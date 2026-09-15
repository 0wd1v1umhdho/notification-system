from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Event, Notification, User, NotificationPreference, EventType
from app.schemas import EventCreate, Event as EventSchema
from app.auth import get_current_user
from app.websocket_manager import manager
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["events"])

@router.post("/", response_model=EventSchema)
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создать новое событие (действие, которое произойдёт для пользователя)
    Например: like, comment, mention, follow и т.д.
    """
    # Проверить, активирована ли эта категория уведомлений у получателя
    recipient = db.query(User).filter(User.id == event_data.recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Получить настройки уведомлений получателя
    prefs = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == event_data.recipient_id
    ).first()
    
    # Проверить, включены ли уведомления для этого типа события
    if prefs:
        if event_data.event_type == EventType.LIKE and not prefs.likes_enabled:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User has disabled notifications for this event type"
            )
        elif event_data.event_type == EventType.COMMENT and not prefs.comments_enabled:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User has disabled notifications for this event type"
            )
        elif event_data.event_type == EventType.MENTION and not prefs.mentions_enabled:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User has disabled notifications for this event type"
            )
    
    # Создать событие
    event = Event(
        actor_id=current_user.id,
        recipient_id=event_data.recipient_id,
        event_type=event_data.event_type,
        title=event_data.title,
        description=event_data.description,
        related_object_id=event_data.related_object_id,
        related_object_type=event_data.related_object_type
    )
    db.add(event)
    db.flush()  # Получить ID события
    
    # Создать уведомление
    notification = Notification(
        user_id=event_data.recipient_id,
        event_id=event.id,
        is_delivered=False
    )
    db.add(notification)
    db.commit()
    db.refresh(event)
    
    # Отправить в реальном времени через WebSocket
    notification_message = {
        "type": "notification",
        "data": {
            "id": notification.id,
            "event_id": event.id,
            "actor": {
                "id": current_user.id,
                "username": current_user.username,
                "avatar_url": current_user.avatar_url
            },
            "event_type": event_data.event_type,
            "title": event_data.title,
            "description": event_data.description,
            "created_at": event.created_at.isoformat()
        }
    }
    
    await manager.broadcast_to_user(event_data.recipient_id, notification_message)
    
    return event

@router.get("/{event_id}")
async def get_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить информацию о событии
    """
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.recipient_id == current_user.id  # Только собственные события
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return event
