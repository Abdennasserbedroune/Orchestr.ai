/**
 * workflows-api.ts
 * Single source of truth for fetching workflows from the Zie619 live API.
 *
 * Live API: https://n8n-workflows-1-xxgm.onrender.com
 * GitHub Pages (static UI only, not the API): https://zie619.github.io/n8n-workflows/
 *
 * Key API notes from api_server.py:
 *  - Search param is `q`, not `search`
 *  - Response pagination field is `pages`, not `total_pages`
 *  - Trigger filter uses `trigger=all` (not empty string) to mean no filter
 *  - Complexity filter uses `complexity=all` to mean no filter
 */

export interface WorkflowItem {
  id: string | number
  filename: string
  name: string
  description: string
  category: string          // derived from AGENT_CATEGORY_MAP on our side
  complexity: 'low' | 'medium' | 'high'
  trigger_type: string
  node_count: number
  integrations: string[]
  tags: string[]
  active: boolean
  raw_url: string           // constructed from filename, for JSON download
}

export interface WorkflowsResponse {
  workflows: WorkflowItem[]
  total: number
  page: number
  per_page: number
  total_pages: number       // normalised from API's `pages` field
}

export interface WorkflowStats {
  total: number
  active: number
  inactive: number
  triggers: Record<string, number>
  complexity: Record<string, number>
  total_nodes: number
  unique_integrations: number
  last_indexed: string
}

// ── Constants ───────────────────────────────────────────────────────────────

const ZIE619_API = 'https://n8n-workflows-1-xxgm.onrender.com'

// Maps agent slugs to the category strings used by the Zie619 API.
// These values match what /api/categories returns from their unique_categories.json.
export const AGENT_CATEGORY_MAP: Record<string, string> = {
  quill:  'Creative Content & Video Automation',
  nexus:  'CRM & Sales',
  atlas:  'Business Process Automation',
  scout:  'Web Scraping & Data Extraction',
  ledger: 'Financial & Accounting',
  pulse:  'Project Management',
  forge:  'Technical Infrastructure & DevOps',
}

// Raw GitHub URL for downloading a workflow JSON by filename.
// Filenames in the Zie619 API are bare (e.g. "0785_Openai_Twitter_Create.json");
// the API's folder structure places them under workflows/<FolderName>/.
// We use the GitHub search tree to build the raw URL via the API's download endpoint.
function buildRawUrl(filename: string): string {
  // Use the Zie619 API's own download endpoint — it finds the file across subfolders.
  return `${ZIE619_API}/api/workflows/${filename}/download`
}

// ── Shared fetcher ───────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${ZIE619_API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // 8s timeout via AbortController
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    throw new Error(`Zie619 API error ${res.status}: ${path}`)
  }
  return res.json() as Promise<T>
}

// ── Raw API response shapes (internal) ──────────────────────────────────────

interface RawWorkflowSummary {
  id?: number | string
  filename: string
  name: string
  active: boolean | number
  description?: string
  trigger_type?: string
  complexity?: string
  node_count?: number
  integrations?: string[]
  tags?: string[]
}

interface RawSearchResponse {
  workflows: RawWorkflowSummary[]
  total: number
  page: number
  per_page: number
  pages: number   // NOTE: API uses `pages`, not `total_pages`
  query: string
  filters: Record<string, unknown>
}

// Normalise a raw API workflow into our WorkflowItem shape.
function normalise(raw: RawWorkflowSummary, overrideCategory = ''): WorkflowItem {
  const complexity = (['low', 'medium', 'high'].includes(raw.complexity ?? '')
    ? raw.complexity
    : 'low') as 'low' | 'medium' | 'high'

  return {
    id: raw.id ?? raw.filename,
    filename: raw.filename,
    name: raw.name,
    description: raw.description ?? '',
    category: overrideCategory,
    complexity,
    trigger_type: raw.trigger_type ?? 'Manual',
    node_count: raw.node_count ?? 0,
    integrations: raw.integrations ?? [],
    tags: raw.tags ?? [],
    active: Boolean(raw.active),
    raw_url: buildRawUrl(raw.filename),
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface FetchWorkflowsParams {
  page?: number
  per_page?: number
  /** Maps to API `trigger` param; use 'all' for no filter */
  trigger?: string
  /** Maps to API `complexity` param; use 'all' for no filter */
  complexity?: string
  /** Maps to API `q` param */
  search?: string
  /** If provided, resolved to a category string via AGENT_CATEGORY_MAP */
  agent_slug?: string
  /** Pass a raw category string directly (overrides agent_slug) */
  category?: string
}

/**
 * Fetch a paginated, filtered list of workflows from the Zie619 API.
 * All params optional; defaults to page 1, 12 per page, no filters.
 */
export async function fetchWorkflows(
  params: FetchWorkflowsParams = {},
): Promise<WorkflowsResponse> {
  const {
    page = 1,
    per_page = 12,
    trigger = 'all',
    complexity = 'all',
    search = '',
    agent_slug,
    category: rawCategory,
  } = params

  // Resolve category — direct category > agent_slug mapping > none
  const resolvedCategory =
    rawCategory ??
    (agent_slug ? AGENT_CATEGORY_MAP[agent_slug] ?? '' : '')

  const qs = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
    trigger,
    complexity,
    q: search,
  })

  // The Zie619 API uses /api/workflows/category/<category> for category filtering.
  // For search+complexity+trigger without category, use /api/workflows directly.
  let data: RawSearchResponse

  if (resolvedCategory) {
    // Use the category endpoint (supports page/per_page but not other filters)
    const categoryQs = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
    })
    // If there's also a search/complexity/trigger, append to the category endpoint
    if (search) categoryQs.set('q', search)
    if (trigger !== 'all') categoryQs.set('trigger', trigger)
    if (complexity !== 'all') categoryQs.set('complexity', complexity)

    const encodedCategory = encodeURIComponent(resolvedCategory)
    data = await apiFetch<RawSearchResponse>(
      `/api/workflows/category/${encodedCategory}?${categoryQs}`,
    )
  } else {
    data = await apiFetch<RawSearchResponse>(`/api/workflows?${qs}`)
  }

  const workflows = data.workflows.map(w =>
    normalise(w, resolvedCategory),
  )

  return {
    workflows,
    total: data.total,
    page: data.page,
    per_page: data.per_page,
    total_pages: data.pages, // normalise field name
  }
}

/**
 * Fetch a single workflow by filename (e.g. "0785_Openai_Twitter_Create.json").
 * Returns both the metadata WorkflowItem and the raw JSON.
 */
export async function fetchWorkflowById(
  filename: string,
): Promise<{ metadata: WorkflowItem; raw_json: unknown }> {
  const data = await apiFetch<{ metadata: RawWorkflowSummary; raw_json: unknown }>(
    `/api/workflows/${encodeURIComponent(filename)}`,
  )
  return {
    metadata: normalise(data.metadata),
    raw_json: data.raw_json,
  }
}

/** Returns a flat array of category strings. */
export async function fetchCategories(): Promise<string[]> {
  const data = await apiFetch<{ categories: string[] }>('/api/categories')
  return data.categories
}

/** Returns aggregate stats for the whole workflow library. */
export async function fetchStats(): Promise<WorkflowStats> {
  return apiFetch<WorkflowStats>('/api/stats')
}
