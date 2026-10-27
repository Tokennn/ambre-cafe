import { useEffect, useState } from 'react'
import { Logo } from './Logo'

const LINKS = [
  { href: '#carte', label: 'La Carte' },
  { href: '#torrefaction', label: 'Torréfaction' },
  { href: '#ateliers', label: 'Ateliers' },
  { href: '#apropos', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
]

export function BrandHeader() {
  return (
    <div className="premium-brand-header">
      <Logo className="premium-brand-logo-svg" />
      <span className="premium-brand-text">Ambre</span>
    </div>
  )
}

export function NavHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header className="premium-header-nav">
        <nav className="premium-nav-desktop" aria-label="Navigation principale">
          <ul className="premium-nav-list">
            {LINKS.map((link) => (
              <li key={link.href} className="premium-nav-item">
                <a href={link.href} className={`premium-nav-link${link.href === '#contact' ? ' premium-nav-link--cta' : ''}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="premium-hamburger"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`premium-hamburger-line${menuOpen ? ' top-open' : ''}`} />
          <span className={`premium-hamburger-line${menuOpen ? ' mid-open' : ''}`} />
          <span className={`premium-hamburger-line${menuOpen ? ' bot-open' : ''}`} />
        </button>
      </header>

      <div id="mobile-menu" className={`premium-mobile-menu${menuOpen ? ' open' : ''}`} inert={!menuOpen}>
        <nav aria-label="Navigation mobile">
          <ul className="premium-mobile-menu-list">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="premium-mobile-menu-link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
