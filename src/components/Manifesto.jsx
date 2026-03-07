import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
    const sectionRef = useRef(null)
    const line1Ref = useRef(null)
    const line2Ref = useRef(null)
    const line3Ref = useRef(null)
    const dividerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                    end: 'center center',
                    scrub: false,
                    toggleActions: 'play none none reverse',
                },
            })

            tl.from(line1Ref.current, {
                opacity: 0,
                y: 80,
                duration: 0.9,
                ease: 'power3.out',
            })
                .from(dividerRef.current, {
                    scaleX: 0,
                    duration: 0.6,
                    ease: 'power2.inOut',
                }, '-=0.3')
                .from(line2Ref.current, {
                    opacity: 0,
                    y: 80,
                    duration: 0.9,
                    ease: 'power3.out',
                }, '-=0.3')
                .from(line3Ref.current, {
                    opacity: 0,
                    y: 40,
                    duration: 0.7,
                    ease: 'power3.out',
                }, '-=0.3')
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="manifesto"
            className="relative py-32 md:py-48 px-6 md:px-16 lg:px-24 overflow-hidden"
            style={{ background: 'var(--color-charcoal)' }}
        >
            {/* Background texture with parallax feel */}
            <div
                className="absolute inset-0 opacity-15 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80')`,
                    backgroundAttachment: 'fixed',
                }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.9) 100%)' }} />

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] mx-auto text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-mono text-m tracking-[0.3em] uppercase block mb-12" style={{ color: 'var(--color-clay)', margin: '50px' }}>
                    Manifiesto
                </span>

                <h2 ref={line1Ref} className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.1] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Tú lo imaginas
                </h2>

                <div ref={dividerRef} className="w-24 h-px mx-auto my-8" style={{ background: 'var(--color-clay)' }} />

                <h2 ref={line2Ref} className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.1] mb-6" style={{ color: '#fff' }}>
                    Nosotros lo hacemos{' '}
                    <span className="font-serif italic font-normal" style={{ color: 'var(--color-clay)' }}>realidad</span>
                </h2>

                <p ref={line3Ref} className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '100px' }}>
                    Desde el primer boceto hasta la última pieza colocada. Porcelanatos y azulejos que crean el escenario perfecto de tu vida cotidiana.
                </p>
            </div>
        </section>
    )
}
