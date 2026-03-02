import { DOMAIN_META } from '@/lib/mock-data'
import type { MockAgent } from '@/lib/mock-data'

interface AgentCardProps {
  agent: MockAgent
}

export function AgentCard({ agent }: AgentCardProps) {
  const meta = DOMAIN_META[agent.domain]
  const Icon = meta.icon

  return (
    <div className="card-hover p-5 group relative overflow-hidden">
      {/* Domain-colored inset border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${meta.color}40` }}
      />

      {/* Icon + status row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="icon-node w-10 h-10 flex-shrink-0"
          style={{ background: meta.bg, borderColor: `${meta.color}50` }}
        >
          <Icon size={16} style={{ color: meta.color }} />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`status-dot ${agent.status}`} />
          <span className="font-mono text-2xs tracking-widest uppercase text-muted">
            {agent.status}
          </span>
        </div>
      </div>

      {/* Name + role */}
      <h3 className="font-display text-base font-semibold text-foreground leading-tight">
        {agent.name}
      </h3>
      <p className="text-xs text-muted font-mono tracking-wide mt-0.5 mb-5">
        {agent.role}
      </p>

      {/* Divider */}
      <div className="h-px w-full mb-4" style={{ background: 'var(--color-border)' }} />

      {/* Tasks count + last active */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-gradient font-mono text-2xl font-medium leading-none">
            {agent.tasksCompleted}
          </span>
          <p className="text-2xs text-subtle font-mono uppercase tracking-widest mt-1">
            tasks done
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xs text-subtle font-mono">last active</p>
          <p className="text-2xs text-muted font-mono mt-0.5">{agent.lastActive}</p>
        </div>
      </div>
    </div>
  )
}

export default AgentCard
