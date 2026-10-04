/**
 * FloatingParticles — fondo de partículas sutiles animadas con CSS.
 * Reemplaza la escena Three.js como efecto de fondo ligero.
 * No requiere WebGL, funciona en cualquier dispositivo.
 */

const COLORS = ['#00c0c0', '#7a3f9f', '#e4246c', '#f0900c']

// Genera partículas de forma determinista para evitar hidratación diferente
const PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const seed = i * 7 + 13
  const x = ((seed * 17 + 3) % 100)
  const y = ((seed * 23 + 7) % 100)
  const size = 3 + (seed % 5)
  const opacity = 0.12 + (seed % 5) * 0.06
  const duration = 6 + (seed % 8)
  const delay = -(seed % 7)
  const color = COLORS[i % COLORS.length]
  return { id: i, x, y, size, opacity, duration, delay, color }
})

export default function FloatingParticles({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="floating-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
