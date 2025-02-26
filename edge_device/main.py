import paho.mqtt.client as mqtt
import json
import time
import socket
import base64
import os
from datetime import datetime

# MQTT Configuration
BROKER = "mosquitto"
PORT = 1883
TOPIC = "camera/"
CAMERA_SECTOR = "Sector A"  # Define the sector of the camera
IMAGE_FOLDER = "./images"  # Folder containing images

def get_ip_address():
    """Get the IP address of the current machine dynamically."""
    try:
        # Create a socket connection to an external host and get the local IP
        # s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # s.connect(("8.8.8.8", 80))  # Google public DNS (does not establish a connection)
        # ip_address = s.getsockname()[0]
        # s.close()
        return "my_fake_ip_address"
    except Exception as e:
        print(f"Could not determine IP address: {e}")
        return "Unknown"

def get_latest_image():
    """Retrieve the most recent image file from the folder and encode it as base64."""
    files = sorted(
        [f for f in os.listdir(IMAGE_FOLDER) if f.endswith((".jpg", ".png", ".jpeg"))],
        key=lambda x: os.path.getmtime(os.path.join(IMAGE_FOLDER, x)),
        reverse=True
    )
    
    if not files:
        print("No images found in folder.")
        return None, None
    
    latest_image_path = os.path.join(IMAGE_FOLDER, files[0])
    
    with open(latest_image_path, "rb") as img_file:
        encoded_image = base64.b64encode(img_file.read()).decode()
    
    return encoded_image, latest_image_path


def publish_data(status):
    """Publish image and metadata as a single MQTT message."""
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)  # Fix for deprecation warning
    client.connect(BROKER, PORT, 60)

    # Get metadata
    timestamp = datetime.utcnow().isoformat()
    ip_address = get_ip_address()

    # Get latest image
    encoded_image, image_path = get_latest_image()

    if not encoded_image:
        return  # No image found, so we don't publish anything

    # Construct the JSON payload
    payload = {
        "ip_address": ip_address,
        "timestamp": timestamp,
        "camera_sector": CAMERA_SECTOR,
        "status": status,
        # "image_name": os.path.basename(image_path),
        "image": encoded_image  # Embed image as base64 string
    }

    # Publish the payload
    topic_with_id = f"{TOPIC}1"  # Fixed topic formatting
    client.publish(topic_with_id, json.dumps(payload))
    print(f"Published data to {topic_with_id}: {json.dumps(payload)[:100]}...")  # Print truncated for readability

    client.disconnect()

if __name__ == "__main__":
    while True:
        publish_data("hazard")
        time.sleep(5)  # Publish every 5 seconds
