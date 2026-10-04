from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routers import auth, contacts, users
from src.db.session import create_tables
import src.db.models  # noqa: F401 — registra los modelos en SQLAlchemy
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crea las tablas de la base de datos al iniciar el servidor."""
    await create_tables()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Configurar CORS — leer desde settings para facilitar producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los enrutadores
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Autenticación"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Usuarios"])
app.include_router(contacts.router, prefix=f"{settings.API_V1_STR}/contacts", tags=["Contactos"])

@app.get("/")
async def root():
    return {"message": f"Bienvenido a {settings.PROJECT_NAME} v{settings.VERSION}"}

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
