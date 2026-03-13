-- ============================================================
-- Orchestrai — Full Supabase Schema
-- Paste entirely in SQL Editor and run once.
-- Safe to re-run: uses IF NOT EXISTS + DROP IF EXISTS everywhere.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table profiles enable row level security;
drop policy if exists "profiles_read_own"   on profiles;
drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_read_own"   on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. WORKSPACES
-- ============================================================
create table if not exists workspaces (
  id         uuid primary key default uuid_generate_v4(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  slug       text unique not null,
  created_at timestamptz default now()
);
alter table workspaces enable row level security;
drop policy if exists "owner_all"            on workspaces;
drop policy if exists "workspaces_owner_all" on workspaces;
create policy "workspaces_owner_all" on workspaces for all using (auth.uid() = owner_id);

create or replace function public.handle_new_workspace()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.workspaces (owner_id, name, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'My Workspace'),
    new.id::text
  )
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_workspace on auth.users;
create trigger on_auth_user_created_workspace
  after insert on auth.users
  for each row execute procedure public.handle_new_workspace();

-- ============================================================
-- 3. CONVERSATIONS
-- ============================================================
create table if not exists conversations (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title        text not null default 'New Chat',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table conversations enable row level security;
drop policy if exists "conversations_owner_all" on conversations;
create policy "conversations_owner_all" on conversations for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index if not exists conversations_workspace_idx on conversations(workspace_id);
create index if not exists conversations_updated_idx   on conversations(updated_at desc);

-- ============================================================
-- 4. MESSAGES
-- ============================================================
create table if not exists messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'system')),
  content         text not null,
  created_at      timestamptz default now()
);
alter table messages enable row level security;
drop policy if exists "messages_owner_all" on messages;
create policy "messages_owner_all" on messages for all using (
  conversation_id in (
    select c.id from conversations c
    join workspaces w on w.id = c.workspace_id
    where w.owner_id = auth.uid()
  )
);
create index if not exists messages_conversation_idx on messages(conversation_id);
create index if not exists messages_created_idx      on messages(created_at);

-- ============================================================
-- 5. USER STACK
-- ============================================================
create table if not exists user_stack (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  added_at     timestamptz default now(),
  unique(workspace_id, agent_slug)
);
alter table user_stack enable row level security;
drop policy if exists "workspace_all"       on user_stack;
drop policy if exists "user_stack_owner_all" on user_stack;
create policy "user_stack_owner_all" on user_stack for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);

-- ============================================================
-- 6. TASKS
-- ============================================================
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
drop policy if exists "workspace_all"   on tasks;
drop policy if exists "tasks_owner_all" on tasks;
create policy "tasks_owner_all" on tasks for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index if not exists tasks_workspace_idx on tasks(workspace_id);
create index if not exists tasks_status_idx    on tasks(status);
create index if not exists tasks_agent_idx     on tasks(agent_slug);

-- ============================================================
-- 7. REVIEWS
-- ============================================================
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
drop policy if exists "reviews_read_all"  on reviews;
drop policy if exists "reviews_write_own" on reviews;
create policy "reviews_read_all"  on reviews for select using (true);
create policy "reviews_write_own" on reviews for insert with check (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index if not exists reviews_agent_idx on reviews(agent_slug);

-- ============================================================
-- 8. ACTIVITY LOG
-- ============================================================
create table if not exists activity_log (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  action       text not null,
  metadata     jsonb,
  created_at   timestamptz default now()
);
alter table activity_log enable row level security;
drop policy if exists "activity_read"   on activity_log;
drop policy if exists "activity_insert" on activity_log;
create policy "activity_read" on activity_log for select using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create policy "activity_insert" on activity_log for insert with check (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index if not exists activity_workspace_idx  on activity_log(workspace_id);
create index if not exists activity_created_at_idx on activity_log(created_at desc);

-- ============================================================
-- 9. USER WORKFLOWS
-- ============================================================
create table if not exists user_workflows (
  id           uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  agent_slug   text not null,
  workflow_id  text not null,
  imported_at  timestamptz default now(),
  unique(workspace_id, workflow_id)
);
alter table user_workflows enable row level security;
drop policy if exists "user_workflows_all"       on user_workflows;
drop policy if exists "user_workflows_owner_all" on user_workflows;
create policy "user_workflows_owner_all" on user_workflows for all using (
  workspace_id in (select id from workspaces where owner_id = auth.uid())
);
create index if not exists user_workflows_workspace_idx on user_workflows(workspace_id);
create index if not exists user_workflows_agent_idx     on user_workflows(agent_slug);
