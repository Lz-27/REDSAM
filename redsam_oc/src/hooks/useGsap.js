import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useGsapScrollReveal — hook que aplica animaciones GSAP al entrar al viewport.
 * 
 * @param {Object} options
 * @param {string} options.selector - selector CSS de los elementos a animar dentro del container
 * @param {Object} options.from - estado inicial de la animación
 * @param {Object} options.to - estado final de la animación
 * @param {number} options.stagger - delay entre cada elemento (default 0.08s)
 * @param {string} options.trigger - dónde dispara el scroll ('top 85%', etc.)
 * @returns ref para el container
 */
export function useGsapScrollReveal({
  selector = '[data-gsap]',
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
  stagger = 0.08,
  trigger = 'top 88%',
  duration = 0.85,
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector, containerRef.current)
      if (!elements.length) return

      gsap.fromTo(elements, from, {
        ...to,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: trigger,
          toggleActions: 'play none none none',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [selector, stagger, trigger, duration])

  return containerRef
}

/**
 * useGsapParallax — parallax avanzado con GSAP ScrollTrigger.
 * @param {number} speed - velocidad del parallax (0.1 = sutil, 0.5 = dramático)
 * @param {string} direction - 'y' (default) o 'x'
 */
export function useGsapParallax(speed = 0.25, direction = 'y') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        [direction]: () => el.offsetHeight * speed * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [speed, direction])

  return ref
}

/**
 * useGsapTextReveal — anima cada palabra de un texto como si emergiera de abajo.
 * Efecto tipo "titular cinematográfico".
 */
export function useGsapTextReveal(trigger = 'top 90%') {
  const textRef = useRef(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    // Dividir en palabras y envolver en spans
    const originalHTML = el.innerHTML
    const words = el.innerText.split(' ')
    el.innerHTML = words
      .map((w) => `<span class="word-wrap" style="overflow:hidden;display:inline-block;vertical-align:bottom"><span class="word" style="display:inline-block">${w}</span></span>`)
      .join(' ')

    const wordEls = el.querySelectorAll('.word')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordEls,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.72,
          stagger: 0.045,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: trigger,
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => {
      ctx.revert()
      el.innerHTML = originalHTML
    }
  }, [trigger])

  return textRef
}

/**
 * useGsapCountUp — contador animado de números con GSAP (versión mejorada).
 * @param {number} target - número objetivo
 * @param {string} prefix - prefijo (ej. '+')
 * @param {string} suffix - sufijo (ej. 'k')
 */
export function useGsapCountUp(target, prefix = '', suffix = '', trigger = 'top 90%') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: trigger,
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          const val = Math.round(obj.val)
          el.textContent = `${prefix}${val.toLocaleString('es-PE')}${suffix}`
        },
      })
    })

    return () => ctx.revert()
  }, [target, prefix, suffix, trigger])

  return ref
}
