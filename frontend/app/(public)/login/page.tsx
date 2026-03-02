'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email,    setEmail   ] = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow    ] = useState(false)
  const [loading,  setLoading ] = useState(false)
  const [error,    setError   ] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Check if workspace exists — redirect accordingly
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/workspaces', {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    const json = await res.json()
    router.push(json.workspace ? '/command' : '/register?step=workspace')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Ambient glow */}
      <div className="glow-blob w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      {/* Card */}
      <div
        className="relative w-full max-w-[400px] card p-8 animate-slide-up"
        style={{ boxShadow: '0 0 60px -10px rgba(99,102,241,0.15)' }}
      >

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #5254CC, #6366F1)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-base text-foreground">Orchestrai</span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted mt-1.5 mb-8">
          Sign in to your workspace.
        </p>

        {/* Error */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

          <div className="flex flex-col gap-1.5">
            <label className="section-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="input"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="section-label" htmlFor="password">Password</label>
              <button
                type="button"
                className="font-mono text-2xs text-muted hover:text-brand transition-colors"
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted transition-colors"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight size={14} />
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-muted text-center mt-6">
          No account?{' '}
          <Link href="/register" className="text-brand hover:underline font-medium">
            Create workspace
          </Link>
        </p>

      </div>
    </div>
  )
}
