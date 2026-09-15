from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    first_name = Column(String(100))
    last_name = Column(String(100))
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    notifications = relationship("Notification", back_populates="user")
    events = relationship("Event", back_populates="actor")

class EventType(str, enum.Enum):
    LIKE = "like"
    COMMENT = "comment"
    MENTION = "mention"
    FRIEND_REQUEST = "friend_request"
    FRIEND_ACCEPTED = "friend_accepted"
    POST = "post"
    FOLLOW = "follow"
    MESSAGE = "message"
    OTHER = "other"

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(Enum(EventType), index=True)
    title = Column(String(255))
    description = Column(Text, nullable=True)
    related_object_id = Column(Integer, nullable=True)  # ID поста, комментария и т.д.
    related_object_type = Column(String(50), nullable=True)  # Тип объекта (post, comment и т.д.)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    actor = relationship("User", foreign_keys=[actor_id], back_populates="events")
    recipient = relationship("User", foreign_keys=[recipient_id])
    notifications = relationship("Notification", back_populates="event")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    is_read = Column(Boolean, default=False, index=True)
    is_delivered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    read_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    event = relationship("Event", back_populates="notifications")

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    likes_enabled = Column(Boolean, default=True)
    comments_enabled = Column(Boolean, default=True)
    mentions_enabled = Column(Boolean, default=True)
    friend_requests_enabled = Column(Boolean, default=True)
    messages_enabled = Column(Boolean, default=True)
    email_enabled = Column(Boolean, default=False)
    push_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
