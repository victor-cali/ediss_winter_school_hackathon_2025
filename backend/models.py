# models.py - Database models
from sqlalchemy import Column, Integer, String, Text, DateTime, BigInteger
from sqlalchemy.sql import func
from database import Base

class Message(Base):
    """Model for storing MQTT messages."""
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key=True)
    topic = Column(String(100), nullable=False)
    payload = Column(Text, nullable=False)
    qos = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        """String representation of the Message object."""
        return f'<Message {self.id}: {self.topic}>'
    
    @classmethod
    def save_message(cls, topic, payload, qos=0):
        """Save a message to the database.
        
        Args:
            topic (str): The MQTT topic
            payload (str): The message payload
            qos (int): Quality of Service level
            
        Returns:
            Message: The saved message object
        """
        from database import db_session
        
        message = cls(topic=topic, payload=payload, qos=qos)
        db_session.add(message)
        db_session.commit()
        return message
    
    @classmethod
    def get_messages(cls, limit=10):
        """Get the most recent messages.
        
        Args:
            limit (int): Maximum number of messages to return
            
        Returns:
            list: List of Message objects
        """
        return cls.query.order_by(cls.timestamp.desc()).limit(limit).all()