# Design

<!-- impeccable:design-schema 1 -->

## World: «Red de Señales»

REDSAM es una red de jóvenes líderes en la región San Martín. El mundo visual traduce esa idea a una constelación viva: fondo de noche índigo sobre el cual la señal multicolor de la marca (cian → violeta → magenta → ámbar) viaja conectando nodos —los líderes—. El territorio es un mapa: grillas cartográficas, coordenadas y tipografía técnica en monoespaciada conviven con un display geométrico amplio y una composición editorial asimétrica.

Se rechaza el template de ONG (fondo crema, serif cálido, un solo acento): el suelo por defecto es índigo profundo casi-negro con secciones de contenido en off-white frío, y la energía vive en vectores finos del degradado, nunca en texto degradado.

## Surfaces & Multitema

- **Noche Índigo (Inmersiva):** `--surface` (#0A1226) con superficies suaves `--surface-soft` (#101B38). Configuración de marca por defecto para la atmósfera amazónica nocturna.
- **Negro Puro (OLED Contrast):** `--surface` (#000000) con superficies `#0c0e17` y líneas nítidas para una experiencia futurista de alto contraste.
- **Día (Editorial Claro):** `--surface` (#F4F6FB) con tarjetas blancas `--surface-soft` (#FFFFFF) y bordes `#0f172a1f` que garantizan contraste AA y jerarquía visual impecable.
- **Transición Cromática Global:** Conmutación sin parpadeos orquestada por atributos `data-theme` con transición fluida de `0.4s` en fondos, bordes y textos.

## Palette

- Señal (degradado de marca, muestreado del logo):
  - `--signal-cyan` #00C0C0
  - `--signal-violet` #7A3F9F
  - `--signal-magenta` #E4246C
  - `--signal-amber` #F0900C
- Indigo / noche (de las fotografías): `--ink-950` #0A1226 · `--ink-900` #101B38 · `--ink-800` #182646 · `--ink-700` #223258 · `--ink-300` #8FA3C7 · `--ink-200` #C3CFE4.
- Día: `--paper` #F6F8FD · `--surface` #FFFFFF · `--line` #E3E8F2 · `--ink-day` #0E1B33 · `--ink-soft` #4A5A7A.
- La señal se aplica como sistema: vectores delgados, anillos de nodo, brillos de hover y la franja diagonal de la marca. Prohibido como texto degradado.

## Typography

- Display: **Sora** (300–800). Titulares amplios, tracking −0.03em a −0.045em, máx 6rem.
- Texto: **Manrope** (400–700). Medida 65–75ch.
- Mono (coordenadas, medidas, etiquetas técnicas): **Space Mono** (400/700), mayúsculas espaciadas 0.18em. Se usa como sistema de datos/medición, no como disfraz técnico.

## Motifs

- **Constelación Neural:** 42 nodos con jerarquía y paquetes de fotones en tiempo real sobre el mapa de San Martín, con conexiones directas proyectadas al cursor.
- **Luciérnagas Vivas:** Partículas bioluminiscentes flotantes en el Hero con respiración sinusoidal y repulsión elástica que se excitan ante el cursor.
- **Laboratorio de Partículas:** Rasterización tipográfica en tiempo real a partículas elásticas en Canvas 2D (`measureText`), con dispersión física ante el ratón, explosión en pulso radial y **adaptación dinámica total al fondo/tema elegido** (`data-theme`), mutando sus fondos, canvas, controles y tipografías en tiempo real.
- **Cartografía:** grilla fina, cruces de coordenadas, etiquetas tipo `06°29′S · 76°21′W` (Tarapoto).
- **Grano:** textura sutil de ruido sobre superficies oscuras para dar profundidad física.

## Motion

- Momento focal — **Hero con carrusel GPU y luciérnagas vivas**: carrusel 1:1 con ratio responsivo y precarga, acompañado de luciérnagas interactivas y constelación SVG de fondo.
- **Red Topográfica Interactiva (`NeuralSignalConstellation`)**: paquetes de pulso que viajan entre nodos y reacción magnética al puntero.
- **Interactive Particle Text**: físicas elásticas (Spring Physics) en letras de partículas adaptadas dinámicamente al contenedor y al tema seleccionado.
- **Tarjetas 3D Tilt Homogéneas**: físicas de resorte en hover (`Card3DTilt`) con alturas equilibradas (`min-h-[380px]` en Pillars, `min-h-[280px]` en Valores), tags alineados en la misma base y contraste cromático protegido en hover contra cualquier tono de superficie.
- **Navegación del Carrusel de Actividades**: botones de avance y retroceso posicionados ergonómicamente en la cabecera superior derecha para máxima accesibilidad y limpieza visual.
- **Barra de progreso de página** con la señal de marca (fija, 3px, escala en X).
- **Control de Recursos y Batería**: pausa automática con `IntersectionObserver` de todos los lienzos Canvas fuera del viewport.
- Todo el motion respeta `prefers-reduced-motion` (desactiva físicas y bucles automáticamente).

## Components

- Botones: primario (señal ámbar→magenta sólido sobre noche, texto oscuro), secundario (contorno), terciario (texto con flecha). Estados hover con desplazamiento de la señal.
- Eyebrow de sistema: mono + coordenada (p. ej. `// 01 — NOSOTROS`). Un kicker nombrado, no repetido en cada sección.
- Tarjetas de actividad: imagen real, fecha en mono, título display, descripción, tags.
- Navbar: glass sobre noche, logo + enlaces + CTA; sobre día, fondo blanco.
- Footer: noche densa, constelación de marca, enlaces + sociales + legal.
- Formulario: campos con borde inferior y señal en foco; estados de envío simulados.

## Estado del arte

Tokens exactos provisionales hasta el primer build; se consolidan en este archivo cuando la implementación los fije.
Para un detalle técnico completo de cómo se implementan estos tokens, clases CSS y animaciones en el código fuente, consulta el archivo `TECHNICAL_REFERENCE.md`.