# -*- coding: utf-8 -*-
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.session import create_tables, AsyncSessionLocal
from src.services.user import get_user_by_email, create_user
from src.schemas.user import UserCreate

ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL",    "admin@redsam.pe")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Redsam2026!")
ADMIN_NAME     = os.getenv("ADMIN_NAME",     "Admin REDSAM")

async def run_seed():
    print("[SEED] Iniciando seed...")
    await create_tables()
    async with AsyncSessionLocal() as db:
        existing = await get_user_by_email(db, email=ADMIN_EMAIL)
        if existing:
            print("[SEED] Usuario ya existe. Sin cambios.")
            return
        user_in = UserCreate(
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            full_name=ADMIN_NAME,
            is_active=True,
            is_superuser=True,
        )
        user = await create_user(db=db, user_in=user_in)
        print("[SEED] Superusuario creado: " + user.email)

if __name__ == "__main__":
    asyncio.run(run_seed())