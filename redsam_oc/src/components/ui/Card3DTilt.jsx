import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

/**
 * Card3DTilt — tarjeta con efecto de inclinación 3D basado en la posición del cursor.
 * Usa spring physics de Framer Motion para movimiento ultra fluido.
 *
 * REGLA: todos los hooks en el nivel superior del componente, nunca condicionales.
 *
 * Props:
 *  - children: contenido de la tarjeta
 *  - className: clases adicionales
 *  - intensity: intensidad de la inclinación (default: 12)
 *  - glare: activar efecto de brillo especular (default: true)
 */
export default function Card3DTilt({
  children,
  className = '',
  intensity = 12,
  glare = true,
  ...rest
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [glareStyle, setGlareStyle] = useState(
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.13) 0%, transparent 58%)',
  )

  // Valores de movimiento para la inclinación
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Spring suavizado para la inclinación
  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), springConfig)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), springConfig)
  const scale = useSpring(1, { stiffness: 260, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(x)
    rawY.set(y)

    // Calcular el brillo directamente (sin hook extra)
    if (glare) {
      const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
      const my = ((e.clientY - rect.top) / rect.height * 100).toFixed(1)
      setGlareStyle(
        `radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.13) 0%, transparent 58%)`,
      )
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    scale.set(1.03)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    scale.set(1)
    rawX.set(0)
    rawY.set(0)
    setGlareStyle('radial-gradient(circle at 50% 50%, rgba(255,255,255,0.13) 0%, transparent 58%)')
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 900,
      }}
      className={`relative ${className}`}
      {...rest}
    >
      {/* Contenido principal */}
      <div className="h-full" style={{ transform: 'translateZ(0px)' }}>{children}</div>

      {/* Efecto de brillo especular — sin hooks internos condicionales */}
      {glare && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="card-glare"
              className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ zIndex: 20, background: glareStyle }}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
