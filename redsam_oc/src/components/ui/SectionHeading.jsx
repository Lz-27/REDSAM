import Reveal from './Reveal'

/**
 * SectionHeading — cabecera reutilizable de sección.
 * kicker: etiqueta mono con la señal de marca.
 * title: titular display. sub: apoyo opcional.
 * Los colores dependen del tema global (data-theme).
 */
function SectionHeading({ kicker, title, sub = null, tone = 'night', className = '', id = null }) {
  void tone
  return (
    <div className={`max-w-3xl ${className}`} id={id}>
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent-cyan">
          <span aria-hidden="true" className="signal-bar inline-block h-px w-9" />
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="mt-5 text-4xl font-bold leading-[1.06] text-fg-strong sm:text-5xl">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={2}>
          <p className="mt-5 text-lg leading-relaxed text-fg">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

export default SectionHeading