import cv2
import collections
import json
import time
import socket
import base64
import paho.mqtt.client as mqtt
from ultralytics import YOLO
from datetime import datetime

# --- Configurações MQTT ---
BROKER = "localhost"
PORT = 1883
TOPIC = "camera/"
CAMERA_SECTOR = "Sector A"

# --- Configuração da Agregação Temporal ---
window_duration = 1  # segundos
fps = 20  # taxa de quadros por segundo (aproximada)
window_size = window_duration * fps  # tamanho da janela deslizante
threshold = 0.6  # Se >=60% dos quadros indicarem perigo, marcar como HAZARD

# --- Configuração dos EPIs ---
ppe_config = {
    "hairnet": {"pos": "hairnet", "neg": "no_hairnet_helmet"}
}

# Criar buffers para cada item de EPI
buffers = {item: collections.deque(maxlen=window_size) for item in ppe_config}

# --- Inicializar modelo YOLO ---
MODEL_PATH = "model/best.pt"
model = YOLO(MODEL_PATH)
class_names = model.names

# --- Captura de Vídeo ---
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("Erro: Não foi possível acessar a câmera")
    exit(1)

def get_ip_address():
    # return socket.gethostbyname(socket.gethostname())
    return "127.0.0.1"


def publish_data(status, encoded_image):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.connect(BROKER, PORT, 60)
    
    payload = {
        "ip_address": get_ip_address(),
        "timestamp": datetime.utcnow().isoformat(),
        "camera_sector": CAMERA_SECTOR,
        "status": status,
        "image": encoded_image
    }
    
    topic_with_id = f"{TOPIC}1"
    client.publish(topic_with_id, json.dumps(payload))
    print(f"Publicado: {json.dumps(payload)[:100]}...")
    client.disconnect()
state_variable = False
while True:

    
    ret, frame = camera.read()
    if not ret:
        print("Error: Failed to capture image")
        break
    
      # Run YOLO inference on the current frame.
    results = model(frame)
    # Draw per-frame detections (bounding boxes and labels).
    annotated_frame = results[0].plot()

    # --- Determine Per-Frame PPE Compliance ---
    # Initialize each PPE item status as "safe" (0).
    # A status of 1 means that for that PPE item a non-compliant detection was found.
    frame_status = {item: 0 for item in ppe_config}
    for box in results[0].boxes:
        class_id = int(box.cls[0])
        label = class_names[class_id].lower().strip()
        # For each PPE item, if the detection matches the negative (non‑compliant) label, mark as hazard.
        for item, mapping in ppe_config.items():
            if label == mapping["neg"]:
                frame_status[item] = 1  # Hazard for this PPE item
                # Once a negative detection is found for an item, no need to check further for that item.

    # --- Update Buffers ---
    # Append the per-frame status (0 or 1) for each PPE item.
    for item in buffers:
        buffers[item].append(frame_status[item])

    # --- Aggregate the Results Over the Sliding Window ---
    aggregated_status = {}
    for item in buffers:
        # If we haven't yet filled the window, default to safe (0)
        if len(buffers[item]) == window_size:
            avg_status = sum(buffers[item]) / window_size
        else:
            avg_status = 0
        aggregated_status[item] = avg_status

    # --- Determine Global Hazard State ---
    # If any PPE item is aggregated as hazardous, we set the global state to HAZARD.
    global_hazard = any(aggregated_status[item] >= threshold for item in aggregated_status)
    if global_hazard:
        state_color = (0, 0, 255)  # Red for hazard (BGR)
        state_text = "HAZARD"
    else:
        state_color = (0, 255, 0)  # Green for safe
        state_text = "SAFE"

    # --- Draw the Global Indicator ---
    # Draw a circle to represent the hazard light.
    cv2.circle(annotated_frame, (50, 50), 20, state_color, -1)
    cv2.putText(annotated_frame, state_text, (80, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, state_color, 2)

    # --- Optionally, Display Per-PPE Status on the Frame ---
    y0 = 100
    for i, item in enumerate(aggregated_status):
        text = f"{item.capitalize()}: {'Hazard' if aggregated_status[item] >= threshold else 'Safe'} ({aggregated_status[item]:.2f})"
        cv2.putText(annotated_frame, text, (50, y0 + i * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, state_color, 2)

    # Show the annotated frame.
    cv2.imshow('PPE Safety POC', annotated_frame)
    
    if state_variable != global_hazard:
        _, buffer = cv2.imencode(".jpg", annotated_frame)
        encoded_image = base64.b64encode(buffer).decode()
        publish_data(state_text, encoded_image)
        state_variable = global_hazard

    # Break the loop when 'q' is pressed.
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

camera.release()
cv2.destroyAllWindows()
