import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
<<<<<<< HEAD
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
=======
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import PostListPanel from './admin/PostListPanel'
import PostEditorPanel from './admin/PostEditorPanel'
import SettingsPanel from './admin/SettingsPanel'
import { FileText, PlusCircle, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'posts', label: 'Publicaciones', icon: FileText },
  { key: 'new-post', label: 'Nueva entrada', icon: PlusCircle },
  { key: 'settings', label: 'Configuración', icon: Settings },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [editingPost, setEditingPost] = useState(null)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setActiveTab('new-post')
  }

  const handleSavePost = () => {
    setEditingPost(null)
    setActiveTab('posts')
  }

  const handleCancelEditor = () => {
    setEditingPost(null)
    setActiveTab('posts')
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setActiveTab('new-post')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 260,
          background: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div
          className="flex justify-center items-center py-8"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Logo width={44} height={66} />
        </div>

        {/* User info */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Sesión activa
          </p>
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-text-main)' }}
            title={user?.email}
          >
            {user?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key && !(key === 'new-post' && editingPost)
            const isEditorActive = key === 'new-post' && activeTab === 'new-post'

            return (
              <button
                key={key}
                onClick={() => {
                  if (key !== 'new-post') setEditingPost(null)
                  setActiveTab(key)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
                style={
                  isEditorActive || (isActive && key !== 'new-post')
                    ? {
                        background: 'rgba(0,113,188,0.08)',
                        color: 'var(--color-brand-blue)',
                      }
                    : {
                        color: 'var(--color-text-muted)',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isEditorActive && !(isActive && key !== 'new-post')) {
                    e.currentTarget.style.background = 'var(--color-bg-primary)'
                    e.currentTarget.style.color = 'var(--color-text-main)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isEditorActive && !(isActive && key !== 'new-post')) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-6" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-sm font-medium transition-all"
            style={{ color: '#EF4444' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'posts' && (
          <PostListPanel onEditPost={handleEditPost} onNewPost={handleNewPost} />
        )}
        {activeTab === 'new-post' && (
          <PostEditorPanel
            post={editingPost}
            onSave={handleSavePost}
            onCancel={handleCancelEditor}
          />
        )}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
>>>>>>> swarm-admin-panel-7291b61f
}
