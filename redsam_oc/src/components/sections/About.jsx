import { about } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import MotionReveal from '../ui/MotionReveal'
import Card3DTilt from '../ui/Card3DTilt'
import Icon from '../ui/Icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { motion } from 'framer-motion'
import { useGsapScrollReveal } from '../../hooks/useGsap'

/**
 * About — «Quiénes somos» con animaciones profesionales:
 * - Framer Motion reveal con blur y spring physics
 * - Tabs de Misión/Visión con Card3DTilt (efecto 3D en hover)
 * - Valores tipo Bento con stagger GSAP y números watermark animados
 */
function About() {
  const valuesRef = useGsapScrollReveal({
    selector: '[data-gsap]',
    from: { opacity: 0, y: 60, scale: 0.92 },
    to: { opacity: 1, y: 0, scale: 1 },
    stagger: 0.1,
    duration: 0.75,
    trigger: 'top 85%',
  })

  return (
    <section id="nosotros" className="relative overflow-hidden bg-page py-16 lg:py-24">
      {/* Fondo decorativo de red neuronal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #00c0c0 0%, transparent 40%),
                            radial-gradient(circle at 80% 50%, #7a3f9f 0%, transparent 40%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <MotionReveal variant="slide-right" delay={0}>
              <SectionHeading kicker={about.kicker} title={about.title} tone="day" />
            </MotionReveal>

            <div className="mt-8">
              {about.story.map((paragraph, i) => (
                <MotionReveal key={paragraph} variant="rise" delay={i * 0.1 + 0.15}>
                  <p className={`${i > 0 ? 'mt-5' : ''} text-lg leading-relaxed text-fg`}>
                    {paragraph}
                  </p>
                </MotionReveal>
              ))}
              <MotionReveal variant="rise" delay={0.35}>
                <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-magenta">
                  <span aria-hidden="true" className="signal-bar inline-block h-px w-9" />
                  Desde Tarapoto · Conectando las 10 provincias
                </p>
              </MotionReveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <MotionReveal variant="slide-left" delay={0.1} className="h-full">
              <Tabs defaultValue="mission" className="w-full flex flex-col h-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2 bg-surface-soft border border-fg-line h-14 rounded-full p-1 mx-auto lg:mx-0">
                  <TabsTrigger value="mission" className="rounded-full rounded-r-none font-bold tracking-wide data-[state=active]:signal-bg data-[state=active]:text-white data-[state=active]:shadow-lg text-fg transition-all">
                    Misión
                  </TabsTrigger>
                  <TabsTrigger value="vision" className="rounded-full rounded-l-none font-bold tracking-wide data-[state=active]:signal-bg data-[state=active]:text-white data-[state=active]:shadow-lg text-fg transition-all">
                    Visión
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mission" className="mt-6 flex-grow outline-none">
                  <Card3DTilt intensity={10} className="h-full">
                    <div className="group relative h-full overflow-hidden rounded-[32px] border border-fg-line bg-surface-soft p-10 transition-all duration-700 hover:border-signal-cyan/40 hover:shadow-[0_30px_80px_-30px_rgba(0,192,192,0.3)] sm:p-14">
                      <div className="carto-grid absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]" aria-hidden="true" />
                      <div
                        aria-hidden="true"
                        className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-[90px] transition-opacity duration-500 group-hover:opacity-50"
                        style={{ background: 'radial-gradient(circle, #00c0c0 0%, transparent 65%)' }}
                      />
                      <div className="relative z-10 flex flex-col h-full justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                          className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-fg-line bg-surface-raised text-accent-cyan backdrop-blur-md shadow-lg"
                        >
                          <Icon name="capacitacion" size={28} />
                        </motion.div>
                        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-accent-cyan">
                          {about.mission.title}
                        </p>
                        <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-fg-strong sm:text-4xl">
                          {about.mission.text}
                        </h3>
                      </div>
                    </div>
                  </Card3DTilt>
                </TabsContent>

                <TabsContent value="vision" className="mt-6 flex-grow outline-none">
                  <Card3DTilt intensity={10} className="h-full">
                    <div className="group relative h-full overflow-hidden rounded-[32px] border border-fg-line bg-surface-soft p-10 transition-all duration-700 hover:border-signal-magenta/40 hover:shadow-[0_30px_80px_-30px_rgba(228,36,108,0.3)] sm:p-14">
                      <div className="carto-grid absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]" aria-hidden="true" />
                      <div
                        aria-hidden="true"
                        className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-[90px] transition-opacity duration-500 group-hover:opacity-50"
                        style={{ background: 'radial-gradient(circle, #e4246c 0%, transparent 65%)' }}
                      />
                      <div className="relative z-10 flex flex-col h-full justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: -5 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                          className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-fg-line bg-surface-raised text-accent-magenta backdrop-blur-md shadow-lg"
                        >
                          <Icon name="red" size={28} />
                        </motion.div>
                        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-accent-magenta">
                          {about.vision.title}
                        </p>
                        <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-fg-strong sm:text-4xl">
                          {about.vision.text}
                        </h3>
                      </div>
                    </div>
                  </Card3DTilt>
                </TabsContent>
              </Tabs>
            </MotionReveal>
          </div>
        </div>

        {/* Valores tipo Bento Grid con GSAP stagger */}
        <div ref={valuesRef} className="mt-20 lg:mt-24">
          <MotionReveal variant="fade" delay={0}>
            <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-fg-muted uppercase mb-10 text-center lg:text-left">
              Principios Fundamentales
            </h3>
          </MotionReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, i) => (
              <Card3DTilt key={value.title} intensity={14} className="h-full" data-gsap>
                <div
                  className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[26px] border border-fg-line bg-surface-soft p-8 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-signal-cyan/40 hover:shadow-[0_20px_50px_-20px_rgba(228,36,108,0.3)]"
                >
                  {/* Línea superior animada */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 signal-bg transition-transform duration-500 group-hover:scale-x-100"
                  />

                  {/* Número de fondo (Watermark) */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-6 -right-2 font-display text-[7.5rem] font-bold leading-none text-fg-line opacity-15 pointer-events-none select-none transition-all duration-500 group-hover:text-accent-magenta group-hover:opacity-25"
                  >
                    0{i + 1}
                  </span>

                  <div className="relative z-10">
                    <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-accent-magenta transition-colors duration-500 group-hover:text-signal-cyan">
                      <span className="h-2 w-2 rounded-full bg-accent-magenta group-hover:bg-signal-cyan transition-colors" />
                      V0{i + 1}
                    </p>
                    <h4 className="mt-5 font-display text-2xl font-bold text-fg-strong transition-colors duration-500 group-hover:text-fg-strong group-hover:drop-shadow-sm">
                      {value.title}
                    </h4>
                  </div>

                  <div className="relative z-10 mt-6 pt-2">
                    <p className="leading-relaxed text-fg-muted transition-colors duration-500 group-hover:text-fg text-sm sm:text-base">
                      {value.text}
                    </p>
                  </div>
                </div>
              </Card3DTilt>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About