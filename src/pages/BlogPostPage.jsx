import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import PostContent, { toPlainText } from '../components/blog/PostContent'
import { getPostBySlug } from '../services/blogService'

function formatDate(dateValue) {
    if (!dateValue) return ''
    const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function toISO(dateValue) {
    if (!dateValue) return undefined
    const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
    return date.toISOString()
}

/* ── Loading skeleton ──────────────────────────────────── */
function PostSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="w-full h-72 md:h-[500px]" style={{ background: 'var(--color-border)' }} />
            <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-5">
                <div className="h-4 rounded-full w-1/4" style={{ background: 'var(--color-border)' }} />
                <div className="h-8 rounded-lg w-3/4" style={{ background: 'var(--color-border)' }} />
                <div className="h-8 rounded-lg w-1/2" style={{ background: 'var(--color-border)' }} />
                {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-4 rounded-full w-full" style={{ background: 'var(--color-border)' }} />
                ))}
            </div>
        </div>
    )
}

export default function BlogPostPage() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setLoading(true)
        setNotFound(false)
        getPostBySlug(slug, { publishedOnly: true })
            .then((data) => {
                if (data) {
                    setPost(data)
                } else {
                    setNotFound(true)
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [slug])

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
            {post && (
                <Seo
                    title={post.title}
                    description={post.excerpt || toPlainText(post.content).slice(0, 157) + '…'}
                    path={`/blog/${post.slug}`}
                    image={post.coverImage}
                    type="article"
                    jsonLd={{
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.title,
                        description: post.excerpt,
                        ...(post.coverImage ? { image: [post.coverImage] } : {}),
                        datePublished: toISO(post.createdAt),
                        dateModified: toISO(post.updatedAt || post.createdAt),
                        ...(post.focusKeyword ? { keywords: post.focusKeyword } : {}),
                        author: { '@type': 'Organization', name: post.author || 'Azulejos Valencia' },
                        publisher: { '@type': 'Organization', name: 'Azulejos Valencia' },
                        mainEntityOfPage: `${window.location.origin}/blog/${post.slug}`,
                    }}
                />
            )}
            {notFound && <Seo title="Artículo no encontrado" noindex />}
            <Navbar />

            {loading && (
                <div className="pt-24 md:pt-28">
                    <PostSkeleton />
                </div>
            )}

            {!loading && notFound && (
                <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center pt-32 md:pt-40">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,113,188,0.08)' }}
                    >
                        <span style={{ fontSize: '2rem' }}>🔍</span>
                    </div>
                    <h1
                        className="font-display font-bold text-3xl"
                        style={{ color: 'var(--color-text-main)' }}
                    >
                        Post no encontrado
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        El artículo que buscas no existe o ha sido eliminado.
                    </p>
                    <Link
                        to="/blog"
                        className="btn-premium btn-brand text-sm !py-3 !px-6 inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={15} />
                        Volver al blog
                    </Link>
                </main>
            )}

            {!loading && post && (
                <>
                    {/* ── Hero image ─────────────────────────── */}
                    {post.coverImage ? (
                        <div
                            className="w-full overflow-hidden"
                            style={{ maxHeight: '500px', marginTop: '72px' }}
                        >
                            <img
                                src={post.coverImage}
                                alt={post.coverAlt || post.title}
                                fetchPriority="high"
                                className="w-full object-cover"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                    ) : (
                        <div
                            className="w-full"
                            style={{
                                height: '300px',
                                marginTop: '64px',
                                background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-dark) 40%, var(--color-brand-green) 100%)',
                            }}
                        />
                    )}

                    {/* ── Article content ────────────────────── */}
                    <main className="flex-1">
                        <div className="max-w-3xl mx-auto px-6 md:px-8 py-14">
                            {/* Back button — top */}
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-all duration-300 hover:gap-3"
                                style={{ color: 'var(--color-brand-blue)', textDecoration: 'none' }}
                            >
                                <ArrowLeft size={16} />
                                Volver al blog
                            </Link>

                            {/* Meta: date + author */}
                            <div className="flex flex-wrap items-center gap-5 mb-5">
                                <span
                                    className="flex items-center gap-1.5 text-sm"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <Calendar size={15} style={{ color: 'var(--color-brand-blue)' }} />
                                    <time dateTime={toISO(post.createdAt)}>{formatDate(post.createdAt)}</time>
                                </span>
                                {post.author && (
                                    <span
                                        className="flex items-center gap-1.5 text-sm"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        <User size={15} style={{ color: 'var(--color-brand-blue)' }} />
                                        {post.author}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1
                                className="font-display font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-10"
                                style={{ color: 'var(--color-text-main)' }}
                            >
                                {post.title}
                            </h1>

                            {/* Divider */}
                            <div className="brand-line mb-10" />

                            {/* Body */}
                            <article>
                                <PostContent content={post.content} />
                            </article>

                            {/* Back button — bottom */}
                            <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <Link
                                    to="/blog"
                                    className="btn-premium btn-ghost text-sm !py-3 !px-6 inline-flex items-center gap-2"
                                >
                                    <ArrowLeft size={15} />
                                    Volver al blog
                                </Link>
                            </div>
                        </div>
                    </main>
                </>
            )}

            <Footer />
        </div>
    )
}
