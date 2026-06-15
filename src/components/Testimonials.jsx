import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        name: 'María García López',
        role: 'Propietaria · Villa en Godella',
        text: 'Transformaron nuestra piscina en un verdadero oasis. El equipo entendió nuestra visión desde el primer momento. Los mosaicos vítreos que eligieron capturan la luz de una manera mágica. Cada día que disfrutamos de nuestra terraza, sabemos que tomamos la mejor decisión.',
        rating: 5,
        project: 'Piscina infinity + zona wet deck',
    },
    {
        name: 'Carlos Martínez Ruiz',
        role: 'Arquitecto · Estudio CM',
        text: 'Como profesional del diseño, soy extremadamente exigente con los materiales. Azulejos Valencia superó todas mis expectativas. La calidad del porcelánico italiano que me proporcionaron para el proyecto de reforma integral fue excepcional. Son mi proveedor de confianza.',
        rating: 5,
        project: 'Reforma integral residencia de lujo',
    },
    {
        name: 'Laura Fernández Díaz',
        role: 'Propietaria · Ático en Ensanche',
        text: 'Soñaba con un baño que fuera mi santuario personal y lo lograron. El mármol Calacatta combinado con los mosaicos de piedra natural creó un espacio que parece sacado de una revista. El servicio fue impecable de principio a fin.',
        rating: 5,
        project: 'Baño spa con mármol italiano',
    },
]

export default function Testimonials() {
    const sectionRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
    const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    useEffect(() => {
        const interval = setInterval(next, 6000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonial-section', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const t = testimonials[activeIndex]

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="py-24 md:py-36 px-6 md:px-12 lg:px-24 overflow-hidden"
            style={{ background: 'var(--color-bg-alt)' }}
        >
            <div className="testimonial-section max-w-[1000px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="section-tag justify-center mb-6">
                        Testimonios
                    </div>
                    <h2
                        className="font-display text-4xl md:text-5xl tracking-tight"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Lo que dicen{' '}
                        <span className="italic" style={{ color: 'var(--color-brand-blue)' }}>
                            nuestros clientes
                        </span>
                    </h2>
                </div>

                {/* Testimonial card */}
                <div
                    className="relative p-8 md:p-14 rounded-3xl text-center shadow-xl bg-white"
                    style={{
                        border: '1px solid var(--color-border)',
                    }}
                >
                    {/* Quote icon */}
                    <div className="flex justify-center mb-8">
                        <Quote
                            size={40}
                            style={{ color: 'rgba(38,194,129,0.3)' }}
                        />
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-8">
                        {[...Array(t.rating)].map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                fill="var(--color-brand-green)"
                                style={{ color: 'var(--color-brand-green)' }}
                            />
                        ))}
                    </div>

                    {/* Quote text */}
                    <p
                        className="font-display text-xl md:text-3xl leading-relaxed mb-10 max-w-3xl mx-auto italic font-medium"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        "{t.text}"
                    </p>

                    {/* Divider */}
                    <div
                        className="w-16 h-1 mx-auto mb-8 rounded-full"
                        style={{ background: 'var(--color-brand-blue)' }}
                    />

                    {/* Author */}
                    <h4
                        className="font-display text-xl font-bold mb-1"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        {t.name}
                    </h4>
                    <p
                        className="text-sm font-semibold mb-2"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {t.role}
                    </p>
                    <p
                        className="text-xs font-mono font-bold tracking-wider uppercase"
                        style={{ color: 'var(--color-brand-blue)' }}
                    >
                        {t.project}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-6 mt-10">
                        <button
                            onClick={prev}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm bg-white"
                            style={{
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                                e.currentTarget.style.color = 'var(--color-brand-blue)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                                e.currentTarget.style.color = 'var(--color-text-main)'
                            }}
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className="transition-all duration-300 cursor-pointer rounded-full border-none shadow-sm"
                                    style={{
                                        width: i === activeIndex ? '24px' : '8px',
                                        height: '8px',
                                        background: i === activeIndex
                                            ? 'var(--color-brand-blue)'
                                            : '#E5E7EB',
                                        borderRadius: '4px',
                                    }}
                                    aria-label={`Testimonio ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm bg-white"
                            style={{
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                                e.currentTarget.style.color = 'var(--color-brand-blue)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                                e.currentTarget.style.color = 'var(--color-text-main)'
                            }}
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
