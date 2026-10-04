# REDSAM · Red de Jóvenes Líderes de San Martín

Landing page de REDSAM, una organización que fortalece la **capacitación de jóvenes líderes** en la región San Martín (Perú) mediante formación, voluntariado y ayuda social.

## Stack

### Frontend
- **React 19** + **Vite 8** (Rolldown)
- **Tailwind CSS v4** (configuración CSS-first con `@theme`)
- **Shadcn UI** (sistema de componentes basado en Radix UI)
- Componentes interactivos y gráficos:
  - `HeroCarousel`: Carrusel con aceleración GPU (`translateZ`), prefetching de imágenes y controles táctiles/swipe.
  - `DynamicMeshBackground`: Ambientación dinámica con degradados y orbes optimizados a 30 FPS.
  - `FirefliesBackground`: Simulación de partículas vectoriales con pausa automática mediante `IntersectionObserver`.
  - `NeuralSignalConstellation`: Red topográfica y fotones de datos sobre el mapa de San Martín.
  - `InteractiveParticleText`: Físicas elásticas (Spring Physics) y adaptación 100% reactiva en tiempo real al tema elegido (fondos, lienzo, letras y controles) con pausa inteligente fuera del viewport.
  - `Activities Carousel`: Carrusel horizontal continuo con botones de navegación reubicados ergonómicamente en la cabecera superior y tarjetas con apertura modal.
- Iconos propios en SVG (sin dependencias de librerías de terceros)
- Lint: **oxlint**
- Gestor de paquetes: **pnpm**

### Backend
- **Python 3.11+** + **FastAPI 0.110+**
- **SQLAlchemy 2.0** (async) + **aiosqlite** (SQLite dev) / **asyncpg** (PostgreSQL prod)
- **Pydantic v2** para validación exhaustiva de esquemas
- **JWT** (python-jose) + **bcrypt** para autenticación
- **Uvicorn** como servidor ASGI
- Base de datos: `redsam.db` (SQLite local)

---

## Empezar

### Frontend

```bash
cd redsam_oc
pnpm install      # instalar dependencias
pnpm run dev      # servidor de desarrollo → http://localhost:5173
pnpm run build    # build de producción → /dist
pnpm run preview  # previsualizar el build
pnpm run lint     # oxlint
```

### Backend

```bash
cd backend

# 1. Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # macOS / Linux

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno
copy .env.example .env           # editar SECRET_KEY y DATABASE_URL

# 4. Crear el primer superusuario (admin)
python -m src.seed

# 5. Arrancar el servidor
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Servidor disponible en **http://localhost:8000**
Documentación interactiva en **http://localhost:8000/docs**

### Credenciales del admin (seed por defecto)

| Campo | Valor |
| --- | --- |
| Email | `admin@redsam.pe` |
| Password | `Redsam2026!` |

> Cambia estas credenciales editando las variables de entorno `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de ejecutar `src.seed`, o directamente en `src/seed.py`.

---

## Arquitectura

El proyecto sigue una **arquitectura por capas** que desacopla contenido, diseño y presentación para crecer sin fricción:

```
redsam_oc/               ← Frontend (React + Vite)
├── src/
│   ├── data/
│   │   └── content.js        # Única fuente de verdad del copy y datos
│   ├── hooks/
│   │   ├── useReveal.js      # Observador de entrada al viewport
│   │   └── useCountUp.js     # Contador animado de estadísticas
│   ├── styles/
│   │   └── tokens.css        # Sistema de diseño: tokens, bases y efectos
│   ├── services/
│   │   └── contact.js        # Cliente HTTP para el endpoint de contacto
│   ├── components/
│   │   ├── ui/               # Primitivas (Button, Card3DTilt, InteractiveParticleText,
│   │   │                     # FirefliesBackground, NeuralSignalConstellation, Dialog, etc.)
│   │   ├── layout/           # Navbar, Marquee, Footer, WhatsAppButton, ScrollProgress
│   │   └── sections/         # Hero (Carrusel + Luciérnagas), About (Bento Values),
│   │                         # Pillars (Tarjetas homogéneas 3D), Activities (Carrusel),
│   │                         # ImpactMap (Red Neural territorial), Sponsors, CtaBanner, Contact
│   └── App.jsx               # Orquestación de secciones y capas de ambientación

backend/                 ← Backend (FastAPI + SQLAlchemy)
├── src/
│   ├── main.py               # App FastAPI, CORS, lifespan, routers
│   ├── seed.py               # Script para crear el primer superusuario
│   ├── api/
│   │   ├── routers/          # contacts.py, auth.py, users.py
│   │   └── dependencies.py   # get_current_user (JWT guard)
│   ├── core/
│   │   ├── config.py         # Settings (pydantic-settings + .env)
│   │   ├── security.py       # bcrypt hash/verify + JWT encode
│   │   └── exceptions.py     # HTTPException personalizadas
│   ├── db/
│   │   ├── base.py           # DeclarativeBase de SQLAlchemy
│   │   ├── models.py         # Modelos: User, Contact
│   │   └── session.py        # Engine async, get_db(), create_tables()
│   ├── schemas/
│   │   ├── contact.py        # ContactCreate, ContactResponse (Pydantic v2)
│   │   ├── user.py           # UserCreate, UserResponse
│   │   └── token.py          # Token, TokenPayload
│   └── services/
│       ├── contact.py        # CRUD de contactos (async)
│       └── user.py           # CRUD de usuarios (async)
├── .env                      # Variables de entorno (no commitear)
├── .env.example              # Plantilla de variables
├── requirements.txt          # Dependencias Python
└── redsam.db                 # Base de datos SQLite (desarrollo)
```

### Flujo del formulario de contacto

```
Usuario llena el formulario (Contact.jsx)
  → POST http://localhost:8000/api/v1/contacts/  [JSON]
  → FastAPI valida con Pydantic (ContactCreate)
  → service.create_contact() persiste en SQLite/PostgreSQL
  → BackgroundTasks dispara send_confirmation_email() + notify_admin()
  → Responde 201 Created (ContactResponse)
  → Frontend muestra pantalla de éxito
```

### Flujo de la página

```
Hero (Carrusel + Luciérnagas) → Marquee de Valores → Nosotros (Bento Grid) →
Qué hacemos (Pillars 3D) → Actividades (Carrusel + Modal) → Estadísticas →
Impacto Territorial (Mapa SVG + Neural Constellation) → Laboratorio de Partículas (Interactive Particle Text) →
Aliados (Sponsors infinitos) → CTA Banner → Contacto → Footer
```

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/v1/contacts/` | Público | Enviar formulario de contacto |
| `GET` | `/api/v1/contacts/` | JWT | Listar todos los contactos |
| `GET` | `/api/v1/contacts/{id}` | JWT | Obtener un contacto por ID |
| `PATCH` | `/api/v1/contacts/{id}/read` | JWT | Marcar como leído |
| `DELETE` | `/api/v1/contacts/{id}` | JWT | Eliminar un contacto |
| `POST` | `/api/v1/auth/login` | Público | Login → devuelve JWT |
| `POST` | `/api/v1/users/` | JWT superuser | Crear usuario admin |

---

## Sistema de diseño

El mundo visual «Red de Señales» deriva del ADN real de marca (extraído de `img/logo.jpg` y las fotografías):

| Rol | Color |
| --- | --- |
| Señal cian | `#00C0C0` |
| Señal violeta | `#7A3F9F` |
| Señal magenta | `#E4246C` |
| Señal ámbar | `#F0900C` |
| Noche 950 | `#0A1226` |
| Día paper | `#F6F8FD` |

Tipografía: **Sora** (display), **Manrope** (texto), **Space Mono** (coordenadas y datos).

Reglas de marca: el degradado se usa como **sistema** (vectores, anillos, brillos, superficies), nunca como texto degradado. La grilla cartográfica se reserva a superficies-mapa (hero y footer).

---

## Personalizar contenido

Todo el copy y los datos viven en `redsam_oc/src/data/content.js`. Para actualizar actividades, estadísticas, contacto o secciones, solo edita ese archivo.

> **Importante:** el contenido actual es **material de demostración** de alta fidelidad. Sustitúyelo por la información oficial de REDSAM antes de publicar.

### Variables de entorno

**Frontend** (`redsam_oc/.env`):

```env
VITE_API_URL="http://localhost:8000/api/v1"
VITE_CONTACT_ENDPOINT="http://localhost:8000/api/v1/contacts/"
VITE_APP_ENV="development"
```

**Backend** (`backend/.env`):

```env
DATABASE_URL="sqlite+aiosqlite:///./redsam.db"
SECRET_KEY="tu-clave-secreta-aqui"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"
```

---

## Documentación

| Archivo | Contenido |
| --- | --- |
| `redsam_oc/PRODUCT.md` | Contexto de producto y usuarios |
| `redsam_oc/DESIGN.md` | Mundo visual, tokens y decisiones de diseño |
| `redsam_oc/REQUIREMENTS.md` | Requerimientos funcionales y no funcionales |
| `redsam_oc/TECHNICAL_REFERENCE.md` | Manual técnico completo (frontend + backend) |
| `backend/.env.example` | Plantilla de variables de entorno del backend |
