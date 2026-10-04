import { cta } from '../../data/content'
import Icon from '../ui/Icon'
import Reveal from '../ui/Reveal'

/**
 * CtaBanner — franja de señal de marca a página completa.
 * La superficie es el color (Committed palette); invita a unirse.
 */
function CtaBanner() {
  return (
    <section className="grain relative overflow-hidden">
      <div className="signal-bg relative py-24 lg:py-32">
        {/* Nodos de constelación */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="node-pulse absolute left-[12%] top-[22%] inline-flex h-2.5 w-2.5 rounded-full bg-night-950/70" />
          <span className="node-pulse absolute right-[16%] top-[30%] inline-flex h-2 w-2 rounded-full bg-night-950/70" />
          <span className="absolute bottom-[26%] left-[24%] inline-flex h-2 w-2 rounded-full bg-night-950/50" />
          <span className="absolute bottom-[32%] right-[26%] inline-flex h-2.5 w-2.5 rounded-full bg-night-950/60" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-night-950">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-night-950" />
              {cta.kicker}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-night-950" />
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-night-950 sm:text-6xl">
              {cta.title}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-night-950/80">
              {cta.text}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-10">
              <a
                href={cta.primaryCta.href}
                className="btn-shine group inline-flex items-center gap-2.5 rounded-full bg-night-950 px-8 py-4 text-sm font-bold text-white shadow-[0_18px_50px_-16px_rgba(10,18,38,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_rgba(10,18,38,1)]"
              >
                {cta.primaryCta.label}
                <Icon
                  name="arrowUpRight"
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default CtaBanner