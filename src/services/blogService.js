import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION = 'blogPosts'

/**
 * Crea un nuevo post.
 * @param {Object} data - Datos del post (title, slug, content, excerpt, published, coverImage, author, etc.)
 * @returns {Promise<string>} ID del documento creado
 */
export async function createPost(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

/**
 * Actualiza un post existente.
 * @param {string} id - ID del documento
 * @param {Object} data - Campos a actualizar
 */
export async function updatePost(id, data) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

/**
 * Elimina un post.
 * @param {string} id - ID del documento
 */
export async function deletePost(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}

/**
 * Trae todos los posts (para admin, incluyendo borradores).
 * @returns {Promise<Array>} Lista de posts
 */
export async function getAllPosts() {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Trae un post por su slug.
 * Para visitantes usa publishedOnly: las reglas de Firestore rechazan
 * la consulta si no filtra por published == true.
 * @param {string} slug
 * @param {{ publishedOnly?: boolean }} [options]
 * @returns {Promise<Object|null>} El post encontrado o null
 */
export async function getPostBySlug(slug, { publishedOnly = false } = {}) {
  const filters = [where('slug', '==', slug)]
  if (publishedOnly) filters.push(where('published', '==', true))
  const q = query(collection(db, COLLECTION), ...filters)
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { id: d.id, ...d.data() }
}
