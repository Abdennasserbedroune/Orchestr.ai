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
  X,
  Zap
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

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)
  const fullText = 'Bonsoir ! On travaille tard ?'
  const [greetings, setGreetings] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setGreetings(current => current + fullText.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col bg-bg overflow-hidden font-sans">

      {/* Top Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.jpg" alt="Orchestrai Logo" width={32} height={32} className="rounded-md object-contain" />
          <span className="font-display font-medium text-lg text-foreground tracking-tight">Orchestrai</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-foreground/70 font-medium">
          <Link href="#" className="hover:text-foreground transition-colors">Tutoriels</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Tarifs</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Mobile</Link>
        </div>

        <div>
          <Link href="/login" className="text-sm font-medium text-foreground hover:opacity-80 transition-opacity bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10">
            Commencer
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 -mt-10">

        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-4xl md:text-[52px] font-semibold tracking-tight text-foreground mb-4 leading-tight">
            {greetings}
          </h1>
          <p className="text-[#a1a1aa] text-base font-normal">
            Choisis un mode pour commencer avec des modèles et exemples
          </p>
        </div>

        {/* Modes Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 max-w-4xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {MODES.map((mode) => (
            <button
              key={mode.label}
              className="flex items-center gap-2 px-4 py-2 rounded-[14px] border border-white/[0.08] bg-[#111111] hover:bg-[#1f1f1f] transition-all text-[15px] font-medium text-[#e4e4e7] cursor-pointer"
            >
              <mode.icon size={16} className="text-[#a1a1aa]" />
              {mode.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[760px] flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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

          {/* Complex Input Box */}
          <div className="relative w-full rounded-[28px] border border-white/[0.08] bg-[#171717] hover:border-white/[0.15] transition-all focus-within:border-white/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
            <div className="p-4 pb-16">
              <input
                type="text"
                placeholder="Décris ce dont tu as besoin d'aide..."
                className="w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-[#71717a] ml-2"
                onClick={() => { window.location.href = '/login' }}
                readOnly
              />
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/5 transition-colors text-[#a1a1aa]">
                  <Paperclip size={20} strokeWidth={1.5} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/5 transition-colors text-[#a1a1aa] relative">
                  <Box size={20} className="rounded-sm" strokeWidth={1.5} />
                  {/* Small lock icon */}
                  <div className="absolute top-[6px] right-[6px] w-[14px] h-[14px] bg-white rounded-full flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/5 transition-colors text-[#a1a1aa]">
                  <Mic size={20} strokeWidth={1.5} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3f3f46] hover:bg-white transition-all text-white hover:text-black shadow-lg">
                  <CornerDownLeft size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background glow similar to Kortix */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-b from-brand/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full opacity-30"></div>
    </div>
  )
}
