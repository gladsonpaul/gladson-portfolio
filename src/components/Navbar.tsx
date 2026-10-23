import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        menuOpen || scrolled
          ? 'border-b border-[var(--line)] bg-[var(--bg)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container flex items-center justify-between py-5 md:py-6"
        aria-label="Main navigation"
      >
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('#hero')
          }}
          className="font-display text-lg font-semibold tracking-tight text-[var(--text)] focus-ring"
        >
          GP.
        </a>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-[var(--text)] lg:hidden focus-ring"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

    </header>

    {menuOpen && (
      <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-[var(--bg)] lg:hidden">
        <ul className="container flex flex-col py-4">
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-[var(--line)]">
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="font-display block py-5 text-3xl font-semibold tracking-tight text-[var(--text)] focus-ring sm:py-6 sm:text-4xl"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
    </>
  )
}
