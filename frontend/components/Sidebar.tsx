'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutDashboard, Layers, Cpu, MessageSquare } from 'lucide-react'

// Nav items — do not change hrefs, they match the (app) route group
const NAV = [
  { href: '/command',    label: 'Command',    icon: LayoutDashboard },
  { href: '/stack',      label: 'The Stack',  icon: Layers          },
  { href: '/operations', label: 'Operations', icon: Cpu             },
  { href: '/brief',      label: 'Brief',      icon: MessageSquare   },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-[220px] flex-shrink-0 h-screen flex flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
          <Zap size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-sm text-foreground">Orchestrai</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-brand-muted text-brand font-medium'
                  : 'text-muted hover:text-foreground hover:bg-panel'
              }`}>
              <Icon size={15} strokeWidth={active ? 2 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer — frontend will replace with real auth data */}
      <div className="px-4 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-muted flex items-center justify-center text-xs font-bold text-brand">W</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Workspace</p>
            <p className="text-2xs text-muted">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
