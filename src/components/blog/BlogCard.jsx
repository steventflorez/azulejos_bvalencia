import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

function formatDate(dateValue) {
    if (!dateValue) return ''
    // Handle Firestore Timestamp or JS Date
    const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BlogCard({ post }) {
    const { title, excerpt, coverImage, imageUrl, slug, createdAt } = post
    const image = coverImage || imageUrl  // soporte para ambos campos

    return (
        <article
            className="card-glass group flex flex-col overflow-hidden h-full"
            style={{ cursor: 'pointer' }}
        >
            {/* Image / fallback gradient */}
            <div className="img-zoom relative h-52 flex-shrink-0 overflow-hidden rounded-t-[var(--radius-card)]">
                {image ? (
                    <img
                        src={image}
                        alt={post.coverAlt || title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-dark) 40%, var(--color-brand-green) 100%)',
                        }}
                    />
                )}
                {/* Date badge */}
                <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    <Calendar size={12} style={{ color: 'var(--color-brand-blue)' }} />
                    {formatDate(createdAt)}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-6 gap-3">
                <h2
                    className="font-display font-bold text-xl leading-snug line-clamp-2"
                    style={{ color: 'var(--color-text-main)' }}
                >
                    <Link to={`/blog/${slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {title}
                    </Link>
                </h2>

                {excerpt && (
                    <p
                        className="text-sm leading-relaxed line-clamp-3 flex-1"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {excerpt}
                    </p>
                )}

                <Link
                    to={`/blog/${slug}`}
                    aria-label={`Leer: ${title}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: 'var(--color-brand-blue)', textDecoration: 'none' }}
                >
                    Leer más
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
            </div>
        </article>
    )
}
