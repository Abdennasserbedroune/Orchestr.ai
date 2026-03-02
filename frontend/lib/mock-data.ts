import {
  PenLine, TrendingUp, Settings2, Search,
  DollarSign, Users, Code2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ── Domain ───────────────────────────────────────────────────
export type Domain = 'content' | 'sales' | 'ops' | 'research' | 'finance' | 'hr' | 'tech'
export type AgentStatus = 'active' | 'running' | 'idle' | 'error'
export type TaskStatus  = 'backlog' | 'in-progress' | 'complete' | 'error'

export interface DomainMeta {
  color: string      // hex — use inline for icon color and text
  bg: string         // rgba — use for icon container background
  label: string
  icon: LucideIcon
}

// DOMAIN_META is the single source for all domain colors + icons.
// Import this in every component that needs domain-specific styling.
export const DOMAIN_META: Record<Domain, DomainMeta> = {
  content:  { color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', label: 'Content',  icon: PenLine    },
  sales:    { color: '#34D399', bg: 'rgba(52,211,153,0.12)',  label: 'Sales',    icon: TrendingUp },
  ops:      { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  label: 'Ops',      icon: Settings2  },
  research: { color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  label: 'Research', icon: Search     },
  finance:  { color: '#F472B6', bg: 'rgba(244,114,182,0.12)', label: 'Finance',  icon: DollarSign },
  hr:       { color: '#FB923C', bg: 'rgba(251,146,60,0.12)',  label: 'HR',       icon: Users      },
  tech:     { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  label: 'Tech',     icon: Code2      },
}

// ── Mock Agents (Command dashboard) ─────────────────────────
export interface MockAgent {
  id: string
  name: string
  role: string
  domain: Domain
  status: AgentStatus
  tasksCompleted: number
  lastActive: string
}

export const MOCK_AGENTS: MockAgent[] = [
  { id: 'a1', name: 'Quill',  role: 'Content Writer',    domain: 'content',  status: 'running', tasksCompleted: 47, lastActive: '2m ago'  },
  { id: 'a2', name: 'Nexus',  role: 'Sales Strategist',  domain: 'sales',    status: 'active',  tasksCompleted: 31, lastActive: '5m ago'  },
  { id: 'a3', name: 'Atlas',  role: 'Ops Commander',     domain: 'ops',      status: 'idle',    tasksCompleted: 89, lastActive: '1h ago'  },
  { id: 'a4', name: 'Scout',  role: 'Market Researcher', domain: 'research', status: 'running', tasksCompleted: 23, lastActive: '12m ago' },
  { id: 'a5', name: 'Ledger', role: 'Finance Analyst',   domain: 'finance',  status: 'active',  tasksCompleted: 15, lastActive: '30m ago' },
  { id: 'a6', name: 'Pulse',  role: 'HR Manager',        domain: 'hr',       status: 'idle',    tasksCompleted: 9,  lastActive: '3h ago'  },
  { id: 'a7', name: 'Forge',  role: 'Tech Architect',    domain: 'tech',     status: 'error',   tasksCompleted: 62, lastActive: '45m ago' },
]

// ── Mock Tasks (Operations / kanban) ────────────────────────
export interface MockTask {
  id: string
  title: string
  agentId: string
  agentName: string
  domain: Domain
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export const MOCK_TASKS: MockTask[] = [
  { id: 't1', title: 'Write Q2 blog post series',       agentId: 'a1', agentName: 'Quill',  domain: 'content',  status: 'in-progress', priority: 'high',   createdAt: '2h ago' },
  { id: 't2', title: 'Qualify 50 inbound leads',        agentId: 'a2', agentName: 'Nexus',  domain: 'sales',    status: 'in-progress', priority: 'high',   createdAt: '3h ago' },
  { id: 't3', title: 'Automate invoice reminders',      agentId: 'a3', agentName: 'Atlas',  domain: 'ops',      status: 'complete',    priority: 'medium', createdAt: '1d ago' },
  { id: 't4', title: 'Research competitors pricing',    agentId: 'a4', agentName: 'Scout',  domain: 'research', status: 'in-progress', priority: 'medium', createdAt: '5h ago' },
  { id: 't5', title: 'Monthly P&L report',              agentId: 'a5', agentName: 'Ledger', domain: 'finance',  status: 'backlog',     priority: 'high',   createdAt: '1h ago' },
  { id: 't6', title: 'Screen 20 developer applicants',  agentId: 'a6', agentName: 'Pulse',  domain: 'hr',       status: 'backlog',     priority: 'low',    createdAt: '2d ago' },
  { id: 't7', title: 'Audit API rate limits',           agentId: 'a7', agentName: 'Forge',  domain: 'tech',     status: 'error',       priority: 'high',   createdAt: '6h ago' },
  { id: 't8', title: 'Draft partnership outreach',      agentId: 'a2', agentName: 'Nexus',  domain: 'sales',    status: 'complete',    priority: 'medium', createdAt: '2d ago' },
  { id: 't9', title: 'Publish 3 LinkedIn posts',        agentId: 'a1', agentName: 'Quill',  domain: 'content',  status: 'complete',    priority: 'low',    createdAt: '3d ago' },
]

// ── Mock Activity Feed ───────────────────────────────────────
export interface ActivityItem {
  id: string
  agentName: string
  domain: Domain
  action: string
  time: string
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'ac1', agentName: 'Quill',  domain: 'content',  action: 'Completed blog post draft — "AI in 2025"',   time: '2m ago'  },
  { id: 'ac2', agentName: 'Nexus',  domain: 'sales',    action: 'Qualified 12 leads from HubSpot import',     time: '8m ago'  },
  { id: 'ac3', agentName: 'Scout',  domain: 'research', action: 'Scraped 3 competitor pricing pages',          time: '15m ago' },
  { id: 'ac4', agentName: 'Atlas',  domain: 'ops',      action: 'Invoice reminder workflow triggered (×7)',    time: '32m ago' },
  { id: 'ac5', agentName: 'Ledger', domain: 'finance',  action: 'P&L report queued for month-end',            time: '1h ago'  },
  { id: 'ac6', agentName: 'Forge',  domain: 'tech',     action: 'Rate limit error on OpenAI — retrying (3/5)',time: '45m ago' },
]

// ── Mock typewriter responses (agent detail "Try It" demo) ───
export const MOCK_TYPEWRITER_RESPONSES: Record<string, string> = {
  content:  'Analyzing your request... Drafting a high-conversion blog intro. Hook: "Most businesses waste 80% of their content budget on posts that rank nowhere." Opening with a bold stat immediately captures attention. Continuing with 3 supporting arguments...',
  sales:    'Scanning CRM data... Identified 8 high-intent leads from last week\'s demo requests. Top prospect: Acme Corp (230 employees, SaaS, matched 6/7 ICP criteria). Drafting personalized outreach sequence now.',
  ops:      'Running ops audit... Found 3 manual workflows that can be automated: invoice reminders, Slack standup reports, and lead assignment routing. Estimated time saved: 14h/week. Building n8n workflow templates.',
  research: 'Initiating competitor scan... Competitor A raised prices 18% last quarter. Competitor B launched a new tier at $299/mo targeting SMBs. Compiling full comparison matrix now.',
  finance:  'Pulling financial data... Q1 revenue: $127k (+22% QoQ). Burn rate: $43k/mo. Runway: 8.2 months. Flagging 2 invoices overdue 30+ days. Generating full P&L summary.',
  hr:       'Reviewing 20 applicants for Senior Developer role... Shortlisted 4 candidates. Scheduling conflict flagged for Thursday panel. Sending calendar invites now.',
  tech:     'Running API health check... OpenAI endpoint latency: 340ms (+120ms vs baseline). Rate limit hit 3× in last hour. Recommend queue with exponential backoff. Patch ready to review.',
  default:  'Processing your request... Analyzing context and identifying the most relevant approach. Preparing structured output with actionable next steps.',
}
