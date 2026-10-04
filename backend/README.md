# REDSAM Backend — API REST

API REST para la plataforma REDSAM. Construida con **FastAPI** + **SQLAlchemy 2.0 async**.

## Stack

- **Python 3.11+**
- **FastAPI 0.110+** — Framework ASGI
- **Uvicorn** — Servidor ASGI
- **SQLAlchemy 2.0** (async) — ORM
- **aiosqlite** — SQLite async (desarrollo)
- **asyncpg** — PostgreSQL async (producción)
- **Pydantic v2** — Validación de datos
- **python-jose** — JWT
- **bcrypt** — Hash de contraseñas

## Inicio rápido

```bash
# 1. Entorno virtual
python -m venv venv
.\venv\Scripts\activate

# 2. Dependencias
pip install -r requirements.txt

# 3. Variables de entorno
copy .env.example .env
# Editar .env con tu SECRET_KEY

# 4. Crear superusuario admin
python -m src.seed

# 5. Arrancar servidor
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

- API: http://localhost:8000
- Docs interactivas (Swagger): http://localhost:8000/docs
- Docs alternativas (ReDoc): http://localhost:8000/redoc

## Credenciales admin (seed por defecto)

| Campo | Valor |
| --- | --- |
| Email | admin@redsam.pe |
| Password | Redsam2026! |

## Endpoints

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| POST | /api/v1/contacts/ | Publico | Enviar formulario de contacto |
| GET | /api/v1/contacts/ | JWT | Listar contactos |
| GET | /api/v1/contacts/{id} | JWT | Obtener contacto por ID |
| PATCH | /api/v1/contacts/{id}/read | JWT | Marcar como leido |
| DELETE | /api/v1/contacts/{id} | JWT | Eliminar contacto |
| POST | /api/v1/auth/login | Publico | Login, devuelve JWT |
| POST | /api/v1/users/ | JWT superuser | Crear usuario admin |

## Variables de entorno

| Variable | Descripcion | Default |
| --- | --- | --- |
| DATABASE_URL | URL SQLAlchemy async | sqlite+aiosqlite:///./redsam.db |
| SECRET_KEY | Clave JWT (min 32 chars) | Requerido |
| ALGORITHM | Algoritmo JWT | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Duracion token | 1440 (24h) |
| ALLOWED_ORIGINS | CORS origins (comas) | http://localhost:5173 |

Generar SECRET_KEY segura:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Estructura

```
src/
+-- main.py              App FastAPI, CORS, lifespan, routers
+-- seed.py              Crea el primer superusuario
+-- api/
|   +-- routers/         contacts.py, auth.py, users.py
|   +-- dependencies.py  get_current_user (JWT guard)
+-- core/
|   +-- config.py        Settings (pydantic-settings + .env)
|   +-- security.py      bcrypt hash/verify + JWT encode
|   +-- exceptions.py    HTTPException personalizadas
+-- db/
|   +-- base.py          DeclarativeBase
|   +-- models.py        User, Contact
|   +-- session.py       Engine, get_db(), create_tables()
+-- schemas/
|   +-- contact.py       ContactCreate, ContactResponse
|   +-- user.py          UserCreate, UserResponse
|   +-- token.py         Token, TokenPayload
+-- services/
    +-- contact.py       CRUD contactos async
    +-- user.py          CRUD usuarios async
```

## Produccion

1. Cambiar DATABASE_URL a PostgreSQL
2. Generar SECRET_KEY segura
3. Configurar ALLOWED_ORIGINS con el dominio del frontend
4. Ejecutar python -m src.seed (una sola vez)
5. Servir con uvicorn detras de Nginx o proxy inverso

## Nota de compatibilidad

passlib 1.7.4 es incompatible con bcrypt >= 4.0.
Este proyecto usa bcrypt directamente (sin passlib) en src/core/security.py.