import { useEffect, useRef } from 'react'

/**
 * useParallax — parallax de profundidad multi-capa por scroll.
 * Expone un ref para el contenedor y actualiza las vars CSS
 * `--px-1`..`--px-3` (desplazamiento en px) según la posición del
 * contenedor respecto al viewport. Las capas internas consumen esas
 * vars con `translate3d(0, var(--px-N), 0)`.
 * Se desactiva con `prefers-reduced-motion`.
 */
export function useParallax(intensity = 1) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const range = 130 * intensity
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh - rect.top) / (vh + rect.height)
      const p = Math.min(1, Math.max(0, progress))
      const off = (0.5 - p) * 2 * range
      el.style.setProperty('--px-1', `${off * 0.65}px`)
      el.style.setProperty('--px-2', `${off * 0.45}px`)
      el.style.setProperty('--px-3', `${off * 0.28}px`)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [intensity])

  return ref
}