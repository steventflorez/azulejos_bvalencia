import { useEffect, useRef, useState } from 'react'
import { Phone, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const links = [
        { label: 'Colecciones', href: '#features' },
        { label: 'Filosofía', href: '#manifesto' },
        { label: 'Proyectos', href: '#archive' },

    ]

    return (
        <nav
            ref={navRef}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
                borderRadius: 'var(--radius-pill)',
                padding: scrolled ? '0.6rem 1.8rem' : '0.8rem 2rem',
                background: scrolled
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(0,0,0,0.15)',
                backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'blur(4px)',
                WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'blur(4px)',
                border: scrolled
                    ? '1px solid rgba(46,64,54,0.12)'
                    : '1px solid rgba(255,255,255,0.12)',
                boxShadow: scrolled
                    ? '0 8px 32px rgba(0,0,0,0.08)'
                    : 'none',
            }}
        >
            <div className="flex items-center gap-8">
                {/* Logo */}
                <a
                    href="#"
                    className="font-display font-bold text-lg tracking-tight whitespace-nowrap transition-colors duration-500"
                    style={{ color: scrolled ? 'var(--color-moss)' : '#fff' }}
                >
                    Azulejos Valencia
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors duration-500 hover:opacity-70"
                            style={{ color: scrolled ? 'var(--color-charcoal)' : 'rgba(255,255,255,0.85)' }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="tel:+34692580681"
                    className="hidden md:inline-flex btn-magnetic btn-clay text-sm !py-2.5 !px-5"
                >
                    <Phone size={15} />
                    Llámanos
                </a>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden transition-colors duration-500"
                    style={{ color: scrolled ? 'var(--color-charcoal)' : '#fff' }}
                    aria-label="Menú"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div
                    className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t pt-4"
                    style={{ borderColor: scrolled ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)' }}
                >
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium transition-colors duration-300"
                            style={{ color: scrolled ? 'var(--color-charcoal)' : '#fff' }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="tel:+34692580681" className="btn-magnetic btn-clay text-sm !py-2.5 !px-5 w-fit mt-2">
                        <Phone size={15} />
                        Llámanos
                    </a>
                </div>
            )}
        </nav>
    )
}
