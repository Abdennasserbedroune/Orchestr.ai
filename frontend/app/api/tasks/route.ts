import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/tasks?workspace_id=xxx  &status=in-progress  &agent_slug=atlas
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const workspace_id = searchParams.get('workspace_id')
  const status      = searchParams.get('status')
  const agent_slug  = searchParams.get('agent_slug')
  if (!workspace_id)
    return NextResponse.json({ error: 'workspace_id required' }, { status: 400 })

  let query = supabase.from('tasks').select('*')
    .eq('workspace_id', workspace_id)
    .order('created_at', { ascending: false })
  if (status)     query = query.eq('status', status)
  if (agent_slug) query = query.eq('agent_slug', agent_slug)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tasks: data ?? [] })
}

// POST /api/tasks   body: { workspace_id, agent_slug, title, input? }
export async function POST(req: NextRequest) {
  const { workspace_id, agent_slug, title, input } = await req.json()
  if (!workspace_id || !agent_slug || !title)
    return NextResponse.json({ error: 'workspace_id, agent_slug, title required' }, { status: 400 })

  const { data, error } = await supabase.from('tasks')
    .insert({ workspace_id, agent_slug, title, input: input ?? null, status: 'in-progress' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data }, { status: 201 })
}

// PATCH /api/tasks   body: { id, status, output? }
export async function PATCH(req: NextRequest) {
  const { id, status, output } = await req.json()
  if (!id || !status)
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })

  const { data, error } = await supabase.from('tasks')
    .update({
      status,
      output: output ?? null,
      completed_at: status === 'complete' ? new Date().toISOString() : null,
    })
    .eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}
