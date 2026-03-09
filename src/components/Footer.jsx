import { Phone, Mail, MapPin, Instagram, ArrowUpRight } from 'lucide-react'

export default function Footer() {
    const links = {
        'Colecciones': ['Mediterránea', 'Artesanal', 'Geométrica', 'Natural', 'Vintage'],
        'Servicios': ['Asesoramiento', 'Diseño 3D', 'Instalación', 'Presupuesto', 'Muestras'],
        'Empresa': ['Sobre nosotros', 'Showroom', 'Blog', 'Contacto', 'Trabaja con nosotros'],
    }

    return (
        <footer
            id="footer"
            className="relative px-6 md:px-16 lg:px-24 pt-24 pb-12"
            style={{
                background: 'var(--color-charcoal)',
                borderRadius: '3rem 3rem 0 0',
                marginTop: '-2rem',
            }}
        >
            <div className="max-w-[1200px] mx-auto">

                {/* Brand centered at top */}
                <div className="text-center mb-16">
                    <h3 className="font-display font-bold text-3xl text-white mb-4 tracking-tight">
                        Azulejos Valencia
                    </h3>
                    <p className="text-sm leading-relaxed max-w-md mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Venta de porcelanatos y azulejos premium. Más de 20 años transformando hogares en Valencia. Cada pieza cuenta una historia.
                    </p>

                    {/* Contact info centered */}
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <a href="tel:+34692580681" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <Phone size={14} style={{ color: 'var(--color-clay)' }} />
                            +34 692 580 681
                        </a>
                        <a href="mailto:genesis2777@gmail.com" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <Mail size={14} style={{ color: 'var(--color-clay)' }} />
                            genesis2777@gmail.com
                        </a>
                        <span className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <MapPin size={14} style={{ color: 'var(--color-clay)' }} />
                            Calle Cura Palanca 1, bajo 1, 46013 Valencia
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-12" style={{ background: 'rgba(255,255,255,0.08)' }} />

                {/* Link columns centered */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16 max-w-[700px] mx-auto text-center">
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="font-display font-semibold text-sm text-white mb-5 tracking-wide uppercase">{title}</h4>
                            <ul className="flex flex-col gap-3">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm transition-colors duration-300 hover:text-white inline-flex items-center gap-1.5 group"
                                            style={{ color: 'rgba(255,255,255,0.4)' }}
                                        >
                                            {item}
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

                {/* Bottom row */}
                <div className="flex flex-col items-center gap-4 text-center">
                    {/* System status */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: '#4ade80' }} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#4ade80' }} />
                        </span>
                        <span className="font-mono text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Sistema operativo · Activo
                        </span>
                    </div>

                    {/* Social + Copyright */}
                    <div className="flex items-center gap-5">
                        <a href="#" className="transition-opacity hover:opacity-80" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            <Instagram size={18} />
                        </a>
                        <span className="font-mono text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            © 2026 Azulejos Valencia. Todos los derechos reservados.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
