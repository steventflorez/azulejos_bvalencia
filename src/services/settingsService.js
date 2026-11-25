import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const SETTINGS_REF = () => doc(db, 'settings', 'main')

/**
 * Trae el documento settings/main.
 * @returns {Promise<Object|null>}
 */
export async function getSettings() {
  const snapshot = await getDoc(SETTINGS_REF())
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Actualiza (o crea) el documento settings/main.
 * Usa setDoc con merge:true para no sobreescribir campos existentes.
 * @param {Object} data
 */
export async function updateSettings(data) {
  await setDoc(SETTINGS_REF(), data, { merge: true })
}
