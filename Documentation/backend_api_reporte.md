# Reporte Backend — REDSAM Web App
**Fecha:** 30 Sep 2026 · **Versión frontend:** v1.0 · **Estado actual:** 100% frontend, sin backend conectado

---

## Resumen ejecutivo

El frontend está completamente construido y listo para conectarse a un backend. Existen **dos flujos de formulario** que requieren APIs propias:

| Formulario | Componente | Estado actual |
|---|---|---|
| **Contacto general** | `Contact.jsx` via `services/contact.js` | ⚠️ Preparado — falta definir `VITE_CONTACT_ENDPOINT` |
| **Libro de Reclamaciones** | `LibroReclamaciones.jsx` | ❌ Solo hace `console.log` — sin servicio, sin endpoint |

---

## 1. Estado actual del frontend

### 1.1 Formulario de Contacto (`/` → sección `#contacto`)

El componente [`Contact.jsx`](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/src/components/sections/Contact.jsx) **ya está arquitectado correctamente** para consumir una API:

- Usa el servicio [`src/services/contact.js`](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/src/services/contact.js) para enviar via `fetch()` a un endpoint configurable.
- Lee la URL desde `VITE_CONTACT_ENDPOINT` (variable de entorno).
- Muestra un banner de advertencia si `VITE_CONTACT_ENDPOINT` no está configurado.
- Maneja estados: `idle → submitting → success / error`.

**Payload que envía el frontend:**
```json
{
  "name": "string (max 100)",
  "email": "string (max 254)",
  "phone": "string (opcional)",
  "interest": "string (ej: 'Ser voluntario/a')",
  "message": "string (max 1200)",
  "activity": "string | null"
}
```

**Lo que falta:** Solo configurar la variable de entorno apuntando al endpoint real.

---

### 1.2 Libro de Reclamaciones (`/libro-reclamaciones`)

El componente [`LibroReclamaciones.jsx`](file:///c:/PROYECTOS/FRONTEND/15.%20REDSAM/redsam_oc/src/pages/LibroReclamaciones.jsx) **no tiene ningún servicio conectado**. Su `handleSubmit` actual solo hace:

```js
// ❌ Código actual — no envía nada real
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form data:', formData);
  console.log('Files:', archivos);
  alert('Reclamo enviado correctamente.');
};
```

No existe un archivo `src/services/reclamaciones.js`. Falta todo.

**Payload que deberá enviar el frontend (datos del formulario):**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `nombre` | string | ✅ | |
| `primerApellido` | string | ✅ | |
| `segundoApellido` | string | ✅ | |
| `tipoDoc` | enum: `DNI`, `CE`, `Pasaporte` | ✅ | |
| `numDoc` | string | ✅ | |
| `celular` | string (tel) | ✅ | |
| `departamento` | string | ✅ | Solo San Martín actualmente |
| `provincia` | string | ✅ | |
| `distrito` | string | ✅ | |
| `direccion` | string | ✅ | |
| `referencia` | string | ❌ | |
| `email` | string (email) | ✅ | |
| `tipoReclamo` | enum: `Reclamo`, `Queja` | ✅ | |
| `tipoConsumo` | enum: `Producto`, `Servicio` | ✅ | |
| `numPedido` | string | ✅ | |
| `fechaReclamo` | date (ISO) | auto | Generado en cliente |
| `proveedor` | string | auto | Fijo: `"REDSAM"` |
| `montoReclamado` | decimal | ❌ | |
| `descripcion` | string (textarea) | ✅ | |
| `fechaCompra` | date | ❌ | |
| `fechaConsumo` | date | ❌ | |
| `fechaCaducidad` | date | ❌ | |
| `detalleReclamo` | string (textarea) | ✅ | |
| `pedidoCliente` | string (textarea) | ✅ | |
| `detalleArticulo` | string (textarea) | ❌ | |
| `numeroPedido2` | string | ❌ | Campo secundario |
| `archivos` | File[] (max 5, max 10MB total) | ❌ | multipart/form-data |

---

## 2. APIs requeridas

### API 1 — Formulario de Contacto

| Propiedad | Valor |
|---|---|
| **Endpoint** | `POST /api/contact` |
| **Content-Type** | `application/json` |
| **Autenticación** | Opcional (rate-limit por IP recomendado) |

**Request body:**
```json
{
  "name": "María López",
  "email": "maria@ejemplo.pe",
  "phone": "+51 941 000 000",
  "interest": "Ser voluntario/a",
  "message": "Me gustaría unirme a la red...",
  "activity": "Taller: Liderazgo para el cambio"
}
```

**Response esperada (200 OK):**
```json
{ "ok": true, "message": "Mensaje recibido correctamente." }
```

**Response esperada (error):**
```json
{ "ok": false, "error": "Descripción del error." }
```

**Acciones que debe realizar el backend:**
- [ ] Validar y sanitizar todos los campos.
- [ ] Enviar notificación interna por correo a `hola@redsam.pe` con el detalle de la solicitud.
- [ ] Enviar correo de confirmación al usuario (campo `email`).
- [ ] (Opcional) Guardar registro en base de datos.
- [ ] Aplicar rate-limiting (ej. máx. 5 solicitudes/hora por IP).

---

### API 2 — Libro de Reclamaciones

| Propiedad | Valor |
|---|---|
| **Endpoint** | `POST /api/reclamaciones` |
| **Content-Type** | `multipart/form-data` (por los archivos adjuntos) |
| **Autenticación** | Pública (con CAPTCHA recomendado) |

**Acciones que debe realizar el backend:**
- [ ] Validar todos los campos requeridos.
- [ ] Validar archivos adjuntos: máx. 5 archivos, máx. 10 MB total, tipos permitidos (PDF, JPG, PNG).
- [ ] Guardar el registro del reclamo en base de datos con un **código de seguimiento único** (ej. `REC-2026-0001`).
- [ ] Guardar los archivos adjuntos en almacenamiento (S3, disco, etc.).
- [ ] Enviar correo de acuse de recibo al cliente con el **código de seguimiento**.
- [ ] Enviar notificación interna al equipo de REDSAM.
- [ ] (Legal) El sistema debe guardar evidencia con timestamp para cumplir el plazo de 30 días establecido por INDECOPI.

**Response esperada (201 Created):**
```json
{
  "ok": true,
  "codigoSeguimiento": "REC-2026-0001",
  "message": "Tu reclamo fue registrado. Recibirás una respuesta en un máximo de 30 días."
}
```

---

## 3. Cambios necesarios en el frontend

### 3.1 Crear servicio `src/services/reclamaciones.js`

```js
// PENDIENTE DE CREAR: src/services/reclamaciones.js
const reclamacionesEndpoint = import.meta.env.VITE_RECLAMACIONES_ENDPOINT?.trim()

export const isReclamacionesServiceConfigured = Boolean(reclamacionesEndpoint)

export async function sendReclamacion(formData, archivos, { signal } = {}) {
  if (!reclamacionesEndpoint) {
    throw new Error('RECLAMACIONES_ENDPOINT_NOT_CONFIGURED')
  }

  const body = new FormData()
  Object.entries(formData).forEach(([key, value]) => body.append(key, value))
  archivos.forEach((file) => body.append('archivos', file))

  const response = await fetch(reclamacionesEndpoint, {
    method: 'POST',
    body,            // No establecer Content-Type, el browser lo hace automáticamente con boundary
    signal,
  })

  if (!response.ok) {
    throw new Error('RECLAMACION_REQUEST_FAILED')
  }

  return response.json()
}
```

### 3.2 Actualizar `handleSubmit` en `LibroReclamaciones.jsx`

Reemplazar el `handleSubmit` actual por uno que:
- [ ] Llame a `sendReclamacion()` del nuevo servicio.
- [ ] Maneje estado de carga (`isSubmitting`).
- [ ] Muestre el **código de seguimiento** devuelto por la API en caso de éxito.
- [ ] Muestre mensajes de error descriptivos al usuario.

### 3.3 Actualizar variables de entorno

**Archivo `.env` (local):**
```ini
# Contacto general
VITE_CONTACT_ENDPOINT="http://localhost:3000/api/contact"

# Libro de reclamaciones
VITE_RECLAMACIONES_ENDPOINT="http://localhost:3000/api/reclamaciones"
```

**Archivo `.env.example` (actualizar):**
```ini
# URL del endpoint del formulario de contacto
VITE_CONTACT_ENDPOINT="https://api.redsam.pe/api/contact"

# URL del endpoint del libro de reclamaciones
VITE_RECLAMACIONES_ENDPOINT="https://api.redsam.pe/api/reclamaciones"
```

---

## 4. Stack de backend recomendado

> [!NOTE]
> El proyecto ya tiene un `Dockerfile` configurado con Node 20 Alpine, por lo que un backend en Node.js encaja perfectamente.

| Capa | Opción recomendada | Alternativa |
|---|---|---|
| **Runtime** | Node.js 20 | Python (FastAPI) |
| **Framework** | Express.js / Fastify | Hono |
| **Correo transaccional** | Resend | SendGrid / Nodemailer + SMTP |
| **Base de datos** | PostgreSQL | SQLite (para inicio rápido) |
| **ORM** | Prisma | Drizzle |
| **Almacenamiento archivos** | AWS S3 / Cloudflare R2 | Disco local (desarrollo) |
| **Rate limiting** | `express-rate-limit` | Cloudflare WAF |
| **CAPTCHA** | Cloudflare Turnstile (gratis) | hCaptcha |

---

## 5. Modelo de base de datos sugerido

```sql
-- Tabla: contactos
CREATE TABLE contactos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(254) NOT NULL,
  telefono    VARCHAR(20),
  interes     VARCHAR(100),
  mensaje     TEXT NOT NULL,
  actividad   VARCHAR(200),
  ip_origen   INET,
  creado_en   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: reclamaciones
CREATE TABLE reclamaciones (
  id                  SERIAL PRIMARY KEY,
  codigo_seguimiento  VARCHAR(20) UNIQUE NOT NULL,  -- REC-2026-0001
  nombre              VARCHAR(100) NOT NULL,
  primer_apellido     VARCHAR(100) NOT NULL,
  segundo_apellido    VARCHAR(100),
  tipo_doc            VARCHAR(20) NOT NULL,
  num_doc             VARCHAR(20) NOT NULL,
  celular             VARCHAR(20) NOT NULL,
  email               VARCHAR(254) NOT NULL,
  departamento        VARCHAR(100),
  provincia           VARCHAR(100),
  distrito            VARCHAR(100),
  direccion           TEXT,
  referencia          TEXT,
  tipo_reclamo        VARCHAR(20) NOT NULL,   -- 'Reclamo' | 'Queja'
  tipo_consumo        VARCHAR(20) NOT NULL,   -- 'Producto' | 'Servicio'
  num_pedido          VARCHAR(100),
  fecha_reclamo       DATE NOT NULL,
  proveedor           VARCHAR(100) DEFAULT 'REDSAM',
  monto_reclamado     DECIMAL(10,2),
  descripcion         TEXT NOT NULL,
  fecha_compra        DATE,
  fecha_consumo       DATE,
  fecha_caducidad     DATE,
  detalle_reclamo     TEXT NOT NULL,
  pedido_cliente      TEXT NOT NULL,
  detalle_articulo    TEXT,
  estado              VARCHAR(30) DEFAULT 'pendiente',  -- pendiente | en_proceso | resuelto
  creado_en           TIMESTAMPTZ DEFAULT NOW(),
  plazo_respuesta     TIMESTAMPTZ GENERATED ALWAYS AS (creado_en + INTERVAL '30 days') STORED
);

-- Tabla: reclamacion_archivos
CREATE TABLE reclamacion_archivos (
  id              SERIAL PRIMARY KEY,
  reclamacion_id  INT REFERENCES reclamaciones(id) ON DELETE CASCADE,
  nombre_archivo  VARCHAR(255) NOT NULL,
  url_archivo     TEXT NOT NULL,
  tamano_bytes    INT,
  subido_en       TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Variables de entorno del backend

```ini
# Server
PORT=3000
NODE_ENV=production

# CORS — Origen permitido (el frontend)
ALLOWED_ORIGIN=https://redsam.pe

# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/redsam_db

# Correo transaccional (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=no-reply@redsam.pe
EMAIL_TO_ADMIN=hola@redsam.pe

# Almacenamiento de archivos (S3 / Cloudflare R2)
STORAGE_BUCKET=redsam-reclamaciones
STORAGE_ACCESS_KEY=xxxx
STORAGE_SECRET_KEY=xxxx
STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=3600000   # 1 hora
RATE_LIMIT_MAX=5               # máx. 5 peticiones por IP por ventana
```

---

## 7. Checklist de implementación

### Backend — Formulario de Contacto
- [ ] Crear endpoint `POST /api/contact`
- [ ] Validación de campos (nombre, email, mensaje obligatorios)
- [ ] Rate limiting por IP
- [ ] Integración con proveedor de correo (Resend / SendGrid)
- [ ] Email de notificación interna a `hola@redsam.pe`
- [ ] Email de confirmación al usuario
- [ ] Manejo de errores con códigos HTTP correctos (400, 429, 500)
- [ ] Configurar CORS para el dominio del frontend

### Backend — Libro de Reclamaciones
- [ ] Crear endpoint `POST /api/reclamaciones`
- [ ] Parser de `multipart/form-data` (ej. `multer` en Express)
- [ ] Validación de campos requeridos
- [ ] Validación de archivos (tipo MIME, cantidad, tamaño)
- [ ] Generación de código de seguimiento único (`REC-YYYY-NNNN`)
- [ ] Guardado en base de datos
- [ ] Upload de archivos a almacenamiento (S3 / R2)
- [ ] Email de acuse de recibo al cliente con código de seguimiento
- [ ] Email de notificación interna
- [ ] Manejo de errores con mensajes claros
- [ ] (Futuro) Endpoint `GET /api/reclamaciones/:codigo` para consultar estado

### Frontend — Libro de Reclamaciones
- [ ] Crear `src/services/reclamaciones.js`
- [ ] Actualizar `handleSubmit` en `LibroReclamaciones.jsx`
- [ ] Agregar estado de carga (`isSubmitting`) con feedback visual en el botón
- [ ] Mostrar código de seguimiento en pantalla de éxito
- [ ] Mostrar mensajes de error descriptivos al usuario
- [ ] Agregar advertencia tipo banner si `VITE_RECLAMACIONES_ENDPOINT` no está configurado (igual que Contact)

### Infraestructura
- [ ] Agregar `VITE_CONTACT_ENDPOINT` al `.env` y al `.env.example`
- [ ] Agregar `VITE_RECLAMACIONES_ENDPOINT` al `.env` y al `.env.example`
- [ ] Configurar variables en el entorno de producción (hosting/CI)
- [ ] Crear repositorio separado para el backend (o monorepo)
- [ ] Configurar `Dockerfile` para el backend
- [ ] Configurar HTTPS y dominio (ej. `api.redsam.pe`)

---

## 8. Diagrama de flujo

```
FRONTEND (redsam.pe)
│
├── [Formulario Contacto]
│   └── POST /api/contact  ──────────► BACKEND
│                                          │
│                                          ├── Valida payload
│                                          ├── Rate-limit IP
│                                          ├── Email → hola@redsam.pe
│                                          ├── Email confirmación → usuario
│                                          └── 200 OK { ok: true }
│
└── [Libro de Reclamaciones]
    └── POST /api/reclamaciones ────► BACKEND
                                         │
                                         ├── Valida payload + archivos
                                         ├── Genera código REC-YYYY-NNNN
                                         ├── Guarda en DB
                                         ├── Sube archivos a S3/R2
                                         ├── Email acuse → cliente
                                         ├── Email notif → hola@redsam.pe
                                         └── 201 Created { codigoSeguimiento }
```

---

> [!IMPORTANT]
> **Prioridad legal:** El Libro de Reclamaciones es un **requisito legal peruano** (Código de Protección y Defensa del Consumidor, Ley 29571). El backend debe garantizar persistencia confiable, timestamp auditado y que el plazo de 30 días calendario sea rastreable. No se puede dejar en `console.log`.

> [!TIP]
> Para arrancar rápido, puedes usar **Resend** (plan gratuito: 3,000 emails/mes) como proveedor de correo y **Neon** o **Supabase** como base de datos PostgreSQL serverless. Ambos tienen tier gratuito generoso y se integran en minutos con Node.js.
