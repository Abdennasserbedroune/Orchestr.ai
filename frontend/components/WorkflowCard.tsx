'use client'
import { useState } from 'react'
import { Download, Copy, Check, Zap, Hexagon } from 'lucide-react'
import type { WorkflowItem } from '@/lib/workflows-api'

interface WorkflowCardProps {
  workflow: WorkflowItem
}

// Complexity → chip colour tokens (all reuse existing .chip base class)
const COMPLEXITY_STYLE: Record<
  'low' | 'medium' | 'high',
  { color: string; border: string; bg: string; label: string }
> = {
  low: {
    color: '#22C55E',
    border: 'rgba(34,197,94,0.3)',
    bg:    'rgba(34,197,94,0.08)',
    label: 'Low',
  },
  medium: {
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.3)',
    bg:    'rgba(245,158,11,0.08)',
    label: 'Medium',
  },
  high: {
    color: '#EF4444',
    border: 'rgba(239,68,68,0.3)',
    bg:    'rgba(239,68,68,0.08)',
    label: 'High',
  },
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [copied,      setCopied     ] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const complexity = COMPLEXITY_STYLE[workflow.complexity] ?? COMPLEXITY_STYLE.low

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    try {
      const res = await fetch(workflow.raw_url)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = workflow.filename || `${workflow.id}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Silently fail — CORS on the download endpoint will be handled by the proxy
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
      // Clipboard API unavailable (e.g. non-secure context)
    }
  }

  return (
    <div
      className="card p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: 'none' }}
    >
      {/* ── Header row ── */}
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
          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {workflow.name}
          </h4>
          {workflow.category && (
            <p className="section-label mt-0.5 truncate" style={{ fontSize: '10px' }}>
              {workflow.category}
            </p>
          )}
        </div>

        {/* Complexity badge — top-right */}
        <span
          className="chip text-2xs flex-shrink-0 self-start"
          style={{
            color:       complexity.color,
            borderColor: complexity.border,
            background:  complexity.bg,
          }}
        >
          {complexity.label}
        </span>
      </div>

      {/* ── Description ── */}
      {workflow.description && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {workflow.description}
        </p>
      )}

      {/* ── Integration badges ── */}
      {workflow.integrations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {workflow.integrations.slice(0, 6).map(integration => (
            <span
              key={integration}
              className="chip text-2xs"
              style={{
                background:  'rgba(99,102,241,0.07)',
                borderColor: 'rgba(99,102,241,0.2)',
                color:       'var(--color-brand)',
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

      {/* ── Meta row: node count + trigger ── */}
      <div className="flex items-center gap-3">
        {workflow.node_count > 0 && (
          <span className="flex items-center gap-1 font-mono text-2xs text-muted">
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

      {/* ── Actions ── */}
      <div
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-ghost text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Download ${workflow.name} JSON`}
        >
          <Download size={12} />
          {downloading ? 'Downloading…' : 'Download JSON'}
        </button>

        <button
          onClick={handleCopyUrl}
          className="btn-ghost text-xs gap-1.5 ml-auto"
          aria-label={`Copy import URL for ${workflow.name}`}
        >
          {copied
            ? <><Check size={12} style={{ color: 'var(--color-status-active)' }} /> Copied</>
            : <><Copy size={12} /> Copy URL</>
          }
        </button>
      </div>
    </div>
  )
}

export default WorkflowCard
