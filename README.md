# Notification System

Реал-тайм система уведомлений на примере VK.com с использованием FastAPI, React и MySQL.

## 🚀 Особенности

- **WebSocket поддержка** - получение уведомлений в реальном времени
- **JWT аутентификация** - безопасные соединения
- **MySQL база данных** - надёжное хранилище данных
- **React компоненты** - интерактивный UI
- **Настраиваемые уведомления** - пользователи могут включать/отключать уведомления
- **Типы событий** - like, comment, mention, friend_request, follow и др.

## 📋 Требования

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy
- MySQL
- Redis (опционально)

### Frontend
- Node.js 14+
- React 18+
- Vite

## 🔧 Установка

### Backend Setup

1. **Создайте виртуальное окружение:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

2. **Установите зависимости:**
```bash
pip install -r requirements.txt
```

3. **Создайте файл .env:**
```bash
cp .env.example .env
```

4. **Отредактируйте .env файл с вашими параметрами:**
```env
DATABASE_URL=mysql+pymysql://root:password@localhost/notification_system
SECRET_KEY=your-super-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
```

5. **Создайте базу данных:**
```bash
mysql -u root -p
CREATE DATABASE notification_system;
EXIT;
```

6. **Запустите сервер:**
```bash
python run.py
```

Сервер будет доступен по адресу: `http://localhost:8000`

### Frontend Setup

1. **Перейдите в папку frontend:**
```bash
cd frontend
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Создайте файл .env:**
```bash
cp .env.example .env
```

4. **Запустите dev сервер:**
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

## 📚 API Документация

### WebSocket Connection

**Подключение:**
```javascript
const ws = new WebSocket('ws://localhost:8000/api/ws?token=YOUR_JWT_TOKEN');

ws.onopen = () => {
  console.log('Connected to notification system');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received notification:', message);
};
```

### Endpoints

#### Получить уведомления
```http
GET /api/notifications/?skip=0&limit=20&unread_only=false
Authorization: Bearer <token>
```

**Параметры:**
- `skip` (int, default=0) - количество пропускаемых записей
- `limit` (int, default=20, max=100) - количество записей
- `unread_only` (bool, default=false) - только непрочитанные

**Ответ:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "event_id": 1,
    "is_read": false,
    "is_delivered": true,
    "created_at": "2024-01-15T10:30:00",
    "read_at": null,
    "event": {
      "id": 1,
      "event_type": "like",
      "title": "John liked your post",
      "description": null,
      "created_at": "2024-01-15T10:30:00",
      "actor": {
        "id": 2,
        "username": "john_doe",
        "email": "john@example.com",
        "avatar_url": "https://..."
      }
    }
  }
]
```

#### Получить количество непрочитанных
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "unread_count": 5
}
```

#### Отметить как прочитанное
```http
POST /api/notifications/{notification_id}/read
Authorization: Bearer <token>
```

#### Отметить все как прочитанные
```http
POST /api/notifications/read-all
Authorization: Bearer <token>
```

#### Удалить уведомление
```http
DELETE /api/notifications/{notification_id}
Authorization: Bearer <token>
```

#### Удалить все уведомления
```http
DELETE /api/notifications/
Authorization: Bearer <token>
```

#### Создать событие (отправить уведомление)
```http
POST /api/events/
Authorization: Bearer <token>
Content-Type: application/json

{
  "actor_id": 1,
  "recipient_id": 2,
  "event_type": "like",
  "title": "User liked your post",
  "description": "Check it out!",
  "related_object_id": 123,
  "related_object_type": "post"
}
```

**Event Types:**
- `like` - лайк
- `comment` - комментарий
- `mention` - упоминание
- `friend_request` - запрос дружбы
- `friend_accepted` - принял дружбу
- `post` - новая публикация
- `follow` - подписка
- `message` - сообщение
- `other` - другое

#### Получить настройки уведомлений
```http
GET /api/preferences/
Authorization: Bearer <token>
```

#### Обновить настройки уведомлений
```http
PUT /api/preferences/
Authorization: Bearer <token>
Content-Type: application/json

{
  "likes_enabled": true,
  "comments_enabled": true,
  "mentions_enabled": true,
  "friend_requests_enabled": true,
  "messages_enabled": true,
  "email_enabled": false,
  "push_enabled": true
}
```

## 🎨 Компоненты React

### NotificationCenter

Главный компонент для отображения уведомлений:

```jsx
import NotificationCenter from './components/NotificationCenter';

function App() {
  return (
    <header>
      <NotificationCenter />
    </header>
  );
}
```

### useWebSocket Hook

Хук для управления WebSocket подключением:

```jsx
import useWebSocket from './hooks/useWebSocket';

function MyComponent() {
  const token = localStorage.getItem('token');
  useWebSocket(token);
  
  return <div>Component</div>;
}
```

### notificationStore (Zustand)

Глобальное состояние уведомлений:

```jsx
import useNotificationStore from './store/notificationStore';

function MyComponent() {
  const { notifications, unreadCount, addNotification, markAsRead } = useNotificationStore();
  
  return (
    <div>
      <h2>Notifications: {unreadCount}</h2>
      {notifications.map(n => (
        <div key={n.id}>{n.title}</div>
      ))}
    </div>
  );
}
```

## 🔐 Аутентификация

### Регистрация (требует реализации)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Вход в систему (требует реализации)
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Ответ:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

Сохраните токен в localStorage:
```javascript
localStorage.setItem('token', response.access_token);
```

## 📊 Архитектура базы данных

### Таблицы

1. **users** - пользователи системы
2. **events** - события/действия (like, comment, mention и т.д.)
3. **notifications** - уведомления для пользователей
4. **notification_preferences** - настройки уведомлений пользователя

### Диаграмма связей

```
users
├── notifications (user_id)
└── events (actor_id, recipient_id)
    └── notifications (event_id)

notification_preferences (user_id)
```

## 🚀 Примеры использования

### Пример 1: Отправить лайк

```bash
curl -X POST http://localhost:8000/api/events/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": 2,
    "event_type": "like",
    "title": "User liked your post",
    "related_object_id": 123,
    "related_object_type": "post"
  }'
```

### Пример 2: Получить непрочитанные уведомления

```bash
curl http://localhost:8000/api/notifications/?unread_only=true \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Пример 3: Подключиться к WebSocket (Python)

```python
import asyncio
import websockets
import json

async def connect():
    token = "YOUR_JWT_TOKEN"
    uri = f"ws://localhost:8000/api/ws?token={token}"
    
    async with websockets.connect(uri) as websocket:
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            print(f"Received: {data}")

asyncio.run(connect())
```

## 🔧 Конфигурация

### Переменные окружения

**Backend (.env):**
- `DATABASE_URL` - строка подключения к БД
- `SECRET_KEY` - ключ для подписи JWT
- `ALGORITHM` - алгоритм шифрования (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - время жизни токена
- `REDIS_URL` - URL Redis сервера
- `CORS_ORIGINS` - разрешённые CORS origins
- `ENVIRONMENT` - development/production

**Frontend (.env):**
- `VITE_API_URL` - URL API сервера (default: http://localhost:8000/api)
- `VITE_WS_URL` - URL WebSocket сервера (default: ws://localhost:8000)

## 📝 Структура проекта

```
notification-system/
├── backend/
│   ├── app/
│   │   ├── models.py          # SQLAlchemy модели
│   │   ├── schemas.py         # Pydantic схемы
│   │   ├── database.py        # Конфигурация БД
│   │   ├── auth.py            # Аутентификация
│   │   ├── config.py          # Конфигурация приложения
│   │   ├── websocket_manager.py # WebSocket менеджер
│   │   ├── main.py            # FastAPI приложение
│   │   └── routes/
│   │       ├── notifications.py
│   │       ├── events.py
│   │       ├── preferences.py
│   │       └── ws.py
│   ├── run.py                 # Entry point
│   ├── requirements.txt       # Зависимости
│   └── .env.example           # Пример .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── NotificationItem.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── store/
│   │   │   └── notificationStore.js
│   │   ├── api/
│   │   │   └── client.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🐛 Решение проблем

### WebSocket не подключается
1. Проверьте, что токен правильно передан в URL
2. Убедитесь, что токен не истёк
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что CORS правильно настроен

### Ошибка подключения к БД
1. Убедитесь, что MySQL запущен
2. Проверьте DATABASE_URL в .env
3. Убедитесь, что база данных создана

### Уведо��ления не отправляются
1. Проверьте, что WebSocket подключение активно
2. Убедитесь, что recipient_id правильный
3. Проверьте настройки уведомлений пользователя
4. Посмотрите логи сервера

## 📦 Следующие шаги

- [ ] Реализовать endpoints для регистрации и входа
- [ ] Добавить email уведомления
- [ ] Добавить push notifications
- [ ] Добавить Celery для асинхронных задач
- [ ] Добавить Redis кэширование
- [ ] Добавить миграции Alembic
- [ ] Написать unit тесты
- [ ] Добавить докеризацию
- [ ] Развернуть на production

## 📄 Лицензия

MIT

## 👨‍💻 Автор

Created with ❤️ using FastAPI, React, and MySQL
