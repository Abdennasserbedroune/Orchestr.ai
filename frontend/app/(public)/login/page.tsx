'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    router.push(json.workspace ? '/chat' : '/register?step=workspace')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 relative overflow-hidden font-sans">

      {/* Very faint background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] rounded-[24px] border border-white/[0.08] bg-[#111111] p-10 animate-slide-up shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-xl object-contain shadow-lg" />
          <h1 className="font-display text-[28px] font-semibold text-foreground tracking-tight">
            Bon retour
          </h1>
          <p className="text-[15px] text-[#a1a1aa]">
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-[12px] px-4 py-3 mb-6 text-[14px] bg-red-500/10 border border-red-500/20 text-red-400" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-3 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="password">Mot de passe</label>
              <button type="button" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors" tabIndex={-1}>
                Oublié ?
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
                className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-3 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b] pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#a1a1aa] transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-[12px] py-3 text-[15px] font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                Connexion…
              </span>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-[14px] text-[#a1a1aa] text-center mt-8">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-white hover:underline font-medium transition-colors">
            S'inscrire
          </Link>
        </p>

      </div>
    </div>
  )
}
