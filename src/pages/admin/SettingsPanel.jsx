import { useState, useEffect, useMemo } from 'react'
import { deleteField } from 'firebase/firestore'
import { Clock, Phone, Mail, MapPin, Plus, X, Copy, AlertTriangle } from 'lucide-react'
import { getSettings, updateSettings } from '../../services/settingsService'
import { DAYS, MAX_SHIFTS, normalizeSchedule, validateSchedule, todayIndex } from '../../utils/schedule'
import { Toast, PageHeader, Card, CardTitle, Switch } from './ui'

const timeInput =
    'w-full min-w-0 px-3 py-2.5 rounded-lg text-base sm:text-sm bg-white outline-none border border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[rgba(0,113,188,0.12)]'

function describeFirestoreError(e) {
    const msg = `${e?.code || ''} ${e?.message || ''}`.toLowerCase()
    if (msg.includes('permission')) {
        return 'No tienes permiso para leer o guardar en la base de datos. Revisa que hayas iniciado sesión y que las reglas de Firestore estén publicadas.'
    }
    if (msg.includes('offline') || msg.includes('unavailable') || msg.includes('not-found') || msg.includes('failed to get document')) {
        return 'No se pudo conectar con la base de datos (Firestore). Comprueba que la base de datos esté creada en Firebase y tu conexión a internet.'
    }
    return `No se pudo conectar con la base de datos: ${e?.message || 'error desconocido'}`
}

function DayRow({ entry, index, error, isToday, onChange, onCopyToAll }) {
    const day = DAYS[index]
    const isOpen = !entry.closed

    const setShift = (si, field, value) =>
        onChange({ ...entry, shifts: entry.shifts.map((s, i) => (i === si ? { ...s, [field]: value } : s)) })

    const toggleOpen = (open) =>
        onChange({
            ...entry,
            closed: !open,
            shifts: open && !entry.shifts.length ? [{ open: '10:00', close: '19:00' }] : entry.shifts,
        })

    const addShift = () => {
        const last = entry.shifts[entry.shifts.length - 1]
        onChange({ ...entry, shifts: [...entry.shifts, { open: last?.close > '17:00' ? last.close : '17:00', close: '20:00' }] })
    }

    const removeShift = (si) => onChange({ ...entry, shifts: entry.shifts.filter((_, i) => i !== si) })

    return (
        <li
            className="py-4 first:pt-0 last:pb-0"
            style={{ borderBottom: '1px solid var(--color-border)' }}
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
                {/* Día + interruptor */}
                <div className="flex items-center justify-between gap-3 md:w-56 md:flex-shrink-0 md:pt-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold" style={{ color: 'var(--color-text-main)' }}>{day.label}</span>
                        {isToday && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,113,188,0.08)', color: 'var(--color-brand-blue)' }}>
                                Hoy
                            </span>
                        )}
                    </div>
                    <Switch
                        id={`open-${day.key}`}
                        checked={isOpen}
                        onChange={toggleOpen}
                        label={isOpen ? 'Abierto' : 'Cerrado'}
                    />
                </div>

                {/* Tramos */}
                <div className="flex-1 min-w-0">
                    {isOpen ? (
                        <div className="flex flex-col gap-2">
                            {entry.shifts.map((s, si) => (
                                <div key={si} className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        aria-label={`${day.label}, apertura tramo ${si + 1}`}
                                        value={s.open}
                                        onChange={(e) => setShift(si, 'open', e.target.value)}
                                        className={timeInput}
                                    />
                                    <span className="text-sm flex-shrink-0" style={{ color: 'var(--color-text-light)' }}>a</span>
                                    <input
                                        type="time"
                                        aria-label={`${day.label}, cierre tramo ${si + 1}`}
                                        value={s.close}
                                        onChange={(e) => setShift(si, 'close', e.target.value)}
                                        className={timeInput}
                                    />
                                    {entry.shifts.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeShift(si)}
                                            aria-label={`Quitar tramo ${si + 1} del ${day.label}`}
                                            className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                                            style={{ color: '#DC2626' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    ) : (
                                        <span className="w-10 flex-shrink-0 hidden sm:block" />
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-1">
                                {entry.shifts.length < MAX_SHIFTS && (
                                    <button
                                        type="button"
                                        onClick={addShift}
                                        className="inline-flex items-center gap-1 text-xs font-semibold py-1.5"
                                        style={{ color: 'var(--color-brand-blue)' }}
                                    >
                                        <Plus size={14} /> Jornada partida
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onCopyToAll}
                                    className="inline-flex items-center gap-1 text-xs font-semibold py-1.5"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <Copy size={13} /> Copiar a todos
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm md:pt-2.5" style={{ color: 'var(--color-text-light)' }}>
                            No se atiende este día
                        </p>
                    )}
                    {error && (
                        <p className="text-xs font-medium mt-2" style={{ color: '#DC2626' }}>{error}</p>
                    )}
                </div>
            </div>
        </li>
    )
}

export default function SettingsPanel() {
    const [schedule, setSchedule] = useState(() => normalizeSchedule(null))
    const [saved, setSaved] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [showErrors, setShowErrors] = useState(false)
    const [loadError, setLoadError] = useState(null)
    // true si el horario aún no está guardado en el formato día por día
    const [needsFirstSave, setNeedsFirstSave] = useState(false)

    useEffect(() => {
        getSettings()
            .then((s) => {
                const sch = normalizeSchedule(s)
                setSchedule(sch)
                setSaved(JSON.stringify(sch))
                setNeedsFirstSave(!Array.isArray(s?.schedule))
            })
            .catch((e) => {
                console.error('Error cargando configuración:', e)
                setLoadError(describeFirestoreError(e))
                setNeedsFirstSave(true)
            })
            .finally(() => setLoading(false))
    }, [])

    const errors = useMemo(() => validateSchedule(schedule), [schedule])
    const dirty = needsFirstSave || (saved !== null && JSON.stringify(schedule) !== saved)
    const today = todayIndex()

    const notify = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const updateDay = (i, entry) => setSchedule((prev) => prev.map((d, idx) => (idx === i ? entry : d)))

    const copyToAll = (i) => {
        const source = schedule[i]
        setSchedule((prev) =>
            prev.map((d, idx) => (idx === i || d.closed ? d : { ...d, shifts: source.shifts.map((s) => ({ ...s })) }))
        )
        notify(`Horario del ${DAYS[i].label.toLowerCase()} copiado`)
    }

    const handleSave = async () => {
        if (Object.keys(errors).length) {
            setShowErrors(true)
            notify('Revisa los días marcados en rojo', 'error')
            return
        }
        setSaving(true)
        try {
            // Guardamos el nuevo formato y eliminamos el antiguo (`horarios`)
            await updateSettings({ schedule, horarios: deleteField() })
            setSaved(JSON.stringify(schedule))
            setNeedsFirstSave(false)
            setLoadError(null)
            setShowErrors(false)
            notify('Horario guardado')
        } catch (e) {
            console.error(e)
            setLoadError(describeFirestoreError(e))
            notify('No se pudo guardar el horario', 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="pb-24 lg:pb-0">
            <Toast {...(toast || {})} />

            <PageHeader
                title="Negocio"
                subtitle="Horario de atención y datos que se muestran en la web"
            />

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 lg:gap-6 items-start">
                <Card>
                    <CardTitle
                        icon={Clock}
                        tone="green"
                        title="Horario de atención"
                        subtitle="Se muestra en Contacto y Google lo usa para tu ficha local"
                    />

                    {loadError && (
                        <div role="alert" className="flex gap-2.5 rounded-xl p-3 mb-5 text-sm" style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
                            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                            <p>{loadError}</p>
                        </div>
                    )}
                    {!loadError && needsFirstSave && !loading && (
                        <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: 'rgba(0,113,188,0.06)', color: 'var(--color-brand-blue-dark)' }}>
                            Revisa el horario y pulsa <strong>Guardar</strong> para publicarlo día por día en la web.
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {DAYS.map((d) => (
                                <div key={d.key} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-primary)' }} />
                            ))}
                        </div>
                    ) : (
                        <ul>
                            {schedule.map((entry, i) => (
                                <DayRow
                                    key={entry.day}
                                    entry={entry}
                                    index={i}
                                    isToday={i === today}
                                    error={showErrors ? errors[i] : null}
                                    onChange={(e) => updateDay(i, e)}
                                    onCopyToAll={() => copyToAll(i)}
                                />
                            ))}
                        </ul>
                    )}

                    {/* Guardar — escritorio */}
                    <div className="hidden lg:flex items-center justify-end gap-4 mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                        {dirty && <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Tienes cambios sin guardar</span>}
                        <button
                            onClick={handleSave}
                            disabled={saving || loading || !dirty}
                            className="btn-premium btn-brand text-sm !py-2.5 !px-6 disabled:opacity-50"
                        >
                            {saving ? 'Guardando…' : 'Guardar horario'}
                        </button>
                    </div>
                </Card>

                <Card>
                    <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text-main)' }}>Información de contacto</h2>
                    <p className="text-xs mb-4" style={{ color: 'var(--color-text-light)' }}>Para cambiar estos datos, contacta con el desarrollador</p>
                    {[
                        { icon: Phone, label: 'Teléfono', value: '+34 692 580 681' },
                        { icon: Mail, label: 'Email', value: 'genesis2777@gmail.com' },
                        { icon: MapPin, label: 'Dirección', value: 'Calle Cura Palanca 1, bajo 1\n46013 Valencia, España' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 py-3 last:pb-0" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,113,188,0.08)', color: 'var(--color-brand-blue)' }}>
                                <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold" style={{ color: 'var(--color-text-light)' }}>{label}</p>
                                <p className="text-sm font-medium whitespace-pre-line break-words" style={{ color: 'var(--color-text-main)' }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            {/* Guardar — móvil: barra fija sobre la navegación inferior */}
            <div
                className="lg:hidden fixed left-0 right-0 z-30 px-4 py-3 bg-white/95 backdrop-blur"
                style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--color-border)' }}
            >
                <button
                    onClick={handleSave}
                    disabled={saving || loading || !dirty}
                    className="btn-premium btn-brand w-full text-sm !py-3 disabled:opacity-50"
                >
                    {saving ? 'Guardando…' : dirty ? 'Guardar cambios' : 'Sin cambios'}
                </button>
            </div>
        </div>
    )
}
