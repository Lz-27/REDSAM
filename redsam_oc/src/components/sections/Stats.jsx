import { motion } from 'framer-motion'
import { useGsapCountUp } from '../../hooks/useGsap'
import { stats } from '../../data/content'

/** Paleta de colores por índice de stat */
const ACCENT_COLORS = ['text-accent-cyan', 'text-accent-magenta', 'text-signal-amber', 'text-accent-cyan']
const GLOW_COLORS = ['rgba(0,192,192,0.15)', 'rgba(228,36,108,0.15)', 'rgba(240,144,12,0.15)', 'rgba(0,192,192,0.15)']

/**
 * StatItem — número con animación GSAP mejorada + Framer Motion reveal.
 */
function StatItem({ item, index }) {
  const numberRef = useGsapCountUp(item.value, item.prefix, item.suffix)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col items-center gap-3 px-6 py-12 text-center sm:py-16"
    >
      {/* Glow de fondo animado */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 60%, ${GLOW_COLORS[index % GLOW_COLORS.length]} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Número */}
      <motion.p
        className="font-display text-5xl font-extrabold tracking-tight text-fg-strong sm:text-6xl"
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span ref={numberRef} className={ACCENT_COLORS[index % ACCENT_COLORS.length]}>
          {item.prefix}0{item.suffix}
        </span>
      </motion.p>

      {/* Etiqueta */}
      <p className="max-w-[13ch] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted transition-colors duration-300 group-hover:text-fg">
        {item.label}
      </p>

      {/* Divisor animado en hover */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[1px] -translate-x-1/2 signal-bg"
        initial={{ width: 0 }}
        whileHover={{ width: '60%' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

/**
 * Stats — banda de impacto con métricas + contadores GSAP + hover reveal.
 */
function Stats() {
  return (
    <section className="relative border-y border-fg-line bg-surface-soft overflow-hidden">
      {/* Gradiente de fondo sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(90deg, #00c0c0, #7a3f9f, #e4246c, #f0900c)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[var(--line)] sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {stats.items.map((item, i) => (
          <StatItem key={item.label} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

export default Stats