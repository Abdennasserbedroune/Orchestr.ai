import type { Domain } from './mock-data'

// ── Types ────────────────────────────────────────────────────
export interface AgentReview {
  author: string
  company: string
  rating: number
  body: string
  date: string
}

export interface PlaybookStep {
  step: number
  title: string
  detail: string
}

export interface AgentFull {
  id: string
  slug: string          // URL-safe unique ID — used as FK in user_stack / tasks / reviews
  name: string
  role: string
  tagline: string
  description: string
  domain: Domain
  status: 'active' | 'beta' | 'coming-soon'
  rating: number
  installs: number
  skills: string[]
  compatibleTools: string[]
  n8nWorkflow: boolean
  playbook: PlaybookStep[]
  reviews: AgentReview[]
}

// ── Catalog ──────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for agents.
// Never store agents in Supabase — always read from here.
export const AGENTS_CATALOG: AgentFull[] = [
  {
    id: 'agent-001', slug: 'quill',
    name: 'Quill', role: 'Content Writer',
    tagline: 'From brief to publish-ready copy in minutes.',
    description: 'Quill handles your entire content pipeline — blog posts, social copy, email sequences, landing pages, and SEO briefs. It researches, drafts, revises, and formats content optimized for your audience and channel.',
    domain: 'content', status: 'active', rating: 4.8, installs: 2340,
    skills: ['Blog writing', 'SEO optimization', 'Email copy', 'Social media', 'Content calendar', 'Brand voice'],
    compatibleTools: [
      'Notion — Docs & wikis',
      'WordPress — Blog publishing',
      'Webflow — Website CMS',
      'Mailchimp — Email campaigns',
      'Buffer — Social scheduling',
      'HubSpot — Marketing hub',
    ],
    n8nWorkflow: true,
    playbook: [
      { step: 1, title: 'Brief intake',      detail: 'Receives topic, audience, tone, and keywords from you or your CMS.' },
      { step: 2, title: 'Research',          detail: 'Scans top-ranking content and identifies gaps to position your piece.' },
      { step: 3, title: 'Draft',             detail: 'Writes structured, SEO-optimized draft with H2s, intro hook, and CTA.' },
      { step: 4, title: 'Brand alignment',   detail: 'Revises against your brand voice guide stored in the workspace.' },
      { step: 5, title: 'Publish or export', detail: 'Pushes to CMS or exports as Markdown/HTML.' },
    ],
    reviews: [
      { author: 'Sarah M.',  company: 'GrowthLab',   rating: 5, body: 'Quill cut our content production time by 70%. The brand voice feature is spot on.', date: 'Jan 2025' },
      { author: 'Tom K.',    company: 'Indie Hacker', rating: 5, body: 'Best AI writing agent I have used. Actually understands SEO, not just keywords.',   date: 'Feb 2025' },
      { author: 'Priya R.',  company: 'SaaSly',       rating: 4, body: 'Great output quality. Would love more social media template variety.',              date: 'Mar 2025' },
    ],
  },
  {
    id: 'agent-002', slug: 'nexus',
    name: 'Nexus', role: 'Sales Strategist',
    tagline: 'Qualify leads, write outreach, close more deals.',
    description: 'Nexus manages your full sales workflow — from lead qualification and ICP scoring to personalized outreach sequences and CRM updates. It monitors deal health and flags at-risk opportunities before they go cold.',
    domain: 'sales', status: 'active', rating: 4.7, installs: 1870,
    skills: ['Lead qualification', 'ICP scoring', 'Outreach sequences', 'CRM sync', 'Deal monitoring', 'Pipeline reporting'],
    compatibleTools: [
      'HubSpot — CRM & sales pipeline',
      'Salesforce — Enterprise CRM',
      'Pipedrive — Deal tracking',
      'Apollo — Lead prospecting',
      'LinkedIn — Professional outreach',
      'Gmail — Email sequences',
    ],
    n8nWorkflow: true,
    playbook: [
      { step: 1, title: 'Lead intake',     detail: 'Pulls new leads from CRM, CSV, or LinkedIn export.' },
      { step: 2, title: 'ICP scoring',     detail: 'Scores each lead against your Ideal Customer Profile criteria.' },
      { step: 3, title: 'Outreach draft',  detail: 'Writes personalized email sequences with industry-specific hooks.' },
      { step: 4, title: 'Follow-up logic', detail: 'Automates follow-up cadence and adjusts based on reply signals.' },
      { step: 5, title: 'CRM update',      detail: 'Logs all activity back to your CRM with structured notes.' },
    ],
    reviews: [
      { author: 'James L.', company: 'Velocity B2B', rating: 5, body: 'Pipeline went from 20 to 80 active deals in 6 weeks. Nexus is a beast.',         date: 'Feb 2025' },
      { author: 'Anna C.',  company: 'Seedstage',    rating: 4, body: 'Outreach quality is excellent. Setup took longer than expected but worth it.', date: 'Jan 2025' },
    ],
  },
  {
    id: 'agent-003', slug: 'atlas',
    name: 'Atlas', role: 'Ops Commander',
    tagline: 'Automate every repetitive workflow. Zero code.',
    description: 'Atlas maps your operations, identifies automation opportunities, and builds n8n workflows to eliminate manual work. From invoice processing to Slack notifications to internal reporting — Atlas runs it all.',
    domain: 'ops', status: 'active', rating: 4.9, installs: 3120,
    skills: ['Workflow automation', 'n8n builder', 'Process mapping', 'Slack ops', 'Invoice processing', 'Report generation'],
    compatibleTools: [
      'n8n — Workflow automation engine',
      'Zapier — No-code automations',
      'Slack — Team notifications',
      'Notion — Internal knowledge base',
      'Airtable — Structured databases',
      'Google Workspace — Docs, Sheets & Drive',
    ],
    n8nWorkflow: true,
    playbook: [
      { step: 1, title: 'Process audit',  detail: 'Identifies your top 5 time-consuming manual workflows.' },
      { step: 2, title: 'Automation map', detail: 'Designs trigger-action logic for each workflow.' },
      { step: 3, title: 'n8n build',      detail: 'Builds and tests the workflow in your n8n instance.' },
      { step: 4, title: 'Error handling', detail: 'Adds retry logic, error alerts, and fallback paths.' },
      { step: 5, title: 'Handoff report', detail: 'Documents what runs, when, and how to modify it.' },
    ],
    reviews: [
      { author: 'Mike T.', company: 'OpsFirst', rating: 5, body: 'Atlas built 8 n8n workflows in a day. We saved 20+ hours per week.',                     date: 'Mar 2025' },
      { author: 'Dana W.', company: 'SMBscale', rating: 5, body: 'The process audit alone was worth it. Spotted 3 workflows we had never automated.', date: 'Feb 2025' },
    ],
  },
  {
    id: 'agent-004', slug: 'scout',
    name: 'Scout', role: 'Market Researcher',
    tagline: 'Know your market before your competitors do.',
    description: 'Scout continuously monitors your competitive landscape — tracking pricing changes, product launches, funding news, and social signals. It delivers structured intelligence reports so you can act first.',
    domain: 'research', status: 'active', rating: 4.6, installs: 1540,
    skills: ['Competitor tracking', 'Pricing intelligence', 'News monitoring', 'Trend analysis', 'SWOT reports', 'Social listening'],
    compatibleTools: [
      'Perplexity API — AI-powered web search',
      'SerpAPI — Google search results',
      'X (Twitter) — Social signals & trends',
      'Crunchbase — Startup & funding data',
      'LinkedIn — Company & people insights',
      'Notion — Intelligence report delivery',
    ],
    n8nWorkflow: false,
    playbook: [
      { step: 1, title: 'Competitor list',   detail: 'You provide or it discovers your top 5-10 competitors.' },
      { step: 2, title: 'Signal monitoring', detail: 'Tracks pricing pages, blog posts, job listings, and social feeds.' },
      { step: 3, title: 'Change detection',  detail: 'Flags meaningful changes vs. noise using pattern matching.' },
      { step: 4, title: 'Intel report',      detail: 'Delivers weekly structured report to Slack or email.' },
      { step: 5, title: 'Action prompts',    detail: 'Suggests strategic responses to each intelligence item.' },
    ],
    reviews: [
      { author: 'Lena S.', company: 'CompeteSmart', rating: 5, body: 'Scout caught a competitor pricing drop before we lost a deal. Game changer.',  date: 'Jan 2025' },
      { author: 'Ryan P.', company: 'EarlyStage',   rating: 4, body: 'Solid research agent. Would love Crunchbase integration to be deeper.',       date: 'Feb 2025' },
    ],
  },
  {
    id: 'agent-005', slug: 'ledger',
    name: 'Ledger', role: 'Finance Analyst',
    tagline: 'Your books, your runway, your decisions — automated.',
    description: 'Ledger pulls data from your accounting tools, generates P&L reports, tracks burn rate and runway, flags overdue invoices, and answers financial questions in plain English.',
    domain: 'finance', status: 'active', rating: 4.7, installs: 980,
    skills: ['P&L reporting', 'Burn rate tracking', 'Invoice management', 'Runway calculation', 'Budget vs actuals', 'Financial Q&A'],
    compatibleTools: [
      'QuickBooks — Small business accounting',
      'Xero — Cloud accounting & invoices',
      'Stripe — Payments & revenue data',
      'Mercury — Startup banking',
      'Notion — Finance dashboards',
      'Google Sheets — Custom financial models',
    ],
    n8nWorkflow: true,
    playbook: [
      { step: 1, title: 'Data connection', detail: 'Connects to your accounting tool and pulls current period data.' },
      { step: 2, title: 'P&L generation',  detail: 'Builds income statement with variance analysis vs prior period.' },
      { step: 3, title: 'Runway model',    detail: 'Calculates burn rate and months of runway at current spend.' },
      { step: 4, title: 'Invoice audit',   detail: 'Flags overdue invoices and drafts payment reminder messages.' },
      { step: 5, title: 'Monthly report',  detail: 'Delivers executive summary to Slack or email on schedule.' },
    ],
    reviews: [
      { author: 'Chris B.',  company: 'BootstrapCo',  rating: 5, body: 'Finally I understand my own finances. Ledger explains everything in plain English.',        date: 'Mar 2025' },
      { author: 'Fatima A.', company: 'Founders Fund', rating: 4, body: 'P&L reports are excellent. Stripe integration has minor delay but nothing critical.', date: 'Jan 2025' },
    ],
  },
  {
    id: 'agent-006', slug: 'pulse',
    name: 'Pulse', role: 'HR Manager',
    tagline: 'Hire faster. Retain longer. Run HR on autopilot.',
    description: 'Pulse handles recruitment screening, interview scheduling, onboarding checklists, team health surveys, and PTO tracking. It gives every HR task the attention it deserves without a full HR team.',
    domain: 'hr', status: 'active', rating: 4.5, installs: 760,
    skills: ['Candidate screening', 'Interview scheduling', 'Onboarding workflows', 'Team surveys', 'PTO tracking', 'Job descriptions'],
    compatibleTools: [
      'Greenhouse — Applicant tracking system',
      'Lever — Recruitment & hiring pipeline',
      'Notion — Onboarding wikis & checklists',
      'Slack — Team communications',
      'Google Calendar — Interview scheduling',
      'Typeform — Team surveys & feedback',
    ],
    n8nWorkflow: true,
    playbook: [
      { step: 1, title: 'Role intake',      detail: 'Captures job title, requirements, and team context.' },
      { step: 2, title: 'JD generation',    detail: 'Writes compelling job description aligned with your culture.' },
      { step: 3, title: 'Applicant screen', detail: 'Scores CVs against your rubric and shortlists top candidates.' },
      { step: 4, title: 'Interview setup',  detail: 'Sends scheduling links and prepares interviewer question sets.' },
      { step: 5, title: 'Onboarding flow',  detail: 'Triggers day 1-30 onboarding checklist for accepted candidates.' },
    ],
    reviews: [
      { author: 'Mark D.',  company: 'ScaleUp HR',  rating: 5, body: 'Pulse screened 40 candidates overnight. Shortlist was perfect.',                  date: 'Feb 2025' },
      { author: 'Julia N.', company: 'RemoteFirst', rating: 4, body: 'Great for async teams. The survey templates are particularly useful.', date: 'Mar 2025' },
    ],
  },
  {
    id: 'agent-007', slug: 'forge',
    name: 'Forge', role: 'Tech Architect',
    tagline: 'From spec to scalable system design in hours.',
    description: 'Forge reviews your codebase, designs scalable architecture, audits API performance, manages technical debt backlogs, and writes engineering documentation. The senior engineer you always needed.',
    domain: 'tech', status: 'active', rating: 4.8, installs: 2100,
    skills: ['System design', 'API auditing', 'Tech debt tracking', 'Code review', 'Engineering docs', 'Architecture diagrams'],
    compatibleTools: [
      'GitHub — Code repos & pull requests',
      'Linear — Engineering task tracking',
      'Notion — Architecture documentation',
      'Postman — API testing & monitoring',
      'Vercel — Frontend deployments',
      'Supabase — Backend & database layer',
    ],
    n8nWorkflow: false,
    playbook: [
      { step: 1, title: 'Codebase scan',    detail: 'Reviews repo structure, dependencies, and identifies risk areas.' },
      { step: 2, title: 'Architecture map', detail: 'Diagrams your current system and proposes improvements.' },
      { step: 3, title: 'API audit',        detail: 'Tests endpoints for performance, security, and correctness.' },
      { step: 4, title: 'Debt backlog',     detail: 'Creates prioritized tech debt tickets in Linear or Notion.' },
      { step: 5, title: 'Docs generation',  detail: 'Writes or updates README, API docs, and architecture notes.' },
    ],
    reviews: [
      { author: 'Alex J.', company: 'DevScale',    rating: 5, body: 'Forge found a critical N+1 query issue in our API that was costing us $400/mo.', date: 'Feb 2025' },
      { author: 'Nina K.', company: 'SoloFounder', rating: 5, body: 'As a non-technical founder, Forge explained our entire system in plain terms.',  date: 'Jan 2025' },
    ],
  },
]
