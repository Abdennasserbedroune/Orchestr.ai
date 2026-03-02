-- ============================================================
-- Orchestrai — Supabase Schema
--
-- IMPORTANT: Agents are NOT stored here.
-- They live in frontend/lib/agents-data.ts
-- The DB only stores user runtime data.
-- ============================================================

create extension if not exists "uuid-ossp";

-- WORKSPACES
create table if not exists workspaces (
  id         uuid primary key default uuid_generate_v4(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  slug       text unique not null,
  created_at timestamptz default now()
);
alter table workspaces enable row level security;
create policy "owner_all" on workspaces for all using (auth.uid() = owner_id);

-- USER STACK
-- Tracks which agent slugs (from catalog) the user added to their stack
create table if not exists user_stack (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  added_at     timestamptz default now(),
  unique(workspace_id, agent_slug)
);
alter table user_stack enable row level security;
create policy "workspace_all" on user_stack for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);

-- TASKS
create table if not exists tasks (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  title        text not null,
  status       text not null default 'backlog'
               check (status in ('backlog','in-progress','complete','error')),
  input        text,
  output       text,
  created_at   timestamptz default now(),
  completed_at timestamptz
);
alter table tasks enable row level security;
create policy "workspace_all" on tasks for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index tasks_workspace_idx on tasks(workspace_id);
create index tasks_status_idx    on tasks(status);
create index tasks_agent_idx     on tasks(agent_slug);

-- REVIEWS
create table if not exists reviews (
  id           uuid primary key default uuid_generate_v4(),
  agent_slug   text not null,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  author_name  text not null,
  company      text,
  rating       integer not null check (rating between 1 and 5),
  body         text not null,
  created_at   timestamptz default now(),
  unique(workspace_id, agent_slug)
);
alter table reviews enable row level security;
create policy "reviews_read_all"  on reviews for select using (true);
create policy "reviews_write_own" on reviews for insert with check (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index reviews_agent_idx on reviews(agent_slug);

-- ACTIVITY LOG (append-only)
create table if not exists activity_log (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  action       text not null,
  metadata     jsonb,
  created_at   timestamptz default now()
);
alter table activity_log enable row level security;
create policy "activity_read" on activity_log for select using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create policy "activity_insert" on activity_log for insert with check (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index activity_workspace_idx  on activity_log(workspace_id);
create index activity_created_at_idx on activity_log(created_at desc);

-- USER WORKFLOWS
-- Tracks which n8n workflows a workspace has imported.
-- workflow_id references N8N_WORKFLOWS_INDEX ids (static, not DB rows).
create table if not exists user_workflows (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  workflow_id  text not null,   -- e.g. 'quill-001' from n8n-workflows-index.ts
  imported_at  timestamptz default now(),
  unique(workspace_id, workflow_id)
);
alter table user_workflows enable row level security;
create policy "user_workflows_all" on user_workflows for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index user_workflows_workspace_idx on user_workflows(workspace_id);
create index user_workflows_agent_idx     on user_workflows(agent_slug);
