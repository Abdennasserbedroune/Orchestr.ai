'use client'
import Link from 'next/link'
import {
  MonitorPlay,
  BarChart2,
  FileText,
  PenTool,
  Video,
  Search,
  Image as ImageIcon,
  Paperclip,
  Box,
  Mic,
  CornerDownLeft,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const MODES = [
  { label: 'Slides', icon: MonitorPlay },
  { label: 'Data', icon: BarChart2 },
  { label: 'Docs', icon: FileText },
  { label: 'Canvas', icon: PenTool },
  { label: 'Video', icon: Video },
  { label: 'Research', icon: Search },
  { label: 'Image', icon: ImageIcon },
]

/** Returns a grammatically correct, time-aware greeting in French — no truncation */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bonjour ! Que puis-je faire pour vous ?'
  if (hour >= 12 && hour < 18) return 'Bon après-midi ! Comment puis-je vous aider ?'
  if (hour >= 18 && hour < 22) return 'Bonsoir ! Comment puis-je vous aider ?'
  return 'Vous travaillez tard… Je suis là pour vous.'
}

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)
  const [greetings, setGreetings] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const fullText = getGreeting()
    setGreetings('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setGreetings(cur => cur + fullText.charAt(i))
        i++
      } else {
        clearInterval(timer)
        setDone(true)
      }
    }, 42)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col bg-bg overflow-hidden font-sans">

      {/* Ambient glow — same as chat page */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] pointer-events-none rounded-full opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Minimal Navbar — logo + brand name + login only, no nav links */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3 cursor-pointer">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 0 1.5px rgba(99,102,241,0.4), 0 0 16px rgba(99,102,241,0.2)',
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.jpg"
              alt="OrchestrAI Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-display font-medium text-lg text-foreground tracking-tight">Orchestrai</span>
        </div>

        {/* No Tutoriels / Tarifs / Mobile links */}

        <div>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:opacity-80 transition-opacity bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Main Content — matches chat page hero exactly */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

        {/* Big logo — same size as chat page hero (120px) */}
        <div
          className="mb-7 animate-fade-in"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 0 0 2.5px rgba(99,102,241,0.45), 0 0 48px rgba(99,102,241,0.28)',
          }}
        >
          <Image
            src="/logo.jpg"
            alt="OrchestrAI"
            width={120}
            height={120}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Greeting — same font/size as chat page */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-4xl md:text-[52px] font-semibold tracking-tight text-foreground mb-4 leading-tight min-h-[1.2em]">
            {greetings}
            {!done && (
              <span className="inline-block w-[3px] h-[0.85em] bg-white ml-1 align-middle animate-pulse" />
            )}
          </h1>
          <p className="text-[#71717a] text-[15px] font-normal">
            Choisissez un domaine pour commencer ou décrivez votre besoin directement.
          </p>
        </div>

        {/* Modes Row */}
        <div
          className="flex flex-wrap items-center justify-center gap-2.5 mb-8 max-w-4xl animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          {MODES.map((mode) => (
            <button
              key={mode.label}
              className="flex items-center gap-2 px-4 py-2 rounded-[14px] border border-white/[0.07] bg-[#111111] hover:bg-[#1a1a1a] hover:border-white/[0.14] transition-all duration-200 text-[14px] font-medium text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
            >
              <mode.icon size={15} className="text-[#71717a]" />
              {mode.label}
            </button>
          ))}
        </div>

        <div
          className="w-full max-w-[760px] flex flex-col gap-3 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {/* Promo Banner */}
          {showBanner && (
            <div className="relative flex items-center justify-between px-4 py-3 rounded-[20px] border border-white/[0.08] bg-[#141414] shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <span className="text-[11px] font-semibold text-blue-300">Ultra</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-foreground">Unlock the full Orchestrai experience</span>
                  <span className="text-[13px] text-[#a1a1aa] mt-0.5">Advanced mode, 100+ Integrations, Triggers, Custom AI Workers & more</span>
                </div>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-[#a1a1aa] hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Input box — same style as chat page */}
          <div
            className="relative w-full rounded-[28px] border transition-all duration-300"
            style={{
              background: '#131313',
              borderColor: 'rgba(255,255,255,0.07)',
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
            }}
          >
            <div className="px-4 pt-4 pb-[64px]">
              <input
                type="text"
                placeholder="Décrivez ce dont vous avez besoin…"
                className="w-full bg-transparent text-[16px] text-[#fafafa] outline-none focus:outline-none focus:ring-0 placeholder:text-[#3f3f46] ml-1 caret-white"
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={() => { window.location.href = '/login' }}
                readOnly
              />
            </div>

            {/* Action bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#3f3f46] hover:text-[#a1a1aa] hover:bg-white/[0.05] transition-all">
                  <Paperclip size={18} strokeWidth={1.5} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#3f3f46] hover:text-[#a1a1aa] hover:bg-white/[0.05] transition-all relative">
                  <Box size={18} strokeWidth={1.5} />
                  <div className="absolute top-[5px] right-[5px] w-[13px] h-[13px] bg-white rounded-full flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#3f3f46] hover:text-[#a1a1aa] hover:bg-white/[0.05] transition-all">
                  <Mic size={18} strokeWidth={1.5} />
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    background: '#1f1f1f',
                    color: '#3f3f46',
                  }}
                  onClick={() => { window.location.href = '/login' }}
                >
                  <CornerDownLeft size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#2a2a2a] mt-3 font-mono">
            Orchestrai peut commettre des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </main>
    </div>
  )
}
