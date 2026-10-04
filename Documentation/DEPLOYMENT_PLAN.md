# Plan de Despliegue y Producción — REDSAM

Este documento detalla los próximos pasos necesarios para llevar la plataforma REDSAM (Frontend React + Backend FastAPI) desde el entorno de desarrollo local hacia un entorno de producción público y funcional.

---

## 1. 📧 Integración de Correos Reales (Backend)

Actualmente, el backend almacena los contactos en la base de datos, pero las tareas en segundo plano (`send_confirmation_email` y `notify_admin`) solo imprimen mensajes en la consola. Es necesario conectar un servicio transaccional.

**Acciones requeridas:**
- Crear una cuenta en un proveedor de correos transaccionales (recomendado: **Resend** o **SendGrid**).
- Obtener el API Key e inyectarlo como variable de entorno (`RESEND_API_KEY`).
- Instalar el SDK oficial (ej. `pip install resend`).
- Modificar el archivo `backend/src/api/routers/contacts.py` para reemplazar los `print()` por llamadas reales al API de correos.

---

## 2. 🗄️ Migración de Base de Datos (Backend)

El entorno local utiliza SQLite, lo cual es excelente para desarrollo rápido, pero en producción (especialmente con arquitecturas asíncronas de FastAPI y despliegues serverless/efímeros), se requiere una base de datos más robusta.

**Acciones requeridas:**
- Crear una base de datos **PostgreSQL** en la nube (proveedores como Render, Supabase, o Railway ofrecen opciones gratuitas).
- Actualizar la variable de entorno `DATABASE_URL` en producción para apuntar al nuevo servidor usando el driver asíncrono (`postgresql+asyncpg://usuario:pass@host/bd`).
- Ejecutar el script `seed.py` en producción por única vez para crear el primer administrador.

---

## 3. 🚀 Despliegue del Frontend (Aplicación Web)

El frontend está construido como una SPA estática (Single Page Application) optimizada. Su despliegue es sencillo y gratuito.

**Acciones requeridas:**
- Elegir plataforma de hosting (recomendado: **Vercel**, **Netlify** o **Cloudflare Pages**).
- Vincular el repositorio de código (GitHub/GitLab).
- Configurar comandos de compilación en la plataforma:
  - **Build Command**: `pnpm run build`
  - **Output Directory**: `dist`
- Configurar Variables de Entorno en el dashboard del hosting:
  - `VITE_API_URL` = URL pública del backend (una vez desplegado en el paso 4).
  - `VITE_CONTACT_ENDPOINT` = URL completa del endpoint POST de contactos.

---

## 4. ☁️ Despliegue del Backend (API REST)

El servidor de Python/FastAPI requiere un entorno de ejecución continuo (App Service o Contenedor).

**Acciones requeridas:**
- Elegir plataforma cloud (recomendado: **Render** como "Web Service" o **Railway**).
- Vincular el repositorio y especificar la raíz del backend.
- Configurar comando de arranque: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- Configurar Variables de Entorno en la nube:
  - `DATABASE_URL` = URL de PostgreSQL (Paso 2).
  - `SECRET_KEY` = Hash seguro de 32+ caracteres.
  - `ALLOWED_ORIGINS` = URL pública del frontend (Paso 3) para habilitar CORS de forma segura.
  - `RESEND_API_KEY` = Credenciales del correo (Paso 1).

---

## Resumen de Orden de Ejecución Recomendado

1. **Código:** Completar Paso 1 (Correos) para tener el código fuente 100% terminado.
2. **Infraestructura Backend:** Completar Pasos 2 y 4 para obtener la URL pública de la API y su base de datos.
3. **Infraestructura Frontend:** Completar Paso 3 usando la URL pública del backend obtenida en el punto anterior.
