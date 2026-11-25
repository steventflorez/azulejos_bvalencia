import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export function useBlogPosts() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    let q
    if (user) {
      // Admin / authenticated: traer todos los posts
      q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'))
    } else {
      // Visitante: solo publicados
      q = query(
        collection(db, 'blogPosts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      )
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPosts(data)
        setLoading(false)
      },
      (err) => {
        console.error('useBlogPosts error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { posts, loading, error }
}

export default useBlogPosts
