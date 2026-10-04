import { useEffect, useRef, useState } from 'react'

/**
 * InteractiveParticleText
 *
 * Convierte texto tipográfico ("REDSAM 2026") en una cuadrícula densa de partículas
 * que forman las letras en alta resolución sobre un canvas HTML5.
 *
 * Características:
 * - Rasteriza el texto en un canvas oculto y genera coordenadas precisas para cada partícula.
 * - Gradiente cromático oficial de REDSAM (Cian #00c0c0 → Violeta #7a3f9f → Magenta #e4246c → Ámbar #f0900c).
 * - Física elástica (Spring Physics):
 *     • Al acercar el cursor o pasar sobre las letras, las partículas son repelidas violentamente
 *       o dispersadas con turbulencia según la velocidad del ratón.
 *     • Cada partícula recuerda su posición de origen ('home') y regresa de forma armónica elástica.
 * - Brillo interactivo / Glow en hover.
 * - Controles interactivos: cambiar el texto o explotar las partículas con un clic.
 */

const PALETTE = [
  { r: 0, g: 192, b: 192 },   // Cian
  { r: 122, g: 63, b: 159 },  // Violeta
  { r: 228, g: 36, b: 108 },  // Magenta
  { r: 240, g: 144, b: 12 },  // Ámbar
]

export default function InteractiveParticleText({ initialText = 'REDSAM 2026' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [text, setText] = useState(initialText)
  const [isExploding, setIsExploding] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let animId
    let width = 0
    let height = 0
    let particles = []

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      radius: 90,
      isHovered: false,
    }

    const initParticles = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = Math.max(rect.height, 280)

      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      // Canvas temporal fuera de pantalla para rasterizar el texto y leer píxeles
      const offCanvas = document.createElement('canvas')
      offCanvas.width = width
      offCanvas.height = height
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true })
      if (!offCtx) return

      offCtx.clearRect(0, 0, width, height)

      // Margen de seguridad: el texto no debe superar el 72% del ancho ni el 38% del alto disponible
      const maxAvailableWidth = width * 0.72
      const maxAvailableHeight = height * 0.38

      let fontSize = Math.min(width * 0.10, 84)
      offCtx.font = `900 ${fontSize}px "Sora", "Outfit", sans-serif`
      let measuredWidth = offCtx.measureText(text).width

      // Reducción iterativa precisa para garantizar que ninguna letra quede al borde
      while ((measuredWidth > maxAvailableWidth || fontSize > maxAvailableHeight) && fontSize > 18) {
        fontSize -= 1.5
        offCtx.font = `900 ${fontSize}px "Sora", "Outfit", sans-serif`
        measuredWidth = offCtx.measureText(text).width
      }

      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'middle'
      offCtx.fillStyle = '#ffffff'
      offCtx.fillText(text, width / 2, height / 2 - 4)

      const imgData = offCtx.getImageData(0, 0, width, height).data

      // Muestrear píxeles (densidad según resolución de pantalla)
      const step = width < 640 ? 5 : 4
      const newParticles = []

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4
          const alpha = imgData[index + 3]

          if (alpha > 120) {
            // Asignar color según posición horizontal (gradiente continuo REDSAM)
            const t = Math.max(0, Math.min(1, x / width))
            const colorIdx = Math.min(
              PALETTE.length - 1,
              Math.floor(t * (PALETTE.length - 1))
            )
            const nextIdx = Math.min(PALETTE.length - 1, colorIdx + 1)
            const subT = (t * (PALETTE.length - 1)) - colorIdx

            const r = Math.round(PALETTE[colorIdx].r + (PALETTE[nextIdx].r - PALETTE[colorIdx].r) * subT)
            const g = Math.round(PALETTE[colorIdx].g + (PALETTE[nextIdx].g - PALETTE[colorIdx].g) * subT)
            const b = Math.round(PALETTE[colorIdx].b + (PALETTE[nextIdx].b - PALETTE[colorIdx].b) * subT)

            // Posición de reposo
            const homeX = x
            const homeY = y

            // Inicio con ligera dispersión estética al cargarse
            const angle = Math.random() * Math.PI * 2
            const dist = Math.random() * 80

            newParticles.push({
              x: homeX + Math.cos(angle) * dist,
              y: homeY + Math.sin(angle) * dist,
              homeX,
              homeY,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              size: (step * 0.42) + Math.random() * 0.4,
              baseSize: (step * 0.42) + Math.random() * 0.4,
              color: `rgb(${r}, ${g}, ${b})`,
              glowColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
              friction: 0.88 + Math.random() * 0.05,
              ease: 0.08 + Math.random() * 0.04,
            })
          }
        }
      }

      particles = newParticles
    }

    initParticles()

    const handleResize = () => {
      initParticles()
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top

      if (mouse.prevX === -9999) {
        mouse.prevX = newX
        mouse.prevY = newY
      }

      mouse.vx = (newX - mouse.prevX) * 0.4
      mouse.vy = (newY - mouse.prevY) * 0.4
      mouse.prevX = newX
      mouse.prevY = newY
      mouse.x = newX
      mouse.y = newY
      mouse.isHovered = true
    }

    const handleMouseLeave = () => {
      mouse.isHovered = false
      mouse.x = -9999
      mouse.y = -9999
      mouse.prevX = -9999
      mouse.prevY = -9999
      mouse.vx = 0
      mouse.vy = 0
    }

    const handleClick = () => {
      setIsExploding(true)
      setTimeout(() => setIsExploding(false), 800)

      // Fuerza de explosión radial desde el centro o cursor
      const originX = mouse.isHovered ? mouse.x : width / 2
      const originY = mouse.isHovered ? mouse.y : height / 2

      particles.forEach((p) => {
        const dx = p.x - originX
        const dy = p.y - originY
        const dist = Math.hypot(dx, dy) || 1
        const force = (Math.random() * 35 + 15) * (150 / (dist + 50))
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      })
    }

    const containerEl = container
    containerEl.addEventListener('mousemove', handleMouseMove, { passive: true })
    containerEl.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    containerEl.addEventListener('click', handleClick)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const interactRadius = mouse.radius

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // 1. Interacción con el cursor (repulsión magnética)
        if (mouse.isHovered) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)

          if (dist < interactRadius && dist > 0) {
            const force = (1 - dist / interactRadius) * 12
            const angle = Math.atan2(dy, dx)
            p.vx += Math.cos(angle) * force + mouse.vx * 0.12
            p.vy += Math.sin(angle) * force + mouse.vy * 0.12
          }
        }

        // 2. Fuerza de retorno elástico a homeX / homeY
        const homeDx = p.homeX - p.x
        const homeDy = p.homeY - p.y
        p.vx += homeDx * p.ease
        p.vy += homeDy * p.ease

        // 3. Fricción y aplicación de velocidad
        p.vx *= p.friction
        p.vy *= p.friction
        p.x += p.vx
        p.y += p.vy

        // 4. Dibujar partícula
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    let inView = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) {
          animId = requestAnimationFrame(render)
        } else {
          cancelAnimationFrame(animId)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(containerEl)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      containerEl.removeEventListener('mousemove', handleMouseMove)
      containerEl.removeEventListener('mouseleave', handleMouseLeave)
      containerEl.removeEventListener('click', handleClick)
      cancelAnimationFrame(animId)
    }
  }, [text])

  // Escuchar cambios reactivos en el tema global (data-theme)
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.dataset.theme || localStorage.getItem('redsam-theme') || 'indigo'
  })

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const activeTheme = document.documentElement.dataset.theme || 'indigo'
      setCurrentTheme(activeTheme)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  const options = ['REDSAM 2026', 'JÓVENES LÍDERES', 'SAN MARTÍN', 'IMPACTO SOCIAL']
  const isLight = currentTheme === 'light'

  return (
    <section className="relative overflow-hidden bg-page py-20 lg:py-28 select-none transition-colors duration-500">
      {/* Resplandor ambiental de fondo reactivo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-opacity duration-700 ${
            isLight ? 'opacity-20' : 'opacity-15'
          }`}
          style={{
            background: 'radial-gradient(ellipse, #00c0c0 0%, #7a3f9f 50%, #e4246c 100%)',
          }}
        />
        <div className="carto-grid absolute inset-0 opacity-[0.04]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 text-center">
        {/* Encabezado del bloque interactivo */}
        <div className="inline-flex items-center gap-2 rounded-full border border-signal-cyan/25 bg-signal-cyan/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-cyan" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold">
            Laboratorio de Señal Interactiva
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-fg-strong max-w-2xl mx-auto transition-colors duration-500">
          Mueve el cursor o haz clic para dispersar la red
        </h2>
        <p className="mt-4 text-sm sm:text-base text-fg-muted max-w-xl mx-auto transition-colors duration-500">
          Cada partícula representa un nodo y joven conectado en San Martín que reacciona a tu paso y regresa en armonía.
        </p>

        {/* Lienzo del Interactive Particle Text */}
        <div
          ref={containerRef}
          className={`relative mx-auto mt-8 h-[260px] sm:h-[340px] w-full max-w-4xl cursor-pointer rounded-3xl border backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:border-signal-cyan/50 ${
            isLight
              ? 'border-line/70 bg-surface-soft/80 shadow-[0_20px_60px_-15px_rgba(14,27,51,0.08)]'
              : 'border-fg-line bg-surface-soft/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Canvas principal */}
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* Hint de interacción */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted transition-colors duration-300 group-hover:text-accent-cyan">
            <span>✦ Haz clic para detonar el pulso cuántico</span>
          </div>
        </div>

        {/* Selector de palabras interactivas */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted mr-2">
            Cambiar texto:
          </span>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setText(opt)}
              className={`rounded-full px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                text === opt
                  ? 'bg-gradient-to-r from-signal-cyan via-signal-violet to-signal-magenta text-white shadow-[0_0_20px_rgba(0,192,192,0.4)] scale-105'
                  : 'border border-fg-line bg-surface-soft text-fg hover:border-signal-cyan/50 hover:text-fg-strong hover:scale-[1.02]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
