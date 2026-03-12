import { DOMAIN_META } from '@/lib/mock-data'
import type { MockTask } from '@/lib/mock-data'

interface TaskCardProps {
  task: MockTask
}

const PRIORITY_STYLES: Record<MockTask['priority'], { color: string; bg: string; border: string; label: string }> = {
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Élevée' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Moyenne' },
  low: { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', label: 'Faible' },
}

export function TaskCard({ task }: TaskCardProps) {
  const meta = DOMAIN_META[task.domain]
  const priority = PRIORITY_STYLES[task.priority]
  const AgentIcon = meta.icon

  return (
    <div
      className="relative overflow-hidden transition-all duration-300 rounded-[18px] border border-white/[0.06] bg-[#111111] hover:border-white/[0.12] hover:bg-[#181818] p-4 group"
    >
      {/* Domain indicator icon in background */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <AgentIcon size={64} />
      </div>

      {/* Domain accent bar — left edge */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
        style={{ background: meta.color }}
      />

      {/* Agent row */}
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="flex items-center justify-center w-6 h-6 rounded-[8px] flex-shrink-0"
          style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}
        >
          <AgentIcon size={12} style={{ color: meta.color }} />
        </div>
        <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">
          {task.agentName}
        </span>
      </div>

      {/* Task title */}
      <p className="text-[15px] font-medium text-[#fafafa] leading-snug mb-4">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span
          className="text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border"
          style={{
            color: priority.color,
            background: priority.bg,
            borderColor: priority.border,
          }}
        >
          {priority.label}
        </span>
        <span className="font-mono text-[10px] text-[#52525b]">{task.createdAt}</span>
      </div>
    </div>
  )
}

export default TaskCard
