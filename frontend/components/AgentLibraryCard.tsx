'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Star, Zap, Plus, Check } from 'lucide-react'
import { DOMAIN_META } from '@/lib/mock-data'
import type { AgentFull } from '@/lib/agents-data'

interface AgentLibraryCardProps {
  agent: AgentFull
}

function StatusBadge({ status }: { status: AgentFull['status'] }) {
  const styles: Record<AgentFull['status'], { label: string; color: string; bg: string; border: string }> = {
    'active':       { label: 'Active',       color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'  },
    'beta':         { label: 'Beta',         color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
    'coming-soon':  { label: 'Coming Soon',  color: '#4B5563', bg: 'rgba(75,85,99,0.1)',    border: 'rgba(75,85,99,0.3)'   },
  }
  const s = styles[status]
  return (
    <span
      className="chip font-mono text-2xs tracking-widest"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {status === 'active' && <span className="status-dot active mr-1" />}
      {s.label}
    </span>
  )
}

export function AgentLibraryCard({ agent }: AgentLibraryCardProps) {
  const [added, setAdded] = useState(false)
  const meta = DOMAIN_META[agent.domain]
  const Icon = meta.icon

  return (
    <div className="card-hover group p-6 relative overflow-hidden flex flex-col">

      {/* Background watermark icon */}
      <div
        className="absolute bottom-3 right-3 opacity-[0.07] group-hover:opacity-[0.16] transition-opacity duration-500 pointer-events-none"
        style={{ color: meta.color }}
      >
        <Icon size={80} strokeWidth={1} />
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="icon-node w-11 h-11 flex-shrink-0"
          style={{ background: meta.bg, borderColor: `${meta.color}50` }}
        >
          <Icon size={18} style={{ color: meta.color }} />
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Name */}
      <h3 className="font-display text-base font-semibold text-foreground">
        {agent.name}
      </h3>
      <p className="text-xs text-muted font-mono tracking-wide mt-0.5">
        {agent.role}
      </p>

      {/* Rating row */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.round(agent.rating) ? 'fill-[#FFD600] text-[#FFD600]' : 'text-subtle'}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-muted">{agent.rating}</span>
        <span className="text-subtle text-2xs">·</span>
        <span className="font-mono text-2xs text-subtle">{agent.installs.toLocaleString()} installs</span>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted leading-relaxed mt-3 flex-1">
        {agent.tagline}
      </p>

      {/* N8n badge */}
      {agent.n8nWorkflow && (
        <div className="flex items-center gap-1.5 mt-3">
          <Zap size={10} style={{ color: '#A78BFA' }} />
          <span className="font-mono text-2xs tracking-wider" style={{ color: '#A78BFA' }}>
            n8n workflow included
          </span>
        </div>
      )}

      {/* Footer: CTA row */}
      <div className="flex items-center gap-3 mt-5">
        {added ? (
          <button
            onClick={() => setAdded(false)}
            className="btn-outline flex-1 justify-center text-xs py-2 px-3 rounded-full"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}
          >
            <Check size={13} />
            Added
          </button>
        ) : (
          <button
            onClick={() => setAdded(true)}
            className="btn-primary flex-1 justify-center text-xs py-2 px-3"
          >
            <Plus size={13} />
            Add to Stack
          </button>
        )}
        <Link
          href={`/stack/${agent.slug}`}
          className="btn-ghost text-xs py-2 px-3 rounded-full flex-shrink-0"
        >
          View
        </Link>
      </div>
    </div>
  )
}

export default AgentLibraryCard
