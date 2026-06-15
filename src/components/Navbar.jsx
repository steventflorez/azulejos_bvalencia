import { useEffect, useRef, useState } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const links = [
        { label: 'Espacios', href: '#spaces' },
        { label: 'Galería', href: '#gallery' },
        { label: 'Nosotros', href: '#whyus' },
        { label: 'Contacto', href: '#contact' },
    ]

    return (
        <nav
            ref={navRef}
            id="navbar"
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
                padding: scrolled ? '0.4rem 0' : '1.2rem 0',
                background: scrolled
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
                borderBottom: scrolled
                    ? '1px solid var(--color-border)'
                    : '1px solid transparent',
                boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none'
            }}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#"
                    id="logo"
                    className={`flex items-center transition-all duration-500 ${scrolled ? 'scale-75 origin-left' : 'scale-100'}`}
                    style={{ textDecoration: 'none' }}
                >
                    <Logo width={scrolled ? 50 : 60} height={scrolled ? 75 : 90} />
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold transition-all duration-300"
                            style={{
                                color: scrolled ? 'var(--color-text-main)' : '#FFFFFF',
                                textDecoration: 'none',
                                textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-blue)'}
                            onMouseLeave={(e) => e.target.style.color = scrolled ? 'var(--color-text-main)' : '#FFFFFF'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="tel:+34692580681"
                    id="nav-cta"
                    className={`hidden md:inline-flex btn-premium text-sm !py-2.5 !px-5 ${scrolled ? 'btn-brand' : 'bg-white/10 text-white hover:bg-white hover:text-[#0071BC] backdrop-blur-md border border-white/20'}`}
                >
                    <Phone size={14} />
                    Solicitar Presupuesto
                </a>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg"
                    style={{ 
                        color: scrolled ? 'var(--color-brand-blue)' : '#FFFFFF',
                        background: scrolled ? 'transparent' : 'rgba(0,0,0,0.2)',
                        backdropFilter: scrolled ? 'none' : 'blur(4px)'
                    }}
                    aria-label="Menú"
                    id="mobile-menu-toggle"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className="md:hidden overflow-hidden transition-all duration-500 bg-white"
                style={{
                    maxHeight: menuOpen ? '400px' : '0',
                    opacity: menuOpen ? 1 : 0,
                    boxShadow: menuOpen ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                <div
                    className="px-6 pt-4 pb-6 flex flex-col gap-4 border-t border-gray-100"
                >
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-base font-semibold py-2"
                            style={{
                                color: 'var(--color-text-main)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="tel:+34692580681"
                        className="btn-premium btn-brand text-sm !py-3 w-full mt-2 text-center"
                    >
                        <Phone size={14} />
                        Solicitar Presupuesto
                    </a>
                </div>
            </div>
        </nav>
    )
}
