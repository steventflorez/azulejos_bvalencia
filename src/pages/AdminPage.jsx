import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
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
}
