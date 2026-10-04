import { useReveal } from '../../hooks/useReveal'

/**
 * Reveal — envoltura de revelado por scroll.
 * Aplica una transición de entrada (desplazamiento o máscara) cuando el
 * elemento entra al viewport. `delay` usa pasos del sistema (0–4).
 */
function Reveal({
  as: Tag = 'div',
  delay = 0,
  mask = false,
  className = '',
  children,
  ...rest
}) {
  const { ref, visible } = useReveal()
  const base = mask ? 'reveal-mask' : 'reveal'
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : ''

  return (
    <Tag
      ref={ref}
      className={`${base} ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Reveal