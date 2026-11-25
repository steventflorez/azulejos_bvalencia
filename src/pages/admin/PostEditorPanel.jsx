import { useState, useEffect } from 'react'
import { serverTimestamp } from 'firebase/firestore'
import { createPost, updatePost } from '../../services/blogService'
import { Save, Send, X, RefreshCw } from 'lucide-react'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-main)' }}>
        {label}
      </label>
      {hint && (
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'var(--color-bg-primary)',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-text-main)',
  borderRadius: '0.75rem',
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

function StyledInput({ value, onChange, placeholder, type = 'text', ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-brand-blue)'
        e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-border)'
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
}

function StyledTextarea({ value, onChange, placeholder, rows = 4, maxLength, style = {} }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-brand-blue)'
        e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-border)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

export default function PostEditorPanel({ post, onSave, onCancel }) {
  const isEditing = Boolean(post)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [slugManual, setSlugManual] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title))
    }
  }, [title, slugManual])

  const handleSlugChange = (e) => {
    setSlugManual(true)
    setSlug(slugify(e.target.value))
  }

  const regenerateSlug = () => {
    setSlugManual(false)
    setSlug(slugify(title))
  }

  const handleSave = async (asPublished) => {
    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    if (!slug.trim()) {
      setError('El slug es obligatorio.')
      return
    }

    setError('')
    setSaving(true)

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      published: asPublished,
    }

    try {
      if (isEditing) {
        await updatePost(post.id, { ...data, updatedAt: serverTimestamp() })
      } else {
        await createPost({ ...data, createdAt: serverTimestamp() })
      }
      onSave()
    } catch (err) {
      console.error('Error guardando post:', err)
      setError('No se pudo guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="section-tag text-sm mb-2">Blog</div>
        <h1
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--color-text-main)' }}
        >
          {isEditing ? 'Editar publicación' : 'Nueva publicación'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {isEditing ? `Editando: ${post.title}` : 'Escribe tu nueva entrada para el blog'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-6 text-sm"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#DC2626',
          }}
        >
          {error}
        </div>
      )}

      <div
        className="rounded-2xl p-7 space-y-6"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Title */}
        <Field label="Título">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la publicación…"
            style={{
              ...inputStyle,
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-brand-blue)'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </Field>

        {/* Slug */}
        <Field
          label="Slug (URL)"
          hint="Se genera automáticamente desde el título. Puedes editarlo manualmente."
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none"
                style={{ color: 'var(--color-text-muted)' }}
              >
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="mi-entrada"
                style={{
                  ...inputStyle,
                  paddingLeft: '3.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brand-blue)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <button
              type="button"
              onClick={regenerateSlug}
              title="Regenerar desde el título"
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all shrink-0"
              style={{
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)'
                e.currentTarget.style.color = 'var(--color-brand-blue)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-muted)'
              }}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </Field>

        {/* Excerpt */}
        <Field label="Resumen / Extracto" hint={`${excerpt.length}/200 caracteres`}>
          <StyledTextarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Breve descripción del artículo para listados y SEO…"
            rows={3}
            maxLength={200}
          />
        </Field>

        {/* Content */}
        <Field label="Contenido" hint="Puedes usar texto plano o formato Markdown.">
          <StyledTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido completo aquí…"
            rows={14}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
        </Field>

        {/* Cover image */}
        <Field label="URL de imagen de portada">
          <StyledInput
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://…"
            type="url"
          />
          {coverImage && (
            <div
              className="mt-3 rounded-xl overflow-hidden"
              style={{ height: 160, border: '1px solid var(--color-border)' }}
            >
              <img
                src={coverImage}
                alt="Previsualización"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </Field>

        {/* Published toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
              Publicado
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Las entradas publicadas son visibles en el blog.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished((v) => !v)}
            className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              background: published ? 'var(--color-brand-blue)' : 'var(--color-border)',
            }}
          >
            <span
              className="inline-block w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200"
              style={{
                width: 18,
                height: 18,
                transform: published ? 'translateX(22px)' : 'translateX(2px)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="btn-premium btn-ghost flex items-center gap-2 px-5 py-3 text-sm disabled:opacity-60"
        >
          <Save size={16} />
          Guardar borrador
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="btn-premium btn-brand flex items-center gap-2 px-5 py-3 text-sm disabled:opacity-60"
        >
          <Send size={16} />
          Publicar
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 text-sm rounded-xl transition-all disabled:opacity-60"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-bg-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <X size={16} />
          Cancelar
        </button>
      </div>
    </div>
  )
}
