import { useState, useRef, useMemo } from 'react'
import { createPost, updatePost, getPostBySlug } from '../../services/blogService'
import {
    Save, Send, ArrowLeft, Image as ImageIcon, Heading2, Heading3, Bold, List, Link2, Search, CheckCircle2, Circle, Eye, PenLine,
} from 'lucide-react'
import PostContent, { parseBlocks, toPlainText } from '../../components/blog/PostContent'
import { Toast, Card, Field, inputClass } from './ui'

export function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80)
        .replace(/-$/, '')
}

const norm = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Comprobaciones SEO básicas, en lenguaje sencillo. */
function seoChecks(form) {
    const kw = norm(form.focusKeyword.trim())
    const plain = toPlainText(form.content)
    const words = plain ? plain.split(' ').length : 0
    const blocks = parseBlocks(form.content)
    const firstP = blocks.find((b) => b.type === 'p')
    const firstText = firstP ? norm(firstP.lines.join(' ')) : ''
    const t = form.title.trim().length
    const d = form.excerpt.trim().length

    const checks = [
        { ok: t >= 30 && t <= 65, label: 'Título entre 30 y 65 caracteres', detail: `${t} caracteres` },
        { ok: d >= 120 && d <= 160, label: 'Descripción entre 120 y 160 caracteres', detail: `${d} caracteres` },
        { ok: words >= 300, label: 'Al menos 300 palabras de contenido', detail: `${words} palabras` },
        { ok: blocks.some((b) => b.type === 'h2'), label: 'Usa subtítulos (## ) para organizar el texto' },
        { ok: !!form.coverImage && form.coverAlt.trim().length > 5, label: 'Imagen de portada con texto alternativo' },
    ]
    if (kw) {
        checks.push(
            { ok: norm(form.title).includes(kw), label: 'La palabra clave aparece en el título' },
            { ok: norm(form.excerpt).includes(kw), label: 'La palabra clave aparece en la descripción' },
            { ok: firstText.includes(kw), label: 'La palabra clave aparece en el primer párrafo' },
            { ok: form.slug.includes(generateSlug(kw)), label: 'La palabra clave aparece en la URL' },
        )
    } else {
        checks.push({ ok: false, label: 'Define una palabra clave principal' })
    }
    return { checks, words, score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100) }
}

function Counter({ value, min, max }) {
    const n = value.length
    const color = n === 0 ? 'var(--color-text-light)' : n >= min && n <= max ? '#16a34a' : '#D97706'
    return <span className="text-xs font-semibold tabular-nums" style={{ color }}>{n}/{max}</span>
}

const TOOLBAR = [
    { icon: Heading2, label: 'Subtítulo', apply: (sel) => ({ text: `\n## ${sel || 'Subtítulo'}\n`, select: !sel }) },
    { icon: Heading3, label: 'Subtítulo menor', apply: (sel) => ({ text: `\n### ${sel || 'Subtítulo'}\n`, select: !sel }) },
    { icon: Bold, label: 'Negrita', apply: (sel) => ({ text: `**${sel || 'texto'}**` }) },
    { icon: List, label: 'Lista', apply: (sel) => ({ text: (sel || 'Elemento').split('\n').map((l) => `- ${l}`).join('\n') }) },
    { icon: Link2, label: 'Enlace', apply: (sel) => ({ text: `[${sel || 'texto del enlace'}](https://)` }) },
]

export default function PostEditorPanel({ post, onSave, onCancel }) {
    const isEditing = !!post
    const [form, setForm] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        coverImage: post?.coverImage || '',
        coverAlt: post?.coverAlt || '',
        focusKeyword: post?.focusKeyword || '',
        published: post?.published || false,
    })
    const [saving, setSaving] = useState(false)
    const [slugManual, setSlugManual] = useState(isEditing)
    const [toast, setToast] = useState(null)
    const [mobileView, setMobileView] = useState('edit') // 'edit' | 'preview' (vista previa del artículo)
    const contentRef = useRef(null)

    const seo = useMemo(() => seoChecks(form), [form])

    const update = (field, value) =>
        setForm((prev) => {
            const next = { ...prev, [field]: value }
            if (field === 'title' && !slugManual) next.slug = generateSlug(value)
            return next
        })
    const bind = (field) => ({ value: form[field], onChange: (e) => update(field, e.target.value) })

    const notify = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 2500)
    }

    const insert = (tool) => {
        const el = contentRef.current
        if (!el) return
        const { selectionStart: start, selectionEnd: end } = el
        const sel = form.content.slice(start, end)
        const { text } = tool.apply(sel)
        const next = form.content.slice(0, start) + text + form.content.slice(end)
        update('content', next)
        requestAnimationFrame(() => {
            el.focus()
            el.setSelectionRange(start + text.length, start + text.length)
        })
    }

    const save = async (publish) => {
        if (!form.title.trim()) return notify('El título es obligatorio', 'error')
        const slug = generateSlug(form.slug || form.title)
        if (!slug) return notify('La URL no es válida', 'error')
        if (publish && !form.content.trim()) return notify('Escribe el contenido antes de publicar', 'error')

        setSaving(true)
        try {
            const existing = await getPostBySlug(slug)
            if (existing && existing.id !== post?.id) {
                notify('Ya existe otra entrada con esa URL. Cámbiala.', 'error')
                return
            }
            const data = {
                ...form,
                title: form.title.trim(),
                excerpt: form.excerpt.trim() || toPlainText(form.content).slice(0, 157) + '…',
                slug,
                published: publish,
            }
            if (isEditing) await updatePost(post.id, data)
            else await createPost(data)
            notify(publish ? '¡Entrada publicada!' : 'Borrador guardado')
            setTimeout(onSave, 900)
        } catch (err) {
            console.error(err)
            notify('No se pudo guardar. Intenta de nuevo.', 'error')
        } finally {
            setSaving(false)
        }
    }

    const scoreColor = seo.score >= 80 ? '#16a34a' : seo.score >= 50 ? '#D97706' : '#DC2626'
    const previewDesc = form.excerpt || toPlainText(form.content).slice(0, 160) || 'Añade una descripción para que Google muestre un buen resumen…'

    const ActionButtons = ({ compact }) => (
        <>
            <button
                onClick={() => save(false)}
                disabled={saving}
                className={`btn-premium btn-ghost text-sm !py-3 disabled:opacity-60 ${compact ? 'flex-1 !px-3' : 'w-full'}`}
            >
                <Save size={15} />
                {form.published && isEditing ? 'Pasar a borrador' : compact ? 'Borrador' : 'Guardar borrador'}
            </button>
            <button
                onClick={() => save(true)}
                disabled={saving}
                className={`btn-premium btn-brand text-sm !py-3 disabled:opacity-60 ${compact ? 'flex-1 !px-3' : 'w-full'}`}
            >
                <Send size={15} />
                {saving ? 'Guardando…' : form.published && isEditing ? 'Actualizar' : 'Publicar'}
            </button>
        </>
    )

    return (
        <div>
            <Toast {...(toast || {})} />

            {/* Encabezado */}
            <div className="flex items-center gap-2 mb-5 lg:mb-8">
                <button onClick={onCancel} aria-label="Volver a publicaciones" className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-gray-100" style={{ color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-display text-2xl sm:text-3xl font-bold flex-1 min-w-0 truncate" style={{ color: 'var(--color-text-main)' }}>
                    {isEditing ? 'Editar entrada' : 'Nueva entrada'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${scoreColor}1a`, color: scoreColor }} title="Puntuación SEO">
                    SEO {seo.score}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 lg:gap-6 items-start">
                {/* ── Columna principal ─────────────────── */}
                <div className="flex flex-col gap-5 min-w-0">
                    <Card className="flex flex-col gap-5">
                        <Field label="Título" htmlFor="title" counter={<Counter value={form.title} min={30} max={65} />} hint="Es lo que aparece en Google y en la pestaña del navegador. Incluye la palabra clave.">
                            <input id="title" type="text" {...bind('title')} placeholder="Ej.: Cómo elegir azulejos para un baño pequeño" className={`${inputClass} font-semibold`} />
                        </Field>

                        <Field label="Palabra clave principal" htmlFor="kw" hint="La búsqueda por la que quieres aparecer. Ej.: «azulejos baño Valencia».">
                            <input id="kw" type="text" {...bind('focusKeyword')} placeholder="azulejos para baño" className={inputClass} />
                        </Field>

                        <Field label="Descripción para Google" htmlFor="excerpt" counter={<Counter value={form.excerpt} min={120} max={160} />} hint="Resumen de 1–2 frases que invite a hacer clic. También se usa en la tarjeta del blog.">
                            <textarea id="excerpt" {...bind('excerpt')} maxLength={200} rows={3} placeholder="Descubre qué azulejos funcionan mejor en baños pequeños…" className={`${inputClass} resize-none`} />
                        </Field>

                        <Field label="URL del artículo" htmlFor="slug">
                            <div className="flex items-stretch rounded-xl overflow-hidden border border-[var(--color-border)] focus-within:border-[var(--color-brand-blue)]">
                                <span className="px-3 flex items-center text-sm select-none flex-shrink-0" style={{ color: 'var(--color-text-light)', background: 'var(--color-bg-primary)', borderRight: '1px solid var(--color-border)' }}>
                                    /blog/
                                </span>
                                <input
                                    id="slug"
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => { setSlugManual(true); update('slug', e.target.value) }}
                                    onBlur={() => update('slug', generateSlug(form.slug))}
                                    placeholder="mi-articulo"
                                    className="flex-1 min-w-0 px-3 py-3 text-base sm:text-sm outline-none bg-white"
                                />
                            </div>
                        </Field>
                    </Card>

                    <Card className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>Contenido</span>
                            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>{seo.words} palabras</span>
                        </div>

                        {/* Cambiar entre escribir y ver */}
                        <div className="grid grid-cols-2 p-1 rounded-xl text-sm font-semibold" style={{ background: 'var(--color-bg-alt)' }}>
                            {[{ id: 'edit', label: 'Escribir', icon: PenLine }, { id: 'preview', label: 'Vista previa', icon: Eye }].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setMobileView(id)}
                                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors"
                                    style={mobileView === id ? { background: 'white', color: 'var(--color-text-main)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' } : { color: 'var(--color-text-light)' }}
                                >
                                    <Icon size={15} /> {label}
                                </button>
                            ))}
                        </div>

                        {mobileView === 'edit' ? (
                            <>
                                <div className="flex gap-1 overflow-x-auto" role="toolbar" aria-label="Formato">
                                    {TOOLBAR.map((tool) => (
                                        <button
                                            key={tool.label}
                                            type="button"
                                            onClick={() => insert(tool)}
                                            title={tool.label}
                                            aria-label={tool.label}
                                            className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                            style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                                        >
                                            <tool.icon size={17} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    ref={contentRef}
                                    {...bind('content')}
                                    rows={18}
                                    placeholder={'Escribe aquí el artículo.\n\n## Usa subtítulos así\n\nSepara los párrafos con una línea en blanco.\n\n- Listas con guion\n- **Negrita** con dos asteriscos'}
                                    className={`${inputClass} resize-y leading-relaxed min-h-[320px]`}
                                />
                                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                                    Consejo: escribe para personas, no para Google. Responde dudas reales de tus clientes y enlaza a tus servicios.
                                </p>
                            </>
                        ) : (
                            <div className="rounded-xl p-4 sm:p-6 min-h-[320px]" style={{ border: '1px solid var(--color-border)' }}>
                                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-5" style={{ color: 'var(--color-text-main)' }}>{form.title || 'Sin título'}</h2>
                                {form.content.trim() ? <PostContent content={form.content} /> : <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>Aún no hay contenido.</p>}
                            </div>
                        )}
                    </Card>
                </div>

                {/* ── Columna lateral ───────────────────── */}
                <div className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-6">
                    {/* Publicación (solo escritorio; en móvil va en la barra inferior) */}
                    <Card className="hidden lg:block">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>Estado</h2>
                            <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={form.published ? { background: 'rgba(38,194,129,0.12)', color: '#15803d' } : { background: 'var(--color-bg-primary)', color: 'var(--color-text-muted)' }}
                            >
                                {form.published ? 'Publicado' : 'Borrador'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <ActionButtons />
                            <button onClick={onCancel} disabled={saving} className="text-sm font-medium py-2 hover:text-red-500 transition-colors" style={{ color: 'var(--color-text-light)' }}>
                                Cancelar
                            </button>
                        </div>
                    </Card>

                    {/* Vista previa en Google */}
                    <Card>
                        <div className="flex items-center gap-2 mb-3">
                            <Search size={15} style={{ color: 'var(--color-text-light)' }} />
                            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>Así se verá en Google</h2>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'var(--color-bg-primary)' }}>
                            <p className="text-xs truncate" style={{ color: '#4d5156' }}>
                                {window.location.host} › blog › {form.slug || '…'}
                            </p>
                            <p className="text-[17px] leading-snug mt-1 line-clamp-2" style={{ color: '#1a0dab' }}>
                                {(form.title || 'Título del artículo').slice(0, 65)}{form.title.length > 65 ? '…' : ''} | Azulejos Valencia
                            </p>
                            <p className="text-[13px] leading-snug mt-1 line-clamp-3" style={{ color: '#4d5156' }}>{previewDesc}</p>
                        </div>
                    </Card>

                    {/* Checklist SEO */}
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>Checklist SEO</h2>
                            <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor }}>{seo.score}/100</span>
                        </div>
                        <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'var(--color-bg-alt)' }}>
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${seo.score}%`, background: scoreColor }} />
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {seo.checks.map((c) => (
                                <li key={c.label} className="flex items-start gap-2 text-sm">
                                    {c.ok
                                        ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                                        : <Circle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-light)' }} />}
                                    <span style={{ color: c.ok ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
                                        {c.label}
                                        {c.detail && <span className="block text-xs" style={{ color: 'var(--color-text-light)' }}>{c.detail}</span>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Portada */}
                    <Card className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <ImageIcon size={15} style={{ color: 'var(--color-text-light)' }} />
                            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>Imagen de portada</h2>
                        </div>
                        <Field label="Enlace de la imagen" htmlFor="cover">
                            <input id="cover" type="url" inputMode="url" {...bind('coverImage')} placeholder="https://…/imagen.jpg" className={inputClass} />
                        </Field>
                        {form.coverImage && (
                            <div className="rounded-xl overflow-hidden aspect-video" style={{ background: 'var(--color-bg-alt)' }}>
                                <img src={form.coverImage} alt={form.coverAlt || 'Vista previa'} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            </div>
                        )}
                        <Field label="Texto alternativo" htmlFor="alt" hint="Describe la imagen. Google lo usa para entenderla y aparecer en Imágenes.">
                            <input id="alt" type="text" {...bind('coverAlt')} placeholder="Baño con azulejo hexagonal blanco" className={inputClass} />
                        </Field>
                    </Card>
                </div>
            </div>

            {/* Barra de acciones fija (móvil / tablet) */}
            <div
                className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2 px-4 pt-3 bg-white/95 backdrop-blur"
                style={{ borderTop: '1px solid var(--color-border)', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
            >
                <ActionButtons compact />
            </div>
        </div>
    )
}
