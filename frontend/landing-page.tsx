'use client'
import Link from 'next/link'
import {
  MonitorPlay, BarChart2, FileText, PenTool,
  Video, Search, Image as ImageIcon,
  Paperclip, Mic, CornerDownLeft, X, ArrowRight, Sparkles
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
  { from: 5,  to: 12, text: 'Orchestrez vos agents. Automatisez l\u2019avenir.' },
  { from: 12, to: 18, text: 'Vos agents travaillent. Vous dirigez.' },
  { from: 18, to: 22, text: 'L\u2019orchestration ne dort jamais.' },
  { from: 22, to: 5,  text: 'Pendant que vous dormez, vos agents agissent.' },
]

function getSlogan(): string {
  const h = new Date().getHours()
  for (const s of SLOGANS) {
    if (s.from < s.to) { if (h >= s.from && h < s.to) return s.text }
    else { if (h >= s.from || h < s.to) return s.text }
  }
  return SLOGANS[1].text
}

export default function Home() {
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(true)
  const [slogan, setSlogan] = useState('')
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
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

  void router

  return (
    <>
      <style>{`
        @keyframes landFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes orbitSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .land-item{animation:landFadeIn 0.55s ease both}
        .land-item-1{animation-delay:0.05s}
        .land-item-2{animation-delay:0.12s}
        .land-item-3{animation-delay:0.2s}
        .land-item-4{animation-delay:0.28s}
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: '#050507', overflow: 'hidden',
        fontFamily: 'var(--font-sans, -apple-system, sans-serif)',
      }}>
        {/* Background */}
        <div aria-hidden style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', zIndex: 0,
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', top: '28%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw', height: '60vh',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }} />
          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.025,
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />
        </div>

        {/* Nav */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.045)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(5,5,7,0.75)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(99,102,241,0.32), 0 0 16px rgba(99,102,241,0.18)',
            }}>
              <Image src="/logo.jpg" alt="OrchestrAI logo" width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover' }} priority />
            </div>
            <span style={{ fontFamily: 'var(--font-display, inherit)', fontWeight: 600, fontSize: 15, color: '#f0f0f3', letterSpacing: '-0.015em' }}>Orchestrai</span>
          </div>
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 13.5, fontWeight: 500, color: '#8a8a96',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '7px 16px', borderRadius: 99,
            transition: 'all 0.18s ease',
            letterSpacing: '-0.01em',
          }}
            onMouseEnter={e => {
              const a = e.currentTarget as HTMLAnchorElement
              a.style.color = '#f0f0f3'
              a.style.background = 'rgba(255,255,255,0.07)'
              a.style.borderColor = 'rgba(255,255,255,0.13)'
            }}
            onMouseLeave={e => {
              const a = e.currentTarget as HTMLAnchorElement
              a.style.color = '#8a8a96'
              a.style.background = 'rgba(255,255,255,0.04)'
              a.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            Commencer <ArrowRight size={12} />
          </Link>
        </nav>

        {/* Main */}
        <main style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '48px 24px 64px',
          position: 'relative', zIndex: 1,
        }}>
          {/* Logo hero */}
          <div className="land-item land-item-1" style={{
            marginBottom: 28,
            width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
            animation: 'landFadeIn 0.55s ease both 0.05s, logoFloat 5s ease-in-out infinite 0.6s',
            boxShadow: '0 0 0 2px rgba(99,102,241,0.4), 0 0 50px rgba(99,102,241,0.24)',
          }}>
            <Image src="/logo.jpg" alt="OrchestrAI" width={88} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} priority />
          </div>

          {/* Slogan */}
          <div className="land-item land-item-2" style={{ textAlign: 'center', marginBottom: 10 }}>
            <h1 style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 'clamp(22px, 4.5vw, 46px)',
              fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2,
              color: '#ededf0', minHeight: '1.3em',
            }}>
              {slogan ? (
                <span key={slogan} className="slogan-reveal">
                  {slogan}<span className="slogan-cursor" aria-hidden="true" />
                </span>
              ) : (
                <span style={{ opacity: 0 }}>placeholder</span>
              )}
            </h1>
            <p style={{ fontSize: 14, color: '#3e3e48', marginTop: 10, letterSpacing: '-0.01em' }}>
              Décrivez votre workflow. Vos agents s&apos;en chargent.
            </p>
          </div>

          {/* Mode chips */}
          <div className="land-item land-item-3" style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'center', gap: 8, marginBottom: 28,
            maxWidth: 580,
          }}>
            {MODES.map((mode) => (
              <button
                key={mode.label}
                type="button"
                onClick={() => { setInput(mode.label); inputRef.current?.focus() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 13px', borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.025)',
                  fontSize: 12.5, fontWeight: 500, color: '#52525b',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.color = '#d4d4dc'
                  b.style.background = 'rgba(255,255,255,0.05)'
                  b.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.color = '#52525b'
                  b.style.background = 'rgba(255,255,255,0.025)'
                  b.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <mode.icon size={12} style={{ color: '#3e3e48' }} />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="land-item land-item-4" style={{ width: '100%', maxWidth: 680 }}>
            {showBanner && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.055)',
                marginBottom: 10, gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 6,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.15))',
                    border: '1px solid rgba(99,102,241,0.22)',
                    fontSize: 10.5, fontWeight: 700, color: '#818cf8', flexShrink: 0,
                    letterSpacing: '0.03em',
                  }}>
                    <Sparkles size={9} /> ULTRA
                  </span>
                  <span style={{ fontSize: 12.5, color: '#3e3e48', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                    <span style={{ color: '#5a5a66', fontWeight: 500 }}>Mode avancé</span> — 100+ intégrations, triggers, agents personnalisés et plus
                  </span>
                </div>
                <button type="button" onClick={() => setShowBanner(false)}
                  style={{ color: '#2a2a34', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input box */}
            <div
              style={{
                position: 'relative', width: '100%', borderRadius: 20,
                background: '#0c0c10',
                border: `1px solid ${focused || input.length > 0 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.055)'}`,
                boxShadow: focused || input.length > 0
                  ? '0 0 0 3px rgba(99,102,241,0.06), 0 20px 60px rgba(0,0,0,0.7)'
                  : '0 8px 30px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ padding: '16px 18px 58px' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Décrivez votre besoin, lancez un workflow…"
                  rows={focused || input.length > 0 ? 2 : 1}
                  style={{
                    width: '100%', background: 'transparent',
                    fontSize: 15, color: '#ededf0', outline: 'none',
                    border: 'none', resize: 'none', overflow: 'hidden',
                    lineHeight: 1.7, caretColor: '#6366f1',
                    minHeight: 28, maxHeight: 160,
                    letterSpacing: '-0.01em',
                  }}
                  aria-label="Describe your workflow or task"
                  autoComplete="off" spellCheck={false}
                />
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 10px 12px 12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {[
                    { icon: Paperclip, label: 'Attach file' },
                    { icon: Mic, label: 'Voice input' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} type="button" aria-label={label}
                      style={{
                        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 8, background: 'none', border: 'none', color: '#2a2a34', cursor: 'pointer',
                        transition: 'all 0.14s ease',
                      }}
                      onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = '#52525b'; b.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = '#2a2a34'; b.style.background = 'none' }}
                    >
                      <Icon size={14} strokeWidth={1.7} />
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleSend} disabled={!input.trim()} aria-label="Send"
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10, border: 'none',
                    background: input.trim() ? '#6366f1' : '#111118',
                    color: input.trim() ? '#fff' : '#28282f',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.18s ease',
                    boxShadow: input.trim() ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  <CornerDownLeft size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#1a1a20', marginTop: 10, letterSpacing: '0.01em', fontFamily: 'monospace' }}>
              Orchestrai peut commettre des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </main>

        {/* Redirect modal */}
        {showRedirect && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
            }}
            onClick={() => setShowRedirect(false)}
            role="dialog" aria-modal="true"
          >
            <div
              style={{
                width: '100%', maxWidth: 400, borderRadius: 22,
                background: 'linear-gradient(to bottom, #0e0e14, #0a0a0f)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '36px 32px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
                animation: 'landFadeIn 0.2s ease both',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 1.5px rgba(99,102,241,0.4), 0 0 28px rgba(99,102,241,0.22)' }}>
                  <Image src="/logo.jpg" alt="OrchestrAI" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display, inherit)', fontSize: 20, fontWeight: 700, color: '#ededf0', textAlign: 'center', letterSpacing: '-0.025em', margin: 0 }}>
                  Lancez vos agents
                </h2>
                <p style={{ fontSize: 13, color: '#48484f', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                  Connectez-vous pour orchestrer vos workflows et lancer vos agents IA.
                </p>
              </div>

              {input && (
                <div style={{
                  marginBottom: 16, padding: '10px 14px', borderRadius: 11,
                  border: '1px solid rgba(255,255,255,0.055)',
                  background: 'rgba(255,255,255,0.022)',
                  fontSize: 12.5, color: '#48484f', fontFamily: 'monospace',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  <span style={{ color: '#5558ea' }}>›</span>{' '}
                  <span>{input}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/login" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#fff', color: '#08080a',
                  borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600,
                  transition: 'opacity 0.18s', letterSpacing: '-0.01em',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
                >
                  Se connecter <ArrowRight size={14} />
                </Link>
                <Link href="/register" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8a8a96', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 500,
                  transition: 'all 0.18s', letterSpacing: '-0.01em',
                }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'rgba(255,255,255,0.07)'; a.style.color = '#c4c4cc' }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'rgba(255,255,255,0.04)'; a.style.color = '#8a8a96' }}
                >
                  Créer un compte
                </Link>
              </div>

              <button type="button" onClick={() => setShowRedirect(false)}
                style={{
                  marginTop: 18, width: '100%', textAlign: 'center',
                  fontSize: 12.5, color: '#2a2a34', background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.15s', letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#52525b'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#2a2a34'}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
