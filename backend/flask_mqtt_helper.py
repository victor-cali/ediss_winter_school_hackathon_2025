# flask_mqtt_helper.py - MQTT client integration
import paho.mqtt.client as mqtt
from threading import Thread
from models import Message
import config
import json
import hashlib
import datetime
import base64
from database import db_session  # Assuming db_session is your SQLAlchemy session
from models import EdgeDevice, Notification

# MQTT client instance
mqtt_client = None

def on_connect(client, userdata, flags, rc):
    """Callback for when the client connects to the broker.
    
    Args:
        client: The client instance
        userdata: User data of any type
        flags: Response flags sent by the broker
        rc: The connection result
    """
    print(f"Connected with result code {rc}")
    client.subscribe(config.MQTT_TOPIC)
    print(f"Subscribed to {config.MQTT_TOPIC}")

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic}: {msg.payload}")	

def start_mqtt_client():
    """Start the MQTT client loop in a blocking manner."""
    global mqtt_client
    
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    
    try:
        mqtt_client.connect(config.MQTT_BROKER, config.MQTT_PORT, config.MQTT_KEEPALIVE)
        mqtt_client.loop_forever()
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")

def setup_mqtt(app):
    """Setup the MQTT client for the Flask application.
    
    Args:
        app: The Flask application instance
    """
    # Start MQTT client in a separate thread
    mqtt_thread = Thread(target=start_mqtt_client)
    mqtt_thread.daemon = True  # Thread will close when main program exits
    mqtt_thread.start()
    
    # Store the thread in the app context
    app.mqtt_thread = mqtt_thread