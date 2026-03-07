import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Phone, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const plans = [
    {
        name: 'Esencial',
        price: '29',
        unit: '/ m²',
        description: 'Para renovaciones puntuales y espacios pequeños.',
        highlighted: false,
        features: [
            'Azulejo cerámico estándar',
            'Asesoramiento básico',
            'Presupuesto en 48h',
            'Entrega a domicilio',
            'Garantía de 5 años',
        ],
    },
    {
        name: 'Premium',
        price: '59',
        unit: '/ m²',
        description: 'La elección perfecta para reformas completas con diseño a medida.',
        highlighted: true,
        badge: 'Más popular',
        features: [
            'Porcelánico premium',
            'Diseño 3D personalizado',
            'Presupuesto en 24h',
            'Instalación profesional',
            'Garantía de 15 años',
            'Asesor dedicado',
            'Muestras a domicilio',
        ],
    },
    {
        name: 'Boutique',
        price: '120',
        unit: '/ m²',
        description: 'Para proyectos de alto nivel que exigen materiales exclusivos.',
        highlighted: false,
        features: [
            'Piezas artesanales únicas',
            'Proyecto de interiorismo',
            'Presupuesto inmediato',
            'Instalación con supervisor',
            'Garantía de por vida',
            'Atención 24/7',
            'Colecciones exclusivas',
        ],
    },
]

export default function Pricing() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.pricing-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
                y: 80,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="pricing" className="py-24 md:py-36 px-6 md:px-16 lg:px-24" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="font-mono text-xs tracking-widest uppercase block mb-4" style={{ color: 'var(--color-clay)' }}>
                        Planes
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter mb-4" style={{ color: 'var(--color-charcoal)' }}>
                        Invierte en{' '}
                        <span className="font-serif italic font-normal" style={{ color: 'var(--color-moss)' }}>calidad</span>
                    </h2>
                    <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(26,26,26,0.5)' }}>
                        Cada plan incluye asesoramiento personalizado. Sin sorpresas, sin letras pequeñas.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className="pricing-card relative rounded-3xl p-8 flex flex-col transition-transform duration-300 hover:-translate-y-1"
                            style={{
                                background: plan.highlighted ? 'var(--color-moss)' : '#fff',
                                border: plan.highlighted ? 'none' : '1px solid rgba(0,0,0,0.06)',
                                boxShadow: plan.highlighted ? '0 20px 60px rgba(46,64,54,0.25)' : '0 4px 20px rgba(0,0,0,0.04)',
                            }}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--color-clay)', color: '#fff' }}>
                                        <Star size={12} fill="currentColor" />
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            {/* Plan name */}
                            <h3
                                className="font-display font-bold text-lg mb-2"
                                style={{ color: plan.highlighted ? '#fff' : 'var(--color-charcoal)' }}
                            >
                                {plan.name}
                            </h3>
                            <p className="text-sm mb-6" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : 'rgba(26,26,26,0.5)' }}>
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="font-display font-extrabold text-4xl tracking-tight" style={{ color: plan.highlighted ? '#fff' : 'var(--color-charcoal)' }}>
                                    {plan.price}€
                                </span>
                                <span className="font-mono text-sm" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,26,0.4)' }}>
                                    {plan.unit}
                                </span>
                            </div>

                            {/* Features */}
                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,26,0.7)' }}>
                                        <Check size={16} className="flex-shrink-0" style={{ color: plan.highlighted ? 'var(--color-clay)' : 'var(--color-moss)' }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <a
                                href="tel:+34960000000"
                                className={`btn-magnetic w-full text-center ${plan.highlighted ? 'btn-clay' : 'btn-outline'}`}
                            >
                                <Phone size={16} />
                                Contactar
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
