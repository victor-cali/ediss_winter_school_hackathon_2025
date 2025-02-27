import paho.mqtt.client as mqtt
import json
import time
import socket
import base64
import collections  # For sliding window buffer
import cv2
import torch
from ultralytics import YOLO
from datetime import datetime

# MQTT Configuration (Ensure broker is accessible)
BROKER = "localhost"  # Use "localhost" if running on native Linux
PORT = 1883
TOPIC = "camera/"
CAMERA_SECTOR = "Sector A"

# Use Local Camera Instead of IP Stream
camera = cv2.VideoCapture(0)  # Change from IP camera to local webcam

if not camera.isOpened():
    print("Error: Unable to access local camera")
    exit(1)

# --- Load YOLOv8 Model ---
MODEL_PATH = "model/best.pt"  # Replace with your trained YOLOv8 model
model = YOLO(MODEL_PATH)  # Load the YOLOv8 model once
class_names = model.names  # A dict mapping class ids to class names

# --- Define PPE Config ---
ppe_config = {
    "hairnet": {"pos": "hairnet", "neg": "no_hairnet_helmet"}
}

# --- Define Sliding Window Buffer (For Smoother Detection) ---
window_size = 5  # Adjust based on stability needed
buffers = {item: collections.deque(maxlen=window_size) for item in ppe_config}

# Track last published status
last_status = None

def get_ip_address():
    """Get the local IP address of the machine."""
    return socket.gethostbyname(socket.gethostname())

def detect_ppe(frame):
    """Perform PPE detection using YOLOv8 and classify as COMPLIANT or NON-COMPLIANT."""
    results = model(frame)  # Run YOLO detection

    detected_classes = [class_names[int(box.cls)] for box in results[0].boxes]  # Extract class names

    # Process detections per PPE item
    ppe_status = {}
    for item, labels in ppe_config.items():
        if labels["pos"] in detected_classes:
            buffers[item].append("COMPLIANT")
        elif labels["neg"] in detected_classes:
            buffers[item].append("NON_COMPLIANT")
        else:
            buffers[item].append("UNKNOWN")  # No detection

        # Determine majority status from buffer
        ppe_status[item] = max(set(buffers[item]), key=buffers[item].count)

    # Combine all PPE statuses
    final_status = "HAZARD" if "NON_COMPLIANT" in ppe_status.values() else "SAFE"
    return final_status, results[0].boxes  # Return status and bounding boxes

def publish_data(status, encoded_image):
    """Publish only when the status changes."""
    global last_status
    if status == last_status:
        return  # No change, so don't publish

    last_status = status  # Update last published status

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.connect(BROKER, PORT, 60)

    # Get metadata
    timestamp = datetime.utcnow().isoformat()
    ip_address = get_ip_address()

    # Construct the JSON payload
    payload = {
        "ip_address": ip_address,
        "timestamp": timestamp,
        "camera_sector": CAMERA_SECTOR,
        "status": status,
        "image": encoded_image  # Embed image as base64 string
    }

    # Publish the payload
    topic_with_id = f"{TOPIC}1"
    client.publish(topic_with_id, json.dumps(payload))
    print(f"Published data to {topic_with_id}: {json.dumps(payload)[:100]}...")  # Truncated for readability

    client.disconnect()

if __name__ == "__main__":
    while True:
        ret, frame = camera.read()

        if not ret:
            print("Error: Lost connection to the camera, retrying...")
            camera.release()
            time.sleep(2)  # Wait before retrying
            camera = cv2.VideoCapture(-1)  # Reconnect to the local camera
            continue  # Skip this iteration if no frame received

        # Run YOLOv8 PPE detection
        status, boxes = detect_ppe(frame)

        # Draw bounding boxes on detected objects
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = class_names[int(box.cls)]
            confidence = box.conf[0].item()
            color = (0, 255, 0) if label in [v["pos"] for v in ppe_config.values()] else (0, 0, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{label} ({confidence:.2f})", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Show the camera feed with detections
        cv2.imshow("Live Camera Feed - PPE Detection", frame)

        # Encode the frame to base64 for MQTT publishing
        _, buffer = cv2.imencode(".jpg", frame)
        encoded_image = base64.b64encode(buffer).decode()

        # Publish only if status changes
        publish_data(status, encoded_image)

        # Break loop on 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Cleanup
    camera.release()
    cv2.destroyAllWindows()
