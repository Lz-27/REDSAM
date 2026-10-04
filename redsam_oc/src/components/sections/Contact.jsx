import { useEffect, useRef, useState } from 'react'
import { contact, site } from '../../data/content'
import { isContactServiceConfigured, sendContactMessage } from '../../services/contact'
import SectionHeading from '../ui/SectionHeading'
import Icon from '../ui/Icon'
import { Button } from '../ui/button.tsx'
import Reveal from '../ui/Reveal'

const SOCIALS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
]

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  interest: contact.interests[0],
  message: '',
}

const ACTIVITY_INTEREST = 'Participar en una actividad'

/**
 * Contact — formulario preparado para un endpoint configurado mediante
 * VITE_CONTACT_ENDPOINT. Sin endpoint nunca comunica un envío como exitoso.
 */
function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    const selectActivity = (event) => {
      const activity = event.detail
      if (!activity) return

      setSelectedActivity(activity)
      setForm((prev) => ({
        ...prev,
        interest: ACTIVITY_INTEREST,
        message:
          prev.message || `Me interesa participar en “${activity.title}” (${activity.date}, ${activity.place}).`,
      }))
      setStatus('idle')
      setErrorMessage('')
    }

    window.addEventListener('redsam:activity-interest', selectActivity)
    return () => window.removeEventListener('redsam:activity-interest', selectActivity)
  }, [])

  useEffect(() => {
    if (status === 'success' || status === 'error') resultRef.current?.focus()
  }, [status])

  const update = (field) => (event) => {
    if (status === 'error') setStatus('idle')
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isContactServiceConfigured) {
      setErrorMessage('El servicio de contacto aún no está configurado para este entorno.')
      setStatus('error')
      return
    }

    if (form.message.trim().length < 5) {
      setErrorMessage('El mensaje debe tener al menos 5 caracteres.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        interest: form.interest,
        message: form.message.trim(),
        activity: selectedActivity?.title ?? null,
      })
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'No pudimos procesar tu mensaje. Revisa tu conexión e inténtalo nuevamente.')
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-fg-line bg-surface-raised px-4 py-3 text-fg-strong placeholder:text-fg-muted/60 transition-all duration-200 focus:border-signal-cyan focus:outline-none focus:ring-2 focus:ring-signal-cyan/20'

  return (
    <section id="contacto" className="relative overflow-hidden bg-page py-16 lg:py-20">
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        {/* Información */}
        <div className="lg:col-span-5">
          <SectionHeading kicker={contact.kicker} title={contact.title} sub={contact.sub} tone="day" />

          <Reveal delay={2} className="mt-12">
            <ul className="space-y-10">
              {contact.info.map((item) => (
                <li key={item.label} className="flex items-start gap-6">
                  <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-raised text-fg-strong shadow-lg">
                    <Icon name={item.icon} size={28} />
                  </span>
                  <div className="pt-1">
                    <p className="font-display text-xl font-bold text-fg-strong">
                      {item.label}:
                    </p>
                    <p className="mt-2 text-lg font-medium text-fg-muted">
                      {item.label === 'Correo' ? (
                        <a href={`mailto:${item.value}`} className="transition-colors hover:text-accent-magenta">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-14 flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={site.social[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised text-fg-strong shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:text-accent-magenta"
                >
                  <Icon name={s.key} size={24} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Formulario */}
        <div className="lg:col-span-7">
          <Reveal delay={1}>
            <div className="relative rounded-[28px] border border-fg-line bg-surface-raised p-7 shadow-[0_30px_80px_-50px_var(--glow)] sm:p-10">
              {status === 'success' ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="signal-bg inline-flex h-16 w-16 items-center justify-center rounded-full text-night-950">
                    <Icon name="check" size={30} />
                  </span>
                  <h3 ref={resultRef} tabIndex={-1} className="mt-6 font-display text-2xl font-bold text-fg-strong sm:text-3xl">
                    ¡Mensaje recibido!
                  </h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-fg-muted">
                    Gracias por escribirnos, <strong className="text-fg-strong">{form.name}</strong>. Recibimos tu consulta con éxito en nuestra base de datos y el equipo de {site.name} se comunicará contigo vía correo o WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(INITIAL)
                      setSelectedActivity(null)
                      setStatus('idle')
                      setErrorMessage('')
                    }}
                    className="mt-8 text-sm font-semibold text-accent-cyan transition-colors hover:text-fg-strong"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {!isContactServiceConfigured && (
                    <div className="mb-7 rounded-2xl border border-signal-amber/40 bg-signal-amber/10 p-4 text-sm leading-relaxed text-fg">
                      <p className="font-semibold text-fg-strong">Canal de contacto en configuración</p>
                      <p className="mt-1 text-fg-muted">
                        Este entorno es una demostración: tus datos no se enviarán hasta conectar el servicio de contacto.
                      </p>
                    </div>
                  )}

                  {selectedActivity && (
                    <div className="mb-7 flex items-start justify-between gap-4 rounded-2xl border border-signal-cyan/35 bg-signal-cyan/10 p-4">
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent-cyan">Actividad seleccionada</p>
                        <p className="mt-1 font-semibold text-fg-strong">{selectedActivity.title}</p>
                        <p className="mt-1 text-sm text-fg-muted">{selectedActivity.date} · {selectedActivity.place}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedActivity(null)
                          setForm((prev) => ({ ...prev, interest: contact.interests[0] }))
                        }}
                        className="shrink-0 text-sm font-semibold text-accent-magenta transition-colors hover:text-fg-strong"
                      >
                        Quitar
                      </button>
                    </div>
                  )}

                  {status === 'error' && (
                    <div ref={resultRef} tabIndex={-1} role="alert" className="mb-7 rounded-2xl border border-signal-magenta/35 bg-signal-magenta/10 p-4 text-sm leading-relaxed text-fg">
                      <p className="font-semibold text-fg-strong">No pudimos enviar tu mensaje.</p>
                      <p className="mt-1 text-fg-muted">
                        {errorMessage || 'Revisa tu conexión e inténtalo nuevamente. Tus datos siguen en el formulario.'}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label htmlFor="name" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted">
                        Nombre completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        maxLength={100}
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Tu nombre"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="email" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted">
                        Correo
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        maxLength={254}
                        value={form.email}
                        onChange={update('email')}
                        placeholder="tu@correo.pe"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="phone" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted">
                        Teléfono / WhatsApp
                        <span className="normal-case text-fg-muted/60"> (opcional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+51 9XX XXX XXX"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="interest" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted">
                        ¿Cómo quieres participar?
                      </label>
                      <div className="relative">
                        <select
                          id="interest"
                          value={form.interest}
                          onChange={update('interest')}
                          className={`${inputClass} appearance-none pr-10`}
                        >
                          {[...contact.interests, ACTIVITY_INTEREST].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <Icon
                          name="chevronRight"
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-fg-muted"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-fg-muted">
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        maxLength={1200}
                        value={form.message}
                        onChange={update('message')}
                        placeholder="Cuéntanos qué te gustaría hacer en la red…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="px-8 text-sm"
                    >
                      {status === 'submitting' ? 'Enviando…' : 'Enviar mensaje'}
                      <Icon name="send" size={16} />
                    </Button>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
                      {isContactServiceConfigured
                        ? 'Usaremos estos datos solo para responder a tu consulta.'
                        : 'Demostración · Configura VITE_CONTACT_ENDPOINT para habilitar el envío'}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
