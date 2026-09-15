from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import get_current_user
from app.websocket_manager import manager
from jose import jwt
from app.config import settings
import json

router = APIRouter(prefix="/api", tags=["auth"])

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint для получения уведомлений в реальном времени
    
    Использование:
    ws://localhost:8000/api/ws?token=<your_jwt_token>
    """
    
    if not token:
        await websocket.close(code=4001, reason="Token required")
        return
    
    try:
        # Декодировать JWT токен
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: int = payload.get("sub")
        
        if user_id is None:
            await websocket.close(code=4001, reason="Invalid token")
            return
        
        # Проверить, существует ли пользователь
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            await websocket.close(code=4001, reason="User not found")
            return
        
        # Подключить пользователя
        await manager.connect(user_id, websocket)
        
        # Отправить сообщение о подключении
        await websocket.send_json({
            "type": "connected",
            "data": {
                "user_id": user_id,
                "username": user.username,
                "message": "Connected to notification system"
            }
        })
        
        try:
            while True:
                # Получать сообщения от клиента (heartbeat или другие команды)
                data = await websocket.receive_json()
                
                if data.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
        
        except WebSocketDisconnect:
            manager.disconnect(user_id, websocket)
            print(f"User {user_id} disconnected")
    
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=4000, reason=str(e))
