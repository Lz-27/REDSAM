import { pillars } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'
import MotionReveal from '../ui/MotionReveal'
import Card3DTilt from '../ui/Card3DTilt'
import { motion } from 'framer-motion'

const CARD_COLORS = ['#00c0c0', '#7a3f9f', '#e4246c', '#f0900c']

/**
 * Pillars — «Qué hacemos» con animaciones 3D premium:
 * - Card3DTilt con spring physics en cada tarjeta
 * - Framer Motion stagger container para la cuadrícula
 * - Iconos con hover spring y glow animado
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 55, scale: 0.93, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

function Pillars() {
  return (
    <section id="que-hacemos" className="relative overflow-hidden bg-page py-16 transition-colors duration-500 lg:py-20">
      {/* Glow decorativo */}
      <div
        aria-hidden="true"
        className="absolute right-[-15%] top-[10%] h-[540px] w-[540px] rounded-full opacity-15 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #00c0c0 0%, transparent 65%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[-10%] bottom-[5%] h-[400px] w-[400px] rounded-full opacity-10 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #7a3f9f 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MotionReveal variant="slide-right" delay={0}>
            <SectionHeading kicker={pillars.kicker} title={pillars.title} sub={pillars.sub} tone="night" />
          </MotionReveal>
          <MotionReveal variant="fade" delay={0.2}>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted lg:pb-3">
              <span className="node-pulse relative inline-flex h-2 w-2 rounded-full bg-signal-magenta" />
              4 rutas activas · 2026
            </p>
          </MotionReveal>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {pillars.items.map((item, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length]
            return (
              <motion.div key={item.title} variants={cardVariants} className="h-full">
                <Card3DTilt intensity={14} className="h-full">
                  <a href="#actividades" className="block h-full outline-none">
                    <div
                      className="group relative flex h-full min-h-[380px] flex-col items-center justify-between overflow-hidden rounded-[26px] border border-fg-line bg-surface-soft p-8 text-center shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-signal-cyan/40"
                      style={{ '--card-accent': color }}
                    >
                      {/* Línea superior animada */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 signal-bg transition-transform duration-500 group-hover:scale-x-100"
                      />

                      {/* Glow de fondo en hover */}
                      <div
                        className="absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 30%, ${color}18 0%, transparent 65%)`,
                        }}
                        aria-hidden="true"
                      />

                      {/* Contenido superior: Icono + Título + Descripción */}
                      <div className="flex flex-col items-center w-full">
                        {/* Icono central con spring */}
                        <div
                          className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-fg-line bg-surface-raised transition-all duration-300 group-hover:scale-110 shadow-inner"
                          style={{ color }}
                        >
                          <Icon name={item.icon} size={32} />
                        </div>

                        <h3 className="mb-4 font-display text-2xl font-bold text-fg-strong transition-colors duration-300 group-hover:text-fg-strong group-hover:drop-shadow-sm">
                          {item.title}
                        </h3>

                        <p className="leading-relaxed text-fg-muted transition-colors duration-300 group-hover:text-fg text-sm sm:text-base">
                          {item.text}
                        </p>
                      </div>

                      {/* Tag inferior alineado en la base */}
                      <div className="mt-8 pt-4 w-full flex justify-center border-t border-fg-line/30">
                        <Tag variant="outline" className="transition-all duration-300 group-hover:border-signal-cyan group-hover:text-accent group-hover:scale-105">
                          {item.tag}
                        </Tag>
                      </div>
                    </div>
                  </a>
                </Card3DTilt>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Pillars