# models.py - Database models
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, LargeBinary
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class EdgeDevice(Base):
    """Model for storing Edge Device information."""
    __tablename__ = 'EdgeDevice'

    deviceId = Column(String(255), primary_key=True)
    Location = Column(String(255))
    Sector = Column(String(255))
    IP = Column(String(50))
    Metadata = Column(Text)

    notifications = relationship("Notification", backref="edge_device") # One-to-many relationship

    def __repr__(self):
        """String representation of the EdgeDevice object."""
        return f'<EdgeDevice {self.deviceId}: {self.Location}, {self.Sector}>'


class Notification(Base):
    """Model for storing Notifications from Edge Devices."""
    __tablename__ = 'Notification'

    NotificationId = Column(String(255), primary_key=True)
    Timestamp = Column(DateTime) # Removed timezone awareness for simplicity, adjust if needed
    frame_path = Column(Text) # Although schema.sql has frame_path, the on_message function is saving image in Annotations, so this might not be used.
    deviceId = Column(String(255), ForeignKey('EdgeDevice.deviceId'), index=True) # Foreign Key to EdgeDevice
    Annotations = Column(LargeBinary) # Changed to LargeBinary to store binary image data

    def __repr__(self):
        """String representation of the Notification object."""
        return f'<Notification {self.NotificationId} from Device {self.deviceId} at {self.Timestamp}>'


# The Message model is removed as per the schema.sql and the focus on EdgeDevice and Notification.
# If you still need the Message model for other purposes, please let me know, and I can re-incorporate it.