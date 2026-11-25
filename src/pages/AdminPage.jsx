import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, PlusCircle, Store, LogOut, ExternalLink } from 'lucide-react'
import Seo from '../components/Seo'
import PostListPanel from './admin/PostListPanel'
import PostEditorPanel from './admin/PostEditorPanel'
import SettingsPanel from './admin/SettingsPanel'

const MENU = [
    { id: 'posts', label: 'Blog', longLabel: 'Publicaciones', icon: FileText },
    { id: 'new-post', label: 'Nueva', longLabel: 'Nueva entrada', icon: PlusCircle },
    { id: 'settings', label: 'Negocio', longLabel: 'Horario y negocio', icon: Store },
]

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('posts')
    const [editingPost, setEditingPost] = useState(null)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut(auth)
        navigate('/login')
    }

    const go = (id) => {
        if (id === 'new-post') setEditingPost(null)
        setActiveTab(id)
        window.scrollTo({ top: 0 })
    }

    const handleEditPost = (post) => {
        setEditingPost(post)
        setActiveTab('edit-post')
        window.scrollTo({ top: 0 })
    }

    const handleSavePost = () => {
        setEditingPost(null)
        go('posts')
    }

    const isEditor = activeTab === 'new-post' || activeTab === 'edit-post'
    const isActive = (id) => activeTab === id || (id === 'posts' && activeTab === 'edit-post')

    return (
        <div className="admin-root min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
            <Seo title="Panel de administración" noindex />

            {/* ── Sidebar (escritorio) ───────────────────────── */}
            <aside
                className="hidden lg:flex fixed inset-y-0 left-0 z-20 w-64 flex-col bg-white"
                style={{ borderRight: '1px solid var(--color-border)' }}
            >
                <div className="px-6 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span
                        aria-hidden
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-green))' }}
                    >
                        AV
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>Panel Admin</p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-light)' }} title={user?.email}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1" aria-label="Administración">
                    {MENU.map(({ id, longLabel, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => go(id)}
                            aria-current={isActive(id) ? 'page' : undefined}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left w-full transition-colors"
                            style={{
                                background: isActive(id) ? 'rgba(0,113,188,0.08)' : 'transparent',
                                color: isActive(id) ? 'var(--color-brand-blue)' : 'var(--color-text-muted)',
                            }}
                        >
                            <Icon size={18} />
                            {longLabel}
                        </button>
                    ))}
                </nav>

                <div className="p-4 flex flex-col gap-1" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
                        style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    >
                        <ExternalLink size={18} />
                        Ver sitio web
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition-colors hover:bg-red-50 hover:text-red-600"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ── Barra superior (móvil / tablet) ────────────── */}
            <header
                className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 h-14 bg-white/95 backdrop-blur"
                style={{ borderBottom: '1px solid var(--color-border)', paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <span
                        aria-hidden
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-green))' }}
                    >
                        AV
                    </span>
                    <div className="min-w-0 leading-tight">
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>Panel Admin</p>
                        <p className="text-[11px] truncate" style={{ color: 'var(--color-text-light)' }}>{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link
                        to="/"
                        target="_blank"
                        aria-label="Ver sitio web"
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <ExternalLink size={18} />
                    </Link>
                    <button
                        onClick={handleLogout}
                        aria-label="Cerrar sesión"
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* ── Contenido ──────────────────────────────────── */}
            <main className={`lg:ml-64 px-4 py-5 sm:px-6 sm:py-8 lg:px-10 ${isEditor ? 'pb-28' : 'pb-24'} lg:pb-10`}>
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'posts' && (
                        <PostListPanel onNewPost={() => go('new-post')} onEditPost={handleEditPost} />
                    )}
                    {isEditor && (
                        <PostEditorPanel
                            key={editingPost?.id || 'new'}
                            post={editingPost}
                            onSave={handleSavePost}
                            onCancel={() => go('posts')}
                        />
                    )}
                    {activeTab === 'settings' && <SettingsPanel />}
                </div>
            </main>

            {/* ── Navegación inferior (móvil / tablet) ───────── */}
            {!isEditor && (
                <nav
                    aria-label="Administración"
                    className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white grid grid-cols-3"
                    style={{ borderTop: '1px solid var(--color-border)', paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    {MENU.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => go(id)}
                            aria-current={isActive(id) ? 'page' : undefined}
                            className="h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                            style={{ color: isActive(id) ? 'var(--color-brand-blue)' : 'var(--color-text-light)' }}
                        >
                            <Icon size={22} strokeWidth={isActive(id) ? 2.4 : 2} />
                            {label}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    )
}
