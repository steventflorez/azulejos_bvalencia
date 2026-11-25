import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import BlogCard from '../components/blog/BlogCard'
import useBlogPosts from '../hooks/useBlogPosts'

/* ── Skeleton card ─────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="card-glass overflow-hidden animate-pulse">
            <div className="h-52 rounded-t-[var(--radius-card)]" style={{ background: 'var(--color-border)' }} />
            <div className="p-6 flex flex-col gap-3">
                <div className="h-5 rounded-full w-3/4" style={{ background: 'var(--color-border)' }} />
                <div className="h-4 rounded-full w-full" style={{ background: 'var(--color-border)' }} />
                <div className="h-4 rounded-full w-5/6" style={{ background: 'var(--color-border)' }} />
                <div className="h-4 rounded-full w-1/3 mt-2" style={{ background: 'var(--color-border)' }} />
            </div>
        </div>
    )
}

export default function BlogPage() {
    const { posts, loading, error } = useBlogPosts()
    const heroRef = useRef(null)
    const gridRef = useRef(null)

    /* GSAP: hero fade-in then cards stagger */
    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current.children,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' }
            )
        }
    }, [])

    useEffect(() => {
        if (!loading && gridRef.current) {
            const cards = gridRef.current.querySelectorAll('article, .empty-state')
            gsap.fromTo(
                cards,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
            )
        }
    }, [loading])

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
            <Seo
                title="Blog: ideas y consejos sobre azulejos"
                description="Tendencias en azulejos, porcelanatos y revestimientos para baños, cocinas y piscinas. Consejos de expertos en Valencia."
                path="/blog"
            />
            <Navbar />

            {/* ── Hero ───────────────────────────────────────── */}
            <section
                className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 text-center"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,113,188,0.06) 0%, var(--color-bg-primary) 100%)',
                }}
            >
                <div ref={heroRef} className="max-w-2xl mx-auto flex flex-col items-center gap-5">
                    <span className="section-tag">Nuestro Blog</span>
                    <h1
                        className="font-display font-bold text-4xl md:text-5xl leading-tight tracking-tight"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Ideas, tendencias y&nbsp;consejos de diseño
                    </h1>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        Descubre las últimas tendencias en azulejos, revestimientos y decoración de interiores de la mano de nuestros expertos.
                    </p>
                    <div className="brand-line" />
                </div>
            </section>

            {/* ── Grid ───────────────────────────────────────── */}
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-24">
                {error && (
                    <p className="text-center py-12 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Error al cargar los posts. Inténtalo más tarde.
                    </p>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        ref={gridRef}
                        className="empty-state flex flex-col items-center justify-center gap-6 py-28 text-center"
                    >
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(0,113,188,0.08)' }}
                        >
                            <span style={{ fontSize: '2rem' }}>✍️</span>
                        </div>
                        <h2
                            className="font-display font-bold text-2xl"
                            style={{ color: 'var(--color-text-main)' }}
                        >
                            Pronto publicaremos contenido exclusivo
                        </h2>
                        <p className="text-sm max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                            Estamos preparando artículos sobre tendencias, consejos de diseño y los mejores azulejos para tu hogar.
                        </p>
                    </div>
                ) : (
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
