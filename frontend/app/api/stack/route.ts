import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AGENTS_CATALOG } from '@/lib/agents-data'

// GET /api/stack?workspace_id=xxx
export async function GET(req: NextRequest) {
  const workspace_id = new URL(req.url).searchParams.get('workspace_id')
  if (!workspace_id)
    return NextResponse.json({ error: 'workspace_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('user_stack').select('*')
    .eq('workspace_id', workspace_id)
    .order('added_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const stack = (data ?? [])
    .map(e => ({ ...e, agent: AGENTS_CATALOG.find(a => a.slug === e.agent_slug) ?? null }))
    .filter(e => e.agent !== null)

  return NextResponse.json({ stack })
}

// POST /api/stack   body: { workspace_id, agent_slug }
export async function POST(req: NextRequest) {
  const { workspace_id, agent_slug } = await req.json()
  if (!workspace_id || !agent_slug)
    return NextResponse.json({ error: 'workspace_id and agent_slug required' }, { status: 400 })
  if (!AGENTS_CATALOG.some(a => a.slug === agent_slug))
    return NextResponse.json({ error: 'Agent not in catalog' }, { status: 404 })

  const { data, error } = await supabase
    .from('user_stack').upsert({ workspace_id, agent_slug }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}

// DELETE /api/stack   body: { workspace_id, agent_slug }
export async function DELETE(req: NextRequest) {
  const { workspace_id, agent_slug } = await req.json()
  if (!workspace_id || !agent_slug)
    return NextResponse.json({ error: 'workspace_id and agent_slug required' }, { status: 400 })

  const { error } = await supabase.from('user_stack')
    .delete().eq('workspace_id', workspace_id).eq('agent_slug', agent_slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
