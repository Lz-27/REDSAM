import { useEffect, useRef } from 'react'

/**
 * DynamicMeshBackground
 * 
 * Capa de ambientación dinámica global que complementa el diseño actual de REDSAM.
 * - Renderiza gradientes mesh flotantes orgánicos (Cian, Violeta, Magenta, Ámbar de la marca).
 * - Reacciona suavemente con física de amortiguación (lerp) al movimiento del cursor / scroll.
 * - Superpone un grano fotográfico estético (film grain) casi imperceptible para acabado premium.
 * - Pointer-events-none y z-0 para no bloquear ningún elemento ni alterar el layout existente.
 * - Optimizado a 60fps con requestAnimationFrame y offscreen cleanup.
 */
export default function DynamicMeshBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Coordenadas objetivo y reales para amortiguación suave (Lerp)
    const targetMouse = { x: width * 0.5, y: height * 0.4 }
    const currentMouse = { x: width * 0.5, y: height * 0.4 }

    const handleMouseMove = (e) => {
      targetMouse.x = e.clientX
      targetMouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Orbes energéticos con la paleta oficial de REDSAM
    const orbs = [
      {
        baseX: 0.2,
        baseY: 0.25,
        radius: 380,
        color: 'rgba(0, 192, 192, 0.12)', // Cian señal
        speed: 0.0006,
        phase: 0,
        influence: 0.05,
      },
      {
        baseX: 0.8,
        baseY: 0.35,
        radius: 440,
        color: 'rgba(122, 63, 159, 0.10)', // Violeta señal
        speed: 0.0005,
        phase: 2,
        influence: -0.04,
      },
      {
        baseX: 0.5,
        baseY: 0.75,
        radius: 420,
        color: 'rgba(228, 36, 108, 0.08)', // Magenta señal
        speed: 0.0007,
        phase: 4,
        influence: 0.03,
      },
      {
        baseX: 0.15,
        baseY: 0.85,
        radius: 320,
        color: 'rgba(240, 144, 12, 0.06)', // Ámbar señal
        speed: 0.0004,
        phase: 1.5,
        influence: -0.02,
      },
    ]

    let lastFrameTime = 0
    const TARGET_FPS_INTERVAL = 1000 / 30 // 30 FPS suficiente para mesh orbs etéreos
    let isVisible = true

    const handleVisibility = () => {
      isVisible = !document.hidden
      if (isVisible) {
        lastFrameTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(animationFrameId)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const render = (now = performance.now()) => {
      if (!isVisible) return

      animationFrameId = requestAnimationFrame(render)

      const elapsed = now - lastFrameTime
      if (elapsed < TARGET_FPS_INTERVAL) return
      lastFrameTime = now - (elapsed % TARGET_FPS_INTERVAL)

      time += 1

      // Suave interpolación hacia la posición del mouse
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.03
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.03

      ctx.clearRect(0, 0, width, height)

      // Dibujar cada orbe con mezcla de color enriquecida
      orbs.forEach((orb) => {
        const floatX = Math.sin(time * orb.speed + orb.phase) * (width * 0.08)
        const floatY = Math.cos(time * orb.speed * 0.8 + orb.phase) * (height * 0.08)

        const mouseShiftX = (currentMouse.x - width * 0.5) * orb.influence
        const mouseShiftY = (currentMouse.y - height * 0.5) * orb.influence

        const x = width * orb.baseX + floatX + mouseShiftX
        const y = height * orb.baseY + floatY + mouseShiftY

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius)
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, orb.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Canvas dinámico de mesh orbs interactivo */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-90 transition-opacity duration-700"
      />

      {/* Capa de ruido de película orgánico (film grain sutil) */}
      <div
        className="absolute inset-0 opacity-[0.032] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  )
}
