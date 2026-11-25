/**
 * Horario semanal del negocio, día por día.
 *
 * Estructura guardada en Firestore (settings/main.schedule):
 * [
 *   { day: 'monday', closed: false, shifts: [{ open: '10:00', close: '14:00' }, { open: '17:00', close: '20:00' }] },
 *   ...
 * ]
 * Cada día admite uno o dos tramos (jornada partida).
 */

export const DAYS = [
    { key: 'monday', label: 'Lunes', short: 'Lun', schema: 'Monday' },
    { key: 'tuesday', label: 'Martes', short: 'Mar', schema: 'Tuesday' },
    { key: 'wednesday', label: 'Miércoles', short: 'Mié', schema: 'Wednesday' },
    { key: 'thursday', label: 'Jueves', short: 'Jue', schema: 'Thursday' },
    { key: 'friday', label: 'Viernes', short: 'Vie', schema: 'Friday' },
    { key: 'saturday', label: 'Sábado', short: 'Sáb', schema: 'Saturday' },
    { key: 'sunday', label: 'Domingo', short: 'Dom', schema: 'Sunday' },
]

export const MAX_SHIFTS = 2

const open = (o, c) => ({ closed: false, shifts: [{ open: o, close: c }] })

export const DEFAULT_SCHEDULE = [
    { day: 'monday', ...open('10:00', '19:00') },
    { day: 'tuesday', ...open('10:00', '19:00') },
    { day: 'wednesday', ...open('10:00', '19:00') },
    { day: 'thursday', ...open('10:00', '19:00') },
    { day: 'friday', ...open('10:00', '15:00') },
    { day: 'saturday', ...open('10:00', '13:00') },
    { day: 'sunday', closed: true, shifts: [] },
]

const TIME_RE = /(\d{1,2})[:.](\d{2})/g

/** Convierte el formato antiguo (`horarios` con rangos tipo "Lunes — Jueves") a día por día. */
function fromLegacy(horarios) {
    const result = DEFAULT_SCHEDULE.map((d) => ({ ...d, shifts: [...d.shifts] }))
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const indexOf = (word) => DAYS.findIndex((d) => norm(d.label) === word)

    for (const h of horarios) {
        const words = norm(h.label || '').match(/[a-z]+/g) || []
        const found = words.map(indexOf).filter((i) => i >= 0)
        if (!found.length) continue
        const from = found[0]
        const to = found[found.length - 1]
        const times = [...(h.value || '').matchAll(TIME_RE)].map((m) => `${m[1].padStart(2, '0')}:${m[2]}`)
        const shifts = []
        for (let i = 0; i + 1 < times.length && shifts.length < MAX_SHIFTS; i += 2) {
            shifts.push({ open: times[i], close: times[i + 1] })
        }
        for (let i = from; i <= to; i++) {
            result[i] = { day: DAYS[i].key, closed: !!h.closed || !shifts.length, shifts: h.closed ? [] : shifts }
        }
    }
    return result
}

/** Devuelve siempre 7 días ordenados (lunes → domingo) a partir de lo que haya en settings. */
export function normalizeSchedule(settings) {
    if (Array.isArray(settings?.schedule) && settings.schedule.length) {
        return DAYS.map((d, i) => {
            const found = settings.schedule.find((s) => s.day === d.key)
            if (!found) return { ...DEFAULT_SCHEDULE[i] }
            return {
                day: d.key,
                closed: !!found.closed,
                shifts: (found.shifts || []).slice(0, MAX_SHIFTS),
            }
        })
    }
    if (Array.isArray(settings?.horarios) && settings.horarios.length) {
        return fromLegacy(settings.horarios)
    }
    return DEFAULT_SCHEDULE.map((d) => ({ ...d, shifts: [...d.shifts] }))
}

export function formatShifts(entry) {
    if (entry.closed || !entry.shifts?.length) return 'Cerrado'
    return entry.shifts.map((s) => `${s.open} – ${s.close}`).join(' · ')
}

/** Índice del día de hoy en DAYS (0 = lunes) según la hora de Madrid. */
export function todayIndex(now = new Date()) {
    const name = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Europe/Madrid' }).toLowerCase()
    return DAYS.findIndex((d) => d.key === name)
}

/** ¿Está abierto ahora mismo? (hora de Madrid) */
export function isOpenNow(schedule, now = new Date()) {
    const entry = schedule[todayIndex(now)]
    if (!entry || entry.closed) return false
    const hhmm = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' })
    return entry.shifts.some((s) => s.open <= hhmm && hhmm < s.close)
}

/** Errores de validación por día (índice → mensaje). */
export function validateSchedule(schedule) {
    const errors = {}
    schedule.forEach((entry, i) => {
        if (entry.closed) return
        if (!entry.shifts.length) {
            errors[i] = 'Añade al menos un tramo o marca el día como cerrado.'
            return
        }
        for (const s of entry.shifts) {
            if (!s.open || !s.close) {
                errors[i] = 'Completa la hora de apertura y cierre.'
                return
            }
            if (s.open >= s.close) {
                errors[i] = 'La hora de cierre debe ser posterior a la de apertura.'
                return
            }
        }
        if (entry.shifts.length === 2 && entry.shifts[1].open < entry.shifts[0].close) {
            errors[i] = 'El segundo tramo debe empezar después del primero.'
        }
    })
    return errors
}

/** openingHoursSpecification para el JSON-LD de LocalBusiness (SEO local). */
export function toOpeningHoursSpec(schedule) {
    return schedule.flatMap((entry, i) =>
        entry.closed
            ? []
            : entry.shifts.map((s) => ({
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: `https://schema.org/${DAYS[i].schema}`,
                  opens: s.open,
                  closes: s.close,
              }))
    )
}
