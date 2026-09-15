from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routes import notifications, events, preferences, ws

# Создать таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notification System",
    description="Real-time notification system like VK.com",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключить маршруты
app.include_router(notifications.router)
app.include_router(events.router)
app.include_router(preferences.router)
app.include_router(ws.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Notification System API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
