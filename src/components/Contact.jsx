import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-item', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="py-24 md:py-36 px-6 md:px-12 lg:px-24"
            style={{ background: 'var(--color-bg-surface)', padding: '6px' }}
        >
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="section-tag justify-center mb-6">
                        Contacto
                    </div>
                    <h2
                        className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Visítanos o{' '}
                        <span className="italic" style={{ color: 'var(--color-brand-blue)' }}>
                            contáctanos
                        </span>
                    </h2>
                    <p
                        className="text-base md:text-lg max-w-lg mx-auto leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Estamos listos para ayudarte a crear el espacio de tus sueños. Ven a conocer nuestro showroom o llámanos para una asesoría personalizada.
                    </p>
                </div>

                {/* Content grid */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">

                    {/* Map */}
                    <div
                        className="contact-item overflow-hidden rounded-3xl shadow-md"
                        style={{
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <iframe
                            title="Ubicación Azulejos Valencia"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.0!2d-0.3763!3d39.4600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCalle+Cura+Palanca+1%2C+46013+Valencia!5e0!3m2!1ses!2ses!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '350px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="md:!min-h-[500px]"
                        />
                    </div>

                    {/* Contact info cards */}
                    <div className="flex flex-col gap-4">
                        {/* Address */}
                        <div
                            className="contact-item bg-white p-6 lg:p-8 flex items-start gap-5 flex-1 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                            style={{ border: '1px solid var(--color-border)', padding: '12px' }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: 'rgba(38,194,129,0.1)',
                                    color: 'var(--color-brand-green)',
                                }}
                            >
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h4
                                    className="font-display font-bold text-lg mb-1"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Dirección
                                </h4>
                                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                    Calle Cura Palanca 1, bajo 1<br />
                                    46013 Valencia, España
                                </p>
                                <a
                                    href="https://www.google.com/maps/search/Calle+Cura+Palanca+1+46013+Valencia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm font-bold mt-3 transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--color-brand-blue)', textDecoration: 'none' }}
                                >
                                    Cómo llegar <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        {/* Opening hours */}
                        <div
                            className="contact-item bg-white p-6 lg:p-8 flex items-start gap-5 flex-1 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                            style={{ border: '1px solid var(--color-border)', padding: '12px' }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: 'rgba(38,194,129,0.1)',
                                    color: 'var(--color-brand-green)',
                                }}
                            >
                                <Clock size={22} />
                            </div>
                            <div className="flex-1">
                                <h4
                                    className="font-display font-bold text-lg mb-3"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Horarios
                                </h4>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="font-semibold">Lunes — Sábado</span>
                                        <span className="font-bold text-gray-800">10:00 — 16:00</span>
                                    </div>
                                    <div className="flex justify-between gap-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="font-semibold">Domingo</span>
                                        <span className="font-bold" style={{ color: 'var(--color-text-light)' }}>Cerrado</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <a
                            href="tel:+34692580681"
                            className="contact-item bg-white p-6 lg:p-8 flex items-start gap-5 flex-1 rounded-3xl shadow-sm hover:shadow-lg transition-shadow group"
                            style={{ border: '1px solid var(--color-border)', textDecoration: 'none', padding: '12px' }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                                style={{
                                    background: 'var(--color-brand-blue)',
                                    color: '#FFFFFF',
                                }}
                            >
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4
                                    className="font-display font-bold text-lg mb-1"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Teléfono
                                </h4>
                                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                    +34 692 580 681
                                </p>
                                <span
                                    className="text-sm font-bold mt-2 inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                                    style={{ color: 'var(--color-brand-blue)' }}
                                >
                                    Llámanos ahora <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:genesis2777@gmail.com"
                            className="contact-item bg-white p-6 lg:p-8 flex items-start gap-5 flex-1 rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
                            style={{ border: '1px solid var(--color-border)', textDecoration: 'none', padding: '12px' }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: 'rgba(38,194,129,0.1)',
                                    color: 'var(--color-brand-green)',
                                }}
                            >
                                <Mail size={22} />
                            </div>
                            <div>
                                <h4
                                    className="font-display font-bold text-lg mb-1"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    Correo electrónico
                                </h4>
                                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                    genesis2777@gmail.com
                                </p>
                                <span
                                    className="text-sm font-bold mt-2 inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                                    style={{ color: 'var(--color-brand-blue)' }}
                                >
                                    Escríbenos <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
