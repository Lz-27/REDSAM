import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { hero, site } from '../../data/content'
import Button from '../ui/ButtonOld'
import { useGsapTextReveal } from '../../hooks/useGsap'
import MotionReveal from '../ui/MotionReveal'
import HeroCarousel from '../ui/HeroCarousel'
import FirefliesBackground from '../ui/FirefliesBackground'

const COLLAGE_STATS = [
  { value: '+1.200', label: 'jóvenes en la red', position: '-left-5 bottom-12 sm:-left-8', delay: 0.8 },
  { value: '10', label: 'provincias conectadas', position: '-right-3 top-5 sm:-right-6', delay: 1.0 },
]

const NODES = [
  { x: 60, y: 340, r: 3, fill: '#00c0c0' },
  { x: 200, y: 280, r: 4, fill: '#00c0c0' },
  { x: 340, y: 322, r: 2.5, fill: '#7a3f9f' },
  { x: 500, y: 214, r: 4.5, fill: '#7a3f9f' },
  { x: 640, y: 264, r: 3, fill: '#e4246c' },
  { x: 800, y: 184, r: 5, fill: '#e4246c' },
  { x: 960, y: 234, r: 3, fill: '#f0900c' },
  { x: 1120, y: 158, r: 4, fill: '#f0900c' },
]

const SEGMENTS = NODES.slice(0, -1).map((n, i) => ({
  d: `M${n.x} ${n.y} L${NODES[i + 1].x} ${NODES[i + 1].y}`,
  from: i,
  to: i + 1,
}))

/**
 * Hero — primer viewport con carrusel cuadrado de imágenes REDSAM.
 * Las partículas flotantes CSS actúan como fondo sutil en todo el hero.
 * La constelación SVG permanece como decoración de fondo.
 */
function Hero() {
  const heroRef = useRef(null)
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)
  const pointerRaf = useRef(0)

  const [drawn, setDrawn] = useState(false)
  const [active, setActive] = useState(-1)
  const [glowVisible, setGlowVisible] = useState(false)

  // GSAP text reveal para el headline
  const headlineRef = useGsapTextReveal('top 92%')

  const reduceMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Trazado animado de la señal al cargar */
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    if (reduceMotion) {
      setDrawn(true)
      return undefined
    }
    const len = path.getTotalLength()
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = String(len)
    const anim = path.animate(
      [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration: 2200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
    )
    anim.onfinish = () => {
      path.style.strokeDasharray = ''
      path.style.strokeDashoffset = ''
      setDrawn(true)
    }
    return () => anim.cancel()
  }, [reduceMotion])

  const handlePointerMove = (event) => {
    if (reduceMotion) return
    if (pointerRaf.current) return
    pointerRaf.current = requestAnimationFrame(() => {
      pointerRaf.current = 0
      const svg = svgRef.current
      const heroRect = heroRef.current?.getBoundingClientRect()
      if (!svg || !heroRect) return
      const rect = svg.getBoundingClientRect()

      const glow = glowRef.current
      if (glow) {
        glow.style.setProperty('--mx', `${event.clientX - heroRect.left}px`)
        glow.style.setProperty('--my', `${event.clientY - heroRect.top}px`)
      }
      setGlowVisible(true)

      let best = -1
      let bestDist = 120
      for (let i = 0; i < NODES.length; i++) {
        const sx = rect.left + (NODES[i].x / 1200) * rect.width
        const sy = rect.top + (NODES[i].y / 420) * rect.height
        const dx = event.clientX - sx
        const dy = event.clientY - sy
        const dist = Math.hypot(dx, dy)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      }
      setActive(best)
    })
  }

  const handlePointerLeave = () => {
    if (pointerRaf.current) {
      cancelAnimationFrame(pointerRaf.current)
      pointerRaf.current = 0
    }
    setActive(-1)
    setGlowVisible(false)
  }

  useEffect(() => () => cancelAnimationFrame(pointerRaf.current), [])

  return (
    <section
      id="inicio"
      ref={heroRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="grain relative overflow-hidden bg-page transition-colors duration-500"
    >
      {/* ── Fondos decorativos de fondo ── */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="carto-grid absolute inset-0 opacity-[0.05]"
          style={{ transform: 'translate3d(0, var(--px-3), 0)' }}
        />
        <div
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-25 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #00c0c0 0%, transparent 65%)',
            transform: 'translate3d(0, var(--px-2), 0)',
          }}
        />
        <div
          className="absolute right-[-10%] top-[20%] h-[560px] w-[560px] rounded-full opacity-20 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, #e4246c 0%, transparent 65%)',
            transform: 'translate3d(0, var(--px-2), 0)',
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[30%] h-[480px] w-[480px] rounded-full opacity-15 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, #f0900c 0%, transparent 65%)',
            transform: 'translate3d(0, var(--px-2), 0)',
          }}
        />

        {/* Constelación SVG (señal de fondo) */}
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ transform: 'translate3d(0, var(--px-1), 0)' }}
        >
          <defs>
            <linearGradient id="hero-signal" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#00c0c0" />
              <stop offset="0.4" stopColor="#7a3f9f" />
              <stop offset="0.7" stopColor="#e4246c" />
              <stop offset="1" stopColor="#f0900c" />
            </linearGradient>
          </defs>

          <path
            ref={pathRef}
            d="M60 340 L200 280 L340 322 L500 214 L640 264 L800 184 L960 234 L1120 158"
            fill="none"
            stroke="url(#hero-signal)"
            strokeWidth="1"
            opacity="0.55"
            className={drawn ? 'signal-dash' : ''}
          />

          {SEGMENTS.map((seg, i) => (
            <path
              key={i}
              d={seg.d}
              fill="none"
              stroke="url(#hero-signal)"
              strokeWidth="1.4"
              strokeLinecap="round"
              className={`node-seg ${active !== -1 && (seg.from === active || seg.to === active) ? 'is-active' : ''}`}
            />
          ))}

          {NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r * 2.6} fill={n.fill} opacity="0.12" />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.fill}
                opacity="0.85"
                className={`node ${active === i ? 'is-active' : ''}`}
                style={{ '--nc': n.fill }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Luciérnagas brillantes e interactivas de fondo en el Hero ── */}
      <FirefliesBackground className="z-[2]" />

      {/* Brillo ambiental que sigue al cursor */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className={`hero-cursor-glow pointer-events-none h-[460px] w-[460px] ${glowVisible ? '' : 'opacity-0'}`}
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] items-center gap-10 px-5 pb-14 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:gap-8 xl:gap-12 lg:pt-24 lg:pb-16">
        {/* Columna de texto */}
        <div className="lg:col-span-5 xl:col-span-5">
          <MotionReveal variant="rise" delay={0}>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-fg">
              <span className="text-accent-cyan">{site.coordinates}</span>
              <span aria-hidden="true" className="signal-bar inline-block h-1.5 w-1.5 rounded-full" />
              {hero.eyebrow}
            </p>
          </MotionReveal>

          {/* Headline con GSAP word reveal */}
          <MotionReveal variant="rise" delay={0.12}>
            <h1
              ref={headlineRef}
              className="mt-5 text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-fg-strong sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem]"
            >
              {hero.headline.split(hero.highlight).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-accent-cyan">{hero.highlight}</span>
                  )}
                </span>
              ))}
            </h1>
          </MotionReveal>

          <MotionReveal variant="rise" delay={0.22}>
            <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-fg">
              {hero.sub}
            </p>
          </MotionReveal>

          <MotionReveal variant="rise" delay={0.32}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button href={hero.primaryCta.href} icon="arrowUpRight">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" icon="arrowRight">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal variant="rise" delay={0.42}>
            <p className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
              <span className="node-pulse relative inline-flex h-2 w-2 rounded-full bg-signal-amber" />
              Convocatorias abiertas · Temporada 2026
            </p>
          </MotionReveal>
        </div>

        {/* Columna derecha: Carrusel de imágenes con gran protagonismo visual */}
        <div className="relative lg:col-span-7 xl:col-span-7 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[540px] lg:max-w-[600px] xl:max-w-[660px]"
          >
            <HeroCarousel />

            {/* Chips de impacto flotantes sobre el carrusel */}
            {COLLAGE_STATS.map((chip) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: chip.delay, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute z-20 ${chip.position} flex items-baseline gap-2 rounded-2xl border border-fg-line bg-surface-soft px-4 py-3 backdrop-blur-md transition-transform duration-500 hover:-translate-y-0.5`}
              >
                <span className="font-display text-xl font-extrabold text-signal-amber">
                  {chip.value}
                </span>
                <span className="text-xs font-semibold text-fg">{chip.label}</span>
              </motion.div>
            ))}

            {/* Etiqueta vertical */}
            <p
              aria-hidden="true"
              className="absolute -right-7 bottom-14 hidden rotate-90 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted lg:block"
            >
              Tarapoto · San Martín
            </p>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#nosotros"
        aria-label="Bajar a la sección Nosotros"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted transition-colors hover:text-accent md:flex"
      >
        <span className="inline-flex h-9 w-5 items-start justify-center rounded-full border border-fg-line p-1">
          <span className="scroll-nudge h-2 w-[3px] rounded-full bg-signal-cyan" />
        </span>
        Bajar
      </a>
    </section>
  )
}

export default Hero