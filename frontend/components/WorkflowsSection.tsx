'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Zap, AlertCircle, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { WorkflowCard } from './WorkflowCard'
import type { WorkflowItem, WorkflowsResponse } from '@/lib/workflows-api'

interface WorkflowsSectionProps {
  agentSlug: string
}

const COMPLEXITY_OPTIONS = [
  { value: 'all',    label: 'All' },
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
]

const PER_PAGE = 12

export function WorkflowsSection({ agentSlug }: WorkflowsSectionProps) {
  // ── State ──────────────────────────────────────────────────────────────
  const [workflows,   setWorkflows  ] = useState<WorkflowItem[]>([])
  const [total,       setTotal      ] = useState(0)
  const [totalPages,  setTotalPages ] = useState(1)
  const [page,        setPage       ] = useState(1)
  const [loading,     setLoading    ] = useState(true)
  const [error,       setError      ] = useState<string | null>(null)

  const [search,     setSearch    ] = useState('')
  const [complexity, setComplexity] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [category,   setCategory  ] = useState('')

  // Track whether we should show filters (avoids layout shift on first load)
  const [filtersReady, setFiltersReady] = useState(false)

  // Debounce ref for search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load categories once ────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : null)
      .then((d: { categories: string[] } | null) => {
        if (d?.categories) setCategories(d.categories)
      })
      .catch(() => null)
      .finally(() => setFiltersReady(true))
  }, [])

  // ── Core fetch (memoised to use as dep in effects) ─────────────────────
  const fetchPage = useCallback(
    async (targetPage: number, searchVal: string, complexityVal: string, categoryVal: string) => {
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams({
          agent_slug: agentSlug,
          page:       String(targetPage),
          per_page:   String(PER_PAGE),
          complexity: complexityVal,
          search:     searchVal,
        })
        if (categoryVal) qs.set('category', categoryVal)

        const res = await fetch(`/api/workflows?${qs}`)
        if (!res.ok) throw new Error(`${res.status}`)

        const data: WorkflowsResponse = await res.json()
        setWorkflows(data.workflows)
        setTotal(data.total)
        setTotalPages(data.total_pages)
      } catch {
        setError('Could not load workflows. The live API may be temporarily unavailable.')
      } finally {
        setLoading(false)
      }
    },
    [agentSlug],
  )

  // ── Initial load + agentSlug changes ───────────────────────────────────
  useEffect(() => {
    setPage(1)
    setSearch('')
    setComplexity('all')
    setCategory('')
    fetchPage(1, '', 'all', '')
  }, [agentSlug, fetchPage])

  // ── Re-fetch on filter changes (reset to page 1) ───────────────────────
  // Triggered by complexity or category changes
  function applyFilters(
    newComplexity = complexity,
    newCategory   = category,
    newSearch     = search,
    newPage       = 1,
  ) {
    setPage(newPage)
    fetchPage(newPage, newSearch, newComplexity, newCategory)
  }

  // ── Search — debounced 300ms ────────────────────────────────────────────
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchPage(1, val, complexity, category)
    }, 300)
  }

  // ── Pagination ──────────────────────────────────────────────────────────
  function goToPage(next: number) {
    if (next < 1 || next > totalPages) return
    setPage(next)
    fetchPage(next, search, complexity, category)
    // Scroll section header into view smoothly
    document.getElementById('workflows-section-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <section className="mb-10" id="workflows-section-header">

      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <p className="section-label">Workflows</p>
          <span
            className="chip font-mono text-2xs"
            style={{
              background:  'rgba(99,102,241,0.08)',
              borderColor: 'rgba(99,102,241,0.2)',
              color:       'var(--color-brand)',
            }}
          >
            <Zap size={9} /> n8n
          </span>
        </div>

        {/* Stats bar */}
        {!loading && !error && total > 0 && (
          <span className="font-mono text-xs text-muted">
            {total.toLocaleString()} workflow{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Filters bar ──────────────────────────────────────────────── */}
      {filtersReady && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-muted)' }}
            />
            <input
              type="text"
              className="input pl-8 text-sm rounded-xl"
              placeholder="Search workflows…"
              value={search}
              onChange={handleSearchChange}
              aria-label="Search workflows"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category dropdown */}
            {categories.length > 0 && (
              <div className="relative">
                <SlidersHorizontal
                  size={11}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-muted)' }}
                />
                <select
                  className="input pl-7 pr-3 text-xs rounded-xl appearance-none cursor-pointer"
                  style={{ minWidth: '160px', paddingTop: '8px', paddingBottom: '8px' }}
                  value={category}
                  onChange={e => {
                    const val = e.target.value
                    setCategory(val)
                    applyFilters(complexity, val, search)
                  }}
                  aria-label="Filter by category"
                >
                  <option value="">All categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Complexity pills */}
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
              role="group"
              aria-label="Filter by complexity"
            >
              {COMPLEXITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setComplexity(opt.value)
                    applyFilters(opt.value, category, search)
                  }}
                  className="btn-ghost text-xs px-3 py-2 rounded-none transition-all duration-150"
                  style={{
                    color: complexity === opt.value ? 'var(--color-foreground)' : undefined,
                    background:
                      complexity === opt.value
                        ? 'rgba(99,102,241,0.15)'
                        : undefined,
                    borderRight: '1px solid var(--color-border)',
                  }}
                  aria-pressed={complexity === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="card p-5 flex flex-col gap-3 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="flex-1">
                  <div className="h-3 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-2 rounded w-1/2 mt-2" style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
                <div className="h-5 w-12 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div className="h-2.5 rounded w-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="h-2.5 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="flex gap-1.5">
                {[40, 32, 48, 36].map(w => (
                  <div key={w} className="h-5 rounded-full" style={{ width: `${w}px`, background: 'rgba(255,255,255,0.04)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error state ──────────────────────────────────────────────── */}
      {!loading && error && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border:     '1px solid rgba(239,68,68,0.18)',
            color:      '#EF4444',
          }}
          role="alert"
        >
          <AlertCircle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!loading && !error && workflows.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.015)',
            border:     '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="icon-node w-12 h-12"
            style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' }}
          >
            <Zap size={18} style={{ color: 'var(--color-brand)' }} />
          </div>
          <p className="font-display text-sm font-semibold text-foreground">No workflows found</p>
          <p className="text-xs text-muted text-center max-w-[240px]">
            Try adjusting your search or filter — there are 4,000+ workflows available.
          </p>
        </div>
      )}

      {/* ── Workflow grid ─────────────────────────────────────────────── */}
      {!loading && !error && workflows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map(workflow => (
            <WorkflowCard key={String(workflow.id)} workflow={workflow} />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────── */}
      {!loading && !error && totalPages > 1 && (
        <div
          className="flex items-center justify-between mt-6 pt-5"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="btn-ghost gap-1.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <span className="font-mono text-xs text-muted">
            Page {page} of {totalPages.toLocaleString()}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="btn-ghost gap-1.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

    </section>
  )
}

export default WorkflowsSection
