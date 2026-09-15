from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models import EventType

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None

class User(UserBase):
    id: int
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    event_type: EventType
    title: str
    description: Optional[str] = None
    related_object_id: Optional[int] = None
    related_object_type: Optional[str] = None

class EventCreate(EventBase):
    actor_id: int
    recipient_id: int

class Event(EventBase):
    id: int
    actor_id: int
    recipient_id: int
    is_read: bool
    created_at: datetime
    actor: User
    
    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    pass

class NotificationCreate(NotificationBase):
    user_id: int
    event_id: int

class Notification(NotificationBase):
    id: int
    user_id: int
    event_id: int
    is_read: bool
    is_delivered: bool
    created_at: datetime
    read_at: Optional[datetime]
    event: Event
    
    class Config:
        from_attributes = True

class NotificationPreferenceUpdate(BaseModel):
    likes_enabled: Optional[bool] = None
    comments_enabled: Optional[bool] = None
    mentions_enabled: Optional[bool] = None
    friend_requests_enabled: Optional[bool] = None
    messages_enabled: Optional[bool] = None
    email_enabled: Optional[bool] = None
    push_enabled: Optional[bool] = None

class NotificationPreference(BaseModel):
    id: int
    user_id: int
    likes_enabled: bool
    comments_enabled: bool
    mentions_enabled: bool
    friend_requests_enabled: bool
    messages_enabled: bool
    email_enabled: bool
    push_enabled: bool
    
    class Config:
        from_attributes = True
