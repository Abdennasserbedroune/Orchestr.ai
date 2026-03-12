// Bug 13 fix: useSearchParams wrapped in Suspense via inner component pattern
'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const SLUG_REGEX = /^[a-z0-9-]+$/

function slugify(val: string) {
  return val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

type Step = 'account' | 'workspace'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = (searchParams.get('step') as Step | null) ?? 'account'

  const [step, setStep] = useState<Step>(initialStep)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const [wsName, setWsName] = useState('')
  const [wsSlug, setWsSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleWsNameChange(val: string) {
    setWsName(val)
    if (!slugEdited) setWsSlug(slugify(val))
  }

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    setLoading(false)
    setStep('workspace')
  }

  async function handleWorkspaceSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!wsSlug || wsSlug.length < 3 || wsSlug.length > 30 || !SLUG_REGEX.test(wsSlug)) {
      setError('Le slug doit contenir entre 3 et 30 lettres minuscules, chiffres ou tirets.')
      return
    }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ name: wsName.trim(), slug: wsSlug }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'La création de l\'espace de travail a échoué.'); setLoading(false); return }
    router.push('/chat')
  }

  const passwordStrength = (() => {
    if (password.length === 0) return null
    if (password.length < 8) return 'weak'
    if (password.length < 12) return 'fair'
    return 'strong'
  })()
  const strengthColor: Record<string, string> = { weak: '#EF4444', fair: '#F59E0B', strong: '#22C55E' }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 relative overflow-hidden font-sans">

      {/* Very faint background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] rounded-[24px] border border-white/[0.08] bg-[#111111] p-10 animate-slide-up shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-xl object-contain shadow-lg" />
          <h1 className="font-display text-[26px] font-semibold text-foreground tracking-tight text-center">
            {step === 'account' ? 'Créer un compte' : 'Créer l\'espace'}
          </h1>
          <p className="text-[14px] text-[#a1a1aa] text-center px-4">
            {step === 'account' ? 'Rejoignez-nous en moins d\'une minute.' : 'Votre espace de travail est l\'endroit où vivent vos agents.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(['account', 'workspace'] as Step[]).map((s, i) => {
            const done = step === 'workspace' && s === 'account'
            const current = step === s
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-mono transition-all duration-300"
                  style={{
                    background: done ? 'transparent' : current ? 'white' : 'transparent',
                    border: done ? '1px solid #22C55E' : current ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    color: done ? '#22C55E' : current ? 'black' : '#a1a1aa',
                  }}
                >
                  {done ? <Check size={10} strokeWidth={3} /> : i + 1}
                </div>
                <span className={`text-[11px] uppercase tracking-wider font-semibold ${current ? 'text-white' : 'text-[#a1a1aa]'}`}>
                  {s === 'account' ? 'Compte' : 'Espace'}
                </span>
                {i === 0 && (
                  <div className="w-[30px] h-px bg-white/10 mx-1" />
                )}
              </div>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-[12px] px-4 py-3 mb-6 text-[14px] bg-red-500/10 border border-red-500/20 text-red-400" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {step === 'account' && (
          <form onSubmit={handleAccountSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="name">Nom complet</label>
              <input id="name" type="text" autoComplete="name" required value={name}
                onChange={e => setName(e.target.value)} placeholder="Ada Lovelace"
                className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]" disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" autoComplete="email" required value={email}
                onChange={e => setEmail(e.target.value)} placeholder="vous@entreprise.com"
                className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]" disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="reg-password">Mot de passe</label>
              <div className="relative">
                <input id="reg-password" type={show ? 'text' : 'password'} autoComplete="new-password"
                  required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères" className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b] pr-10" disabled={loading} />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#a1a1aa] transition-colors"
                  aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{
                      width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'fair' ? '66%' : '100%',
                      background: strengthColor[passwordStrength],
                    }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: strengthColor[passwordStrength] }}>
                    {passwordStrength === 'weak' ? 'faible' : passwordStrength === 'fair' ? 'moyen' : 'fort'}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !name || !email || !password}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-[12px] py-3 text-[15px] font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  Création…
                </span>
              ) : (
                <span>Continuer</span>
              )}
            </button>
          </form>
        )}

        {step === 'workspace' && (
          <form onSubmit={handleWorkspaceSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="ws-name">Nom de l'espace</label>
              <input id="ws-name" type="text" required value={wsName}
                onChange={e => handleWsNameChange(e.target.value)}
                placeholder="Acme Corp" className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]" disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="ws-slug">URL (slug)</label>
              <div className="relative flex items-center bg-[#18181b] border border-white/5 rounded-[12px] focus-within:border-white/20 transition-colors overflow-hidden">
                <span className="pl-4 pr-1 text-[#52525b] font-mono text-[14px]">/</span>
                <input id="ws-slug" type="text" required value={wsSlug}
                  onChange={e => { setSlugEdited(true); setWsSlug(slugify(e.target.value)) }}
                  placeholder="acme-corp" className="w-full bg-transparent border-none py-2.5 pr-4 text-[15px] text-foreground outline-none placeholder:text-[#52525b] font-mono" disabled={loading} />
              </div>
            </div>
            <button type="submit" disabled={loading || !wsName || wsSlug.length < 3}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-[12px] py-3 text-[15px] font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  Création…
                </span>
              ) : (
                <span>Lancer l'espace</span>
              )}
            </button>
          </form>
        )}

        <div className="flex justify-center mt-6">
          <p className="text-[14px] text-[#a1a1aa] text-center">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-white hover:underline font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Bug 13: export wraps RegisterForm in Suspense so useSearchParams doesn't break build
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <RegisterForm />
    </Suspense>
  )
}
