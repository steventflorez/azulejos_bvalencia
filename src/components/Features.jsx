import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Calendar, Target, TrendingUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ─── Feature 1: Diagnostic Card Deck ─────────────────── */
function DiagnosticCards() {
    const [activeIndex, setActiveIndex] = useState(0)
    const cards = [
        { icon: <Sparkles size={20} />, title: 'Diseño personalizado', desc: 'Cada proyecto es único. Creamos combinaciones a medida para tu espacio.' },
        { icon: <Target size={20} />, title: 'Instalación premium', desc: 'Equipo certificado con más de 15 años de experiencia en colocación.' },
        { icon: <TrendingUp size={20} />, title: 'Resultados garantizados', desc: 'Materiales de primera calidad con garantía de satisfacción total.' },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cards.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-full" style={{ height: '280px' }}>
            {cards.map((card, i) => {
                const isActive = i === activeIndex
                const offset = ((i - activeIndex + cards.length) % cards.length)
                return (
                    <div
                        key={i}
                        className="absolute left-0 right-0 top-0 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-700"
                        style={{
                            height: '240px',
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            transform: `translateY(${offset * 16}px) scale(${1 - offset * 0.04})`,
                            opacity: offset > 1 ? 0.4 : 1,
                            zIndex: cards.length - offset,
                            boxShadow: isActive ? '0 8px 30px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-moss)', color: '#fff' }}>
                                {card.icon}
                            </div>
                            <span className="font-display font-bold text-base" style={{ color: 'var(--color-moss)' }}>{card.title}</span>
                        </div>
                        <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(26,26,26,0.6)' }}>{card.desc}</p>
                        <div className="flex gap-1.5 mt-auto">
                            {cards.map((_, j) => (
                                <div key={j} className="h-1 flex-1 rounded-full transition-all duration-500" style={{
                                    background: j === activeIndex ? 'var(--color-clay)' : 'rgba(0,0,0,0.08)',
                                }} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

/* ─── Feature 2: Live Telemetry (Typewriter) ──────────── */
function LiveTelemetry() {
    const [text, setText] = useState('')
    const [msgIndex, setMsgIndex] = useState(0)
    const messages = [
        'Analizando medidas del espacio...',
        'Seleccionando colección ideal...',
        'Calculando presupuesto optimizado...',
        'Generando diseño 3D personalizado...',
        'Preparando propuesta final...',
    ]

    useEffect(() => {
        let charIndex = 0
        let currentMsg = messages[msgIndex]
        const typingInterval = setInterval(() => {
            if (charIndex <= currentMsg.length) {
                setText(currentMsg.slice(0, charIndex))
                charIndex++
            } else {
                clearInterval(typingInterval)
                setTimeout(() => {
                    setMsgIndex((prev) => (prev + 1) % messages.length)
                }, 1800)
            }
        }, 50)

        return () => clearInterval(typingInterval)
    }, [msgIndex])

    return (
        <div className="rounded-2xl p-6 flex flex-col justify-between" style={{ background: 'var(--color-charcoal)', height: '280px' }}>
            <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.4)', margin: '10px' }}>SISTEMA_AV://telemetría</span>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-clay)' }} />
                    <span className="font-mono text-[10px]" style={{ color: 'var(--color-clay)', margin: '10px' }}>EN VIVO</span>
                </div>
            </div>

            <div className="flex-1 flex items-center">
                <p className="font-mono text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    <span className="mr-2" style={{ color: 'var(--color-moss)' }}>{'>'}</span>
                    {text}
                    <span className="inline-block w-2 h-5 ml-1 animate-pulse" style={{ background: 'var(--color-clay)', verticalAlign: 'middle' }} />
                </p>
            </div>

            <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full" style={{
                        background: i <= msgIndex ? 'var(--color-clay)' : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.5s ease',
                    }} />
                ))}
            </div>
        </div>
    )
}

/* ─── Feature 3: Schedule Protocol ────────────────────── */
function ScheduleProtocol() {
    const [activeDay, setActiveDay] = useState(-1)
    const [cursorPos, setCursorPos] = useState({ x: -30, y: -30 })
    const [cursorVisible, setCursorVisible] = useState(false)
    const [saved, setSaved] = useState(false)
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

    useEffect(() => {
        const runAnimation = () => {
            setCursorVisible(true)
            setSaved(false)
            setActiveDay(-1)

            setTimeout(() => setCursorPos({ x: 160, y: 120 }), 400)
            setTimeout(() => setActiveDay(3), 1200)
            setTimeout(() => setCursorPos({ x: 140, y: 220 }), 2000)
            setTimeout(() => setSaved(true), 2800)
            setTimeout(() => setCursorVisible(false), 3400)
            setTimeout(() => {
                setActiveDay(-1)
                setSaved(false)
            }, 5500)
        }

        runAnimation()
        const interval = setInterval(runAnimation, 6500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', height: '280px' }}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} style={{ color: 'var(--color-moss)' }} />
                <span className="font-mono text-xs tracking-wide" style={{ color: 'rgba(26,26,26,0.4)', margin: '10px' }}>AGENDA_PROTOCOLO://v2</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2 flex-1 items-center">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-xl flex items-center justify-center text-sm font-mono font-medium transition-all duration-300"
                        style={{
                            background: i === activeDay ? 'var(--color-moss)' : 'rgba(44, 44, 44, 0.03)',
                            color: i === activeDay ? '#fff' : 'rgba(26,26,26,0.5)',
                            transform: i === activeDay ? 'scale(0.9)' : 'scale(1)',
                            maxHeight: '48px',
                        }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Save button */}
            <div
                className="mt-4 py-3 rounded-xl text-center text-sm font-semibold transition-all duration-300"
                style={{
                    background: saved ? 'var(--color-clay)' : 'rgba(0,0,0,0.04)',
                    color: saved ? '#fff' : 'rgba(26,26,26,0.4)',
                }}
            >
                {saved ? '✓ Cita guardada' : 'Reservar cita'}
            </div>

            {/* Animated cursor */}
            <svg
                className="absolute pointer-events-none transition-all duration-700"
                style={{
                    left: cursorPos.x,
                    top: cursorPos.y,
                    opacity: cursorVisible ? 1 : 0,
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path d="M5 3L19 12L12 13.5L9 20L5 3Z" fill="var(--color-charcoal)" stroke="var(--color-charcoal)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

/* ─── Features Section ────────────────────────────────── */
export default function Features() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-panel', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    end: 'bottom 25%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="features" className="py-24 md:py-36 px-6 md:px-16 lg:px-24" style={{ background: 'var(--color-cream)', paddingBottom: '100px', paddingTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="max-w-[1200px] mx-auto">
                {/* Section header */}
                <div className="mb-50 text-center">
                    <span className="font-mono text-m tracking-widest uppercase mb-4 block" style={{ color: 'var(--color-clay)', marginBottom: '20px' }}>
                        Nuestro sistema
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter mb-5" style={{ color: 'var(--color-charcoal)' }}>
                        Tecnología al servicio del{' '}
                        <span className="font-serif italic font-normal" style={{ color: 'var(--color-moss)' }}>diseño</span>
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(26,26,26,0.55)', marginBottom: '50px' }}>
                        Cada proyecto pasa por nuestro protocolo de diseño: analizamos tu espacio, seleccionamos la colección perfecta y garantizamos una instalación impecable.
                    </p>
                </div>

                {/* Feature panels */}
                <div className="grid md:grid-cols-3 gap-8 place-items-center">
                    <div className="feature-panel w-full text-center">
                        <span className="font-mono text-[10px] tracking-widest uppercase mb-4 block" style={{ color: 'rgba(26,26,26,0.35)' }}>01 — Diagnóstico</span>
                        <DiagnosticCards />
                    </div>
                    <div className="feature-panel w-full text-center">
                        <span className="font-mono text-[10px] tracking-widest uppercase mb-4 block" style={{ color: 'rgba(26,26,26,0.35)' }}>02 — Telemetría</span>
                        <LiveTelemetry />
                    </div>
                    <div className="feature-panel w-full text-center">
                        <span className="font-mono text-[10px] tracking-widest uppercase mb-4 block" style={{ color: 'rgba(26,26,26,0.35)' }}>03 — Protocolo</span>
                        <ScheduleProtocol />
                    </div>
                </div>
            </div>
        </section>
    )
}
