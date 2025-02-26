#!/usr/bin/env python3
import os
import sqlite3
import logging
import sys
import json
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('db_manager')

class DatabaseManager:
    def __init__(self, db_path):
        """Initialize the database manager with the path to the database file."""
        self.db_path = Path(db_path)
        self.db_exists = self.db_path.exists()
        self.conn = None

    def connect(self):
        """Establish a connection to the SQLite database."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.execute("PRAGMA foreign_keys = ON")  # Enable foreign key constraints
            logger.info(f"Connected to database at {self.db_path}")
            return True
        except sqlite3.Error as e:
            logger.error(f"Error connecting to database: {e}")
            return False

    def create_schema(self):
        """Create the database schema with the required tables."""
        if not self.conn:
            logger.error("No database connection established")
            return False

        try:
            cursor = self.conn.cursor()
            
            # Create EdgeDevices table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS EdgeDevices (
                deviceId TEXT PRIMARY KEY,
                Location TEXT,
                Sector TEXT,
                IP TEXT,
                Metadata TEXT
            )
            ''')
            
            # Create Notification table with foreign key to EdgeDevices
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS Notification (
                NotificationId TEXT PRIMARY KEY,
                Timestamp TEXT,
                frame_path TEXT,
                deviceId TEXT,
                Annotations TEXT,
                FOREIGN KEY (deviceId) REFERENCES EdgeDevices(deviceId)
            )
            ''')
            
            self.conn.commit()
            logger.info("Database schema created successfully")
            return True
        except sqlite3.Error as e:
            logger.error(f"Error creating schema: {e}")
            self.conn.rollback()
            return False

    def insert_sample_data(self):
        """Insert sample data into the tables for testing purposes."""
        if not self.conn:
            logger.error("No database connection established")
            return False

        try:
            cursor = self.conn.cursor()
            
            # Sample edge devices
            devices = [
                ('device001', 'Building A, Floor 1', 'Manufacturing', '192.168.1.101', json.dumps({'model': 'RaspberryPi4', 'version': '1.2.0'})),
                ('device002', 'Building B, Floor 2', 'Packaging', '192.168.1.102', json.dumps({'model': 'Jetson Nano', 'version': '2.0.1'})),
                ('device003', 'Building A, Floor 3', 'Quality Control', '192.168.1.103', json.dumps({'model': 'Arduino', 'version': '1.1.5'}))
            ]
            
            cursor.executemany('''
            INSERT OR REPLACE INTO EdgeDevices (deviceId, Location, Sector, IP, Metadata)
            VALUES (?, ?, ?, ?, ?)
            ''', devices)
            
            # Sample notifications
            notifications = [
                ('notif001', '2025-02-26T10:15:30Z', '/data/frames/frame001.jpg', 'device001', json.dumps({'alert': 'motion_detected', 'confidence': 0.92})),
                ('notif002', '2025-02-26T11:22:15Z', '/data/frames/frame002.jpg', 'device002', json.dumps({'alert': 'object_classified', 'class': 'product_defect', 'confidence': 0.87})),
                ('notif003', '2025-02-26T12:05:40Z', '/data/frames/frame003.jpg', 'device003', json.dumps({'alert': 'temperature_alert', 'value': 32.5, 'threshold': 30.0}))
            ]
            
            cursor.executemany('''
            INSERT OR REPLACE INTO Notification (NotificationId, Timestamp, frame_path, deviceId, Annotations)
            VALUES (?, ?, ?, ?, ?)
            ''', notifications)
            
            self.conn.commit()
            logger.info("Sample data inserted successfully")
            return True
        except sqlite3.Error as e:
            logger.error(f"Error inserting sample data: {e}")
            self.conn.rollback()
            return False

    def close(self):
        """Close the database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")


def main():
    # Get database path from environment variable or use default
    db_path = os.environ.get('DB_PATH', '/data/edge_devices.db')
    logger.info(f"Using database path: {db_path}")
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Initialize database manager
    db_manager = DatabaseManager(db_path)
    
    if db_manager.connect():
        # Check if we need to create the schema
        if not db_manager.db_exists:
            logger.info("Database file does not exist. Creating schema...")
            if db_manager.create_schema():
                logger.info("Inserting sample data...")
                db_manager.insert_sample_data()
        else:
            logger.info("Database file already exists. Schema creation skipped.")
        
        # Perform any additional operations here
        
        # Close the connection
        db_manager.close()
    else:
        logger.error("Failed to connect to the database")
        sys.exit(1)

if __name__ == "__main__":
    main()