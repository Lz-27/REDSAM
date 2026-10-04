import { useEffect, useState } from 'react'
import Logo from './Logo'
import LegacyButton from '../ui/ButtonOld'
import { Button } from '../ui/button.tsx'
import Icon from '../ui/Icon'
import { navLinks, site } from '../../data/content'

const SOCIALS = ['instagram', 'facebook', 'tiktok', 'youtube']

const THEMES = [
  { id: 'indigo', label: 'Índigo', icon: 'moon' },
  { id: 'black', label: 'Negro', icon: 'black' },
  { id: 'light', label: 'Claro', icon: 'sun' },
]

/**
 * Navbar — barra de navegación fija. Transparente sobre el hero y
 * con superficie al hacer scroll. Controla el tema global del sitio
 * (índigo → negro → claro) mediante `data-theme` en <html>.
 */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('redsam-theme')
    return THEMES.some((t) => t.id === saved) ? saved : 'indigo'
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('redsam-theme', theme)
  }, [theme])

  const solid = scrolled && !open
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0]
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-surface-glass text-fg-strong backdrop-blur-xl border-b border-fg-line' : 'text-fg-strong'
      }`}
    >
      <nav
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label="Principal"
      >
        <a href="/#inicio" className="shrink-0" aria-label="REDSAM, inicio">
          <Logo wordmark />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link text-fg text-lg font-medium transition-colors hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="outline"
            onClick={() => setTheme(next.id)}
            aria-label={`Fondo actual: ${current.label}. Cambiar a ${next.label}`}
            className="h-11 w-11 rounded-full p-0 flex items-center justify-center cursor-pointer"
          >
            <button type="button">
              <Icon name={current.icon} size={20} />
            </button>
          </Button>
          <LegacyButton href="/#contacto" icon="arrowUpRight">
            Únete a la red
          </LegacyButton>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 w-11 rounded-full p-0 flex items-center justify-center cursor-pointer md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <button type="button">
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </Button>
      </nav>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 z-[-1] flex flex-col bg-page px-5 pb-8 pt-[88px] md:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-fg-line py-4 font-display text-3xl font-bold text-fg-strong"
                >
                  <span className="font-mono text-xs text-accent-cyan">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setTheme(next.id)}
              className="flex items-center justify-between rounded-full border border-fg-line px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:text-accent"
            >
              <span className="flex items-center gap-3">
                <Icon name={current.icon} size={18} />
                Fondo {current.label}
              </span>
              <span className="text-fg-muted">{next.label}</span>
            </button>
            <Button href="/#contacto" icon="arrowUpRight" onClick={() => setOpen(false)} className="w-full">
              Únete a la red
            </Button>
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">{site.coordinates}</p>
              <div className="flex gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s}
                    href={site.social[s]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s}
                    className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d97706] text-white transition-all duration-300 hover:bg-[#1a1a1a] hover:text-[#d97706]"
                  >
                    <Icon name={s} size={22} className="transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar