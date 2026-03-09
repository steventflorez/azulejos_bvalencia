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
            className="py-24 md:py-36"
            style={{ background: 'var(--color-cream)', paddingInline: '1rem', marginBottom: '6rem', marginTop: '3rem' }}
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <span className="font-mono text-m tracking-widest uppercase mb-4 mt-4 block" style={{ color: 'var(--color-clay)' }}>
                        Contacto
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter mb-5" style={{ color: 'var(--color-charcoal)' }}>
                        Visítanos o{' '}
                        <span className="font-serif italic font-normal" style={{ color: 'var(--color-moss)' }}>contáctanos</span>
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(26,26,26,0.55)' }}>
                        Estamos aquí para ayudarte a encontrar los porcelanatos y azulejos perfectos para tu proyecto.
                    </p>
                </div>

                {/* Content grid */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch w-full">

                    {/* Map */}
                    <div className="contact-item overflow-hidden rounded-3xl" style={{ border: '1px solid rgba(0,0,0,0.06)', minHeight: '500px' }}>
                        <iframe
                            title="Ubicación Azulejos Valencia"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.0!2d-0.3763!3d39.4600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCalle+Cura+Palanca+1%2C+46013+Valencia!5e0!3m2!1ses!2ses!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '500px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Contact info cards */}
                    <div className="flex flex-col gap-4">
                        {/* Address */}
                        <div
                            className="contact-item rounded-3xl p-6 lg:p-8 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 flex-1"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '1rem' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-moss)', color: '#fff' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-base mb-1" style={{ color: 'var(--color-charcoal)' }}>Dirección</h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,26,26,0.55)' }}>
                                    Calle Cura Palanca 1, bajo 1<br />
                                    46013 Valencia, España
                                </p>
                                <a
                                    href="https://www.google.com/maps/search/Calle+Cura+Palanca+1+46013+Valencia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm font-medium mt-2 transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--color-clay)' }}
                                >
                                    Cómo llegar <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        {/* Opening hours */}
                        <div
                            className="contact-item rounded-3xl p-6 lg:p-8 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 flex-1"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '1rem' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-moss)', color: '#fff' }}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-base mb-1" style={{ color: 'var(--color-charcoal)' }}>Horarios</h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,26,26,0.55)' }}>
                                    De lunes a jueves:
                                    <br />
                                    10:00 am - 4:00 pm y 5:00 pm - 7:00 pm
                                    <br />
                                    Viernes:
                                    <br />
                                    10:00 am - 3:00 pm
                                    <br />
                                    Sábados y domingos: Cerrado
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <a
                            href="tel:+34692580681"
                            className="contact-item rounded-3xl p-6 lg:p-8 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 flex-1"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textDecoration: 'none', padding: '1rem' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-clay)', color: '#fff' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-base mb-1" style={{ color: 'var(--color-charcoal)' }}>Teléfono</h4>
                                <p className="text-sm" style={{ color: 'rgba(26,26,26,0.55)' }}>+34 692 580 681</p>
                                <span className="text-sm font-medium mt-1 block" style={{ color: 'var(--color-clay)' }}>
                                    Llámanos ahora →
                                </span>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:genesis2777@hotmail.com"
                            className="contact-item rounded-3xl p-6 lg:p-8 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 flex-1"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textDecoration: 'none', padding: '1rem' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-moss)', color: '#fff' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-base mb-1" style={{ color: 'var(--color-charcoal)' }}>Correo electrónico</h4>
                                <p className="text-sm" style={{ color: 'rgba(26,26,26,0.55)' }}>genesis2777@gmail.com</p>
                                <span className="text-sm font-medium mt-1 block" style={{ color: 'var(--color-clay)' }}>
                                    Escríbenos →
                                </span>
                            </div>
                        </a>


                    </div>
                </div>


            </div>
        </section>
    )
}
