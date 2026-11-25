import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, PlusCircle, FileText, ExternalLink, ImageOff } from 'lucide-react'
import { getAllPosts, deletePost } from '../../services/blogService'
import { PageHeader, Toast } from './ui'

const FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: 'published', label: 'Publicadas' },
    { id: 'draft', label: 'Borradores' },
]

const formatDate = (ts) => {
    if (!ts) return '—'
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatusBadge({ published }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={published
                ? { background: 'rgba(38,194,129,0.12)', color: '#15803d' }
                : { background: 'var(--color-bg-primary)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: published ? '#16a34a' : 'var(--color-text-light)' }} />
            {published ? 'Publicado' : 'Borrador'}
        </span>
    )
}

function Thumb({ src }) {
    return (
        <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--color-bg-alt)' }}>
            {src ? <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" /> : <ImageOff size={18} style={{ color: 'var(--color-text-light)' }} />}
        </div>
    )
}

function Actions({ post, onEdit, onDelete, deleting }) {
    const btn = 'w-10 h-10 rounded-xl flex items-center justify-center transition-colors'
    return (
        <div className="flex items-center gap-1">
            {post.published && post.slug && (
                <Link to={`/blog/${post.slug}`} target="_blank" aria-label={`Ver "${post.title}"`} title="Ver en la web" className={`${btn} hover:bg-gray-100`} style={{ color: 'var(--color-text-muted)' }}>
                    <ExternalLink size={16} />
                </Link>
            )}
            <button onClick={onEdit} aria-label={`Editar "${post.title}"`} title="Editar" className={`${btn} hover:bg-blue-50`} style={{ color: 'var(--color-brand-blue)' }}>
                <Pencil size={16} />
            </button>
            <button onClick={onDelete} disabled={deleting} aria-label={`Eliminar "${post.title}"`} title="Eliminar" className={`${btn} hover:bg-red-50 disabled:opacity-40`} style={{ color: '#DC2626' }}>
                <Trash2 size={16} />
            </button>
        </div>
    )
}

export default function PostListPanel({ onNewPost, onEditPost }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [filter, setFilter] = useState('all')
    const [toast, setToast] = useState(null)

    useEffect(() => {
        getAllPosts()
            .then(setPosts)
            .catch((err) => console.error('Error cargando posts:', err))
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = async (post) => {
        if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return
        setDeletingId(post.id)
        try {
            await deletePost(post.id)
            setPosts((prev) => prev.filter((p) => p.id !== post.id))
            setToast({ message: 'Entrada eliminada' })
        } catch {
            setToast({ message: 'No se pudo eliminar la entrada', type: 'error' })
        } finally {
            setDeletingId(null)
            setTimeout(() => setToast(null), 3000)
        }
    }

    const counts = {
        all: posts.length,
        published: posts.filter((p) => p.published).length,
        draft: posts.filter((p) => !p.published).length,
    }
    const visible = posts.filter((p) => filter === 'all' || (filter === 'published' ? p.published : !p.published))

    return (
        <div>
            <Toast {...(toast || {})} />

            <PageHeader
                title="Publicaciones"
                subtitle="Artículos del blog. Publicar con regularidad ayuda a posicionar la web en Google."
                action={
                    <button onClick={onNewPost} className="btn-premium btn-brand text-sm !py-2.5 !px-5 !hidden sm:!inline-flex">
                        <PlusCircle size={16} />
                        Nueva entrada
                    </button>
                }
            />

            {/* Filtros */}
            <div className="flex gap-2 mb-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
                {FILTERS.map((f) => {
                    const active = filter === f.id
                    return (
                        <button
                            key={f.id}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setFilter(f.id)}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                            style={active
                                ? { background: 'var(--color-text-main)', color: 'white' }
                                : { background: 'white', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                        >
                            {f.label} <span className="opacity-60 ml-0.5">{counts[f.id]}</span>
                        </button>
                    )
                })}
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-2xl animate-pulse bg-white" style={{ border: '1px solid var(--color-border)' }} />
                    ))}
                </div>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl bg-white px-6 py-14 flex flex-col items-center gap-3 text-center" style={{ border: '1px solid var(--color-border)' }}>
                    <FileText size={32} style={{ color: 'var(--color-text-light)' }} />
                    <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        {posts.length === 0 ? 'Aún no hay publicaciones' : 'No hay entradas en este filtro'}
                    </p>
                    {posts.length === 0 && (
                        <button onClick={onNewPost} className="btn-premium btn-brand text-sm !py-2.5 !px-5 mt-2">
                            <PlusCircle size={16} /> Escribir la primera
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Tarjetas (móvil) */}
                    <ul className="md:hidden flex flex-col gap-3">
                        {visible.map((post) => (
                            <li key={post.id} className="rounded-2xl bg-white p-3" style={{ border: '1px solid var(--color-border)' }}>
                                <button onClick={() => onEditPost(post)} className="flex gap-3 w-full text-left">
                                    <Thumb src={post.coverImage} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold leading-snug line-clamp-2" style={{ color: 'var(--color-text-main)' }}>
                                            {post.title || 'Sin título'}
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>{formatDate(post.createdAt)}</p>
                                    </div>
                                </button>
                                <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                                    <StatusBadge published={post.published} />
                                    <Actions post={post} onEdit={() => onEditPost(post)} onDelete={() => handleDelete(post)} deleting={deletingId === post.id} />
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Tabla (tablet / escritorio) */}
                    <div className="hidden md:block rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid var(--color-border)' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-primary)' }}>
                                    {['Entrada', 'Estado', 'Fecha', ''].map((h, i) => (
                                        <th key={i} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-light)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/60 transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td className="px-5 py-3">
                                            <button onClick={() => onEditPost(post)} className="flex items-center gap-3 text-left">
                                                <Thumb src={post.coverImage} />
                                                <div className="min-w-0">
                                                    <p className="font-semibold line-clamp-1" style={{ color: 'var(--color-text-main)' }}>{post.title || 'Sin título'}</p>
                                                    {post.excerpt && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--color-text-light)' }}>{post.excerpt}</p>}
                                                </div>
                                            </button>
                                        </td>
                                        <td className="px-5 py-3"><StatusBadge published={post.published} /></td>
                                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>{formatDate(post.createdAt)}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-end">
                                                <Actions post={post} onEdit={() => onEditPost(post)} onDelete={() => handleDelete(post)} deleting={deletingId === post.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
