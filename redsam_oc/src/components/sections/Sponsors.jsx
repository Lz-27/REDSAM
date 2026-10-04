import { useRef, useEffect, useState } from 'react'
import { sponsors } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

/**
 * Sponsors — carrusel de logos interactivo
 *
 * Características:
 * - Auto-scroll infinito (sin saltos).
 * - Drag-to-scroll (jalar con el mouse para desplazar).
 * - Hover pausa el auto-scroll.
 * - Los clicks en los logos se respetan (no se abren si fue un drag).
 */
function Sponsors() {
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const isHovered = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const reqRef = useRef(null)
  
  // Estado para prevenir clics si el usuario arrastró
  const [hasDragged, setHasDragged] = useState(false)

  // Duplicamos items lo suficiente para garantizar scroll fluido
  const MIN_REPS = 8
  const base = Array.from({ length: MIN_REPS }, () => sponsors.items).flat()
  const loopItems = [...base, ...base]

  // Auto-scroll logic
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const scrollSpeed = 1.5 // Restaurando velocidad original (~180s CSS equivalente)

    const scroll = () => {
      if (!isDragging.current && !isHovered.current) {
        track.scrollLeft += scrollSpeed
        
        // Loop infinito seamless: si llega a la mitad, resetea a 0
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0
        }
      }
      reqRef.current = requestAnimationFrame(scroll)
    }
    
    reqRef.current = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(reqRef.current)
  }, [])

  // ── Drag Logic ───────────────────────────────────────────
  const handlePointerDown = (e) => {
    if (!trackRef.current) return
    isDragging.current = true
    setHasDragged(false) // Iniciamos asumiendo que es un clic
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
    trackRef.current.style.cursor = 'grabbing'
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current || !trackRef.current) return
    
    // Si se mueve más de unos píxeles, se considera un drag
    setHasDragged(true) 
    
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5 // Multiplicador de velocidad al arrastrar
    trackRef.current.scrollLeft = scrollLeft.current - walk

    // Loop infinito también al arrastrar
    if (trackRef.current.scrollLeft >= trackRef.current.scrollWidth / 2) {
      trackRef.current.scrollLeft = 0
      startX.current = e.pageX - trackRef.current.offsetLeft
      scrollLeft.current = trackRef.current.scrollLeft
    } else if (trackRef.current.scrollLeft <= 0) {
      trackRef.current.scrollLeft = trackRef.current.scrollWidth / 2
      startX.current = e.pageX - trackRef.current.offsetLeft
      scrollLeft.current = trackRef.current.scrollLeft
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseEnter = () => {
    isHovered.current = true
  }

  const handleMouseLeave = () => {
    isHovered.current = false
    handlePointerUp()
  }

  return (
    <section id="aliados" className="relative overflow-hidden bg-page py-16 lg:py-20">

      {/* Acento ambiental cian/violeta de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-80 w-[700px] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,192,192,0.08) 0%, rgba(122,63,159,0.06) 50%, transparent 75%)',
          }}
        />
      </div>

      {/* ── Encabezado ─────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            kicker={sponsors.kicker}
            title={sponsors.title}
            sub={sponsors.sub}
            tone="day"
            className="mx-auto text-center"
          />
        </Reveal>
        <Reveal delay={2}>
          <div className="signal-bar mx-auto mt-8 h-px w-24 rounded-full opacity-60" />
        </Reveal>
      </div>

      {/* ── Carrusel ───────────────────────────────────────── */}
      <div className="relative mt-16 group select-none">
        
        {/* Fade izquierdo */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '0 auto 0 0',
            width: '10rem',
            zIndex: 10,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, var(--surface) 0%, transparent 100%)',
          }}
        />
        {/* Fade derecho */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '0 0 0 auto',
            width: '10rem',
            zIndex: 10,
            pointerEvents: 'none',
            background: 'linear-gradient(to left, var(--surface) 0%, transparent 100%)',
          }}
        />

        {/* 
          Track Contenedor
          Usamos overflow-x-hidden y scrollLeft manejado por JS 
          Touch-none evita conflictos con el scroll nativo en móviles.
        */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="flex overflow-x-hidden touch-none"
          style={{ cursor: 'grab' }}
        >
          <div
            className="flex items-center w-max"
            style={{
              gap: '2rem',
              paddingRight: '2rem',
              paddingBlock: '1rem',
            }}
          >
            {loopItems.map((sponsor, i) => (
              <LogoCard 
                key={`s-${i}`} 
                sponsor={sponsor} 
                hasDragged={hasDragged} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accesible */}
      <p className="sr-only">
        Aliados de REDSAM: {sponsors.items.map((s) => s.name).join(', ')}
      </p>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   LogoCard — tarjeta individual a color completo
──────────────────────────────────────────────────────────── */
function LogoCard({ sponsor, hasDragged }) {
  const { name, url, logo } = sponsor

  const handleClick = (e) => {
    // Si el usuario arrastró, evitamos que el enlace se abra.
    if (hasDragged) {
      e.preventDefault()
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onClick={handleClick}
      className="group/card"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        height: '10rem',
        width: '20rem',
        borderRadius: '1.25rem',
        padding: '2rem',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-raised)',
        transition: 'transform 0.4s cubic-bezier(0.33,1,0.68,1), box-shadow 0.4s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 16px 48px -12px rgba(0,192,192,0.25)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          draggable="false"
          style={{
            maxHeight: '6.5rem',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease',
            pointerEvents: 'none', // Evita que la imagen intercepte el drag
          }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          textAlign: 'center',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}>
          {name}
        </span>
      )}

      {/* Hairline señal inferior */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: '3px',
          borderRadius: 0,
          background: 'linear-gradient(90deg, #00c0c0, #7a3f9f, #e4246c, #f0900c)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.33,1,0.68,1)',
        }}
        className="logo-hairline"
      />
    </a>
  )
}

export default Sponsors
