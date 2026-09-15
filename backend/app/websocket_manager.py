from typing import Set, Dict
import json
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
    
    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def broadcast_to_user(self, user_id: int, message: dict):
        """Отправить сообщение конкретному пользователю на все его соединения"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending message: {e}")
    
    async def broadcast_to_multiple_users(self, user_ids: list, message: dict):
        """Отправить сообщение нескольким пользователям"""
        for user_id in user_ids:
            await self.broadcast_to_user(user_id, message)
    
    def get_connected_users(self) -> list:
        """Получить список подключённых пользователей"""
        return list(self.active_connections.keys())
    
    def is_user_online(self, user_id: int) -> bool:
        """Проверить, находится ли пользователь онлайн"""
        return user_id in self.active_connections

manager = ConnectionManager()
