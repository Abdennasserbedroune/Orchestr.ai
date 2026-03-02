# Supabase Setup

## Tables

| Table | Purpose |
|---|---|
| `workspaces` | One per user account |
| `user_stack` | Agent slugs the user added (slug = FK to catalog) |
| `tasks` | Every task run through any agent |
| `reviews` | User reviews per agent slug |
| `activity_log` | Append-only feed of agent actions |

**Agents are NOT in the DB.** Source of truth = `frontend/lib/agents-data.ts`

## RLS Rules

- All tables: users only see data from their own workspace
- `reviews`: publicly readable (anyone can see ratings)

## Apply

1. Supabase dashboard → SQL Editor → paste `schema.sql` → Run
