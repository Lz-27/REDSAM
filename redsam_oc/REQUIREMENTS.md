# Requerimientos — REDSAM

**Proyecto:** REDSAM · Red de Jóvenes Líderes de San Martín
**Tipo:** Aplicación web full-stack (SPA + API REST)
**Stack Frontend:** React 19 · Vite 8 · Tailwind CSS v4 · pnpm
**Stack Backend:** Python 3.11 · FastAPI · SQLAlchemy 2.0 async · SQLite/PostgreSQL
**Estado:** v1.1 · Backend funcional · Contenido de demostración (ver §5)

---

## 1. Objetivo

Dar a conocer a REDSAM, lo que promueve, sus beneficios y actividades, posicionándola como una **red de jóvenes líderes** activa en la región San Martín, y convertir la visita en una acción: unirse, participar o ser aliado.

## 2. Alcance

- Landing page SPA (una sola página) con navegación por anclas.
- **Backend FastAPI** con API REST para el formulario de contacto y autenticación.
- Base de datos SQLite para desarrollo, PostgreSQL para producción.
- Formulario de contacto funcional con persistencia en base de datos.
- Diseño responsivo (móvil, tablet, escritorio) y accesible.

## 3. Requerimientos funcionales

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-01 | **Navbar fijo** con logo, enlaces y CTA | Visible al hacer scroll; transición de transparente (sobre hero) a blanco (scroll); menú móvil de pantalla completa funcional |
| RF-02 | **Hero** de impacto | Titular, subtítulo, dos CTA, collage de imágenes, coordenadas y estadísticas visibles en el primer viewport |
| RF-03 | **Marquee** de palabras clave | Bucle continuo de temas de la red |
| RF-04 | **Quiénes somos** | Historia, misión, visión y valores de la organización |
| RF-05 | **Qué hacemos** | Cuatro rutas de la red: capacitación, voluntariado, ayuda social y aliados |
| RF-06 | **Carrusel de imágenes** | Avance automático con pausa en hover, flechas, miniaturas y contador |
| RF-07 | **Últimas actividades** | Carrusel Embla con Autoplay y controles de navegación reubicados en la cabecera superior derecha; tarjetas interactivas con apertura de modal Dialog |
| RF-08 | **Impacto / estadísticas** | Métricas con conteo animado al entrar al viewport |
| RF-09 | **CTA de marca** | Franja a página completa con llamada a la acción |
| RF-10 | **Formulario de contacto** | Nombre, correo, teléfono opcional, interés y mensaje; validación HTML y Pydantic v2; envío real al backend FastAPI; estado de éxito/error funcional |
| RF-11 | **Footer** | Marca, navegación, programas, contacto, redes y legal |
| RF-12 | **Contenido desacoplado** | Todo el copy se edita desde `src/data/content.js` sin tocar componentes |
| RF-13 | **Luciérnagas vivas en Hero** | Partículas bioluminiscentes orgánicas con repulsión física y destello reactivo ante el cursor |
| RF-14 | **Red neural en Mapa** | Nodos territoriales interconectados que emiten fotones de datos y proyectan líneas magnéticas al cursor |
| RF-15 | **Interactive Particle Text** | Rasterización de texto a partículas elásticas con auto-ajuste de escala (`measureText`), detonación radial y adaptación 100% reactiva al fondo/tema elegido (fondos, lienzo, tipografías y botones) |
| RF-16 | **Sistema Multitema Fluido** | Conmutación instantánea y sin parpadeos entre Índigo, Negro puro y Claro con persistencia en localStorage y protección de contraste visual en todas las tarjetas |

## 4. Requerimientos no funcionales

| ID | Requerimiento | Detalle |
| --- | --- | --- |
| RNF-01 | **Rendimiento** | Build optimizado por Vite; imágenes con `loading="lazy"` excepto la del hero; bundle JS < 250 kB |
| RNF-02 | **Accesibilidad** | Contraste AA en texto (≥4.5:1) y texto grande (≥3:1); foco visible por teclado; `aria-label` en controles; `prefers-reduced-motion` desactiva animaciones |
| RNF-03 | **Responsivo** | Composición probada en móvil (≥360 px), tablet y escritorio; menú móvil dedicado |
| RNF-04 | **Escalabilidad** | Componentes reutilizables (`ui/`), hooks propios y tokens de diseño; agregar una sección o actividad no requiere reestructurar |
| RNF-05 | **Calidad de código** | `pnpm run lint` (oxlint) sin errores; `pnpm run build` sin errores |
| RNF-06 | **Semántica** | HTML semántico: `header`, `nav`, `main`, `section`, `article`, `footer` |
| RNF-07 | **Documentación** | README, PRODUCT.md, DESIGN.md, REQUIREMENTS.md y TECHNICAL_REFERENCE.md |

## 5. Contenido de demostración

Todo el copy (actividades, estadísticas, correo, teléfono, redes) es **material de demostración de alta fidelidad** y está marcado como reemplazable. Antes de publicar:

- [ ] Reemplazar actividades, fechas y lugares con el calendario oficial
- [ ] Reemplazar estadísticas con métricas reales
- [ ] Configurar correo/teléfono/redes reales en `src/data/content.js`
- [x] ~~Conectar el formulario de contacto a un servicio de correo o API~~ ✅ Backend implementado
- [ ] Integrar servicio de email real (Resend/SendGrid) en `backend/src/api/routers/contacts.py`
- [ ] Migrar a PostgreSQL para producción (`DATABASE_URL` en `backend/.env`)
- [ ] Reemplazar las imágenes de `img/` por las oficiales de alta resolución si se desea

## 6. Fuera de alcance (futuras mejoras)

- ~~Backend y persistencia del formulario~~ ✅ Implementado en v1.1
- Integración de email real (Resend, SendGrid, smtplib)
- Multi-idioma (i18n)
- Página de detalle de actividades
- Panel administrativo web para visualizar contactos
- SEO avanzado y analytics
- Rate limiting en endpoint público de contactos
- Migraciones con Alembic
- Tests de integración (pytest + httpx)