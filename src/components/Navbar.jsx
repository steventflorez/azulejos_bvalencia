import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone, Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navRef = useRef(null)
    const location = useLocation()

    // En páginas que no son la home, la navbar siempre está "scrolled" (con fondo)
    const isHome = location.pathname === '/'
    const hasBackground = !isHome || scrolled

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
        { label: 'Blog', href: '/blog' },
    ]

    return (
        <nav
            ref={navRef}
            id="navbar"
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
                padding: hasBackground ? '0.4rem 0' : '1.2rem 0',
                background: hasBackground
                    ? 'rgba(255, 255, 255, 0.97)'
                    : 'transparent',
                backdropFilter: hasBackground ? 'blur(20px) saturate(1.5)' : 'none',
                WebkitBackdropFilter: hasBackground ? 'blur(20px) saturate(1.5)' : 'none',
                borderBottom: hasBackground
                    ? '1px solid var(--color-border)'
                    : '1px solid transparent',
                boxShadow: hasBackground ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none'
            }}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
                {/* Logo → siempre va a la home */}
                <Link
                    to="/"
                    id="logo"
                    className={`flex items-center transition-all duration-500 ${hasBackground ? 'scale-75 origin-left' : 'scale-100'}`}
                    style={{ textDecoration: 'none' }}
                >
                    <Logo width={hasBackground ? 50 : 60} height={hasBackground ? 75 : 90} />
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
                        const isRouter = link.href.startsWith('/')
                        const baseStyle = {
                            color: hasBackground ? 'var(--color-text-main)' : '#FFFFFF',
                            textDecoration: 'none',
                            textShadow: hasBackground ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                        }
                        const className = "text-sm font-semibold transition-all duration-300"
                        const handlers = {
                            onMouseEnter: (e) => e.target.style.color = 'var(--color-brand-blue)',
                            onMouseLeave: (e) => e.target.style.color = hasBackground ? 'var(--color-text-main)' : '#FFFFFF',
                        }
                        return isRouter ? (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={className}
                                style={baseStyle}
                                {...handlers}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.href}
                                href={link.href}
                                className={className}
                                style={baseStyle}
                                {...handlers}
                            >
                                {link.label}
                            </a>
                        )
                    })}
                </div>

                {/* CTA */}
                <a
                    href="tel:+34692580681"
                    id="nav-cta"
                    className={`hidden md:inline-flex btn-premium text-sm !py-2.5 !px-5 ${hasBackground ? 'btn-brand' : 'bg-white/10 text-white hover:bg-white hover:text-[#0071BC] backdrop-blur-md border border-white/20'}`}
                >
                    <Phone size={14} />
                    Solicitar Presupuesto
                </a>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg"
                    style={{ 
                        color: hasBackground ? 'var(--color-brand-blue)' : '#FFFFFF',
                        background: hasBackground ? 'transparent' : 'rgba(0,0,0,0.2)',
                        backdropFilter: hasBackground ? 'none' : 'blur(4px)'
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
                    {links.map((link) => {
                            const isRouter = link.href.startsWith('/')
                            const baseStyle = {
                                color: 'var(--color-text-main)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--color-border)',
                            }
                            const className = "text-base font-semibold py-2"
                            return isRouter ? (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={className}
                                    style={baseStyle}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={className}
                                    style={baseStyle}
                                >
                                    {link.label}
                                </a>
                            )
                        })}
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
