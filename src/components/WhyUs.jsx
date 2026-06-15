import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, Shield, Palette, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
    { value: 200, suffix: '+', label: 'Proyectos realizados' },
    { value: 5, suffix: '+', label: 'Años de experiencia' },
    { value: 15000, suffix: '', label: 'm² instalados' },
    { value: 100, suffix: '%', label: 'Clientes satisfechos' },
]

const values = [
    {
        icon: <Palette size={24} />,
        title: 'Diseño a Medida',
        description: 'Cada espacio es único. Creamos composiciones personalizadas que reflejan tu visión y estilo de vida.',
    },
    {
        icon: <Award size={24} />,
        title: 'Materiales Exclusivos',
        description: 'Trabajamos con las mejores marcas italianas y españolas. Porcelánicos, mármoles y mosaicos de primera línea.',
    },
    {
        icon: <Users size={24} />,
        title: 'Equipo Certificado',
        description: 'Instaladores profesionales con más de 15 años de experiencia en proyectos residenciales y comerciales de alto nivel.',
    },
    {
        icon: <Shield size={24} />,
        title: 'Garantía Total',
        description: 'Respaldamos cada proyecto con garantía extendida. Tu tranquilidad es nuestra prioridad absoluta.',
    },
]

function AnimatedCounter({ value, suffix }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    let start = 0
                    const duration = 2000
                    const startTime = performance.now()

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setCount(Math.floor(eased * value))
                        if (progress < 1) requestAnimationFrame(animate)
                    }
                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.3 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [value])

    const formatted = value >= 1000
        ? count.toLocaleString('es-ES')
        : count

    return (
        <span ref={ref}>
            {formatted}{suffix}
        </span>
    )
}

export default function WhyUs() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.value-card', {
                scrollTrigger: {
                    trigger: '.values-grid',
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="whyus"
            className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 overflow-hidden"
            style={{ background: 'var(--color-bg-alt)', marginTop: '20px' }}
        >
            {/* Decorative brand gradient */}
            <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                    background: 'linear-gradient(90deg, transparent, var(--color-brand-blue), var(--color-brand-green), transparent)',
                    opacity: 0.5
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 20% 50%, rgba(0,113,188,0.03) 0%, transparent 60%)',
                }}
            />

            <div className="relative z-10 max-w-[1200px] mx-auto">
                {/* Section header */}
                <div className="text-center mb-20">
                    <div className="section-tag justify-center mb-6">
                        Por qué elegirnos
                    </div>
                    <h2
                        className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Más de dos décadas{' '}
                        <span className="italic" style={{ color: 'var(--color-brand-blue)' }}>
                            creando excelencia
                        </span>
                    </h2>
                    <p
                        className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--color-text-muted)', marginBottom: '20px', padding: '6px' }}
                    >
                        No vendemos azulejos. Creamos experiencias. Cada pieza que seleccionamos cuenta
                        una historia de calidad, diseño y pasión por los detalles.
                    </p>
                </div>

                {/* Stats row */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 md:p-12 rounded-3xl bg-white shadow-lg"
                    style={{
                        border: '1px solid var(--color-border)',
                    }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div
                                className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-2"
                                style={{ color: 'var(--color-brand-green)' }}
                            >
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p
                                className="text-sm font-semibold"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    )
}
