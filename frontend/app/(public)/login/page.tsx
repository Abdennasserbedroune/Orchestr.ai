'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

function AgentPanel() {
  const agents = [
    { id: 'orchestr', label: 'OrchestrAI', role: 'Orchestrator', color: '#6366f1', x: 50, y: 18 },
    { id: 'claude',   label: 'Claude',     role: 'Reasoning',   color: '#a78bfa', x: 20, y: 48 },
    { id: 'n8n',      label: 'n8n',        role: 'Automation',  color: '#fb923c', x: 50, y: 78 },
    { id: 'openclaw', label: 'OpenClaw',   role: 'Scraping',    color: '#34d399', x: 80, y: 48 },
  ]
  const connections = [
    { from: agents[0], to: agents[1] },
    { from: agents[0], to: agents[2] },
    { from: agents[0], to: agents[3] },
    { from: agents[1], to: agents[2] },
    { from: agents[3], to: agents[2] },
  ]
  const logLines = [
    { t: '09:14:01', agent: 'OrchestrAI', msg: 'Dispatching task to Claude…',  color: '#6366f1' },
    { t: '09:14:02', agent: 'Claude',     msg: 'Reasoning over context window…', color: '#a78bfa' },
    { t: '09:14:04', agent: 'OpenClaw',   msg: 'Scraping target URL…',          color: '#34d399' },
    { t: '09:14:05', agent: 'n8n',        msg: 'Webhook triggered → Notion',   color: '#fb923c' },
    { t: '09:14:06', agent: 'Claude',     msg: 'Output: workflow.json ready',  color: '#a78bfa' },
    { t: '09:14:07', agent: 'OrchestrAI', msg: 'All agents completed ✓',        color: '#6366f1' },
  ]

  return (
    <div className="relative w-full h-full flex flex-col justify-center px-10 py-12 overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d18 50%, #0a0a0f 100%)' }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      <p className="font-mono text-[11px] text-[#3f3f46] uppercase tracking-[0.2em] mb-6 relative z-10">Live Agent Orchestration</p>

      <div className="relative z-10 mb-8">
        <svg viewBox="0 0 100 100" className="w-full" style={{ height: '260px' }}>
          {connections.map((c, i) => (
            <line key={i} x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
              stroke="rgba(99,102,241,0.18)" strokeWidth="0.5" strokeDasharray="2 2" />
          ))}
          {connections.map((c, i) => (
            <circle key={`p${i}`} r="0.8" fill="#6366f1" opacity="0.7">
              <animateMotion dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite"
                path={`M ${c.from.x} ${c.from.y} L ${c.to.x} ${c.to.y}`} />
            </circle>
          ))}
          {agents.map((a) => (
            <g key={a.id}>
              <circle cx={a.x} cy={a.y} r="5.5" fill="none" stroke={a.color} strokeWidth="0.4" opacity="0.3">
                <animate attributeName="r" values="5.5;7;5.5" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={a.x} cy={a.y} r="4.5" fill={`${a.color}18`} stroke={a.color} strokeWidth="0.6" />
              <circle cx={a.x} cy={a.y} r="1.5" fill={a.color} />
              <text x={a.x} y={a.y + 8} textAnchor="middle" fill="#e4e4e7" fontSize="3.2" fontFamily="monospace" fontWeight="600">{a.label}</text>
              <text x={a.x} y={a.y + 11.5} textAnchor="middle" fill="#52525b" fontSize="2.5" fontFamily="monospace">{a.role}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="relative z-10 rounded-[16px] border border-white/[0.06] overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[10px] text-[#3f3f46] ml-2">orchestrai — agent-runtime</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="font-mono text-[9px] text-[#34d399]">LIVE</span>
          </span>
        </div>
        <div className="px-4 py-3 flex flex-col gap-1.5">
          {logLines.map((l, i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[11px]">
              <span className="text-[#3f3f46] flex-shrink-0">{l.t}</span>
              <span className="flex-shrink-0 font-semibold" style={{ color: l.color }}>[{l.agent}]</span>
              <span className="text-[#71717a]">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2 mt-5">
        {[
          { label: 'Claude',     status: 'Completed', color: '#a78bfa', pulse: false },
          { label: 'n8n',        status: 'Running',   color: '#fb923c', pulse: true  },
          { label: 'OpenClaw',   status: 'Completed', color: '#34d399', pulse: false },
          { label: 'OrchestrAI', status: 'Routing',   color: '#6366f1', pulse: true  },
        ].map((a) => (
          <div key={a.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: `${a.color}10`, borderColor: `${a.color}30` }}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.pulse ? 'animate-pulse' : ''}`}
              style={{ background: a.color }} />
            <span className="font-mono text-[11px] font-medium" style={{ color: a.color }}>{a.label}</span>
            <span className="font-mono text-[10px] text-[#52525b]">{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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
    router.push('/chat')
  }

  return (
    <div className="min-h-screen flex bg-bg overflow-hidden font-sans">

      {/* LEFT — Login form */}
      <div className="flex flex-col justify-center w-full max-w-[480px] flex-shrink-0 px-12 py-16 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col gap-3 mb-10 relative">
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px rgba(99,102,241,0.4), 0 0 28px rgba(99,102,241,0.22)' }}>
            <Image src="/logo.jpg" alt="OrchestrAI" width={72} height={72} className="w-full h-full object-cover" priority />
          </div>
          <h1 className="font-display text-[30px] font-semibold text-foreground tracking-tight mt-2">
            Bon retour
          </h1>
          <p className="text-[15px] text-[#71717a]">
            Connectez-vous pour orchestrer vos agents IA.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-[12px] px-4 py-3 mb-6 text-[14px] bg-red-500/10 border border-red-500/20 text-red-400" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative" noValidate>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email}
              onChange={e => setEmail(e.target.value)} placeholder="vous@entreprise.com"
              className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-3 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b]"
              disabled={loading} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#e4e4e7]" htmlFor="password">Mot de passe</label>
              <button type="button" className="text-[13px] text-[#a1a1aa] hover:text-white transition-colors" tabIndex={-1}>Oublié ?</button>
            </div>
            <div className="relative">
              <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-[#18181b] border border-white/5 rounded-[12px] px-4 py-3 text-[15px] text-foreground outline-none focus:border-white/20 transition-colors placeholder:text-[#52525b] pr-10"
                disabled={loading} />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#a1a1aa] transition-colors">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 transition-colors rounded-[12px] py-3 text-[15px] font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                Connexion…
              </span>
            ) : (
              <span className="flex items-center gap-2"><Zap size={15} /> Se connecter</span>
            )}
          </button>
        </form>

        <p className="text-[14px] text-[#a1a1aa] mt-8 relative">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-white hover:underline font-medium transition-colors">S&apos;inscrire</Link>
        </p>
      </div>

      {/* RIGHT — Animated agent panel */}
      <div className="flex-1 hidden lg:block relative overflow-hidden"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <AgentPanel />
      </div>
    </div>
  )
}
