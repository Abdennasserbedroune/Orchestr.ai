'use client'
import { useState, useEffect } from 'react'
import { Zap, AlertCircle } from 'lucide-react'
import { WorkflowCard } from './WorkflowCard'
import type { N8nWorkflow } from '@/lib/n8n-workflows-index'

interface WorkflowsSectionProps {
  agentSlug: string
}

export function WorkflowsSection({ agentSlug }: WorkflowsSectionProps) {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([])
  const [loading,   setLoading  ] = useState(true)
  const [error,     setError    ] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/workflows?agent_slug=${agentSlug}`)
        if (!res.ok) throw new Error(`${res.status}`)
        const data: N8nWorkflow[] = await res.json()
        if (!cancelled) setWorkflows(data)
      } catch {
        if (!cancelled) setError('Could not load workflows.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [agentSlug])

  return (
    <section className="mb-10">
      {/* Section header — identical pattern to Playbook / Reviews */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <p className="section-label">Workflows</p>
          <span
            className="chip font-mono text-2xs"
            style={{
              background: 'rgba(99,102,241,0.08)',
              borderColor: 'rgba(99,102,241,0.2)',
              color: 'var(--color-brand)',
            }}
          >
            <Zap size={9} /> n8n
          </span>
        </div>
        {!loading && !error && (
          <span className="chip font-mono">{workflows.length} ready</span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card p-5 flex flex-col gap-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="flex-1">
                  <div className="h-3 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-2.5 rounded w-1/2 mt-2" style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
              </div>
              <div className="flex gap-1.5">
                {[40, 32, 48].map(w => (
                  <div key={w} className="h-5 rounded-full" style={{ width: `${w}px`, background: 'rgba(255,255,255,0.04)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#EF4444',
          }}
          role="alert"
        >
          <AlertCircle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && workflows.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="icon-node w-12 h-12"
            style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' }}
          >
            <Zap size={18} style={{ color: 'var(--color-brand)' }} />
          </div>
          <p className="font-display text-sm font-semibold text-foreground">No workflows yet</p>
          <p className="text-xs text-muted text-center max-w-[240px]">
            n8n workflows for this agent are coming soon.
          </p>
        </div>
      )}

      {/* Workflow grid */}
      {!loading && !error && workflows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </section>
  )
}

export default WorkflowsSection
