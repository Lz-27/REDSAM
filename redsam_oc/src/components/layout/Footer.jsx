import { Link } from 'react-router-dom'
import Logo from './Logo'
import Icon from '../ui/Icon'
import { site, navLinks } from '../../data/content'

const SOCIALS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'whatsapp', label: 'WhatsApp' },
]

const PROGRAMS = [
  { label: 'Capacitación de líderes', href: '/#que-hacemos' },
  { label: 'Voluntariado', href: '/#que-hacemos' },
  { label: 'Ayuda social', href: '/#que-hacemos' },
  { label: 'Red de aliados', href: '/#contacto' },
]

const COLUMNS = [
  {
    icon: 'spark',
    color: 'text-accent-cyan',
    label: 'Explora',
    items: navLinks,
  },
  {
    icon: 'capacitacion',
    color: 'text-accent-magenta',
    label: 'Programas',
    items: PROGRAMS,
  },
]

/**
 * Footer — cierre de la página en noche densa, según la referencia.
 * Marca (emblema + wordmark), dos columnas de enlaces con icono,
 * Libro de Reclamaciones y columna de CTA.
 */
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-page pb-10 pt-16 transition-colors duration-500">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marca */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <Logo size={48} />
              <span className="font-display text-2xl font-extrabold tracking-tight text-fg-strong">
                REDSAM
              </span>
            </div>
            <p className="mt-5 max-w-sm leading-relaxed text-fg-muted text-sm">
              Fortalecemos el liderazgo juvenil de la región San Martín mediante formación,
              voluntariado y ayuda social.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={site.social[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d97706] text-white transition-all duration-300 hover:bg-[#1a1a1a] hover:text-[#d97706]"
                >
                  <Icon name={s.key} size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de enlaces */}
          {COLUMNS.map((c) => (
            <nav key={c.label} className="lg:col-span-2" aria-label={c.label}>
              <span className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg-line ${c.color}`}>
                <Icon name={c.icon} size={16} />
              </span>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent-cyan">
                {c.label}
              </p>
              <ul className="mt-5 space-y-3.5">
                {c.items.map((it) => (
                  <li key={it.label}>
                    <Link to={it.href} className="text-sm text-fg-muted transition-colors hover:text-fg-strong">
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Libro de Reclamaciones */}
          <div className="lg:col-span-2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link to="/libro-de-reclamaciones" className="group flex flex-col items-center hover:opacity-80 transition-opacity">
              <span className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-fg-strong group-hover:text-accent-cyan transition-colors mb-4">
                Libro de<br />Reclamaciones
              </span>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-strong group-hover:text-accent-cyan transition-colors">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </Link>
          </div>

          {/* CTA */}
          <div className="lg:col-span-3">
            <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg-line text-accent-magenta">
              <Icon name="voluntariado" size={16} />
            </span>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent-cyan">
              Únete a la red
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Súmate al voluntariado y recibe las novedades.
            </p>
            <Link
              to="/#contacto"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-night-950 shadow-lg shadow-night-950/20 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Únete ahora
              <Icon name="arrowUpRight" size={16} />
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-fg-line pt-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            © 2027 REDSAM · {site.coordinates}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            2027 - Todos los Derechos Reservados
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Volver arriba"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fg-line text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:signal-bg hover:text-night-950"
          >
            <Icon name="arrowUp" size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer