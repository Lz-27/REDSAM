import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { activities } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'
import Reveal from '../ui/Reveal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button.tsx'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'
import Autoplay from 'embla-carousel-autoplay'

/**
 * ActivityModal — ventana modal con la información completa de una
 * actividad. Se abre al presionar la tarjeta; cierra con la X,
 * el fondo, o la tecla Escape. Bloquea el scroll del cuerpo.
 */
function ActivityModal({ item, cta, onClose }) {
  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent 
        showCloseButton={false}
        className="p-0 border-none bg-surface-soft shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:rounded-[26px] overflow-hidden w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="h-64 sm:h-80 w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent opacity-70"
          />
          <Tag variant="soft" tone="night" className="absolute left-4 top-4">
            {item.category}
          </Tag>
          <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-night-950/60 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-night-200 backdrop-blur-md">
            {item.date}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalles"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-night-950/70 text-night-100 backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:border-transparent hover:signal-bg hover:text-white"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
            <Icon name="pin" size={14} className="text-accent-cyan" />
            {item.place}
          </p>
          <DialogTitle asChild>
            <h3 id="activity-dialog-title" className="mt-2 font-display text-2xl font-bold text-fg-strong sm:text-3xl">
              {item.title}
            </h3>
          </DialogTitle>
          <DialogDescription asChild>
            <p className="mt-4 leading-relaxed text-fg-muted">{item.fullText}</p>
          </DialogDescription>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            {item.meta.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-3 rounded-2xl border border-fg-line bg-night-950/10 px-4 py-3 hover:border-signal-cyan/50 transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fg-line text-accent-cyan">
                  <Icon name={m.icon} size={15} />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
                    {m.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-fg-strong">{m.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="#contacto"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('redsam:activity-interest', { detail: item }))
                onClose()
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full signal-bg px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-night-950/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-signal-violet/40"
            >
              {cta}
              <Icon name="arrowUpRight" size={16} />
            </a>
            <Button
              variant="outline"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-fg-line bg-transparent px-6 py-5 text-sm font-semibold text-fg transition-all duration-300 hover:signal-bg hover:text-white hover:border-transparent"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * ActivityCard — tarjeta de actividad. Conserva el diseño editorial
 * actual de la caja; al presionarla abre la ventana modal con la
 * información completa.
 */
function ActivityCard({ item, featured, cta, onOpen }) {
  return (
    <Card 
      className="group relative h-full flex flex-col overflow-hidden border-fg-line bg-surface-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-signal-violet/50 hover:shadow-[0_30px_70px_-30px_rgba(122,63,159,0.45)]"
    >
      {/* Glow top border */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 signal-bg transition-transform duration-500 group-hover:scale-x-100"
      />

      <div 
        className="relative overflow-hidden w-full aspect-[4/5] shrink-0 cursor-pointer"
        onClick={onOpen}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent opacity-70"
        />
        <Tag variant="soft" tone="night" className="absolute left-4 top-4">
          {item.category}
        </Tag>
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-night-950/60 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-night-200 backdrop-blur-md">
          {item.date}
        </span>
      </div>

      <CardHeader className="pb-3 pt-6">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted mb-2">
          <Icon name="pin" size={14} className="text-accent-cyan" />
          {item.place}
        </p>
        <CardTitle className="font-display text-xl font-bold text-fg-strong transition-colors duration-300 group-hover:text-accent">
          {item.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4 grow">
        <CardDescription className="text-sm leading-relaxed text-fg-muted">
          {item.text}
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-2 pt-0 pb-5 border-none bg-transparent">
        <Button 
          variant="outline" 
          className="w-full border-fg-line bg-transparent text-fg hover:signal-bg hover:text-white transition-all text-sm h-10"
          onClick={onOpen}
        >
          Ver detalles
          <Icon name="expand" size={16} className="ml-2" />
        </Button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent-cyan transition-colors hover:text-accent-amber w-full py-1"
        >
          {cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <Icon name="arrowUpRight" size={16} />
          </span>
        </button>
      </CardFooter>
    </Card>
  )
}

/**
 * Activities — «Últimas actividades de la red».
 * Cuadrícula editorial sobre noche: la primera actividad destaca
 * en ancho doble; el resto en tarjetas. Cada caja abre una ventana
 * modal con la información completa de la actividad.
 */
function Activities() {
  const [active, setActive] = useState(null)
  const triggerRef = useRef(null)

  const openActivity = (item, trigger) => {
    triggerRef.current = trigger
    setActive(item)
  }

  const closeActivity = () => {
    setActive(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <section id="actividades" className="relative overflow-hidden bg-page py-16 transition-colors duration-500 lg:py-20">
      <div
        aria-hidden="true"
        className="absolute left-[-12%] top-[30%] h-[480px] w-[480px] rounded-full opacity-15 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #7a3f9f 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-7xl">
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3500,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          {/* Cabecera con título y botones de navegación arriba a la derecha */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between px-5 sm:px-8">
            <SectionHeading kicker={activities.kicker} title={activities.title} sub={activities.sub} tone="night" />
            
            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
              <Reveal delay={2}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
                  {activities.items.length} actividades · 2026
                </p>
              </Reveal>
              <div className="flex items-center gap-3">
                <CarouselPrevious className="static translate-y-0 bg-surface-soft hover:signal-bg hover:text-white border-fg-line h-11 w-11 transition-all shadow-md hover:border-transparent text-fg-strong cursor-pointer" />
                <CarouselNext className="static translate-y-0 bg-surface-soft hover:signal-bg hover:text-white border-fg-line h-11 w-11 transition-all shadow-md hover:border-transparent text-fg-strong cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Carrusel de actividades */}
          <div className="mt-12 sm:mt-14 w-full">
            <CarouselContent className="ml-0 px-5 sm:px-8 flex">
              {activities.items.map((item, i) => (
                <CarouselItem
                  key={item.title}
                  className="pl-0 pr-6 basis-[85vw] sm:basis-[400px] lg:basis-[420px]"
                >
                  <Reveal delay={i % 3} className="h-full flex">
                    <ActivityCard
                      item={item}
                      featured={false}
                      cta={activities.cta}
                      onOpen={(event) => openActivity(item, event.currentTarget)}
                    />
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      </div>

      {active && <ActivityModal item={active} cta={activities.cta} onClose={closeActivity} />}
    </section>
  )
}

export default Activities
