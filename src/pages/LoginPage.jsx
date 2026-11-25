import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import Logo from '../components/Logo'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No existe ninguna cuenta con ese correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
        'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
      }
      setError(messages[err.code] || 'Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-5"
          style={{ background: 'var(--color-brand-blue)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'var(--color-brand-green)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="card-glass rounded-2xl p-10 shadow-xl"
          style={{ background: 'var(--color-bg-surface)' }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo width={50} height={75} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="font-display text-2xl font-bold mb-1"
              style={{ color: 'var(--color-text-main)' }}
            >
              Panel de Administración
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-start gap-3 rounded-xl p-4 mb-6 text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#DC2626',
              }}
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-main)' }}
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@empresa.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-bg-primary)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-brand-blue)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-main)' }}
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-bg-primary)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-brand-blue)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,113,188,0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-premium btn-brand w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Iniciando sesión…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={16} />
                  Iniciar sesión
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm transition-colors hover:underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
