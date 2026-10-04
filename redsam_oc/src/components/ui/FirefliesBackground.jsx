import { useEffect, useRef } from 'react'

/**
 * FirefliesBackground — Luciernagas brillantes e interactivas para el Hero.
 *
 * Características:
 * - Movimiento orgánico y fluido flotando en el espacio 2D.
 * - Brillo pulsante (efecto respiración / glow de luciérnaga real con halo radial).
 * - Paleta oficial REDSAM: Cian (#00c0c0), Violeta (#7a3f9f), Magenta (#e4246c), Ámbar (#f0900c).
 * - Reactividad al cursor:
 *    • Si el cursor se acerca, las luciérnagas se dispersan suavemente (fuerza de repulsión física)
 *      y aumentan su brillo/destello como reacción viva.
 *    • Ondas sutiles que las aceleran y dejan un destello luminoso al pasar.
 * - Optimizado con Canvas 2D en requestAnimationFrame a 60fps con cálculo vectorial ligero.
 */

const COLORS = [
  { r: 0, g: 192, b: 192 },   // Cian
  { r: 122, g: 63, b: 159 },  // Violeta
  { r: 228, g: 36, b: 108 },  // Magenta
  { r: 240, g: 144, b: 12 },  // Ámbar
  { r: 45, g: 212, b: 191 },  // Cian brillante / esmeralda
  { r: 251, g: 191, b: 36 },  // Oro luciérnaga
]

export default function FirefliesBackground({ className = '' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId
    let width = 0
    let height = 0

    // Sensibilidad reducida de movimiento si el usuario prefiere
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Coordenadas del cursor relativas al canvas
    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
      radius: 140, // Radio de interacción con las luciérnagas
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Cantidad de luciérnagas según ancho de pantalla
    const count = width < 768 ? 32 : 55

    // Crear luciérnagas con propiedades físicas
    const fireflies = Array.from({ length: count }, (_, i) => {
      const color = COLORS[i % COLORS.length]
      const baseRadius = 1.5 + Math.random() * 2.2
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseRadius,
        radius: baseRadius,
        color,
        // Parámetros de pulso / brillo
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02 + Math.random() * 0.035,
        alpha: 0.3 + Math.random() * 0.5,
        maxAlpha: 0.85 + Math.random() * 0.15,
        // Reacción al cursor
        excited: 0,
      }
    })

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    const handlePointerLeave = () => {
      mouse.active = false
      mouse.x = -1000
      mouse.y = -1000
    }

    // Escuchar eventos en el contenedor para captar el cursor en todo el Hero
    container.parentElement?.addEventListener('mousemove', handlePointerMove, { passive: true })
    container.parentElement?.addEventListener('mouseleave', handlePointerLeave, { passive: true })

    let lastTime = performance.now()

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      fireflies.forEach((f) => {
        // 1. Variación sinusoidal de brillo (respiración de luciérnaga)
        f.glowPhase += f.glowSpeed
        const pulse = (Math.sin(f.glowPhase) + 1) * 0.5 // 0..1
        let currentAlpha = 0.25 + pulse * (f.maxAlpha - 0.25)

        // 2. Interacción con el cursor
        if (mouse.active && !prefersReducedMotion) {
          const dx = f.x - mouse.x
          const dy = f.y - mouse.y
          const dist = Math.hypot(dx, dy)

          if (dist < mouse.radius && dist > 0) {
            // Fuerza de repulsión suave (se alejan como asustadas por la luz del cursor)
            const force = (1 - dist / mouse.radius) * 45 * dt
            f.vx += (dx / dist) * force
            f.vy += (dy / dist) * force

            // Se excitan e iluminan con más brillo al acercarse el cursor
            f.excited = Math.min(f.excited + 0.15, 1)
          }
        }

        // Amortiguación del estado "excitado"
        f.excited = Math.max(0, f.excited - 0.8 * dt)

        // Brillo amplificado si está interactuando
        currentAlpha = Math.min(1, currentAlpha + f.excited * 0.6)
        const currentRadius = f.baseRadius * (1 + f.excited * 0.4 + pulse * 0.2)

        // 3. Actualizar posiciones con ligera deriva natural
        if (!prefersReducedMotion) {
          // Viento / flotación orgánica sutil
          f.vx += (Math.random() - 0.5) * 0.08
          f.vy += (Math.random() - 0.5) * 0.08

          // Fricción para que no aceleren infinitamente
          f.vx *= 0.985
          f.vy *= 0.985

          f.x += f.vx
          f.y += f.vy
        }

        // 4. Rebote / envoltura en los bordes del Hero
        const margin = 20
        if (f.x < -margin) f.x = width + margin
        if (f.x > width + margin) f.x = -margin
        if (f.y < -margin) f.y = height + margin
        if (f.y > height + margin) f.y = -margin

        // 5. Dibujo con efecto bioluminiscente / halo
        const { r, g, b } = f.color
        const glowRadius = currentRadius * (f.excited > 0.1 ? 6.5 : 4.5)

        // Gradiente radial para el halo difuso de la luciérnaga
        const grad = ctx.createRadialGradient(
          f.x,
          f.y,
          0,
          f.x,
          f.y,
          glowRadius
        )
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha})`)
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.55})`)
        grad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.12})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Núcleo brillante concentrado
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentAlpha * 1.15)})`
        ctx.arc(f.x, f.y, currentRadius * 0.55, 0, Math.PI * 2)
        ctx.fill()
      })

      if (inView) {
        animId = requestAnimationFrame(loop)
      }
    }

    let inView = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) {
          lastTime = performance.now()
          animId = requestAnimationFrame(loop)
        } else {
          cancelAnimationFrame(animId)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    animId = requestAnimationFrame(loop)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      container.parentElement?.removeEventListener('mousemove', handlePointerMove)
      container.parentElement?.removeEventListener('mouseleave', handlePointerLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
