import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── SVG Animation 1: Double Helix ──────────────────── */
function DoubleHelix() {
    const svgRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(svgRef.current, {
                rotation: 360,
                duration: 12,
                repeat: -1,
                ease: 'none',
                transformOrigin: 'center center',
            })
        })
        return () => ctx.revert()
    }, [])

    return (
        <svg ref={svgRef} width="120" height="120" viewBox="0 0 120 120" className="opacity-20">
            <circle cx="60" cy="60" r="45" fill="none" stroke="var(--color-clay)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="60" cy="60" r="30" fill="none" stroke="var(--color-cream)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="60" cy="60" r="55" fill="none" stroke="var(--color-moss)" strokeWidth="0.8" strokeDasharray="12 4" />
            <line x1="20" y1="60" x2="100" y2="60" stroke="var(--color-clay)" strokeWidth="0.5" opacity="0.5" />
            <line x1="60" y1="20" x2="60" y2="100" stroke="var(--color-clay)" strokeWidth="0.5" opacity="0.5" />
        </svg>
    )
}

/* ─── SVG Animation 2: Laser Grid ────────────────────── */
function LaserGrid() {
    const lineRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(lineRef.current, {
                attr: { y1: 0, y2: 0 },
                yoyo: true,
                repeat: -1,
                duration: 2,
                ease: 'power1.inOut',
            })
        })
        return () => ctx.revert()
    }, [])

    return (
        <svg width="160" height="100" viewBox="0 0 160 100" className="opacity-25">
            {/* Grid lines */}
            {[...Array(9)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 12.5} x2="160" y2={i * 12.5} stroke="var(--color-moss)" strokeWidth="0.5" opacity="0.3" />
            ))}
            {[...Array(13)].map((_, i) => (
                <line key={`v${i}`} x1={i * 13.3} y1="0" x2={i * 13.3} y2="100" stroke="var(--color-moss)" strokeWidth="0.5" opacity="0.3" />
            ))}
            {/* Scanner line */}
            <line ref={lineRef} x1="0" y1="100" x2="160" y2="100" stroke="var(--color-clay)" strokeWidth="2" opacity="0.8">
            </line>
            <rect x="0" y="0" width="160" height="100" fill="none" stroke="var(--color-cream)" strokeWidth="1" opacity="0.2" />
        </svg>
    )
}

/* ─── SVG Animation 3: Waveform ──────────────────────── */
function Waveform() {
    const pathRef = useRef(null)

    useEffect(() => {
        let frame
        let offset = 0
        const animate = () => {
            offset += 0.03
            const points = []
            for (let i = 0; i <= 160; i += 2) {
                const y = 50 + Math.sin((i * 0.04) + offset) * 25 * Math.sin(i * 0.02 + offset * 0.5)
                points.push(`${i},${y}`)
            }
            if (pathRef.current) {
                pathRef.current.setAttribute('points', points.join(' '))
            }
            frame = requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <svg width="160" height="100" viewBox="0 0 160 100" className="opacity-30">
            <polyline ref={pathRef} fill="none" stroke="var(--color-clay)" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="50" x2="160" y2="50" stroke="var(--color-cream)" strokeWidth="0.5" opacity="0.2" />
        </svg>
    )
}

/* ─── Archive Cards ─────────────────────────────────── */
const archiveCards = [
    {
        title: 'Colección Mediterránea',
        subtitle: 'Inspirada en las costas de Valencia',
        description: 'Tonos azules, blancos y arena que capturan la esencia del mar Mediterráneo. Diseñada para baños y cocinas que respiran tranquilidad.',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
        Animation: DoubleHelix,
        tag: 'ARQ_001',
    },
    {
        title: 'Serie Artesanal',
        subtitle: 'El valor de lo hecho a mano',
        description: 'Cada pieza lleva la huella del artesano. Texturas irregulares y esmaltes únicos que convierten cada pared en una obra de arte irrepetible.',
        image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
        Animation: LaserGrid,
        tag: 'ARQ_002',
    },
    {
        title: 'Línea Geométrica',
        subtitle: 'Precisión contemporánea',
        description: 'Patrones geométricos de vanguardia con acabados mate y brillo. Para espacios que buscan identidad y carácter con una estética minimal.',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80',
        Animation: Waveform,
        tag: 'ARQ_003',
    },
]

export default function Archive() {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, i) => {
                if (!card) return

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    end: 'bottom top',
                    pin: i < archiveCards.length - 1,
                    pinSpacing: false,
                    onUpdate: (self) => {
                        const nextCard = cardsRef.current[i + 1]
                        if (nextCard) {
                            const progress = self.progress
                            gsap.set(card, {
                                scale: 1 - progress * 0.1,
                                filter: `blur(${progress * 20}px)`,
                                opacity: 1 - progress * 0.5,
                            })
                        }
                    },
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="archive" className="relative">
            {/* Section label */}
            <div className="text-center py-16 md:py-24" style={{ background: 'var(--color-cream)', marginTop: '50px' }}>
                <span className="font-mono text-m tracking-widest uppercase" style={{ color: 'var(--color-clay)', marginTop: '100px' }}>
                    Galeria
                </span>
                <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter mt-4" style={{ color: 'var(--color-charcoal)', marginBottom: '50px' }}>
                    Colecciones que{' '}
                    <span className="font-serif italic font-normal" style={{ color: 'var(--color-moss)' }}>inspiran</span>
                </h2>
            </div>

            {/* Stacked cards */}
            {archiveCards.map((card, i) => {
                const Animation = card.Animation
                return (
                    <div
                        key={i}
                        ref={(el) => (cardsRef.current[i] = el)}
                        className="relative w-full overflow-hidden"
                        style={{ height: '100vh', minHeight: '600px', padding: '20px' }}
                    >
                        {/* Background image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${card.image}')` }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 50%, rgba(26,26,26,0.6) 100%)' }} />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-[1400px] mx-auto">
                            <div className="flex items-end justify-between gap-8 flex-wrap" >
                                <div className="max-w-xl" >

                                    <h3 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter text-white mb-2">
                                        {card.title}
                                    </h3>
                                    <p className="font-serif italic text-lg mb-4" style={{ color: 'var(--color-clay)' }}>
                                        {card.subtitle}
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {card.description}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Animation />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}
