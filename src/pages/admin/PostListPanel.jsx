import { useState, useEffect, useCallback } from 'react'
import { getAllPosts, deletePost } from '../../services/blogService'
import { Pencil, Trash2, PlusCircle, FileText, AlertTriangle } from 'lucide-react'

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-6 py-4">
          <div
            className="h-4 rounded animate-pulse"
            style={{
              background: 'var(--color-border)',
              width: i === 1 ? '60%' : i === 4 ? '80px' : '40%',
            }}
          />
        </td>
      ))}
    </tr>
  )
}

function StatusBadge({ published }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={
        published
          ? {
              background: 'rgba(38,194,129,0.12)',
              color: '#1A9A66',
            }
          : {
              background: 'rgba(107,114,128,0.1)',
              color: 'var(--color-text-muted)',
            }
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ background: published ? '#26C281' : '#9CA3AF' }}
      />
      {published ? 'Publicado' : 'Borrador'}
    </span>
  )
}

function ConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="rounded-2xl p-7 shadow-2xl max-w-sm w-full"
        style={{ background: 'var(--color-bg-surface)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(239,68,68,0.1)' }}
          >
            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-main)' }}>
            Eliminar publicación
          </h3>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          ¿Seguro que quieres eliminar{' '}
          <span className="font-medium" style={{ color: 'var(--color-text-main)' }}>
            &ldquo;{title}&rdquo;
          </span>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-premium btn-ghost px-5 py-2.5 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-premium px-5 py-2.5 text-sm text-white"
            style={{ background: '#EF4444' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PostListPanel({ onEditPost, onNewPost }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllPosts()
      setPosts(data)
    } catch (err) {
      console.error('Error cargando posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deletePost(deleteTarget.id)
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error eliminando post:', err)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-8">
      {deleteTarget && (
        <ConfirmModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-tag text-sm mb-2">Blog</div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: 'var(--color-text-main)' }}
          >
            Publicaciones
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {loading ? '…' : `${posts.length} entrada${posts.length !== 1 ? 's' : ''} en total`}
          </p>
        </div>
        <button
          onClick={onNewPost}
          className="btn-premium btn-brand flex items-center gap-2 px-5 py-3 text-sm"
        >
          <PlusCircle size={16} />
          Nueva entrada
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Título', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText size={40} style={{ color: 'var(--color-border)' }} />
                    <p style={{ color: 'var(--color-text-muted)' }}>
                      No hay publicaciones aún.
                    </p>
                    <button
                      onClick={onNewPost}
                      className="btn-premium btn-brand px-5 py-2.5 text-sm"
                    >
                      Crear la primera
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post, idx) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom:
                      idx < posts.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-medium line-clamp-1 max-w-xs"
                      style={{ color: 'var(--color-text-main)' }}
                    >
                      {post.title || 'Sin título'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge published={post.published} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(post.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditPost(post)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                        title="Editar"
                        style={{ color: 'var(--color-brand-blue)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,113,188,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                        title="Eliminar"
                        style={{ color: '#EF4444' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
