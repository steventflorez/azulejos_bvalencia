import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDRD9o5wcdWX7p9n-c0rsUKsZq-mCEJv40",
  authDomain: "azulejos-bvalencia.firebaseapp.com",
  projectId: "azulejos-bvalencia",
  storageBucket: "azulejos-bvalencia.firebasestorage.app",
  messagingSenderId: "297074073632",
  appId: "1:297074073632:web:933b6df7452309e6f31c45"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
