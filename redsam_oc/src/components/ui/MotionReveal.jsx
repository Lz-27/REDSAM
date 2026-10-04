import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

/**
 * MotionReveal — reemplaza el Reveal.jsx básico con spring physics de Framer Motion.
 * Soporta múltiples variantes de entrada:
 *  - 'rise': sube desde abajo (default)
 *  - 'fade': solo fade-in
 *  - 'slide-left': entra desde la derecha
 *  - 'slide-right': entra desde la izquierda
 *  - 'scale': escala desde 0.85
 */
const VARIANTS = {
  'rise': {
    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  'fade': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: 50, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -50, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  'scale': {
    hidden: { opacity: 0, scale: 0.88, filter: 'blur(6px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
}

export default function MotionReveal({
  children,
  variant = 'rise',
  delay = 0,
  duration = 0.75,
  className = '',
  once = true,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-8% 0px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
    else if (!once) controls.start('hidden')
  }, [isInView, controls, once])

  const variants = VARIANTS[variant] || VARIANTS['rise']

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // ease-expo
        filter: { duration: duration * 0.9 },
      }}
    >
      {children}
    </motion.div>
  )
}
