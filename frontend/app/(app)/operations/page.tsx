import { MOCK_TASKS, DOMAIN_META } from '@/lib/mock-data'
import type { TaskStatus } from '@/lib/mock-data'
import { TaskCard } from '@/components/TaskCard'

type ColumnDef = {
  status: TaskStatus
  label: string
  color: string
  bg: string
  border: string
  dotClass: string
}

const COLUMNS: ColumnDef[] = [
  {
    status: 'backlog',
    label: 'En attente',
    color: '#4B5563',
    bg: 'rgba(75,85,99,0.08)',
    border: 'rgba(75,85,99,0.2)',
    dotClass: 'idle',
  },
  {
    status: 'in-progress',
    label: 'En cours',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    dotClass: 'running',
  },
  {
    status: 'complete',
    label: 'Terminé',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    dotClass: 'active',
  },
  {
    status: 'error',
    label: 'Erreur',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    dotClass: 'error',
  },
]

function StatCounter({
  label, count, color,
}: {
  label: string; count: number; color: string
}) {
  return (
    <div className="flex flex-col gap-1 px-6 py-5 rounded-[20px] border border-white/[0.06] bg-[#111111]/50 backdrop-blur-sm shadow-sm transition-all hover:border-white/[0.12]">
      <span className="font-display text-3xl font-semibold tracking-tight" style={{ color }}>
        {count.toString().padStart(2, '0')}
      </span>
      <span className="text-[13px] font-medium text-[#a1a1aa] uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export default function OperationsPage() {
  const byStatus = (s: TaskStatus) => MOCK_TASKS.filter(t => t.status === s)

  return (
    <div className="relative min-h-screen">
      {/* Ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-b from-brand/10 to-transparent blur-[120px] pointer-events-none z-0 rounded-full opacity-30"></div>

      <div className="relative p-8 max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* ── Header ────────────────────────────────── */}
        <header className="animate-fade-in">
          <h1 className="font-display text-2xl font-semibold text-foreground">Opérations</h1>
          <p className="text-sm text-muted mt-1">Toutes les tâches de votre équipe d&apos;agents, en temps réel.</p>
        </header>

        {/* ── Stat counters row ─────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
          {COLUMNS.map(col => (
            <StatCounter
              key={col.status}
              label={col.label}
              count={byStatus(col.status).length}
              color={col.color}
            />
          ))}
        </div>

        {/* ── Kanban board ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-10">
          {COLUMNS.map(col => {
            const tasks = byStatus(col.status)
            return (
              <div key={col.status} className="flex flex-col gap-3">

                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`status-dot ${col.dotClass}`} />
                    <span className="section-label">{col.label}</span>
                  </div>
                  <span
                    className="chip font-mono text-2xs py-0.5 px-2.5"
                    style={{
                      color: col.color,
                      background: col.bg,
                      borderColor: col.border,
                      boxShadow: tasks.length > 0 ? `0 0 10px ${col.color}20` : 'none',
                    }}
                  >
                    {tasks.length}
                  </span>
                </div>

                {/* Column lane */}
                <div
                  className="flex flex-col gap-3 rounded-2xl p-3 min-h-[420px]"
                  style={{
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 gap-2 opacity-40">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: col.bg, border: `1px solid ${col.border}` }}
                      >
                        <span className={`status-dot ${col.dotClass}`} />
                      </div>
                      <p className="font-mono text-2xs text-subtle uppercase tracking-widest">
                        Vide
                      </p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
