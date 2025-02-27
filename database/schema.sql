-- Create tables for Edge Devices and Notifications

-- Create EdgeDevice table
CREATE TABLE IF NOT EXISTS EdgeDevice (
    deviceId VARCHAR(255) PRIMARY KEY,
    Location VARCHAR(255),
    Sector VARCHAR(255),
    IP VARCHAR(50),
    Metadata TEXT
);

-- Create Notification table
CREATE TABLE IF NOT EXISTS Notification (
    NotificationId VARCHAR(255) PRIMARY KEY,
    Timestamp TIMESTAMP,
    frame_path TEXT,
    deviceId VARCHAR(255) REFERENCES EdgeDevice(deviceId),
    Annotations TEXT
);

-- Create index on deviceId for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_deviceid ON Notification(deviceId);