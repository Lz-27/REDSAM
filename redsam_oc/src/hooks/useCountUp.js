import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * useCountUp — anima un número desde 0 hasta `target` cuando `start` es true.
 * Devuelve el valor interpolado. Usado en el contador de estadísticas.
 */
export function useCountUp(target, { duration = 1600, start = false } = {}) {
  const [value, setValue] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (!start) return undefined

    let startTime = null
    const tick = (now) => {
      if (startTime === null) startTime = now
      const progress = Math.min(1, (now - startTime) / duration)
      setValue(Math.round(target * easeOutExpo(progress)))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [start, target, duration])

  return value
}