import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = ['Todos', 'Piscinas', 'Cocinas', 'Baños']

const projects = [
    {
        title: 'Villa Mediterránea',
        category: 'Piscinas',
        description: 'Piscina infinity con mosaico vítreo azul cobalto',
        image: '/images/picina.jpeg',
    },
    {
        title: 'Penthouse Dorado',
        category: 'Cocinas',
        description: 'Cocina gourmet con azulejo hexagonal artesanal',
        image: '/images/cocina.jpeg',
    },
    {
        title: 'Suite Imperial',
        category: 'Baños',
        description: 'Baño spa con mármol Calacatta y piedra natural',
        image: '/images/bano.jpeg',
    },
    {
        title: 'Terraza Skyline',
        category: 'Piscinas',
        description: 'Rooftop pool con mosaico vítreo iluminado',
        image: '/images/gallery-pool.png',
    },
    {
        title: 'Residencia Elegance',
        category: 'Baños',
        description: 'Ducha walk-in con porcelánico efecto mármol',
        image: '/images/gallery-bathroom.png',
    },
    {
        title: 'Casa del Chef',
        category: 'Cocinas',
        description: 'Backsplash esmeralda con acabado vidriado',
        image: '/images/gallery-kitchen.png',
    },
]

export default function Gallery() {
    const sectionRef = useRef(null)
    const [activeFilter, setActiveFilter] = useState('Todos')

    const filtered = activeFilter === 'Todos'
        ? projects
        : projects.filter((p) => p.category === activeFilter)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.gallery-item', {
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: 'top 80%',
                },
                y: 60,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power3.out',
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="py-24 md:py-36 px-6 md:px-12 lg:px-24"
            style={{ background: 'var(--color-bg-surface)', marginTop: '20px', padding: '6px' }}
        >
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="section-tag justify-center mb-6">
                        Proyectos destacados
                    </div>
                    <h2
                        className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Galería{' '}
                        <span className="italic" style={{ color: 'var(--color-brand-blue)' }}>
                            inspiracional
                        </span>
                    </h2>
                    <p
                        className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                        style={{ color: 'var(--color-text-muted)', marginBottom: '6px' }}
                    >
                        Una selección de nuestros proyectos más emblemáticos. Cada imagen cuenta la historia de un espacio transformado.
                    </p>
                </div>

                {/* Filter tabs */}


                {/* Gallery grid */}
                <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project, i) => (
                        <div
                            key={`${project.title}-${activeFilter}`}
                            className="gallery-item group relative rounded-2xl overflow-hidden cursor-pointer shadow-md"
                            style={{
                                aspectRatio: i === 0 || i === 3 ? '4/3' : '3/4',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* Hover overlay light theme */}
                            <div
                                className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                style={{
                                    background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.2) 100%)',
                                }}
                            >
                                <span
                                    className="font-mono font-bold text-[10px] tracking-[0.2em] uppercase mb-2"
                                    style={{ color: 'var(--color-brand-green)' }}
                                >
                                    {project.category}
                                </span>
                                <h3
                                    className="font-display text-xl font-bold mb-1 tracking-tight"
                                    style={{ color: 'var(--color-text-main)' }}
                                >
                                    {project.title}
                                </h3>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {project.description}
                                </p>
                            </div>

                            {/* Always-visible category badge */}
                            <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity duration-300">
                                <span
                                    className="inline-block px-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-md"
                                    style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        color: 'var(--color-brand-blue)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(0,113,188,0.1)',
                                    }}
                                >
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
