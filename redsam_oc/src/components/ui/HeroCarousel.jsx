import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    src: '/img-hero-1.jpg',
    alt: 'Programa de Incubación de Organizaciones Juveniles — REDSAM',
    caption: 'Incubación Juvenil',
  },
  {
    src: '/img-hero-2.jpg',
    alt: 'Encuentro Regional de Juventudes 2026 San Martín — Sede Lamas',
    caption: 'Encuentro Regional',
  },
  {
    src: '/img-hero-3.jpg',
    alt: 'Voces — Líderes Empresariales, Fernando Villaizan, REDSAM',
    caption: 'Voces Líderes',
  },
  {
    src: '/img-hero-4.jpg',
    alt: 'Liderazgo Juvenil Intergeneracional — Panel 1, Encuentro Regional 2026',
    caption: 'Liderazgo Intergeneracional',
  },
]

const AUTOPLAY_MS = 4000

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
    opacity: 0,
    scale: 0.98,
  }),
}

/**
 * HeroCarousel — carrusel cuadrado de imágenes premium para el Hero.
 * Tiene auto-play, drag-to-swipe, indicadores y controles de flecha.
 * Los puntos flotantes viven como overlay CSS externo.
 */
export default function HeroCarousel() {
  const [[index, dir], setIndex] = useState([0, 0])
  const timerRef = useRef(null)
  const dragStartX = useRef(0)

  const goTo = useCallback((newIndex, direction) => {
    const next = (newIndex + SLIDES.length) % SLIDES.length
    setIndex([next, direction])
  }, [])

  const next = useCallback(() => goTo(index + 1, 1), [index, goTo])
  const prev = useCallback(() => goTo(index - 1, -1), [index, goTo])

  // Auto-play
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, AUTOPLAY_MS)
  }, [next])

  useEffect(() => {
    // Precarga todas las imágenes del carrusel en memoria para transición instantánea
    SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.src
    })
  }, [])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  // Drag / swipe
  const handleDragStart = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }
  const handleDragEnd = (e) => {
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current
    const delta = dragStartX.current - endX
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev()
      resetTimer()
    }
  }

  const handleNav = (fn) => {
    fn()
    resetTimer()
  }

  const handleMouseEnter = () => {
    clearInterval(timerRef.current)
  }

  const handleMouseLeave = () => {
    resetTimer()
  }

  return (
    <div className="hero-carousel-wrapper">
      {/* Cuadro exterior con bordes gradiente */}
      <div className="hero-carousel-frame">
        {/* Borde exterior decorativo con gradiente de marca */}
        <div className="hero-carousel-border-top" aria-hidden="true" />

        {/* Área de imagen con ratio 1:1 */}
        <div
          className="hero-carousel-stage"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.25, 1, 0.5, 1] }}
              className="hero-carousel-slide"
              style={{ willChange: 'transform, opacity' }}
              draggable={false}
            >
              <img
                src={SLIDES[index].src}
                alt={SLIDES[index].alt}
                className="hero-carousel-img"
                loading="eager"
                decoding="async"
                draggable={false}
              />
              {/* Overlay gradiente inferior */}
              <div className="hero-carousel-gradient" aria-hidden="true" />
              {/* Caption */}
              <div className="hero-carousel-caption">
                <span>{SLIDES[index].caption}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flecha izquierda */}
          <button
            aria-label="Slide anterior"
            className="hero-carousel-arrow hero-carousel-arrow-left"
            onClick={() => handleNav(prev)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            aria-label="Siguiente slide"
            className="hero-carousel-arrow hero-carousel-arrow-right"
            onClick={() => handleNav(next)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="hero-carousel-progress-bar" aria-hidden="true">
          <motion.div
            key={`progress-${index}`}
            className="hero-carousel-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
          />
        </div>

        {/* Indicadores */}
        <div className="hero-carousel-dots" role="tablist" aria-label="Seleccionar slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir a slide ${i + 1}: ${s.caption}`}
              className={`hero-carousel-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => handleNav(() => goTo(i, i > index ? 1 : -1))}
            />
          ))}
        </div>

        {/* Contador */}
        <div className="hero-carousel-counter" aria-live="polite" aria-atomic="true">
          <span className="hero-carousel-counter-current">{String(index + 1).padStart(2, '0')}</span>
          <span className="hero-carousel-counter-sep">/</span>
          <span className="hero-carousel-counter-total">{String(SLIDES.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}
