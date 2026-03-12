import { MOCK_TASKS, DOMAIN_META } from '@/lib/mock-data'
import type { TaskStatus } from '@/lib/mock-data'

const COLUMNS: { status: TaskStatus; label: string; dotClass: string; color: string }[] = [
  { status: 'in-progress', label: 'En cours', dotClass: 'running', color: '#F59E0B' },
  { status: 'complete', label: 'Terminé', dotClass: 'active', color: '#22C55E' },
  { status: 'error', label: 'Erreur', dotClass: 'error', color: '#EF4444' },
]

export function OperationsBoard() {
  const total = MOCK_TASKS.length
  const active = MOCK_TASKS.filter(t => t.status === 'in-progress').length
  const errors = MOCK_TASKS.filter(t => t.status === 'error').length

  return (
    <div className="space-y-4">
      {/* Stats chips row */}
      <div className="flex flex-wrap gap-2">
        <span className="chip">
          <span className="status-dot idle" />
          {total} tâches au total
        </span>
        <span className="chip">
          <span className="status-dot running" />
          {active} actives
        </span>
        <span className="chip">
          <span className="status-dot error" />
          {errors} erreurs
        </span>
      </div>

      {/* Mini 3-col kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const tasks = MOCK_TASKS.filter(t => t.status === col.status)
          return (
            <div key={col.status} className="card p-4 space-y-3">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <span className="section-label">{col.label}</span>
                <span
                  className="chip font-mono"
                  style={{
                    color: col.color,
                    borderColor: `${col.color}50`,
                    background: `${col.color}18`,
                  }}
                >
                  {tasks.length}
                </span>
              </div>

              {/* Task items */}
              <div className="space-y-2">
                {tasks.length === 0 && (
                  <p className="text-2xs text-subtle font-mono py-1 px-1">Aucune tâche</p>
                )}
                {tasks.map(task => {
                  const meta = DOMAIN_META[task.domain]
                  return (
                    <div
                      key={task.id}
                      className="relative overflow-hidden rounded-lg pl-4 pr-2.5 py-2.5"
                      style={{ background: 'var(--color-panel)' }}
                    >
                      {/* Domain accent bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ background: meta.color }}
                      />
                      <p className="text-xs text-foreground leading-snug">{task.title}</p>
                      <p className="text-2xs text-muted font-mono mt-0.5">{task.agentName}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OperationsBoard
