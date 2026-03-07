import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown, Phone } from 'lucide-react'

export default function Hero() {
    const sectionRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const ctaRef = useRef(null)
    const badgeRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.from(badgeRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.3,
            })
                .from(titleRef.current.children, {
                    opacity: 0,
                    y: 60,
                    duration: 1,
                    stagger: 0.15,
                }, '-=0.4')
                .from(subtitleRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                }, '-=0.5')
                .from(ctaRef.current.children, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    stagger: 0.1,
                }, '-=0.4')
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative w-full overflow-hidden"
            style={{ height: '100dvh', minHeight: '700px' }}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80')`,
                }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(46,64,54,0.65) 0%, rgba(26,26,26,0.85) 100%)',
            }} />
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(46,64,54,0.4) 0%, transparent 60%)',
            }} />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
                {/* Badge */}
                <div ref={badgeRef} className="mb-6">
                    <span
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide"
                        style={{
                            background: 'rgba(204,88,51,0.15)',
                            color: '#CC5833',
                            border: '1px solid rgba(204,88,51,0.25)',
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CC5833] animate-pulse" />
                        Porcelanatos y azulejos · Colección 2026
                    </span>
                </div>

                {/* Title */}
                <h1 ref={titleRef} className="tracking-tighter mb-6 max-w-4xl">
                    <span className="block font-display font-extrabold text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05]">
                        Tu hogar merece
                    </span>
                    <span
                        className="block font-serif italic text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] mt-1"
                        style={{ color: 'var(--color-clay)' }}
                    >
                        excelencia
                    </span>
                    <span className="block font-display font-extrabold text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] mt-1">
                        en cada detalle.
                    </span>
                </h1>

                {/* Subtitle */}
                <p ref={subtitleRef} className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Venta de porcelanatos y azulejos artesanales que transforman espacios ordinarios en experiencias extraordinarias. Más de 20 años vistiendo hogares en Valencia.
                </p>

                {/* CTA row */}
                <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
                    <a href="tel:+34692580681" className="btn-magnetic btn-clay">
                        <Phone size={18} />
                        Llámanos ahora
                    </a>
                    <a href="#features" className="btn-magnetic btn-outline !border-white/20 !text-white hover:!bg-white/10">
                        Explorar colecciones
                        <ArrowDown size={16} />
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                <span className="text-white text-[10px] font-mono tracking-widest uppercase">Scroll</span>
                <div className="w-px h-8 bg-white/30 relative overflow-hidden">
                    <div className="absolute w-full h-3 bg-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
            </div>
        </section>
    )
}
