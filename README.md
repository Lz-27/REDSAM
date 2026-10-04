# REDSAM · Red de Jóvenes Líderes de San Martín

Plataforma web full-stack oficial de **REDSAM**, una organización que impulsa y fortalece el liderazgo, la formación continua, el voluntariado comunitario y la ayuda social en las 10 provincias de la región San Martín, Perú.

El proyecto está diseñado bajo una arquitectura desacoplada y moderna que integra una experiencia de usuario inmersiva en el frontend con una API REST robusta y asíncrona en el backend.

---

## 🗺️ Arquitectura General

```text
REDSAM/
├── backend/            # API REST en Python (FastAPI, SQLAlchemy 2.0 Async, Pydantic v2)
│   ├── src/            # Enrutadores, lógica de negocio, modelos y esquemas
│   └── README.md       # Documentación técnica exclusiva del servidor
├── redsam_oc/          # Frontend SPA (React 19, Vite 8, Tailwind CSS v4, Shadcn UI)
│   ├── src/            # Componentes, lienzos interactivos, sistema de diseño y contenido
│   └── README.md       # Documentación técnica exclusiva de la interfaz
└── dev.bat             # Script de automatización para levantar ambos entornos en local
```

### Flujo de Datos
```text
[ Cliente Web / Navegador ]
         │
         ▼ (React 19 + Tailwind v4 + Canvas 2D)
  [ Frontend SPA ]  <-- http://localhost:5173
         │
         │  HTTP / JSON (Endpoints REST)
         ▼
  [ Backend FastAPI ] <-- http://localhost:8000
         │
         ├── Autenticación JWT / Bcrypt
         ├── Validación Pydantic v2
         └── SQLAlchemy 2.0 Async ORM
                 │
                 ▼
          [ Base de Datos ]
        (SQLite dev / PostgreSQL prod)
```

---

## 🚀 Puesta en Marcha (Entorno Completo)

Puedes levantar todo el ecosistema de desarrollo de golpe o iniciar cada servicio por separado.

### Opción 1: Inicio Rápido Automatizado (Windows)
El proyecto incluye un script en la raíz para orquestar y ejecutar ambos servidores simultáneamente en terminales dedicadas:

```bash
.\dev.bat
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Opción 2: Inicio Manual por Módulos

#### 1. Backend (FastAPI + Python 3.11+)
```bash
# Navegar a la carpeta backend
cd backend

# Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\activate       # En Windows
# source venv/bin/activate    # En Linux / macOS

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env

# Crear superusuario y tablas iniciales (seed)
python -m src.seed

# Iniciar servidor ASGI
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```
> Consulta la [Guía completa del Backend](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/backend/README.md) para más detalles sobre autenticación, migraciones y endpoints.

#### 2. Frontend (React 19 + Vite 8)
```bash
# Navegar a la carpeta frontend
cd redsam_oc

# Instalar paquetes con pnpm
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```
> Consulta la [Guía completa del Frontend](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/README.md) para detalles sobre el sistema de diseño, tokens, componentes visuales e interactividad.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías Clave |
| --- | --- |
| **Frontend** | React 19, Vite 8 (Rolldown), Tailwind CSS v4 (`@theme`), Shadcn UI, Canvas 2D (Spring Physics), Framer Motion, GSAP, pnpm |
| **Backend** | Python 3.11+, FastAPI 0.110+, SQLAlchemy 2.0 (Async), Pydantic v2, Uvicorn, Python-Jose (JWT), Bcrypt |
| **Bases de Datos** | SQLite con `aiosqlite` (desarrollo local) / PostgreSQL con `asyncpg` (producción) |
| **Identidad Visual** | Sistema «Red de Señales» (Cian `#00C0C0`, Violeta `#7A3F9F`, Magenta `#E4246C`, Ámbar `#F0900C`) con soporte multitema reactivo (Índigo, Negro OLED y Claro) |

---

## 📚 Enlaces a la Documentación Específica

Para instrucciones especializadas por área de desarrollo, consulta los documentos dedicados:

- 🖥️ **[Frontend README (redsam_oc/README.md)](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/README.md):** Arquitectura de componentes, físicas del Laboratorio de Partículas, renderizado territorial, sistema de temas y optimizaciones de GPU.
- ⚙️ **[Backend README (backend/README.md)](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/backend/README.md):** Configuración de base de datos, autenticación JWT, esquemas de validación Pydantic, routers y ejecución de tests.
- 📐 **[Manual Técnico (redsam_oc/TECHNICAL_REFERENCE.md)](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/TECHNICAL_REFERENCE.md):** Manual de ingeniería profunda y referencia técnica integral del sistema.
- 🎨 **[Sistema de Diseño (redsam_oc/DESIGN.md)](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/DESIGN.md):** Filosofía visual, tokens, paletas cromáticas y reglas de animación.

---

## 👥 Contribución y Despliegue

1. Realiza tus modificaciones en ramas separadas por característica (`feature/nombre-mejora`).
2. Verifica el lint y la compilación antes de enviar cambios:
   - Frontend: `pnpm run lint` y `pnpm run build`
   - Backend: validación de sintaxis y tipado con esquemas Pydantic.
3. Asegúrate de configurar variables de entorno seguras en producción (`SECRET_KEY`, `ALLOWED_ORIGINS` y `DATABASE_URL`).
