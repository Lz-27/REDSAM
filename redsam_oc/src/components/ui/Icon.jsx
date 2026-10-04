/**
 * Icon — sistema de iconos propio de REDSAM.
 * SVG dibujados en la gramática de la marca (trazo consistente,
 * esquinas redondeadas), sin dependencias externas.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const PATHS = {
  capacitacion: (
    <>
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" />
      <path d="M7 12v4c0 1.2 2.2 2 5 2s5-.8 5-2v-4" />
      <path d="M21.5 9.5V15" />
    </>
  ),
  voluntariado: (
    <>
      <path d="M12 20.5c-5.2-3.5-8.5-6.6-8.5-10a4 4 0 0 1 8-1.1A4 4 0 0 1 19.5 10.5c0 3.4-3.3 6.5-8.5 10Z" />
      <path d="M8.6 12.2h1.9l1.2-2.2 1.5 3 1.2-2.2h1.9" />
    </>
  ),
  ayuda: (
    <>
      <path d="M4 9.5h16" />
      <path d="M4.5 9.5v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8" />
      <path d="M9 9.5V6a3 3 0 0 1 6 0v3.5" />
      <path d="M12 5.7C11 3.6 7.4 3.6 6 5.3 4.8 6.8 6.4 8.6 9 7.9" />
      <path d="M12 5.7c1-2.1 4.6-2.1 6-.4 1.2 1.5-.4 3.3-3 2.6" />
    </>
  ),
  red: (
    <>
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="19" cy="5.5" r="2.2" />
      <circle cx="19" cy="18.5" r="2.2" />
      <path d="M7 10.9l9.8-4.3M7 13.1l9.8 4.3" />
    </>
  ),
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8m9 0v9" />,
  expand: (
    <>
      <path d="M9 4.5H4.5V9" />
      <path d="M15 4.5h4.5V9" />
      <path d="M9 19.5H4.5V15" />
      <path d="M15 19.5h4.5V15" />
    </>
  ),
  arrowLeft: <path d="M20 12H5m6-6-6 6 6 6" />,
  play: <path d="m9 6 8 6-8 6V6Z" />,
  pause: <path d="M9 6v12M15 6v12" />,
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  moon: <path d="M20 13.8A8.2 8.2 0 0 1 10.2 4a8.2 8.2 0 1 0 9.8 9.8Z" />,
  black: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </>
  ),
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M6.8 4.5h2.6l1.1 3.2-1.7 1.3a12.5 12.5 0 0 0 6.2 6.2l1.3-1.7 3.2 1.1v2.6a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.8 6.7a2 2 0 0 1 2-2.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  send: <path d="m4 12 16-7-5.5 15-2.5-6.5L4 12Z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l2.5 2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
      <path d="M15.8 5.6a3.2 3.2 0 0 1 0 5.8" />
      <path d="M17.5 14.8c1.7.7 2.8 2 3.2 4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3c.6 3.9 1.8 5.8 4 7-2.2 1.2-3.4 3.1-4 7-.6-3.9-1.8-5.8-4-7 2.2-1.2 3.4-3.1 4-7Z" />
      <path d="M18.5 13.5c.3 1.7.8 2.5 1.8 3.1-1 .6-1.5 1.4-1.8 3.1-.3-1.7-.8-2.5-1.8-3.1 1-.6 1.5-1.4 1.8-3.1Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h3V5.2h-3a3.8 3.8 0 0 0-3.8 3.8v2.2H8.2v3.3h2.5v6h3.3v-6h2.8l.7-3.3h-3.5V9.3a.8.8 0 0 1 .8-.8Z" />
  ),
  tiktok: (
    <path d="M15.5 4v9.6a3.7 3.7 0 1 1-3.7-3.7M15.5 4a5 5 0 0 0 3.8 3.6" />
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" />
      <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L4 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M8.9 8.8c-.3 2.7 3 5.8 5.9 6.2 1-.4.6-2 .2-2.4-.8-.5-1.4.7-2.2.4-.7-.4-1.7-1.5-2-2.2-.3-.8.9-1.4.4-2.2-.4-.4-2-.6-2.3.2Z" />
    </>
  ),
}

function Icon({ name, size = 24, className = '', ...rest }) {
  const paths = PATHS[name]
  if (!paths) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      {...STROKE}
      {...rest}
    >
      {paths}
    </svg>
  )
}

export default Icon
