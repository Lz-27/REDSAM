# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Jóvenes de la región San Martín (Perú) entre ~15 y 29 años que buscan capacitarse, hacer voluntariado o encontrar un espacio para participar y crecer como líderes.
- Aliados, instituciones, docentes y organizaciones que quieran sumar recursos, espacios o convocatorias.
- Público general interesado en la labor social de la organización.

## Product Purpose

Sitio tipo landing page que da a conocer a REDSAM: qué es, qué promueve, qué beneficios ofrece y qué actividades realiza (capacitaciones, voluntariados, ayudas). Su éxito se mide en que un visitante entienda en segundos qué hace la organización y actúe: inscribirse, contactar o sumarse como aliado.

## Positioning

REDSAM es una organización que fortalece la **capacitación de jóvenes líderes** en la región San Martín. Su mecanismo diferenciador es operar como una **red** —literalmente, su nombre lo dice— que conecta jóvenes, espacios, voluntariado y ayuda social en un territorio.

## Operating Context

- Sitio de una sola página (landing) navegable por secciones: Hero, Quiénes somos, Qué hacemos, Galería, Actividades, Contacto y Footer.
- Visita típica desde móvil y escritorio, en contexto de navegación casual y de búsqueda de oportunidades de participación.
- Lenguaje de la interfaz: español (es-PE).

## Capabilities and Constraints

- Frontend puro (HTML, CSS, JS, React). Sin backend en esta fase: el formulario de contacto es de demostración (sin envío real) y debe quedar claramente marcado como reemplazable.
- Stack: Vite + React 19 + Tailwind CSS v4, con sistema de componentes reutilizables y tokens de diseño.
- La totalidad del copy y los datos de actividades es material de demostración de alta fidelidad, reemplazable por contenido real de la organización.
- Contacto (correo, teléfono, redes): placeholders de demostración.

## Brand Commitments

- Nombre: REDSAM.
- Logo: degradado multicolor sobre fondo blanco (muestreado de `img/logo.jpg`): cian `#00C0C0`, violeta `#783C90`, magenta `#E4246C`, ámbar `#F0900C`.
- Fotografías de actividades en tonos azul índigo profundo (`img/01_image.jpg`, `img/02_image.jpg`, `img/03_image.jpg`).
- El mundo visual se apoya en estos colores de marca; no se inventa una identidad ajena.

## Evidence on Hand

- Assets reales: `img/logo.jpg` (logo), `img/01_image.jpg`, `img/02_image.jpg`, `img/03_image.jpg` (fotografías de actividades).
- No hay textos oficiales, datos de contacto, redes ni contenido institucional real confirmado; el copy profesional del sitio es de demostración y está listado como reemplazable.

## Product Principles

1. La página debe posicionar a REDSAM como una **red de jóvenes líderes** activa en el territorio, no como una ONG genérica de asistencia.
2. Claridad de acción: en cada tramo del scroll el visitante sabe qué puede hacer (unirse, participar, contactar, ser aliado).
3. Escalabilidad de código: contenido desacoplado en un módulo de datos y componentes reutilizables para que nuevas secciones o actividades se agreguen sin tocar la estructura.
4. El diseño expresa energía y futuro (público joven) sin sacrificar elegancia, legibilidad ni accesibilidad.

## Accessibility & Inclusion

- Español claro y directo. Contraste WCAG AA en texto (≥4.5:1) y elementos grandes (≥3:1).
- Navegación por teclado y estados de foco visibles. Imágenes con texto alternativo descriptivo.