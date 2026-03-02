import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── DB Types (mirror schema.sql) ─────────────────────────────

export interface Workspace {
  id: string
  owner_id: string
  name: string
  slug: string
  created_at: string
}

export interface UserStackEntry {
  id: string
  workspace_id: string
  agent_slug: string
  added_at: string
}

export interface Task {
  id: string
  workspace_id: string
  agent_slug: string
  title: string
  status: 'backlog' | 'in-progress' | 'complete' | 'error'
  input?: string
  output?: string
  created_at: string
  completed_at?: string
}

export interface Review {
  id: string
  agent_slug: string
  workspace_id: string
  author_name: string
  company?: string
  rating: number
  body: string
  created_at: string
}

export interface ActivityLog {
  id: string
  workspace_id: string
  agent_slug: string
  action: string
  metadata?: Record<string, unknown>
  created_at: string
}
