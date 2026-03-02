'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap, LayoutDashboard, Layers,
  Cpu, MessageSquare, Menu, X, ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/command',    label: 'Command',    icon: LayoutDashboard, description: 'Mission control' },
  { href: '/stack',      label: 'The Stack',  icon: Layers,          description: 'Agent library'   },
  { href: '/operations', label: 'Operations', icon: Cpu,             description: 'Task board'       },
  { href: '/brief',      label: 'Brief',      icon: MessageSquare,   description: 'AI consultant'    },
]

// A route is active if pathname starts with the nav href
// e.g. /stack/quill → highlights "The Stack"
function useActiveRoute(href: string) {
  const pathname = usePathname()
  return pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
}

function NavItem({
  href, label, icon: Icon, description, onClick,
}: (typeof NAV)[0] & { onClick?: () => void }) {
  const active = useActiveRoute(href)
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
      style={active ? {
        background: 'rgba(99,102,241,0.12)',
        boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.25)',
      } : undefined}
    >
      {/* Active left bar */}
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
          style={{ background: 'var(--color-brand)', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }}
        />
      )}

      {/* Icon node */}
      <span
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200"
        style={active ? {
          background: 'rgba(99,102,241,0.2)',
          border: '1px solid rgba(99,102,241,0.4)',
        } : {
          background: 'transparent',
          border: '1px solid transparent',
        }}
      >
        <Icon
          size={14}
          strokeWidth={active ? 2.2 : 1.8}
          style={{ color: active ? 'var(--color-brand)' : 'var(--color-muted)' }}
        />
      </span>

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm leading-none transition-colors"
          style={{
            color: active ? 'var(--color-foreground)' : 'var(--color-muted)',
            fontWeight: active ? 600 : 400,
          }}
        >
          {label}
        </p>
        <p
          className="font-mono text-2xs mt-0.5 transition-colors"
          style={{ color: active ? 'rgba(99,102,241,0.7)' : 'transparent' }}
        >
          {description}
        </p>
      </div>

      {/* Trailing chevron on hover */}
      <ChevronRight
        size={12}
        className="flex-shrink-0 transition-all duration-200 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        style={{ color: 'var(--color-brand)' }}
      />
    </Link>
  )
}

// ─── Desktop sidebar ──────────────────────────────────────────
function DesktopSidebar() {
  return (
    <aside
      className="hidden md:flex w-[220px] flex-shrink-0 h-screen flex-col"
      style={{
        background: 'var(--color-surface)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <SidebarContent />
    </aside>
  )
}

// ─── Mobile drawer ────────────────────────────────────────────
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          background: 'rgba(3,3,7,0.8)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col md:hidden"
        style={{
          width: '260px',
          background: 'var(--color-surface)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? '20px 0 60px rgba(0,0,0,0.6)' : 'none',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)' }}
          aria-label="Close menu"
        >
          <X size={14} />
        </button>

        <SidebarContent onNavClick={onClose} />
      </div>
    </>
  )
}

// ─── Mobile top bar (hamburger) ───────────────────────────────
function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="md:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: 'rgba(13,13,20,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #5254CC, #6366F1)',
            boxShadow: '0 0 12px rgba(99,102,241,0.45)',
          }}
        >
          <Zap size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-sm text-foreground">Orchestrai</span>
      </div>

      {/* Hamburger */}
      <button
        onClick={onOpen}
        className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)' }}
        aria-label="Open navigation menu"
        aria-haspopup="true"
      >
        <Menu size={16} />
      </button>
    </div>
  )
}

// ─── Shared sidebar content ───────────────────────────────────
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #5254CC, #6366F1)',
            boxShadow: '0 0 12px rgba(99,102,241,0.45)',
          }}
        >
          <Zap size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-sm text-foreground">Orchestrai</span>

        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping-soft absolute inline-flex h-full w-full rounded-full"
              style={{ background: 'var(--color-status-active)', opacity: 0.6 }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-status-active)' }}
            />
          </span>
        </div>
      </div>

      {/* Nav section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="section-label">Navigation</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto" aria-label="Main navigation">
        {NAV.map(item => (
          <NavItem key={item.href} {...item} onClick={onNavClick} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 mb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Workspace footer */}
      <div className="px-4 pb-5 flex-shrink-0">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.12)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(167,139,250,0.3))',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#A78BFA',
            }}
          >
            W
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Workspace</p>
            <p className="font-mono text-2xs truncate" style={{ color: 'var(--color-subtle)' }}>
              Free plan
            </p>
          </div>
          {/* Status dot */}
          <span className="status-dot active flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

// ─── Composed export ──────────────────────────────────────────
export function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on route change
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
