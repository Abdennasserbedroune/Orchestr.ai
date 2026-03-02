'use client'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { AGENTS_CATALOG } from '@/lib/agents-data'
import { DOMAIN_META } from '@/lib/mock-data'
import type { Domain } from '@/lib/mock-data'
import { AgentLibraryCard } from '@/components/AgentLibraryCard'

type Filter = Domain | 'all'

const DOMAIN_FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'content',  label: 'Content'  },
  { value: 'sales',    label: 'Sales'    },
  { value: 'ops',      label: 'Ops'      },
  { value: 'research', label: 'Research' },
  { value: 'finance',  label: 'Finance'  },
  { value: 'hr',       label: 'HR'       },
  { value: 'tech',     label: 'Tech'     },
]

export default function StackPage() {
  const [query,  setQuery ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    return AGENTS_CATALOG.filter(agent => {
      const matchesDomain = filter === 'all' || agent.domain === filter
      const q = query.toLowerCase()
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.tagline.toLowerCase().includes(q) ||
        agent.domain.toLowerCase().includes(q)
      return matchesDomain && matchesSearch
    })
  }, [query, filter])

  return (
    <div className="relative min-h-screen">
      {/* Ambient glow */}
      <div className="glow-blob w-[600px] h-[400px] -top-10 right-0 opacity-20" />

      <div className="relative p-8 max-w-[1200px] mx-auto flex flex-col gap-8">

        {/* ── Header ─────────────────────────────── */}
        <header className="animate-fade-in">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-semibold text-foreground">The Stack</h1>
            <span className="chip font-mono">{AGENTS_CATALOG.length} agents</span>
          </div>
          <p className="text-sm text-muted mt-1">
            Deploy specialized AI agents across every business domain.
          </p>
        </header>

        {/* ── Search + Filters ────────────────────── */}
        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Terminal-style search */}
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm select-none"
              style={{ color: 'var(--color-brand)', lineHeight: 1 }}
            >
              &gt;
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="search agents by name, role, or domain..."
              className="input pl-9 font-mono text-sm"
              aria-label="Search agents"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <Search size={14} />
              </button>
            )}
          </div>

          {/* Domain filter pill row */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
            {DOMAIN_FILTERS.map(({ value, label }) => {
              const isActive = filter === value
              const domainMeta = value !== 'all' ? DOMAIN_META[value as Domain] : null

              const activeStyle = isActive
                ? value === 'all'
                  ? {
                      background: 'rgba(99,102,241,0.15)',
                      borderColor: 'rgba(99,102,241,0.5)',
                      color: '#6366F1',
                      boxShadow: '0 0 12px rgba(99,102,241,0.25)',
                    }
                  : {
                      background: domainMeta?.bg,
                      borderColor: domainMeta?.color,
                      color: domainMeta?.color,
                      boxShadow: `0 0 12px ${domainMeta?.color}30`,
                    }
                : {}

              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`chip cursor-pointer transition-all duration-200 ${
                    isActive ? '' : 'hover:border-white/20 hover:text-foreground hover:bg-white/5'
                  }`}
                  style={activeStyle}
                  aria-pressed={isActive}
                >
                  {value !== 'all' && domainMeta && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: domainMeta.color }}
                    />
                  )}
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Results count ───────────────────────── */}
        {(query || filter !== 'all') && (
          <div className="flex items-center gap-2 -mt-4">
            <span className="section-label">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { setQuery(''); setFilter('all') }}
              className="text-2xs text-muted hover:text-foreground font-mono underline underline-offset-2 transition-colors"
            >
              clear
            </button>
          </div>
        )}

        {/* ── Agent Grid ──────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
            {filtered.map(agent => (
              <AgentLibraryCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="icon-node w-14 h-14">
              <Search size={22} className="text-brand" />
            </div>
            <p className="font-display text-base font-semibold text-foreground">
              No agents match your search
            </p>
            <p className="text-sm text-muted max-w-[280px]">
              Try a different keyword or clear the domain filter.
            </p>
            <button
              onClick={() => { setQuery(''); setFilter('all') }}
              className="btn-ghost text-sm mt-2"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
