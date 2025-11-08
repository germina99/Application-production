# 🌱 Germina - Code Complet de l'Application

## Table des Matières
1. [Backend](#backend)
2. [Frontend - Composants Principaux](#frontend-composants-principaux)
3. [Frontend - Configuration](#frontend-configuration)
4. [Frontend - Utilitaires](#frontend-utilitaires)

---

## Backend

### server.py
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.germina_db

@app.get("/api/")
async def root():
    return {"message": "Germina Production Tracking API"}

@app.get("/api/status")
async def status():
    try:
        # Test MongoDB connection
        await db.command("ping")
        return {
            "status": "healthy",
            "mongodb": "connected",
            "database": "germina_db"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "mongodb": "disconnected",
            "error": str(e)
        }
```

---

## Frontend - Composants Principaux

Les fichiers suivants sont trop volumineux pour être inclus en entier ici, mais je vais créer des fichiers séparés avec le contenu complet.

