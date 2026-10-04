# Referencia Técnica — REDSAM

Este documento es el manual técnico detallado del proyecto REDSAM. Está diseñado para servir como guía integral para otros desarrolladores y asistentes de inteligencia artificial (IA) que necesiten comprender la arquitectura, el comportamiento técnico, las animaciones y la estructura de componentes para escalar, actualizar o tomar este proyecto como referencia.

---

## 1. Stack Tecnológico

### Frontend
- **Framework Core**: React 19.
- **Build Tool**: Vite 8 (Rolldown).
- **Estilos**: Tailwind CSS v4 (Enfoque CSS-first con directiva `@theme`).
- **Sistema de Componentes**: Shadcn UI (basado en Radix UI).
- **Plugins Adicionales**: `embla-carousel-react`, `embla-carousel-autoplay`.
- **Gestor de Paquetes**: pnpm.
- **Linter**: oxlint.

### Backend
- **Framework**: FastAPI 0.110+.
- **Runtime**: Python 3.11+ con Uvicorn (ASGI).
- **ORM**: SQLAlchemy 2.0 (modo async).
- **Base de datos**: SQLite con aiosqlite (desarrollo) / PostgreSQL con asyncpg (producción).
- **Autenticación**: JWT con `python-jose` + `bcrypt` para hash de contraseñas.
- **Validación**: Pydantic v2 (schemas).

---

## 2. Arquitectura de Directorios

El proyecto emplea una arquitectura por capas para separar datos, estilos, lógica de comportamiento y presentación:

```text
redsam_oc/                   ← Frontend
├── src/
│   ├── assets/              # Recursos estáticos locales
│   ├── components/          # Componentes de React
│   │   ├── layout/          # Estructuras globales (Navbar, Footer)
│   │   ├── sections/        # Bloques de contenido (Hero, About, Contact, etc.)
│   │   └── ui/              # Primitivas de interfaz reutilizables
│   ├── data/
│   │   └── content.js       # Única fuente de verdad de contenido
│   ├── hooks/               # Hooks personalizados de React
│   ├── services/
│   │   └── contact.js       # Cliente HTTP para el endpoint de contacto
│   ├── styles/
│   │   └── tokens.css       # Definición global del diseño, paleta y animaciones CSS
│   ├── App.jsx              # Orquestador principal de secciones
│   ├── index.css            # Punto de entrada de CSS (importa tokens.css)
│   └── main.jsx             # Punto de montaje de la SPA de React

backend/                     ← Backend
├── src/
│   ├── main.py              # Instancia FastAPI, CORS, lifespan, inclusión de routers
│   ├── seed.py              # Script para crear el primer superusuario administrador
│   ├── api/
│   │   ├── routers/
│   │   │   ├── auth.py      # POST /auth/login → devuelve JWT
│   │   │   ├── contacts.py  # CRUD de contactos (POST público + GET/PATCH/DELETE con JWT)
│   │   │   └── users.py     # POST /users/ (solo superusuario)
│   │   └── dependencies.py  # Dependencias FastAPI: get_current_user, get_current_active_superuser
│   ├── core/
│   │   ├── config.py        # Pydantic Settings (lee .env)
│   │   ├── exceptions.py    # HTTPException personalizadas (404, 400, 401, 403)
│   │   └── security.py      # bcrypt hash/verify + JWT encode/decode
│   ├── db/
│   │   ├── base.py          # DeclarativeBase de SQLAlchemy
│   │   ├── models.py        # Modelos ORM: User, Contact
│   │   └── session.py       # Engine async, AsyncSessionLocal, get_db(), create_tables()
│   ├── schemas/
│   │   ├── contact.py       # ContactCreate, ContactResponse (Pydantic v2)
│   │   ├── user.py          # UserCreate, UserResponse
│   │   └── token.py         # Token, TokenPayload
│   └── services/
│       ├── contact.py       # create_contact, get_contacts, get_contact,
│       │                    # mark_contact_as_read, delete_contact
│       └── user.py          # create_user, get_user_by_email, get_user
├── .env                     # Variables de entorno (no commitear)
├── .env.example             # Plantilla
├── requirements.txt         # Dependencias Python
└── redsam.db                # Base de datos SQLite (solo desarrollo)
```

### 2.1 Principio de Desacoplamiento de Datos

El proyecto implementa un patrón estricto de separación entre la interfaz y el contenido. Toda la información de la landing page reside en `src/data/content.js`. Los componentes de React únicamente consumen e iteran sobre estos datos.

---

## 3. Sistema de Diseño (Tokens y Colores)

Implementado íntegramente en `src/styles/tokens.css` utilizando las capacidades `@theme` de Tailwind CSS v4. El diseño alterna dinámicamente entre contextos "Día" y "Noche" mediante atributos en el DOM (`data-theme`).

### 3.1 Paleta de Colores

**Superficies de Noche (Inmersivas):**

- `--color-night-950`: `#0a1226` (Fondo principal nocturno)
- `--color-night-900`: `#101b38` (Superficies elevadas nocturnas)
- `--color-night-800` a `--color-night-100`: Matices de profundidad

**Superficies de Día (Editoriales):**

- `--color-paper`: `#f6f8fd` (Fondo principal diurno)
- `--color-surface`: `#ffffff` (Tarjetas y contenedores diurnos)
- `--color-line`: `#e3e8f2` (Bordes y separadores)

**Señal de Marca (Acentos):**

- `--color-signal-cyan`: `#00c0c0`
- `--color-signal-violet`: `#7a3f9f`
- `--color-signal-magenta`: `#e4246c`
- `--color-signal-amber`: `#f0900c`

### 3.2 Tematización Dinámica

En `tokens.css`, el pseudo-selector `:root` o `html[data-theme='...']` reasigna variables lógicas genéricas (ej. `--surface`, `--surface-raised`, `--text-strong`, `--accent`) a los colores específicos de la paleta.

**Regla de oro:** Los componentes de React deben usar siempre estas clases utilitarias agnósticas en lugar de colores estáticos:

- `bg-page` (usa `--surface`)
- `bg-surface-soft` (usa `--surface-soft`)
- `bg-surface-raised` (usa `--surface-raised`)
- `text-fg` (usa `--text`)
- `text-fg-strong` (usa `--text-strong`)
- `text-accent` y `text-accent-magenta`

El proyecto cuenta con tres temas principales: **Índigo**, **Negro** (modo ultra-oscuro) y **Claro**. La preferencia se guarda en `localStorage` bajo la clave `redsam-theme`.

### 3.3 Tipografía

- **Display**: `Sora` (Titulares).
- **Sans**: `Manrope` (Párrafos y lectura larga).
- **Mono**: `Space Mono` (Coordenadas, etiquetas de sistema, y eyebrows).

---

## 4. Animaciones y Transiciones (Motion)

El sistema de movimiento combina CSS puro (Keyframes y Transitions) con JavaScript (Hooks de intersección y renderizado).

### 4.1 Animaciones CSS (Keyframes y Transitions)

Definidas en la capa `@utility` de Tailwind en `tokens.css`.

- **Scroll Reveal (`.reveal`, `.reveal-mask`)**: Translación vertical + opacidad de `0` a `1`. Las clases `.is-visible` remueven la transformación. La máscara emplea `clip-path: inset(0 0 100% 0)`.
- **Marquee (`.marquee-track`)**: Bucle infinito lineal de traducción en el eje X.
- **Node Pulse (`.node-pulse`)**: Anillos concéntricos expandiéndose y desvaneciéndose.
- **Señal Dash Flow (`.signal-dash`)**: Animación de flujo continuo para bordes punteados con `stroke-dashoffset`.
- **Botones con Brillo (`.btn-shine`)**: Efecto de barrido diagonal en hover con pseudo-elemento `::after`.
- **Subrayado de Navegación (`.nav-link::after`)**: Línea que hace `scaleX(0)` a `scaleX(1)` en hover.
- **Cursor Glow (`.hero-cursor-glow`)**: Brillo ambiental interactivo que sigue el ratón en el Hero.

### 4.2 Lógica JS para Animaciones y Rendimiento

1. **`useReveal.js`**: `IntersectionObserver` que añade clase `is-visible` al entrar al viewport.
2. **`useCountUp.js`**: `requestAnimationFrame` para conteo animado de estadísticas con interpolación.
3. **`useParallax.js`**: Escucha el `scroll` del window y expone un valor proporcional al desplazamiento.
4. **`useGsap.js`**: Despliegue tipográfico sincronizado de palabras con GSAP ScrollTrigger.

### 4.3 Arquitectura de Rendimiento y Desempeño Gráfico

Para asegurar 60 FPS estables y tiempos de respuesta instantáneos en la interfaz:
- **Aceleración por GPU (Hardware Compositing)**:
  - Las diapositivas e imágenes del Hero (`.hero-carousel-slide`, `.hero-carousel-img`) emplean `transform: translateZ(0)`, `will-change: transform, opacity` y `backface-visibility: hidden` para que las rotaciones se procesen en capas dedicadas de la tarjeta gráfica sin bloquear el hilo principal.
- **Descarga de Cómputo con `IntersectionObserver`**:
  - Los bucles matemáticos intensivos (`InteractiveParticleText`, `NeuralSignalConstellation`, `FirefliesBackground`) suspenden su ciclo `requestAnimationFrame` en cuanto el componente abandona el viewport y lo reanudan automáticamente al volver, eliminando el consumo innecesario de CPU y GPU.
- **Throttling y Control de Visibilidad Global**:
  - `DynamicMeshBackground` opera con un intervalo limitado a 30 FPS y se congela completamente cuando la pestaña del navegador pasa a segundo plano (`document.hidden`).
- **Precarga en Memoria (Prefetching)**:
  - `HeroCarousel` precarga de forma inmediata las 4 fotografías en el navegador mediante instancias asíncronas en memoria (`decoding="async"`, `loading="eager"`), eliminando latencias de decodificación al navegar.

### 4.4 Accesibilidad de Movimiento

Todo el sistema está encapsulado en `@media (prefers-reduced-motion: reduce)`. Cuando se activa, el layout se muestra plano desactivando todas las animaciones.

---

## 5. Estructura de Interfaz y Componentes

### 5.1 Primitivas UI (`src/components/ui/`)

El sistema UI utiliza **Shadcn UI** adaptado al mundo visual "Red de Señales":
- **`button.tsx`**: Botón estándar (Shadcn UI) extendido con variantes `default` (signal-bg) y `outline`.
- **`ButtonOld.jsx`**: Wrapper retrocompatible que enruta las propiedades a `button.tsx` para no quebrar el código heredado.
- **`dialog.tsx`**: Componente de ventana modal flotante (Shadcn UI) manejando focus y accesibilidad.
- **`carousel.tsx`**: Carrusel implementado con `embla-carousel-react` y el plugin `Autoplay` para rotación dinámica.
- **`tabs.tsx`**: Navegación por pestañas interactivas (Shadcn UI).
- **`card.tsx`**: Primitiva de tarjetas (Shadcn UI).
- **`SectionHeading.jsx`**: Encabezados estandarizados (Kicker + Título Display).
- **`Reveal.jsx`**: Wrapper React para inyectar automáticamente lógica `useReveal`.
- **`Icon.jsx`**: Paquete de iconos SVG embebidos sin dependencias externas.

### 5.2 Estructuras Globales (`src/components/layout/`)

- `Navbar.jsx`: Barra fija con toggle de tema y menú móvil de pantalla completa.
- `Footer.jsx`: Pie de página con navegación secundaria, legal y redes sociales.

### 5.3 Secciones (`src/components/sections/`)

> *Nota: Todas las secciones mantienen un espaciado vertical estandarizado de `py-16 lg:py-20` para un ritmo constante de lectura.*

- `Hero.jsx`: Parallax multi-capa, animaciones SVG (Constelación viva), `FirefliesBackground` bioluminiscente, partículas de fondo y `HeroCarousel` protagonista (cuadrado/1:1, ratio responsivo, aceleración GPU, borde gradiente transparente con máscara CSS y preloading).
- `About.jsx`: Rediseñado como un **Bento Grid** interactivo. Incorpora `Tabs` de Shadcn para la navegación dinámica entre Misión y Visión con contenedores de iconos adaptativos (`bg-surface-raised`). Las tarjetas de valores cuentan con altura homogénea (`min-h-[280px]`), fondos "watermark" gigantes contenidos sin desbordamiento y contraste optimizado en hover (`group-hover:text-fg-strong`) para visibilidad perfecta en fondos claros y oscuros.
- `Pillars.jsx`: Cuadrícula responsiva de 4 rutas de acción (`min-h-[380px]`) perfectamente equilibradas con distribución vertical uniforme (`flex-col justify-between`), tags de categoría anclados en la misma línea base, iconos interactivos con zoom suave e inclinación física con `Card3DTilt`. Textos y tags adaptados dinámicamente para conservar contraste impecable en hover bajo cualquier fondo.
- `Activities.jsx`: Carrusel horizontal (`Carousel` de Shadcn + Autoplay 3.5s + Loop infinito) de tarjetas de actividades ("Glow Cards"). Los botones de control y navegación (`CarouselPrevious` y `CarouselNext`) se ubican en la cabecera superior derecha junto al contador de actividades, integrados al contexto de Embla. Las tarjetas abren un **Modal (`Dialog`)** premium para ver el contenido completo e inscribirse.
- `ImpactMap.jsx`: Mapa interactivo de San Martín conectado a `NeuralSignalConstellation` (fotones de datos viajando entre las 10 provincias, líneas magnéticas directas al puntero y suspensión por IntersectionObserver).
- `InteractiveParticleText.jsx`: Laboratorio interactivo donde el texto se rasteriza a partículas vectoriales en Canvas 2D con ajuste matemático automático de dimensiones (`measureText`), físicas elásticas (Spring Physics) y detonación en pulso radial ante clics. El componente es **100% reactivo al tema activo** (`indigo`, `black`, `light`): escucha mutaciones en tiempo real sobre `data-theme`, adaptando dinámicamente el fondo de sección (`bg-page`), resplandores, lienzo, tipografías y botones de selección sin perder la animación a 60 FPS.
- `Contact.jsx`: Formulario controlado con integración completa a FastAPI (`/api/v1/contacts/`). Validación en tiempo real (Pydantic v2), captura de errores dinámicos, limpieza al escribir y pantalla de éxito personalizada. Recibe eventos `redsam:activity-interest` para prellenar el campo de interés.

### 5.4 Sistema de Temas y Transición Cromática

Implementado con variables CSS semánticas en `src/styles/tokens.css` y conmutación en `src/components/layout/Navbar.jsx`:
- **Temas Soportados**:
  - `data-theme="indigo"`: Modo inmersivo nocturno característico (#0a1226).
  - `data-theme="black"`: Modo oscuro puro de contraste profundo para pantallas OLED (#000000).
  - `data-theme="light"`: Modo diurno editorial sobre fondo off-white frío (#f4f6fb) con tarjetas blancas y bordes estructurados para legibilidad máxima.
- **Transición sin parpadeos**: Todas las clases utilitarias del sistema (`bg-page`, `bg-surface-soft`, `text-fg`, `border-fg-line`) cuentan con `transition: background-color 0.4s, border-color 0.4s, color 0.4s` para garantizar que la alternancia entre temas sea cinematográfica y suave.

---

## 6. Guía de Escalado (Frontend)

1. **Agregar nuevos estilos/colores**: Modificar `tokens.css` dentro de `@theme`.
2. **Modificar contenido textual**: Dirigirse exclusivamente a `src/data/content.js`.
3. **Añadir nuevas secciones**:
   - Crear el componente en `src/components/sections/`.
   - Asignarle un `id` único y opcionalmente `data-theme`.
   - Orquestarlo en `src/App.jsx`.
   - Agregar su objeto de contenido en `src/data/content.js`.
4. **Optimización de Producción**: Vite / Rolldown maneja automáticamente tree-shaking y compresión CSS/JS.

---

## 7. Backend — FastAPI

### 7.1 Principios de arquitectura

El backend sigue una **arquitectura en capas** con separación estricta de responsabilidades:

| Capa | Módulo | Responsabilidad |
| --- | --- | --- |
| **Router** | `api/routers/*.py` | Recibir request, validar con schema, delegar al service, devolver response |
| **Service** | `services/*.py` | Lógica de negocio y acceso a base de datos (async SQLAlchemy) |
| **Schema** | `schemas/*.py` | Validación de entrada/salida con Pydantic v2 |
| **Model** | `db/models.py` | Definición de tablas SQLAlchemy (ORM) |
| **Core** | `core/*.py` | Configuración, seguridad y excepciones HTTP |

### 7.2 Modelos de base de datos

**`User`** (`users` table):

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INTEGER PK | Autoincremental |
| `email` | VARCHAR(255) UNIQUE | Correo del administrador |
| `hashed_password` | VARCHAR(255) | Hash bcrypt de la contraseña |
| `full_name` | VARCHAR(255) | Nombre completo |
| `is_active` | BOOLEAN | Activo/inactivo |
| `is_superuser` | BOOLEAN | Acceso a creación de usuarios |
| `created_at` | DATETIME | Timestamp de creación (server default) |
| `updated_at` | DATETIME | Timestamp de última actualización |

**`Contact`** (`contacts` table):

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INTEGER PK | Autoincremental |
| `name` | VARCHAR(255) | Nombre completo del solicitante |
| `email` | VARCHAR(255) | Correo electrónico |
| `phone` | VARCHAR(50) | Teléfono/WhatsApp (opcional) |
| `interest` | VARCHAR(255) | Área de interés seleccionada |
| `message` | TEXT | Mensaje libre |
| `activity` | VARCHAR(255) | Actividad de interés (opcional) |
| `is_read` | BOOLEAN | Leído por el admin (default False) |
| `created_at` | DATETIME | Timestamp de creación |

### 7.3 API Endpoints

**Contactos:**

| Método | Ruta | Auth | Body / Params | Respuesta |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/contacts/` | Público | `ContactCreate` JSON | `201 ContactResponse` |
| `GET` | `/api/v1/contacts/` | JWT | `?skip=0&limit=100` | `200 List[ContactResponse]` |
| `GET` | `/api/v1/contacts/{id}` | JWT | Path param `id` | `200 ContactResponse` |
| `PATCH` | `/api/v1/contacts/{id}/read` | JWT | Path param `id` | `200 ContactResponse` |
| `DELETE` | `/api/v1/contacts/{id}` | JWT | Path param `id` | `204 No Content` |

**Autenticación:**

| Método | Ruta | Auth | Body | Respuesta |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Público | Form-data `username` + `password` | `200 Token` |

**Usuarios:**

| Método | Ruta | Auth | Body | Respuesta |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/users/` | JWT (superuser) | `UserCreate` JSON | `200 UserResponse` |

### 7.4 Flujo de autenticación JWT

```
1. POST /api/v1/auth/login  [username, password form-data]
   → verify_password(plain, hashed)  [bcrypt.checkpw]
   → create_access_token(subject=user.email)  [JWT HS256, 24h]
   ← { access_token: "eyJ...", token_type: "bearer" }

2. GET /api/v1/contacts/  [Authorization: Bearer eyJ...]
   → oauth2_scheme extrae el token
   → jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
   → get_user_by_email(db, email=payload.sub)
   → verifica is_active
   ← 200 OK  /  401 Unauthorized
```

### 7.5 Flujo del formulario de contacto

```
Contact.jsx (frontend)
  → fetch(VITE_CONTACT_ENDPOINT, { method: 'POST', body: JSON })
  → POST /api/v1/contacts/
  → Pydantic valida ContactCreate (name, email, phone?, interest?, message, activity?)
  → create_contact(db, contact_in)  → db.commit()
  → BackgroundTasks:
      send_confirmation_email(email, name)   [TODO: integrar Resend/SendGrid]
      notify_admin(name, email, message)     [TODO: email al equipo REDSAM]
  ← 201 ContactResponse
  → frontend: status = 'success' → pantalla de confirmación
```

### 7.6 Configuración (`.env`)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexión SQLAlchemy async | `sqlite+aiosqlite:///./redsam.db` |
| `SECRET_KEY` | Clave para firmar JWT (mín. 32 chars) | `openssl rand -hex 32` |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token | `1440` (24h) |
| `ALLOWED_ORIGINS` | CORS origins separados por coma | `http://localhost:5173` |

### 7.7 Compatibilidad de dependencias

> **Nota importante:** `passlib 1.7.4` es incompatible con `bcrypt >= 4.0`. El proyecto usa `bcrypt` directamente (sin passlib) en `src/core/security.py` para evitar este conflicto.

### 7.8 Script de seed

```bash
# Crear superusuario con valores por defecto
python -m src.seed

# Usar variables de entorno para personalizar
$env:ADMIN_EMAIL="admin@redsam.pe"
$env:ADMIN_PASSWORD="MiPasswordSeguro123"
python -m src.seed
```

Credenciales por defecto: `admin@redsam.pe` / `Redsam2026!`

### 7.9 Tareas pendientes (TODOs)

| Tarea | Módulo | Prioridad |
| --- | --- | --- |
| Integrar Resend/SendGrid para emails reales | `routers/contacts.py` → `send_confirmation_email` | Alta |
| Migrar a PostgreSQL en producción | `backend/.env` → `DATABASE_URL` | Alta |
| Configurar Alembic para migraciones | `backend/` | Media |
| Rate limiting en `POST /contacts/` | `routers/contacts.py` con `slowapi` | Media |
| Tests de integración con `pytest` + `httpx` | `backend/tests/` | Media |
| Panel admin web para visualizar contactos | Nueva app o `admin/` router | Baja |

---

## 8. Guía de Producción

### Frontend
- Ejecutar `pnpm run build` → artefactos en `/dist`
- Servir `/dist` con Nginx, Vercel, Netlify o cualquier CDN estático
- Actualizar `VITE_CONTACT_ENDPOINT` al dominio de producción del backend

### Backend
- Cambiar `DATABASE_URL` a PostgreSQL (`postgresql+asyncpg://...`)
- Generar `SECRET_KEY` segura con `openssl rand -hex 32`
- Ejecutar `python -m src.seed` una sola vez para crear el admin
- Servir con `uvicorn src.main:app --host 0.0.0.0 --port 8000` detrás de Nginx
- Configurar `ALLOWED_ORIGINS` con el dominio real del frontend
