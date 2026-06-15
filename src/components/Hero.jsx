import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown, Phone, Sparkles } from 'lucide-react'

export default function Hero() {
    const sectionRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const ctaRef = useRef(null)
    const badgeRef = useRef(null)
    const overlayRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.from(overlayRef.current, {
                opacity: 0,
                duration: 1.5,
            })
                .from(badgeRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.9,
                    delay: 0.2,
                }, '-=0.8')
                .from(titleRef.current.children, {
                    opacity: 0,
                    y: 80,
                    duration: 1.2,
                    stagger: 0.2,
                }, '-=0.5')
                .from(subtitleRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.9,
                }, '-=0.6')
                .from(ctaRef.current.children, {
                    opacity: 0,
                    y: 25,
                    duration: 0.7,
                    stagger: 0.12,
                }, '-=0.5')
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative w-full overflow-hidden"
            style={{ height: '100vh', minHeight: '750px' }}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/hero_arts_sciences_1781515396279.png')`,
                    transform: 'scale(1.05)',
                }}
            />

            {/* Overlays */}
            <div ref={overlayRef}>
                {/* Subtle dark gradient from bottom and top to ensure text legibility */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)',
                }} />
                {/* Brand blue accent glow */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at 70% 80%, rgba(0,113,188,0.15) 0%, transparent 60%)',
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto mt-10">
                {/* Badge */}
                <div ref={badgeRef} className="mb-8">
                    <span
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            color: 'var(--color-brand-blue)',
                            border: '1px solid rgba(0,113,188,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Sparkles size={14} style={{ color: 'var(--color-brand-green)' }} />
                        Inspiración Mediterránea
                    </span>
                </div>

                {/* Title */}
                <h1 ref={titleRef} className="mb-8 max-w-5xl">
                    <span
                        className="block font-sans font-light text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
                        style={{ color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                    >
                        Diseñamos espacios
                    </span>
                    <span
                        className="block font-display italic font-bold text-5xl md:text-7xl lg:text-[6rem] leading-[1.05] mt-2"
                        style={{ color: 'var(--color-brand-green-light)', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                    >
                        claros y modernos
                    </span>
                    <span
                        className="block font-sans font-medium text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mt-2"
                        style={{ color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                    >
                        para tu vida.
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-base md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                    style={{ color: '#F0F4F8', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                    Inspirados en la luz de Valencia. Cerámica, porcelanatos y diseño de interiores que transforman la arquitectura en arte puro.
                </p>

                {/* CTA row */}
                <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
                    <a href="#spaces" className="btn-premium btn-brand">
                        Nuestros Espacios
                        <ArrowDown size={16} />
                    </a>
                    <a href="tel:+34692580681" className="btn-premium bg-white text-[var(--color-brand-blue)] hover:bg-gray-50 border border-transparent">
                        <Phone size={16} />
                        Contáctanos
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-white shadow-sm">
                    Descubrir
                </span>
                <div className="w-px h-12 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)' }}>
                    <div
                        className="absolute w-full h-4"
                        style={{
                            background: 'linear-gradient(180deg, #FFFFFF, transparent)',
                            animation: 'scrollPulse 2s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes scrollPulse {
                    0%, 100% { transform: translateY(-100%); opacity: 0; }
                    50% { transform: translateY(200%); opacity: 1; }
                }
            `}</style>
        </section>
    )
}
