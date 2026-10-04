import { marqueeItems } from '../../data/content'

/**
 * Marquee — franja de palabras clave de la red.
 * El contenido se duplica para lograr un bucle continuo.
 */
function Marquee() {
  const items = [...marqueeItems, ...marqueeItems]

  return (
    <div
      className="relative overflow-hidden border-y border-fg-line bg-surface-soft py-5"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center gap-12 pr-12 hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-12 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-[0.28em] text-fg-muted"
          >
            {item}
            <span className="signal-bg inline-block h-1.5 w-1.5 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee