import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/admin')
        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg-primary)' }}>
            <Seo title="Acceso" noindex />
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10" style={{ border: '1px solid var(--color-border)' }}>
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <Logo width={50} height={75} />
                        <h1 className="font-display text-2xl font-bold mt-4" style={{ color: 'var(--color-text-main)' }}>
                            Panel Administrador
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                            Acceso exclusivo · Azulejos Valencia
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                            <AlertCircle size={16} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-light)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="ceo@azulejosvalencia.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-primary)',
                                        color: 'var(--color-text-main)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-brand-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-light)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-primary)',
                                        color: 'var(--color-text-main)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-brand-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium btn-brand w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Accediendo...
                                </span>
                            ) : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#0071BC]"
                        style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    >
                        <ArrowLeft size={14} />
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

