# config.py - Configuration settings with PostgreSQL support
import os

DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')

# Database settings
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')
DB_HOST = os.environ.get('DB_HOST', 'postgres')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'edgedevicedb')
DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# MQTT settings
MQTT_BROKER = os.environ.get('MQTT_BROKER', 'mosquitto')
MQTT_PORT = int(os.environ.get('MQTT_PORT', 1883))
MQTT_KEEPALIVE = 60
MQTT_TOPIC = os.environ.get('MQTT_TOPIC', 'example/topic')