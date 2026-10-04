# Arquitectura y Planificación del API REST con FastAPI

## Contexto y Visión General

Hola. Como Ingeniero de Software Arquitecto con más de 20 años de experiencia en el diseño y despliegue de sistemas a gran escala, he analizado la estructura de tu proyecto **REDSAM**. Tienes un frontend sólido y modular construido en React/Vite. Para llevar este proyecto al siguiente nivel, vamos a diseñar un **backend profesional, altamente escalable y asíncrono utilizando Python y FastAPI**.

Nuestro objetivo es crear una API REST que no solo almacene los contactos y gestione el contenido, sino que esté diseñada para soportar alta concurrencia, con una arquitectura limpia (Clean Architecture), modularidad total, enrutamiento eficiente y un modelo de seguridad robusto.

---

## 1. Diseño de Arquitectura (Modularidad)

Para garantizar que el código se mantenga limpio y escalable, dividiremos el proyecto en capas bien definidas. El backend residirá en una carpeta `backend/` paralela a tu frontend `redsam_oc/`.

### Estructura de Directorios Propuesta

```text
backend/
├── src/
│   ├── api/
│   │   ├── dependencies.py    # Inyección de dependencias (p.ej. conexión a DB, validación de token)
│   │   ├── routers/           # Enrutadores modulares (contacts.py, users.py, auth.py)
│   ├── core/
│   │   ├── config.py          # Gestión de variables de entorno usando Pydantic Settings
│   │   ├── security.py        # Lógica de hashing de contraseñas y generación de JWT
│   │   ├── exceptions.py      # Manejo global y centralizado de errores (HTTPException custom)
│   ├── db/
│   │   ├── session.py         # Configuración del motor DB asíncrono y sesión
│   │   ├── models.py          # Modelos de Base de Datos (ORM - p.ej. SQLAlchemy)
│   ├── schemas/               # Pydantic BaseModels para validación y tipado estricto (I/O)
│   ├── services/              # Lógica de negocio (Donde viven los CRUDs)
│   ├── utils/                 # Tareas en hilos secundarios, helpers, envio de correos
│   ├── main.py                # Punto de entrada de la aplicación FastAPI
├── tests/                     # Pruebas unitarias e integración (Pytest)
├── .env                       # Archivo de variables de entorno (no se sube al repositorio)
├── .env.example               # Ejemplo de variables requeridas
├── requirements.txt           # Dependencias del proyecto
```

---

## 2. Modelos, Validaciones y CRUD

Utilizaremos el poder de **Pydantic (`BaseModel`)** para definir exactamente qué datos entran y salen, lo que nos dará validación automática y documentación en OpenAPI (Swagger) de forma gratuita.

### Entidades Principales a Desarrollar:
1. **Contact (Contacto)**: Procesará el formulario que tienes en tu landing page.
2. **User (Usuario Administrador)**: Administradores de REDSAM que podrán gestionar los datos.
3. **Activity (Actividades/Estadísticas)**: (Opcional en el futuro) Para alimentar el frontend dinámicamente sin editar archivos estáticos.

### Patrón CRUD:
Toda la lógica de acceso a datos estará aislada en `src/services/`. Los _Routers_ únicamente recibirán la petición, llamarán al servicio y devolverán la respuesta. Esto facilita enormemente el testing y mantenimiento.

---

## 3. Autenticación y Seguridad (OAuth2 + JWT)

Aplicaremos el estándar de la industria.
- Implementaremos **OAuth2 con `OAuth2PasswordBearer`**.
- Usaremos **JSON Web Tokens (JWT)** para autenticar las peticiones a rutas protegidas.
- Las contraseñas en la base de datos se almacenarán cifradas utilizando **Bcrypt** (a través de `passlib`).

---

## 4. Rendimiento: Asincronismo e Hilos Secundarios

FastAPI es rápido porque es asíncrono.
- **Base de Datos**: Utilizaremos drivers asíncronos (como `asyncpg` para PostgreSQL o `aiosqlite` para SQLite) para que las operaciones de I/O no bloqueen el servidor.
- **Background Tasks (Hilos secundarios)**: Operaciones que demoran (como enviar un email de confirmación después de que alguien llene el formulario de contacto) se delegarán a hilos en segundo plano utilizando `BackgroundTasks` de FastAPI o `concurrent.futures.ThreadPoolExecutor`. De esta manera, el usuario frontend recibe un HTTP 200 inmediatamente.

---

## 5. Variables de Entorno

Evitaremos configuraciones "hardcodeadas". En `src/core/config.py` cargaremos y validaremos (con `pydantic-settings`) variables críticas como:
- `DATABASE_URL`
- `SECRET_KEY` (Para firmar los tokens JWT)
- `ALGORITHM` (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`

---

## 6. Archivo `requirements.txt`

A continuación, la lista de requerimientos técnicos que implementaremos en este archivo:

```text
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
pydantic>=2.6.0
pydantic-settings>=2.2.1
sqlalchemy>=2.0.29
asyncpg>=0.29.0          # Si usamos PostgreSQL (recomendado)
aiosqlite>=0.20.0        # Si usamos SQLite (para desarrollo inicial)
passlib[bcrypt]>=1.7.4
python-jose[cryptography]>=3.3.0
python-multipart>=0.0.9  # Para manejar OAuth2 Form Data
alembic>=1.13.1          # Para migraciones de Base de Datos
pytest>=8.1.1            # Para Testing
httpx>=0.27.0            # Para Testing de APIs
```

---

## User Review Required

> [!IMPORTANT]
> **Aprobación de la Arquitectura**
> Por favor revisa este plan. Una vez aprobado, procederé a crear la estructura de carpetas, los archivos y la configuración inicial de la aplicación.

## Open Questions

> [!TIP]
> **Decisiones Técnicas Pendientes**
> 1. **Base de Datos**: Para un proyecto a gran escala, recomiendo **PostgreSQL**. ¿Deseas que iniciemos directamente con PostgreSQL (requerirá que tengas una base de datos local o en nube configurada), o prefieres iniciar con **SQLite** para un desarrollo ágil y luego migrar?
> 2. **Pruebas Manuales (Postman)**: Mencionaste el uso de Postman. FastAPI autogenera documentación en `/docs` (Swagger UI) que permite hacer pruebas exactamente igual que Postman de manera nativa. ¿Estarías de acuerdo en usar esto como primera herramienta de prueba?
