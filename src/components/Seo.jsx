import { useEffect } from 'react'

const SITE_NAME = 'Azulejos Valencia'

function upsert(selector, create) {
    let el = document.head.querySelector(selector)
    const existed = !!el
    if (!el) {
        el = create()
        document.head.appendChild(el)
    }
    return { el, existed }
}

function setMeta(attr, key, content) {
    const { el, existed } = upsert(`meta[${attr}="${key}"]`, () => {
        const m = document.createElement('meta')
        m.setAttribute(attr, key)
        return m
    })
    const previous = el.getAttribute('content')
    el.setAttribute('content', content)
    return () => (existed ? el.setAttribute('content', previous ?? '') : el.remove())
}

function setLink(rel, href) {
    const { el, existed } = upsert(`link[rel="${rel}"]`, () => {
        const l = document.createElement('link')
        l.setAttribute('rel', rel)
        return l
    })
    const previous = el.getAttribute('href')
    el.setAttribute('href', href)
    return () => (existed ? el.setAttribute('href', previous ?? '') : el.remove())
}

/**
 * Actualiza <title>, meta description, canonical y Open Graph de la página actual
 * (sin duplicar etiquetas) y opcionalmente inserta datos estructurados JSON-LD.
 */
export default function Seo({ title, description, path, image, type = 'website', noindex = false, jsonLd }) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Espacios de Lujo en Cerámica`
    const url = path ? `${window.location.origin}${path}` : window.location.href.split('#')[0]
    const ld = jsonLd ? JSON.stringify(jsonLd) : null

    useEffect(() => {
        const prevTitle = document.title
        document.title = fullTitle
        const cleanups = [
            setLink('canonical', url),
            setMeta('property', 'og:title', fullTitle),
            setMeta('property', 'og:type', type),
            setMeta('property', 'og:url', url),
            setMeta('property', 'og:site_name', SITE_NAME),
            setMeta('property', 'og:locale', 'es_ES'),
            setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary'),
        ]
        if (description) {
            cleanups.push(setMeta('name', 'description', description), setMeta('property', 'og:description', description))
        }
        if (image) cleanups.push(setMeta('property', 'og:image', image))
        if (noindex) cleanups.push(setMeta('name', 'robots', 'noindex, nofollow'))

        let script
        if (ld) {
            script = document.createElement('script')
            script.type = 'application/ld+json'
            script.textContent = ld
            document.head.appendChild(script)
        }

        return () => {
            document.title = prevTitle
            cleanups.forEach((fn) => fn())
            script?.remove()
        }
    }, [fullTitle, description, url, image, type, noindex, ld])

    return null
}
