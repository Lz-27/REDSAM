import { useEffect, useRef } from 'react'

/**
 * NeuralSignalConstellation
 *
 * Red topográfica interactiva que simula una constelación neural de datos.
 *
 * Características:
 * - 35-50 nodos distribuidos orgánicamente sobre el espacio con jerarquía (nodos primarios, secundarios y terciarios).
 * - Conexiones dinámicas con gradientes cromáticos oficiales de REDSAM (Cian, Violeta, Magenta, Ámbar).
 * - Paquetes de pulsos de energía ("Fotones de Datos") viajando periódicamente entre nodos conectados.
 * - Reacción física al cursor:
 *     • Al acercarse el cursor, los nodos cercanos se iluminan con un halo de alta intensidad y se atraen ligeramente.
 *     • Se proyectan líneas de conexión directa temporal y luminosa hacia el cursor ("Conexión de red viva").
 *     • Los pulsos de datos aceleran su flujo ante la presencia del cursor.
 * - Optimizado con Canvas 2D en requestAnimationFrame a 60 FPS, respetando prefers-reduced-motion.
 */

const PALETTE = [
  { r: 0, g: 192, b: 192 },   // Cian
  { r: 122, g: 63, b: 159 },  // Violeta
  { r: 228, g: 36, b: 108 },  // Magenta
  { r: 240, g: 144, b: 12 },  // Ámbar
]

export default function NeuralSignalConstellation({ className = '' }) {
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

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      radius: 170, // Radio de interacción con el cursor
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

    // Crear nodos distribuidos con posiciones relativas
    const nodeCount = width < 768 ? 26 : 42

    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const color = PALETTE[i % PALETTE.length]
      const isPrimary = i % 5 === 0
      const baseRadius = isPrimary ? 3.5 : 2 + Math.random() * 1.5

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius,
        radius: baseRadius,
        color,
        isPrimary,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        hoverIntensity: 0,
      }
    })

    // Guardar origen inicial
    nodes.forEach((n) => {
      n.baseX = n.x
      n.baseY = n.y
    })

    // Crear paquetes de energía (fotones/pulsos que viajan entre nodos)
    const packets = []
    const createPacket = (fromNode, toNode) => {
      packets.push({
        from: fromNode,
        to: toNode,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: fromNode.color,
        size: 2.2 + Math.random() * 1.5,
      })
    }

    // Escuchar movimiento del cursor sobre la sección del mapa
    const parentSection = container.closest('section') || container

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    parentSection.addEventListener('mousemove', handleMouseMove, { passive: true })
    parentSection.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    let lastSpawn = 0

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)

      // 1. Desove periódico de pulsos de datos entre nodos cercanos
      if (!prefersReducedMotion && time - lastSpawn > 250) {
        lastSpawn = time
        if (packets.length < 18) {
          const fromIdx = Math.floor(Math.random() * nodes.length)
          const fromNode = nodes[fromIdx]

          // Buscar un nodo cercano conectado
          let closestDist = Infinity
          let targetNode = null

          for (let j = 0; j < nodes.length; j++) {
            if (j === fromIdx) continue
            const n2 = nodes[j]
            const d = Math.hypot(n2.x - fromNode.x, n2.y - fromNode.y)
            if (d < 160 && d < closestDist) {
              closestDist = d
              targetNode = n2
            }
          }

          if (targetNode) {
            createPacket(fromNode, targetNode)
          }
        }
      }

      // 2. Actualizar nodos
      nodes.forEach((n) => {
        n.pulsePhase += n.pulseSpeed

        if (!prefersReducedMotion) {
          // Deriva sutil de flotación
          n.x += n.vx
          n.y += n.vy

          if (n.x < 10 || n.x > width - 10) n.vx *= -1
          if (n.y < 10 || n.y > height - 10) n.vy *= -1
        }

        // Interacción con el cursor (atracción y activación)
        if (mouse.active) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const dist = Math.hypot(dx, dy)

          if (dist < mouse.radius) {
            const factor = 1 - dist / mouse.radius
            n.hoverIntensity = Math.min(n.hoverIntensity + 0.12, 1)
            // Ligera atracción magnética
            n.x += (dx / dist) * factor * 0.8
            n.y += (dy / dist) * factor * 0.8
          } else {
            n.hoverIntensity = Math.max(n.hoverIntensity - 0.04, 0)
          }
        } else {
          n.hoverIntensity = Math.max(n.hoverIntensity - 0.04, 0)
        }
      })

      // 3. Dibujar conexiones entre nodos (Mesh neural)
      const maxConnectDist = 150

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.hypot(dx, dy)

          if (dist < maxConnectDist) {
            const baseAlpha = (1 - dist / maxConnectDist) * 0.22
            const boost = Math.max(n1.hoverIntensity, n2.hoverIntensity) * 0.4
            const finalAlpha = Math.min(baseAlpha + boost, 0.75)

            // Gradiente dinámico entre ambos nodos
            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y)
            grad.addColorStop(0, `rgba(${n1.color.r}, ${n1.color.g}, ${n1.color.b}, ${finalAlpha})`)
            grad.addColorStop(1, `rgba(${n2.color.r}, ${n2.color.g}, ${n2.color.b}, ${finalAlpha * 0.8})`)

            ctx.beginPath()
            ctx.strokeStyle = grad
            ctx.lineWidth = boost > 0.1 ? 1.5 : 0.85
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }

        // Conexión reactiva directa al cursor si está en rango
        if (mouse.active) {
          const mdx = mouse.x - n1.x
          const mdy = mouse.y - n1.y
          const mDist = Math.hypot(mdx, mdy)

          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.6
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${n1.color.r}, ${n1.color.g}, ${n1.color.b}, ${mAlpha})`
            ctx.lineWidth = 1.2
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // 4. Dibujar paquetes de pulso de energía (fotones viajando)
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.progress += p.speed

        if (p.progress >= 1) {
          packets.splice(i, 1)
          continue
        }

        const px = p.from.x + (p.to.x - p.from.x) * p.progress
        const py = p.from.y + (p.to.y - p.from.y) * p.progress

        // Brillo del paquete
        const { r, g, b } = p.color
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3)
        glow.addColorStop(0, `rgba(255, 255, 255, 0.95)`)
        glow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.8)`)
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // 5. Dibujar nodos
      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulsePhase) * 0.5 + 0.5
        const curRadius = n.radius + pulse * 0.8 + n.hoverIntensity * 2.2
        const { r, g, b } = n.color

        // Halo difuso
        const haloGrad = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          curRadius * (n.isPrimary ? 4.5 : 3.2)
        )
        const alphaBase = n.isPrimary ? 0.45 : 0.28
        const alphaActive = alphaBase + n.hoverIntensity * 0.5

        haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alphaActive})`)
        haloGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = haloGrad
        ctx.beginPath()
        ctx.arc(n.x, n.y, curRadius * (n.isPrimary ? 4.5 : 3.2), 0, Math.PI * 2)
        ctx.fill()

        // Anillo exterior para nodos primarios
        if (n.isPrimary || n.hoverIntensity > 0.2) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + n.hoverIntensity * 0.5})`
          ctx.lineWidth = 0.9
          ctx.arc(n.x, n.y, curRadius + 3.5, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Núcleo brillante
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 + n.hoverIntensity * 0.15})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, curRadius * 0.65, 0, Math.PI * 2)
        ctx.fill()
      })

      if (inView) {
        animId = requestAnimationFrame(render)
      }
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
    observer.observe(container)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      parentSection.removeEventListener('mousemove', handleMouseMove)
      parentSection.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
