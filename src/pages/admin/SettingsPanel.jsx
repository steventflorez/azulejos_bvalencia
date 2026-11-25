<<<<<<< HEAD
import { useState, useEffect, useMemo } from 'react'
import { deleteField } from 'firebase/firestore'
import { Clock, Phone, Mail, MapPin, Plus, X, Copy } from 'lucide-react'
import { getSettings, updateSettings } from '../../services/settingsService'
import { DAYS, MAX_SHIFTS, normalizeSchedule, validateSchedule, todayIndex } from '../../utils/schedule'
import { Toast, PageHeader, Card, CardTitle, Switch } from './ui'

const timeInput =
    'w-full min-w-0 px-3 py-2.5 rounded-lg text-base sm:text-sm bg-white outline-none border border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[rgba(0,113,188,0.12)]'

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

    useEffect(() => {
        getSettings()
            .then((s) => {
                const sch = normalizeSchedule(s)
                setSchedule(sch)
                setSaved(JSON.stringify(sch))
            })
            .catch((e) => console.error('Error cargando configuración:', e))
            .finally(() => setLoading(false))
    }, [])

    const errors = useMemo(() => validateSchedule(schedule), [schedule])
    const dirty = saved !== null && JSON.stringify(schedule) !== saved
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
            setShowErrors(false)
            notify('Horario guardado')
        } catch (e) {
            console.error(e)
            notify('No se pudo guardar. Intenta de nuevo.', 'error')
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
=======
import { useState, useEffect, useCallback } from 'react'
import { getSettings, updateSettings } from '../../services/settingsService'
import { Save, CheckCircle, Clock, Mail, MapPin, Phone, Info } from 'lucide-react'

const DEFAULT_HORARIOS = [
  { label: 'Lunes — Jueves', open: '10:00', close: '19:00', closed: false },
  { label: 'Viernes', open: '10:00', close: '15:00', closed: false },
  { label: 'Sábado', open: '10:00', close: '13:00', closed: false },
  { label: 'Domingo', open: '', close: '', closed: true },
]

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium text-white"
      style={{ background: 'var(--color-brand-green)', animation: 'fadeInUp 0.3s ease' }}
    >
      <CheckCircle size={18} />
      {message}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ border: '1px solid var(--color-border)' }}
    >
      {[80, 80, 80, 40].map((w, i) => (
        <div
          key={i}
          className="h-9 rounded-lg animate-pulse"
          style={{ background: 'var(--color-border)', width: w }}
        />
      ))}
    </div>
  )
}

export default function SettingsPanel() {
  const [horarios, setHorarios] = useState(DEFAULT_HORARIOS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSettings()
      if (data?.horarios && Array.isArray(data.horarios)) {
        // Map Firestore format ({ label, value, closed }) to form format
        const mapped = data.horarios.map((h) => {
          if (h.open !== undefined) return h
          // Convert "10:00 — 19:00" value string to open/close parts
          const parts = (h.value || '').split('—').map((s) => s.trim())
          return {
            label: h.label || '',
            open: parts[0] || '',
            close: parts[1] || '',
            closed: h.closed ?? false,
          }
        })
        setHorarios(mapped)
      }
    } catch (err) {
      console.error('Error cargando configuración:', err)
      setError('No se pudo cargar la configuración. Se muestran valores por defecto.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateRow = (index, field, value) => {
    setHorarios((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      // Convert back to Firestore format
      const toSave = horarios.map((h) => ({
        label: h.label,
        value: h.closed ? '' : `${h.open} — ${h.close}`,
        closed: h.closed,
        open: h.open,
        close: h.close,
      }))
      await updateSettings({ horarios: toSave })
      setToast('¡Cambios guardados correctamente!')
    } catch (err) {
      console.error('Error guardando configuración:', err)
      setError('No se pudo guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: 'var(--color-bg-primary)',
    border: '1.5px solid var(--color-border)',
    color: 'var(--color-text-main)',
    borderRadius: '0.6rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Header */}
      <div className="mb-8">
        <div className="section-tag text-sm mb-2">Administración</div>
        <h1
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--color-text-main)' }}
        >
          Configuración
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Gestiona los horarios y datos del negocio
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

      {/* ── Horarios ──────────────────────────────────────── */}
      <div
        className="rounded-2xl p-7 mb-6"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <Clock size={20} style={{ color: 'var(--color-brand-blue)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>
            Horarios del local
          </h2>
        </div>

        <div className="space-y-3">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_100px_80px] gap-3 pb-2">
            {['Día / Periodo', 'Apertura', 'Cierre', 'Cerrado'].map((h) => (
              <span
                key={h}
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {h}
              </span>
            ))}
          </div>

          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : horarios.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_80px] gap-3 items-center p-4 rounded-xl transition-all"
                  style={{
                    border: '1px solid var(--color-border)',
                    background: row.closed ? 'rgba(107,114,128,0.03)' : 'transparent',
                    opacity: row.closed ? 0.7 : 1,
                  }}
                >
                  {/* Day label */}
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateRow(idx, 'label', e.target.value)}
                    style={{ ...inputStyle, fontWeight: 500 }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-brand-blue)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)'
                    }}
                  />

                  {/* Open time */}
                  <input
                    type="time"
                    value={row.open}
                    onChange={(e) => updateRow(idx, 'open', e.target.value)}
                    disabled={row.closed}
                    style={{
                      ...inputStyle,
                      opacity: row.closed ? 0.4 : 1,
                      cursor: row.closed ? 'not-allowed' : 'default',
                    }}
                    onFocus={(e) => {
                      if (!row.closed) e.target.style.borderColor = 'var(--color-brand-blue)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)'
                    }}
                  />

                  {/* Close time */}
                  <input
                    type="time"
                    value={row.close}
                    onChange={(e) => updateRow(idx, 'close', e.target.value)}
                    disabled={row.closed}
                    style={{
                      ...inputStyle,
                      opacity: row.closed ? 0.4 : 1,
                      cursor: row.closed ? 'not-allowed' : 'default',
                    }}
                    onFocus={(e) => {
                      if (!row.closed) e.target.style.borderColor = 'var(--color-brand-blue)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)'
                    }}
                  />

                  {/* Closed checkbox */}
                  <label className="flex items-center justify-start sm:justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.closed}
                      onChange={(e) => updateRow(idx, 'closed', e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: 'var(--color-brand-blue)' }}
                    />
                    <span
                      className="text-xs font-medium sm:hidden"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Cerrado
                    </span>
                  </label>
                </div>
              ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-premium btn-brand flex items-center gap-2 px-5 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* ── Info de contacto (read-only) ──────────────────── */}
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <Info size={20} style={{ color: 'var(--color-brand-blue)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>
            Información de contacto
          </h2>
        </div>
        <p
          className="text-xs mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-brand-blue)', display: 'inline-block' }}
          />
          Solo lectura — para modificar, edita el código fuente
        </p>

        <div className="space-y-4">
          {[
            { icon: Phone, label: 'Teléfono', value: '+34 963 000 000' },
            { icon: Mail, label: 'Correo electrónico', value: 'info@azulejosvalencia.com' },
            { icon: MapPin, label: 'Dirección', value: 'Carrer de la Pau, 12, 46001 Valencia, España' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 mt-0.5"
                style={{ background: 'rgba(0,113,188,0.08)' }}
              >
                <Icon size={16} style={{ color: 'var(--color-brand-blue)' }} />
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {label}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
>>>>>>> swarm-admin-panel-7291b61f
}
