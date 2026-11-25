/**
 * Renderiza el contenido de un post escrito con un Markdown sencillo:
 *   ## Subtítulo  /  ### Subtítulo menor
 *   - elemento de lista   /   1. lista numerada
 *   **negrita**  *cursiva*  [texto](https://enlace)
 * Los párrafos se separan con una línea en blanco.
 * No usa innerHTML: todo se construye como elementos React (seguro frente a XSS).
 */

const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g

function renderInline(text, keyPrefix) {
    const parts = text.split(INLINE_RE).filter(Boolean)
    return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
            const href = link[2]
            const safe = /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href)
            if (!safe) return link[1]
            const external = /^https?:\/\//i.test(href)
            return (
                <a key={key} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {link[1]}
                </a>
            )
        }
        return part
    })
}

/** Divide el texto en bloques (encabezados, listas, párrafos). */
export function parseBlocks(content = '') {
    const lines = content.replace(/\r\n/g, '\n').split('\n')
    const blocks = []
    let para = []
    let list = null

    const flushPara = () => {
        if (para.length) blocks.push({ type: 'p', lines: para })
        para = []
    }
    const flushList = () => {
        if (list) blocks.push(list)
        list = null
    }

    for (const raw of lines) {
        const line = raw.trimEnd()
        const h = line.match(/^(#{2,3})\s+(.*)$/)
        const ul = line.match(/^\s*[-*•]\s+(.*)$/)
        const ol = line.match(/^\s*\d+[.)]\s+(.*)$/)

        if (!line.trim()) {
            flushPara()
            flushList()
        } else if (h) {
            flushPara()
            flushList()
            blocks.push({ type: h[1].length === 2 ? 'h2' : 'h3', text: h[2] })
        } else if (ul || ol) {
            flushPara()
            const type = ul ? 'ul' : 'ol'
            if (!list || list.type !== type) {
                flushList()
                list = { type, items: [] }
            }
            list.items.push((ul || ol)[1])
        } else {
            flushList()
            para.push(line)
        }
    }
    flushPara()
    flushList()
    return blocks
}

/** Texto plano (para conteo de palabras, metadescripción automática, etc.). */
export function toPlainText(content = '') {
    return content
        .replace(/^#{2,3}\s+/gm, '')
        .replace(/^\s*([-*•]|\d+[.)])\s+/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
}

export default function PostContent({ content }) {
    const blocks = parseBlocks(content)
    return (
        <div className="post-content">
            {blocks.map((b, i) => {
                if (b.type === 'h2') return <h2 key={i}>{renderInline(b.text, i)}</h2>
                if (b.type === 'h3') return <h3 key={i}>{renderInline(b.text, i)}</h3>
                if (b.type === 'ul' || b.type === 'ol') {
                    const List = b.type
                    return (
                        <List key={i}>
                            {b.items.map((it, j) => <li key={j}>{renderInline(it, `${i}-${j}`)}</li>)}
                        </List>
                    )
                }
                return (
                    <p key={i}>
                        {b.lines.map((l, j) => (
                            <span key={j}>
                                {j > 0 && <br />}
                                {renderInline(l, `${i}-${j}`)}
                            </span>
                        ))}
                    </p>
                )
            })}
        </div>
    )
}
