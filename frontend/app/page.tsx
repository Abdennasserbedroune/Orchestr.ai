'use client'
import Link from 'next/link'
import {
  MonitorPlay, BarChart2, FileText, PenTool,
  Video, Search, Image as ImageIcon,
  Paperclip, Box, Mic, CornerDownLeft, X, ArrowRight
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const MODES = [
  { label: 'Slides',   icon: MonitorPlay },
  { label: 'Data',     icon: BarChart2 },
  { label: 'Docs',     icon: FileText },
  { label: 'Canvas',   icon: PenTool },
  { label: 'Video',    icon: Video },
  { label: 'Research', icon: Search },
  { label: 'Image',    icon: ImageIcon },
]

const SLOGANS = [
  { from: 5,  to: 12, text: "Orchestrez vos agents. Automatisez l'avenir." },
  { from: 12, to: 18, text: 'Vos agents travaillent. Vous dirigez.' },
  { from: 18, to: 22, text: "L'orchestration ne dort jamais." },
  { from: 22, to: 5,  text: 'Pendant que vous dormez, vos agents agissent.' },
]

function getSlogan(): string {
  const h = new Date().getHours()
  for (const s of SLOGANS) {
    if (s.from < s.to) {
      if (h >= s.from && h < s.to) return s.text
    } else {
      if (h >= s.from || h < s.to) return s.text
    }
  }
  return SLOGANS[1].text
}

export default function Home() {
  const [showBanner, setShowBanner]   = useState(true)
  const [slogan, setSlogan]           = useState('')
  const [input, setInput]             = useState('')
  const [focused, setFocused]         = useState(false)
  const [showRedirect, setShowRedirect] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setSlogan(getSlogan()) }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  function handleSend() {
    if (input.trim()) {
      if (typeof window !== 'undefined') sessionStorage.setItem('pending_prompt', input.trim())
      setShowRedirect(true)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const inputActive = focused || input.length > 0

  return (
    <div className="relative min-h-screen flex flex-col font-sans" style={{ background: 'var(--color-bg)' }}>
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] pointer-events-none rounded-full opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}
        aria-hidden="true" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <div className="flex items-center gap-3">
          <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 0 1.5px rgba(99,102,241,0.4), 0 0 16px rgba(99,102,241,0.2)' }}>
            <Image src="/logo.jpg" alt="OrchestrAI logo" width={38} height={38} className="w-full h-full object-cover" priority />
          </div>
          <span className="font-display font-medium text-[15px] tracking-tight" style={{ color: 'var(--color-foreground)' }}>Orchestrai</span>
        </div>
        <Link href="/login"
          className="text-[13px] font-medium transition-all px-4 py-2 rounded-full"
          style={{
            color: 'var(--color-foreground)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)' }}
        >
          Commencer
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10">
        {/* Hero logo */}
        <div className="mb-7 animate-fade-in"
          style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2.5px rgba(99,102,241,0.45), 0 0 48px rgba(99,102,241,0.28)' }}>
          <Image src="/logo.jpg" alt="OrchestrAI" width={96} height={96} className="w-full h-full object-cover" priority />
        </div>

        {/* Slogan */}
        <div className="text-center mb-8 animate-fade-in px-4">
          <h1 className="font-display text-2xl sm:text-4xl md:text-[52px] font-semibold tracking-tight mb-4 leading-tight min-h-[1.2em]"
            style={{ color: 'var(--color-foreground)' }}>
            {slogan ? (
              <span key={slogan} className="slogan-reveal">
                {slogan}
                <span className="slogan-cursor" aria-hidden="true" />
              </span>
            ) : (
              <span className="opacity-0" aria-hidden="true">placeholder</span>
            )}
          </h1>
          <p className="text-[14px] sm:text-[15px] font-normal" style={{ color: 'var(--color-muted)' }}>
            {"Décrivez votre workflow. Vos agents s'en chargent."}
          </p>
        </div>

        {/* Mode chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8 max-w-4xl w-full px-2 animate-slide-up"
          style={{ animationDelay: '0.1s' }}>
          {MODES.map((mode) => (
            <button key={mode.label} type="button"
              onClick={() => { setInput(mode.label); inputRef.current?.focus() }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[14px] transition-all duration-200 text-[13px] sm:text-[14px] font-medium cursor-pointer"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-muted)',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.background = 'var(--color-panel)'
                t.style.borderColor = 'var(--color-border-hover)'
                t.style.color = 'var(--color-foreground)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.background = 'var(--color-surface)'
                t.style.borderColor = 'var(--color-border)'
                t.style.color = 'var(--color-muted)'
              }}
            >
              <mode.icon size={15} aria-hidden="true" style={{ color: 'var(--color-subtle)' }} />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="w-full max-w-[760px] flex flex-col gap-3 animate-slide-up px-0" style={{ animationDelay: '0.2s' }}>
          {showBanner && (
            <div className="relative flex items-start sm:items-center justify-between px-4 py-3 rounded-[20px] gap-3"
              style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 sm:mt-0"
                  style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.15), rgba(167,139,250,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <span className="text-[11px] font-semibold" style={{ color: '#a5b4fc' }}>Ultra</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-[15px] font-medium" style={{ color: 'var(--color-foreground)' }}>Unlock the full Orchestrai experience</span>
                  <span className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: 'var(--color-muted)' }}>Advanced mode, 100+ Integrations, Triggers, Custom AI Workers &amp; more</span>
                </div>
              </div>
              <button type="button" onClick={() => setShowBanner(false)}
                className="p-1 flex-shrink-0 transition-colors"
                style={{ color: 'var(--color-muted)' }}
                aria-label="Dismiss banner">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Input box */}
          <div className="relative w-full rounded-[28px] transition-all duration-300"
            style={{
              background: 'var(--color-surface)',
              border: `1px solid ${inputActive ? 'rgba(99,102,241,0.35)' : 'var(--color-border)'}`,
              boxShadow: inputActive
                ? '0 20px 56px -12px rgba(0,0,0,0.9), 0 0 0 3px rgba(99,102,241,0.08)'
                : '0 8px 24px -8px rgba(0,0,0,0.6)',
            }}>
            <div className="px-4 pt-4 pb-[64px]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Décrivez votre besoin, lancez un workflow, interrogez un agent…"
                rows={focused || input.length > 0 ? 2 : 1}
                className="w-full bg-transparent text-[16px] outline-none focus:outline-none focus:ring-0 placeholder:text-[#3f3f46] ml-1 caret-white resize-none overflow-hidden leading-relaxed"
                style={{ color: 'var(--color-foreground)', border: 'none', boxShadow: 'none', minHeight: '28px', maxHeight: '160px' }}
                aria-label="Describe your workflow or task"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Attach file"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                  style={{ color: 'var(--color-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
                  <Paperclip size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Tools"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all relative"
                  style={{ color: 'var(--color-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
                  <Box size={18} strokeWidth={1.5} aria-hidden="true" />
                  <div className="absolute top-[5px] right-[5px] w-[13px] h-[13px] bg-white rounded-full flex items-center justify-center" aria-hidden="true">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Voice input"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                  style={{ color: 'var(--color-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
                  <Mic size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" onClick={handleSend} disabled={!input.trim()}
                  aria-label="Send message"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    background: input.trim() ? '#6366f1' : 'rgba(255,255,255,0.05)',
                    color: input.trim() ? '#ffffff' : 'var(--color-subtle)',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: input.trim() ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                  }}>
                  <CornerDownLeft size={16} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] mt-3" style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
            Orchestrai peut commettre des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </main>

      {/* Redirect modal */}
      {showRedirect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowRedirect(false)}
          role="dialog" aria-modal="true" aria-labelledby="redirect-title">
          <div className="relative w-full max-w-[420px] rounded-[24px] p-8 sm:p-10 animate-slide-up"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-panel)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-3 mb-8">
              <div style={{ width: 68, height: 68, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.2)' }}>
                <Image src="/logo.jpg" alt="OrchestrAI" width={68} height={68} className="w-full h-full object-cover" />
              </div>
              <h2 id="redirect-title" className="font-display text-[22px] sm:text-[24px] font-semibold tracking-tight text-center"
                style={{ color: 'var(--color-foreground)' }}>
                Lancez vos agents
              </h2>
              <p className="text-[14px] text-center leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {"Connectez-vous pour orchestrer vos workflows et lancer vos agents IA."}
              </p>
            </div>

            {input && (
              <div className="mb-4 px-4 py-3 rounded-[14px] truncate text-[13px]"
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                <span style={{ color: '#6366f1' }}>&#x276F;</span>{' '}{input}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link href="/login"
                className="w-full flex items-center justify-center gap-2 rounded-[12px] py-3 text-[15px] font-semibold transition-colors"
                style={{ background: '#6366f1', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
                Se connecter <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/register"
                className="w-full flex items-center justify-center gap-2 rounded-[12px] py-3 text-[15px] font-medium transition-colors"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-panel)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}>
                {"Créer un compte"}
              </Link>
            </div>

            <button type="button" onClick={() => setShowRedirect(false)}
              className="mt-6 w-full text-center text-[13px] transition-colors"
              style={{ color: 'var(--color-subtle)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
