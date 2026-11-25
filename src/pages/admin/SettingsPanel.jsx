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
}
