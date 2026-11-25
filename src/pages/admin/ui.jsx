import { CheckCircle, AlertCircle } from 'lucide-react'

/** Aviso flotante: arriba centrado en móvil, arriba a la derecha en escritorio. */
export function Toast({ message, type = 'success' }) {
    if (!message) return null
    const Icon = type === 'error' ? AlertCircle : CheckCircle
    return (
        <div
            role="status"
            className="fixed z-[60] top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white"
            style={{ background: type === 'error' ? '#DC2626' : 'var(--color-brand-green)' }}
        >
            <Icon size={16} className="flex-shrink-0" />
            {message}
        </div>
    )
}

export function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 lg:mb-8">
            <div className="min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {action}
        </div>
    )
}

export function Card({ children, className = '' }) {
    return (
        <section
            className={`rounded-2xl bg-white p-4 sm:p-6 ${className}`}
            style={{ border: '1px solid var(--color-border)' }}
        >
            {children}
        </section>
    )
}

export function CardTitle({ icon: Icon, title, subtitle, tone = 'blue' }) {
    const tones = {
        blue: { background: 'rgba(0,113,188,0.08)', color: 'var(--color-brand-blue)' },
        green: { background: 'rgba(38,194,129,0.1)', color: 'var(--color-brand-green)' },
    }
    return (
        <div className="flex items-center gap-3 mb-5">
            {Icon && (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={tones[tone]}>
                    <Icon size={18} />
                </div>
            )}
            <div className="min-w-0">
                <h2 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>{title}</h2>
                {subtitle && <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{subtitle}</p>}
            </div>
        </div>
    )
}

/** Interruptor accesible (checkbox con apariencia de switch). */
export function Switch({ checked, onChange, label, id }) {
    return (
        <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
            <span
                aria-hidden
                className="relative w-11 h-6 rounded-full transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[var(--color-brand-blue)]"
                style={{ background: checked ? 'var(--color-brand-green)' : '#D1D5DB' }}
            >
                <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: checked ? '1.5rem' : '0.25rem' }}
                />
            </span>
            {label && <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</span>}
        </label>
    )
}

export const inputClass =
    'w-full px-3.5 py-3 rounded-xl text-base sm:text-sm outline-none bg-white transition-colors border border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[rgba(0,113,188,0.12)]'

export function Field({ label, hint, htmlFor, children, counter }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={htmlFor} className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
                    {label}
                </label>
                {counter}
            </div>
            {children}
            {hint && <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{hint}</p>}
        </div>
    )
}
