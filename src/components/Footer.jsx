import { Phone, Mail, MapPin, Instagram, Facebook, Globe } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
    return (
        <footer
            className="pt-24 pb-8 px-6 md:px-12 lg:px-24"
            style={{
                background: 'var(--color-bg-primary)',
                borderTop: '1px solid var(--color-border)',
            }}
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-center">
                    {/* Brand column */}
                    <div className="flex flex-col items-center">
                        <div className="mb-6">
                            <Logo width={50} height={75} />
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                                    e.currentTarget.style.color = 'var(--color-brand-blue)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)'
                                    e.currentTarget.style.color = 'var(--color-text-main)'
                                }}
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                                    e.currentTarget.style.color = 'var(--color-brand-blue)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)'
                                    e.currentTarget.style.color = 'var(--color-text-main)'
                                }}
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                                    e.currentTarget.style.color = 'var(--color-brand-blue)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)'
                                    e.currentTarget.style.color = 'var(--color-text-main)'
                                }}
                                aria-label="Web"
                            >
                                <Globe size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="flex flex-col items-center">
                        <h4
                            className="font-display font-bold text-lg mb-6"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            Espacios
                        </h4>
                        <ul className="flex flex-col items-center gap-4">
                            <li>
                                <a href="#spaces" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Piscinas de Lujo</a>
                            </li>
                            <li>
                                <a href="#spaces" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Cocinas de Diseño</a>
                            </li>
                            <li>
                                <a href="#spaces" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Baños Exclusivos</a>
                            </li>
                            <li>
                                <a href="#gallery" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Galería</a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="flex flex-col items-center">
                        <h4
                            className="font-display font-bold text-lg mb-6"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            Servicios
                        </h4>
                        <ul className="flex flex-col items-center gap-4">
                            <li>
                                <a href="#" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Asesoramiento Premium</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Diseño Personalizado</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Instalación Profesional</a>
                            </li>
                            <li>
                                <a href="#whyus" className="text-sm transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Garantía Azulejos Valencia</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div className="flex flex-col items-center">
                        <h4
                            className="font-display font-bold text-lg mb-6"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            Contacto
                        </h4>
                        <ul className="flex flex-col items-center gap-4">
                            <li>
                                <a
                                    href="tel:+34692580681"
                                    className="flex items-center justify-center gap-3 text-sm transition-colors duration-300 group"
                                    style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    <Phone size={16} className="text-[#0071BC]" />
                                    <span>+34 692 580 681</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:genesis2777@gmail.com"
                                    className="flex items-center justify-center gap-3 text-sm transition-colors duration-300 group"
                                    style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    <Mail size={16} className="text-[#0071BC]" />
                                    <span>genesis2777@gmail.com</span>
                                </a>
                            </li>
                            <li className="flex flex-col items-center justify-center gap-2 text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                                <MapPin size={16} className="text-[#0071BC] flex-shrink-0" />
                                <span className="text-center">
                                    Calle Cura Palanca 1, bajo 1<br />
                                    46013 Valencia, España
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-8 flex flex-col justify-center items-center gap-6 text-center"
                    style={{ borderTop: '1px solid var(--color-border)' }}
                >
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text-light)' }}>
                        © {new Date().getFullYear()} Azulejos Valencia. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs font-semibold transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>
                            Aviso Legal
                        </a>
                        <a href="#" className="text-xs font-semibold transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>
                            Política de Privacidad
                        </a>
                        <a href="#" className="text-xs font-semibold transition-colors duration-300 hover:text-[#0071BC]" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
