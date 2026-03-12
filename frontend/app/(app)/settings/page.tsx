'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { User, Lock, Mail, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// ── Small feedback banner ────────────────────────────────────────────
function Banner({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 16px', borderRadius: 12, marginBottom: 24,
      background: type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
    }}>
      {type === 'success'
        ? <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
        : <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />}
      <span style={{ fontSize: 13, color: type === 'success' ? '#86efac' : '#fca5a5' }}>{message}</span>
    </div>
  )
}

// ── Shared input style ────────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: '#0f0f0f',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e4e4e7',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
}

function SectionCard({ icon: Icon, color, title, children }: {
  icon: React.ElementType; color: string; title: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 18,
      padding: '24px 28px',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} style={{ color }} strokeWidth={1.8} />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fafafa', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Profile fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)

  // Email change
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)

  // Password change
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  const showBanner = useCallback((type: 'success' | 'error', message: string) => {
    setBanner({ type, message })
    setTimeout(() => setBanner(null), 4000)
  }, [])

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) console.error('Profile load error:', error.message)
      if (data) {
        setProfile(data as Profile)
        setFullName(data.full_name ?? '')
        setUsername(data.username ?? '')
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  // Save profile (name + username)
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null, username: username.trim() || null })
      .eq('id', profile.id)
    setSaving(false)
    if (error) showBanner('error', error.message)
    else showBanner('success', 'Profil mis à jour avec succès.')
  }

  // Change email
  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setEmailSaving(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailSaving(false)
    if (error) showBanner('error', error.message)
    else { showBanner('success', 'Email de confirmation envoyé. Vérifiez votre boîte mail.'); setNewEmail('') }
  }

  // Change password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { showBanner('error', 'Les mots de passe ne correspondent pas.'); return }
    if (newPassword.length < 8) { showBanner('error', 'Le mot de passe doit contenir au moins 8 caractères.'); return }
    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) showBanner('error', error.message)
    else { showBanner('success', 'Mot de passe mis à jour avec succès.'); setNewPassword(''); setConfirmPassword('') }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={24} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fafafa', margin: 0 }}>Paramètres</h1>
        <p style={{ fontSize: 14, color: '#71717a', marginTop: 6 }}>Gérez votre profil et vos informations de connexion.</p>
      </div>

      {banner && <Banner type={banner.type} message={banner.message} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Profile */}
        <SectionCard icon={User} color="#6366f1" title="Profil">
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#71717a', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nom complet</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Votre nom" style={INPUT_STYLE} autoComplete="name"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#71717a', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nom d&apos;utilisateur</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="votre_pseudo" style={INPUT_STYLE} autoComplete="username"
              />
            </div>
            <button type="submit" disabled={saving}
              style={{
                alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10,
                background: saving ? '#1f1f1f' : '#6366f1',
                color: saving ? '#52525b' : '#fff',
                border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.2s',
              }}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        </SectionCard>

        {/* ── Email */}
        <SectionCard icon={Mail} color="#3b82f6" title="Adresse email">
          <form onSubmit={handleChangeEmail} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#71717a', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nouvel email</label>
              <input
                type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder="nouvelle@adresse.com" style={INPUT_STYLE} autoComplete="email"
              />
              <p style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>Un email de confirmation sera envoyé à la nouvelle adresse.</p>
            </div>
            <button type="submit" disabled={emailSaving || !newEmail.trim()}
              style={{
                alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10,
                background: emailSaving || !newEmail.trim() ? '#1f1f1f' : '#3b82f6',
                color: emailSaving || !newEmail.trim() ? '#52525b' : '#fff',
                border: 'none', fontSize: 14, fontWeight: 600,
                cursor: emailSaving || !newEmail.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.2s',
              }}>
              {emailSaving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {emailSaving ? 'Envoi…' : 'Changer l’email'}
            </button>
          </form>
        </SectionCard>

        {/* ── Password */}
        <SectionCard icon={Lock} color="#a855f7" title="Mot de passe">
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#71717a', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nouveau mot de passe</label>
              <input
                type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••" style={INPUT_STYLE} autoComplete="new-password" minLength={8}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#71717a', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confirmer</label>
              <input
                type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" style={INPUT_STYLE} autoComplete="new-password" minLength={8}
              />
            </div>
            <button type="submit" disabled={passwordSaving || !newPassword || !confirmPassword}
              style={{
                alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 10,
                background: passwordSaving || !newPassword || !confirmPassword ? '#1f1f1f' : '#a855f7',
                color: passwordSaving || !newPassword || !confirmPassword ? '#52525b' : '#fff',
                border: 'none', fontSize: 14, fontWeight: 600,
                cursor: passwordSaving || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
              }}>
              {passwordSaving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {passwordSaving ? 'Mise à jour…' : 'Changer le mot de passe'}
            </button>
          </form>
        </SectionCard>

        {/* ── Danger zone */}
        <div style={{
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 18, padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Trash2 size={17} style={{ color: '#ef4444' }} strokeWidth={1.8} />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fca5a5', margin: 0 }}>Zone dangereuse</h2>
          </div>
          <p style={{ fontSize: 13, color: '#71717a', marginBottom: 16, lineHeight: 1.6 }}>
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr ? Cette action est irréversible.')) {
                supabase.auth.admin && showBanner('error', 'Contactez le support pour supprimer votre compte.')
              }
            }}
            style={{
              padding: '9px 22px', borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(239,68,68,0.35)',
              color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Supprimer mon compte
          </button>
        </div>

      </div>
    </div>
  )
}
