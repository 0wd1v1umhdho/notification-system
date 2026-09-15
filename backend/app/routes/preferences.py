from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import NotificationPreference, User
from app.schemas import NotificationPreferenceUpdate, NotificationPreference as NotificationPreferenceSchema
from app.auth import get_current_user

router = APIRouter(prefix="/api/preferences", tags=["preferences"])

@router.get("/", response_model=NotificationPreferenceSchema)
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить настройки уведомлений текущего пользователя
    """
    prefs = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == current_user.id
    ).first()
    
    if not prefs:
        # Создать настройки по умолчанию если их нет
        prefs = NotificationPreference(user_id=current_user.id)
        db.add(prefs)
        db.commit()
    
    return prefs

@router.put("/", response_model=NotificationPreferenceSchema)
async def update_notification_preferences(
    preferences: NotificationPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Обновить настройки уведомлений
    """
    prefs = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == current_user.id
    ).first()
    
    if not prefs:
        prefs = NotificationPreference(user_id=current_user.id)
        db.add(prefs)
    
    # Обновить только переданные параметры
    update_data = preferences.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prefs, key, value)
    
    db.commit()
    db.refresh(prefs)
    
    return prefs
