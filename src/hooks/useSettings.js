import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { normalizeSchedule } from '../utils/schedule'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const docRef = doc(db, 'settings', 'main')

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setSettings(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : {})
        setLoading(false)
      },
      (err) => {
        console.error('useSettings error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Horario siempre día por día (lunes → domingo), con valores por defecto si aún no existe
  const schedule = normalizeSchedule(settings)

  return { settings, schedule, loading, error }
}

export default useSettings
