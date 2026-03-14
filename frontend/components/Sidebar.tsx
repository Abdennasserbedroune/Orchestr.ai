'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare, Layers, Cpu,
  Menu, X, ChevronRight,
  Sparkles, Settings,
} from 'lucide-react'
import Image from 'next/image'

const NAV_MAIN = [
  { href: '/chat',       label: 'Chat',       icon: MessageSquare, description: 'Assistant IA',    accent: '#6366f1' },
  { href: '/agents',     label: 'Agents',     icon: Layers,        description: 'Bibliothèque',     accent: '#a78bfa' },
  { href: '/operations', label: 'Opérations', icon: Cpu,           description: 'Tâches en cours', accent: '#22d3ee' },
]

function useActiveRoute(href: string) {
  const pathname = usePathname()
  return pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
}

function NavItem({ href, label, icon: Icon, description, accent, onClick }: typeof NAV_MAIN[0] & { onClick?: () => void }) {
  const active = useActiveRoute(href)
  return (
    <Link href={href} onClick={onClick}
      className="group relative flex items-center gap-3 px-3 py-[11px] rounded-[14px] transition-all duration-200"
      style={active ? { background: `${accent}14`, boxShadow: `inset 0 0 0 1px ${accent}28` } : undefined}>
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[22px] rounded-r-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}90` }} />
      )}
      <span className="w-[30px] h-[30px] flex items-center justify-center rounded-[10px] flex-shrink-0 transition-all duration-200"
        style={active
          ? { background: `${accent}20`, border: `1px solid ${accent}35` }
          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Icon size={15} strokeWidth={active ? 2.2 : 1.8} style={{ color: active ? accent : '#52525b' }} />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] leading-none transition-colors"
          style={{ color: active ? '#fafafa' : '#a1a1aa', fontWeight: active ? 600 : 400 }}>
          {label}
        </span>
        <span className="text-[10px] font-mono mt-[3px] uppercase tracking-widest transition-colors"
          style={{ color: active ? `${accent}90` : 'transparent' }}>
          {description}
        </span>
      </div>
      <ChevronRight size={12} className="ml-auto flex-shrink-0 transition-all duration-200 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        style={{ color: active ? accent : '#52525b' }} />
    </Link>
  )
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-3 px-5 py-4 flex-shrink-0 hover:bg-white/[0.03] transition-colors"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="relative flex-shrink-0">
          <Image src="/logo.jpg" alt="Orchestrai" width={30} height={30} className="rounded-[9px] object-contain" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[2px] border-[#0E0E0E] bg-emerald-400" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-display font-semibold text-[15px] text-[#fafafa] tracking-tight leading-none">Orchestrai</span>
          <span className="text-[10px] font-mono text-[#3f3f46] mt-0.5">v1.0 · Bêta</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col px-3 pt-5 pb-3 overflow-y-auto gap-1">
        <p className="section-label px-3 mb-2">Navigation</p>
        {NAV_MAIN.map(item => <NavItem key={item.href} {...item} onClick={onNavClick} />)}

        <div className="my-4 mx-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

        <p className="section-label px-3 mb-2">Compte</p>
        <Link href="/settings" onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-[10px] rounded-[14px] transition-all duration-200 hover:bg-white/[0.03]"
          style={{ color: useActiveRoute('/settings') ? '#fafafa' : '#52525b' }}>
          <span className="w-[30px] h-[30px] flex items-center justify-center rounded-[10px] bg-white/[0.02] border border-white/[0.05] flex-shrink-0">
            <Settings size={14} strokeWidth={1.7} />
          </span>
          <span className="text-[14px]">Paramètres</span>
        </Link>
      </div>

      <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-[14px] bg-white/[0.025] border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer group">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 uppercase"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(167,139,250,0.4))', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            W
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#e4e4e7] leading-none truncate">Espace de travail</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="status-dot active" />
              <p className="text-[10px] font-mono text-[#52525b] truncate">Plan gratuit</p>
            </div>
          </div>
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={12} className="text-[#a78bfa]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DesktopSidebar() {
  return (
    <aside className="hidden md:flex w-[220px] flex-shrink-0 h-screen flex-col"
      style={{ background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      <SidebarContent />
    </aside>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 md:hidden"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }}
        aria-hidden="true" />
      <div className="fixed top-0 left-0 h-full z-50 md:hidden"
        style={{ width: 260, background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.05)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? '24px 0 80px rgba(0,0,0,0.7)' : 'none' }}
        role="dialog" aria-modal="true">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-[8px] border border-white/[0.07] text-[#52525b] hover:text-white hover:bg-white/[0.05] transition-all">
          <X size={13} />
        </button>
        <SidebarContent onNavClick={onClose} />
      </div>
    </>
  )
}

function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 sticky top-0 z-30"
      style={{ background: 'rgba(10,10,10,0.92)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)' }}>
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/logo.jpg" alt="Orchestrai" width={26} height={26} className="rounded-[8px] object-contain" />
        <span className="font-display font-semibold text-[14px] text-[#fafafa]">Orchestrai</span>
      </Link>
      <button onClick={onOpen} className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-white/[0.07] text-[#52525b] hover:text-white hover:bg-white/[0.05] transition-all">
        <Menu size={15} />
      </button>
    </div>
  )
}

export function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setDrawerOpen(false) }, [pathname])
  return (
    <>
      <DesktopSidebar />
      <MobileTopBar onOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

export default Sidebar
