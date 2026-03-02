// Bug 13 fix: useSearchParams wrapped in Suspense via inner component pattern
'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowRight, Check, AlertCircle, Layers, Cpu, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const FEATURES = [
  { icon: Layers,        text: 'Access 7 specialised AI agents' },
  { icon: Cpu,           text: 'Real-time operations board'      },
  { icon: MessageSquare, text: 'Brief \u2014 your AI ops consultant'  },
  { icon: Zap,           text: 'n8n workflow automation included' },
]

const SLUG_REGEX = /^[a-z0-9-]+$/

function slugify(val: string) {
  return val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

type Step = 'account' | 'workspace'

// Bug 13: useSearchParams must live in a component wrapped by Suspense
function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const initialStep  = (searchParams.get('step') as Step | null) ?? 'account'

  const [step, setStep] = useState<Step>(initialStep)

  const [name,     setName    ] = useState('')
  const [email,    setEmail   ] = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow    ] = useState(false)

  const [wsName,     setWsName    ] = useState('')
  const [wsSlug,     setWsSlug    ] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error,   setError  ] = useState<string | null>(null)

  function handleWsNameChange(val: string) {
    setWsName(val)
    if (!slugEdited) setWsSlug(slugify(val))
  }

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
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
      setError('Slug must be 3\u201330 lowercase letters, numbers, or hyphens.')
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
    if (!res.ok) { setError(json.error ?? 'Failed to create workspace.'); setLoading(false); return }
    router.push('/command')
  }

  const passwordStrength = (() => {
    if (password.length === 0) return null
    if (password.length < 8)  return 'weak'
    if (password.length < 12) return 'fair'
    return 'strong'
  })()
  const strengthColor: Record<string, string> = { weak: '#EF4444', fair: '#F59E0B', strong: '#22C55E' }

  return (
    <div className="min-h-screen flex bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 relative p-10"
           style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="glow-blob w-[500px] h-[500px] -top-20 -left-20 opacity-20 pointer-events-none" />
        <div className="flex items-center gap-2.5 relative z-10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #5254CC, #6366F1)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}
          >
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-base text-foreground">Orchestrai</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold text-foreground leading-tight">
            Your AI agent<br />
            <span className="text-gradient">operating system</span>
          </h2>
          <p className="text-sm text-muted mt-3 leading-relaxed">
            Deploy specialised AI agents across every business domain.
            Automate ops, content, finance, sales and more \u2014 in minutes.
          </p>
          <ul className="flex flex-col gap-3 mt-8">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                >
                  <Icon size={13} style={{ color: 'var(--color-brand)' }} />
                </span>
                <span className="text-sm text-muted">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <span className="status-dot active" />
          <span className="font-mono text-2xs text-muted tracking-widest uppercase">Free to start</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-[400px] animate-slide-up">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {(['account', 'workspace'] as Step[]).map((s, i) => {
              const done    = step === 'workspace' && s === 'account'
              const current = step === s
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-2xs font-mono transition-all duration-300"
                    style={{
                      background: done ? '#22C55E' : current ? 'var(--color-brand)' : 'rgba(255,255,255,0.06)',
                      border: done || current ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: done || current ? '#fff' : 'var(--color-subtle)',
                      boxShadow: current ? '0 0 12px rgba(99,102,241,0.5)' : 'none',
                    }}
                  >
                    {done ? <Check size={11} /> : i + 1}
                  </div>
                  <span
                    className="font-mono text-2xs tracking-widest uppercase transition-colors"
                    style={{ color: current ? 'var(--color-foreground)' : 'var(--color-subtle)' }}
                  >
                    {s === 'account' ? 'Account' : 'Workspace'}
                  </span>
                  {i === 0 && (
                    <div
                      className="w-8 h-px mx-1 transition-all duration-300"
                      style={{ background: step === 'workspace' ? 'var(--color-brand)' : 'rgba(255,255,255,0.08)' }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}
              role="alert"
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 'account' && (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
              <p className="text-sm text-muted mt-1.5 mb-8">Get started in under a minute.</p>
              <form onSubmit={handleAccountSubmit} className="flex flex-col gap-6" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="section-label" htmlFor="name">Full name</label>
                  <input id="name" type="text" autoComplete="name" required value={name}
                    onChange={e => setName(e.target.value)} placeholder="Ada Lovelace"
                    className="input" disabled={loading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="section-label" htmlFor="reg-email">Email</label>
                  <input id="reg-email" type="email" autoComplete="email" required value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                    className="input" disabled={loading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="section-label" htmlFor="reg-password">Password</label>
                  <div className="relative">
                    <input id="reg-password" type={show ? 'text' : 'password'} autoComplete="new-password"
                      required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" className="input pr-10" disabled={loading} />
                    <button type="button" onClick={() => setShow(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted transition-colors"
                      aria-label={show ? 'Hide password' : 'Show password'}>
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{
                          width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'fair' ? '66%' : '100%',
                          background: strengthColor[passwordStrength],
                        }} />
                      </div>
                      <span className="font-mono text-2xs capitalize" style={{ color: strengthColor[passwordStrength] }}>
                        {passwordStrength}
                      </span>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={loading || !name || !email || !password}
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating account\u2026
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Continue <ArrowRight size={14} /></span>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'workspace' && (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">Create workspace</h1>
              <p className="text-sm text-muted mt-1.5 mb-8">Your workspace is where your agents live.</p>
              <form onSubmit={handleWorkspaceSubmit} className="flex flex-col gap-6" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="section-label" htmlFor="ws-name">Workspace name</label>
                  <input id="ws-name" type="text" required value={wsName}
                    onChange={e => handleWsNameChange(e.target.value)}
                    placeholder="Acme Corp" className="input" disabled={loading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="section-label" htmlFor="ws-slug">Workspace slug</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm select-none pointer-events-none"
                      style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                    <input id="ws-slug" type="text" required value={wsSlug}
                      onChange={e => { setSlugEdited(true); setWsSlug(slugify(e.target.value)) }}
                      placeholder="acme-corp" className="input pl-7 font-mono" disabled={loading} />
                  </div>
                  <p className="font-mono text-2xs text-subtle">Lowercase letters, numbers, hyphens only \u00b7 3\u201330 chars</p>
                </div>
                <button type="submit" disabled={loading || !wsName || wsSlug.length < 3}
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating workspace\u2026
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Launch workspace <ArrowRight size={14} /></span>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-xs text-muted text-center mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-brand hover:underline font-medium">Sign in</Link>
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
