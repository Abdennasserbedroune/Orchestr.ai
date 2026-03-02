'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'

export function BriefButton() {
  const pathname = usePathname()
  if (pathname === '/brief') return null

  return (
    <Link
      href="/brief"
      className="fixed bottom-6 right-6 z-50 group"
      title="Open Brief"
      aria-label="Open Brief — AI consultant"
    >
      {/* Outer ping ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping-soft"
        style={{
          background: 'rgba(99,102,241,0.25)',
          animationDuration: '2.5s',
        }}
        aria-hidden="true"
      />

      {/* Button */}
      <span
        className="relative flex items-center justify-center w-13 h-13 rounded-full transition-all duration-300 group-hover:scale-110"
        style={{
          width: '52px',
          height: '52px',
          background: 'linear-gradient(135deg, #5254CC, #6366F1)',
          boxShadow: '0 0 24px rgba(99,102,241,0.55), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <MessageSquare
          size={20}
          className="text-white transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.8}
        />
      </span>

      {/* Tooltip */}
      <span
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2
                   px-2.5 py-1.5 rounded-lg font-mono text-xs text-foreground
                   pointer-events-none opacity-0 translate-x-1
                   group-hover:opacity-100 group-hover:translate-x-0
                   transition-all duration-200 whitespace-nowrap"
        style={{
          background: 'var(--color-panel)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
        role="tooltip"
      >
        Brief — AI Consultant
      </span>
    </Link>
  )
}

export default BriefButton
