import { useEffect, useRef, useState } from 'react'

/**
 * useReveal — observa el elemento y expone cuando entra al viewport.
 * Soporta IntersectionObserver con fallback a "visible" para entornos
 * sin soporte.
 */
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -6% 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, visible }
}