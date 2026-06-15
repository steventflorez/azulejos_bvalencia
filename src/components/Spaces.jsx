import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const spaces = [
    {
        title: 'Piscinas de Lujo',
        subtitle: 'Donde el agua se convierte en arte',
        description: 'Mosaicos vítreos, gresite premium y porcelánicos antideslizantes para piscinas infinity, spas privados y zonas wet deck. Cada azulejo seleccionado para resistir el tiempo y deslumbrar bajo el sol mediterráneo.',
        image: '/images/space-pool.png',
        features: ['Gresite vítreo premium', 'Antideslizante certificado', 'Resistencia UV garantizada'],
    },
    {
        title: 'Cocinas de Diseño',
        subtitle: 'El corazón de tu hogar, elevado',
        description: 'Backsplash artesanales, porcelánicos de gran formato y cerámicas con carácter. Creamos cocinas que inspiran a vivir, compartir y disfrutar con acabados que combinan belleza y funcionalidad.',
        image: '/images/space-kitchen.png',
        features: ['Porcelánico gran formato', 'Acabados artesanales', 'Fácil mantenimiento'],
    },
    {
        title: 'Baños Exclusivos',
        subtitle: 'Tu santuario personal',
        description: 'Mármoles italianos, mosaicos de piedra natural y cerámicas texturizadas para baños que se convierten en experiencias sensoriales. Duchas rain, bañeras freestanding y paredes que cuentan historias.',
        image: '/images/space-bathroom.png',
        features: ['Mármol Calacatta', 'Piedra natural', 'Diseño personalizado'],
    },
]

export default function Spaces() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.space-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 20%',
                    },
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    delay: i * 0.15,
                    ease: 'power3.out',
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="spaces"
            className="pt-40 pb-24 md:pt-48 md:pb-36 px-4 sm:px-6 md:px-12 lg:px-24 container mx-auto"
            style={{ background: 'var(--color-bg-surface)', paddingLeft: '6px', paddingRight: '6px' }}
        >
            <div className="max-w-[1200px] mx-auto">
                {/* Section header */}
                <div className="text-center mb-24">
                    <div className="section-tag justify-center mb-6">
                        Espacios exclusivos
                    </div>
                    <h2
                        className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Creamos espacios que{' '}
                        <span className="italic" style={{ color: 'var(--color-brand-blue)' }}>
                            transforman vidas
                        </span>
                    </h2>
                    <p
                        className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Cada proyecto es una oportunidad para crear algo extraordinario.
                        Descubre cómo nuestros azulejos elevan los espacios más exigentes.
                    </p>
                </div>

                {/* Space cards */}
                <div className="flex flex-col gap-16">
                    {spaces.map((space, i) => (
                        <div
                            key={i}
                            className={`space-card grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl`}
                            style={{
                                background: 'var(--color-bg-primary)',
                                border: '1px solid var(--color-border)',
                                minHeight: '480px',
                            }}
                        >
                            {/* Image */}
                            <div
                                className={`img-zoom relative ${i % 2 === 1 ? 'md:order-2' : ''}`}
                                style={{ borderRadius: 0, minHeight: '350px' }}
                            >
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    className="w-full h-full object-cover"
                                    style={{ minHeight: '350px' }}
                                    loading="lazy"
                                />
                                {/* Overlay gradient for mobile readability if needed, though light theme might not need it as much */}
                            </div>

                            {/* Content */}
                            <div
                                className={`flex flex-col justify-center items-center text-center p-8 md:p-14 lg:p-20 min-w-0 ${i % 2 === 1 ? 'md:order-1' : ''}`}
                            >
                                <div className="mb-6 flex flex-col items-center justify-center">

                                    <span
                                        className="font-mono font-semibold text-[11px] md:text-xs tracking-widest uppercase text-center w-full"
                                        style={{ color: 'var(--color-brand-green)', marginTop: '10px', marginBottom: '10px' }}
                                    >
                                        {space.subtitle}
                                    </span>
                                </div>

                                <h3
                                    className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 "
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {space.title}
                                </h3>

                                <p
                                    className="text-base md:text-lg leading-relaxed mb-10 max-w-md px-4"
                                    style={{ color: 'var(--color-text-muted)', marginBottom: '20px', padding: '6px' }}
                                >
                                    {space.description}
                                </p>


                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
