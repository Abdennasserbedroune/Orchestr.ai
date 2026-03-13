'use client'
import { useState } from 'react'
import { Download, Copy, Check, Zap, Hexagon } from 'lucide-react'
import type { WorkflowItem } from '@/lib/workflows-api'
import { formatWorkflowName, sanitizeWorkflowDescription } from '@/lib/workflow-name'

interface WorkflowCardProps {
  workflow: WorkflowItem
}

const COMPLEXITY_STYLE: Record<
  'low' | 'medium' | 'high',
  { color: string; border: string; bg: string; label: string }
> = {
  low: {
    color: '#10B981',
    border: 'rgba(16,185,129,0.2)',
    bg: 'rgba(16,185,129,0.08)',
    label: 'Simple',
  },
  medium: {
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.2)',
    bg: 'rgba(245,158,11,0.08)',
    label: 'Moderate',
  },
  high: {
    color: '#EF4444',
    border: 'rgba(239,68,68,0.2)',
    bg: 'rgba(239,68,68,0.08)',
    label: 'Advanced',
  },
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const complexity = COMPLEXITY_STYLE[workflow.complexity] ?? COMPLEXITY_STYLE.low

  // Clean name and description at render time
  const displayName = formatWorkflowName(workflow.name)
  const displayDescription = sanitizeWorkflowDescription(workflow.description, workflow.name)

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    try {
      const res = await fetch(workflow.raw_url)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = workflow.filename || `${workflow.id}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Silently fail — CORS handled by proxy
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(workflow.raw_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable in non-secure context
    }
  }

  return (
    <div
      className="card p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: 'none' }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="icon-node w-9 h-9 flex-shrink-0"
          style={{
            background: 'rgba(99,102,241,0.1)',
            borderColor: 'rgba(99,102,241,0.25)',
          }}
        >
          <Zap size={14} style={{ color: 'var(--color-brand)' }} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Human-readable name — never a raw API slug */}
          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {displayName}
          </h4>
          {workflow.category && (
            <p className="section-label mt-0.5 truncate" style={{ fontSize: '10px' }}>
              {workflow.category}
            </p>
          )}
        </div>

        {/* Complexity badge — English labels */}
        <span
          className="chip text-2xs flex-shrink-0 self-start"
          style={{
            color: complexity.color,
            borderColor: complexity.border,
            background: complexity.bg,
          }}
        >
          {complexity.label}
        </span>
      </div>

      {/* Description — French generic stubs replaced with English fallback */}
      {displayDescription && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {displayDescription}
        </p>
      )}

      {/* Integration badges */}
      {workflow.integrations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {workflow.integrations.slice(0, 6).map(integration => (
            <span
              key={integration}
              className="chip text-2xs"
              style={{
                background: 'rgba(99,102,241,0.07)',
                borderColor: 'rgba(99,102,241,0.2)',
                color: 'var(--color-brand)',
              }}
            >
              {integration}
            </span>
          ))}
          {workflow.integrations.length > 6 && (
            <span className="chip text-2xs">
              +{workflow.integrations.length - 6}
            </span>
          )}
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3">
        {workflow.node_count > 0 && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-[#52525b]">
            <Hexagon size={10} className="flex-shrink-0" strokeWidth={1.5} />
            {workflow.node_count} nodes
          </span>
        )}
        {workflow.trigger_type && workflow.trigger_type !== 'Manual' && (
          <span className="chip text-2xs">
            {workflow.trigger_type}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-ghost text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full gap-1.5 disabled:opacity-50"
          aria-label={`Download ${displayName} JSON`}
        >
          <Download size={12} />
          {downloading ? 'Downloading...' : 'JSON'}
        </button>

        <button
          onClick={handleCopyUrl}
          className="btn-ghost text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full gap-1.5 ml-auto text-brand"
          style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)' }}
          aria-label={`Copy import URL for ${displayName}`}
        >
          {copied
            ? <><Check size={12} className="text-green-400" /> Copied</>
            : <><Copy size={12} /> Import URL</>
          }
        </button>
      </div>
    </div>
  )
}

export default WorkflowCard
