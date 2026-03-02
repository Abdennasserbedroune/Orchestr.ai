# Frontend Contract

This document defines everything the frontend must respect to stay compatible
with the backend. Do not change any of these without updating the backend.

---

## 1. Route Structure

| URL | Route group | Has sidebar? |
|---|---|---|
| `/` | root | No (redirects to /command) |
| `/command` | `(app)` | Yes |
| `/stack` | `(app)` | Yes |
| `/stack/[slug]` | `(app)` | Yes |
| `/operations` | `(app)` | Yes |
| `/brief` | `(app)` | Yes |
| `/login` | `(public)` | No |
| `/register` | `(public)` | No |

**Rule:** Never add sidebar logic to `app/layout.tsx`. Sidebar lives only in `app/(app)/layout.tsx`.

---

## 2. Imports

| What you need | Import from |
|---|---|
| Agent catalog | `@/lib/agents-data` → `AGENTS_CATALOG` |
| Domain colors/icons | `@/lib/mock-data` → `DOMAIN_META` |
| Mock agents | `@/lib/mock-data` → `MOCK_AGENTS` |
| Mock tasks | `@/lib/mock-data` → `MOCK_TASKS` |
| Mock activity | `@/lib/mock-data` → `MOCK_ACTIVITY` |
| Mock typewriter | `@/lib/mock-data` → `MOCK_TYPEWRITER_RESPONSES` |
| Domain type | `@/lib/mock-data` → `type Domain` |
| Task status type | `@/lib/mock-data` → `type TaskStatus` |
| Supabase client | `@/lib/supabase` → `supabase` |
| DB types | `@/lib/supabase` → `Task`, `Review`, `Workspace` etc. |

---

## 3. Design Tokens (Tailwind classes)

### Backgrounds
```
bg-bg        → #0A0A0F  (page background)
bg-surface   → #111118  (cards, sidebar)
bg-panel     → #16161F  (inner sections, hover states)
border-border → #1E1E2A
```

### Text
```
text-foreground  → #F0F0F5  (primary text)
text-muted       → #8B8B9E  (secondary text, labels)
text-subtle      → #4A4A5E  (placeholders, timestamps)
```

### Brand
```
bg-brand          → #6366F1  (primary CTA)
bg-brand-hover    → #5254CC
bg-brand-muted    → rgba(99,102,241,0.12)  (active nav bg)
text-brand        → #6366F1
```

### Status
```
text-status-active  / bg-status-active   → #22C55E
text-status-running / bg-status-running  → #F59E0B
text-status-idle    / bg-status-idle     → #6B7280
text-status-error   / bg-status-error    → #EF4444
```

### Domain colors (always use DOMAIN_META, never hardcode)
```typescript
import { DOMAIN_META } from '@/lib/mock-data'
const meta = DOMAIN_META[agent.domain]
// meta.color → use as inline style for text/icon color
// meta.bg    → use as inline style for icon container background
// meta.icon  → LucideIcon component
// meta.label → display string
```

---

## 4. Component Classes (from globals.css)

```
.card          → bg-surface border border-border rounded-lg
.card-hover    → card + hover effects
.btn-primary   → indigo filled button
.btn-ghost     → transparent button
.btn-outline   → bordered button
.chip          → small tag/badge
.input         → styled text input
.status-dot    → colored dot (add class: active / running / idle / error)
.section-label → uppercase tracking label
```

---

## 5. Fonts

| Variable | Font | Use for |
|---|---|---|
| `--font-sans` / `font-sans` | DM Sans | Body text, UI labels |
| `--font-display` / `font-display` | Plus Jakarta Sans | Headings, titles |
| `--font-mono` / `font-mono` | JetBrains Mono | Code, output blocks |

---

## 6. Agent Slugs (FK used in DB)

| Agent | Slug |
|---|---|
| Quill  | `quill`  |
| Nexus  | `nexus`  |
| Atlas  | `atlas`  |
| Scout  | `scout`  |
| Ledger | `ledger` |
| Pulse  | `pulse`  |
| Forge  | `forge`  |

These slugs are used as foreign keys in `user_stack`, `tasks`, and `reviews` tables.
**Never rename a slug without a DB migration.**

---

## 7. API Endpoints

| Method | Endpoint | Body / Params |
|---|---|---|
| GET | `/api/agents` | `?domain=` `?search=` |
| GET | `/api/agents/:slug` | — |
| GET | `/api/stack` | `?workspace_id=` |
| POST | `/api/stack` | `{ workspace_id, agent_slug }` |
| DELETE | `/api/stack` | `{ workspace_id, agent_slug }` |
| GET | `/api/tasks` | `?workspace_id=` `?status=` `?agent_slug=` |
| POST | `/api/tasks` | `{ workspace_id, agent_slug, title, input? }` |
| PATCH | `/api/tasks` | `{ id, status, output? }` |
| GET | `/api/reviews` | `?agent_slug=` |
| POST | `/api/reviews` | `{ workspace_id, agent_slug, author_name, company?, rating, body }` |
| GET | `/api/activity` | `?workspace_id=` `?limit=` |
| POST | `/api/activity` | `{ workspace_id, agent_slug, action, metadata? }` |
| POST | `/api/brief` | `{ messages: [{role, content}] }` → streaming text |

---

## 8. Task Status Values

Only these 4 values are valid (enforced by DB check constraint):
```
'backlog' | 'in-progress' | 'complete' | 'error'
```

---

## 9. What NOT to do

- Do NOT add agents to Supabase — read from `AGENTS_CATALOG` only
- Do NOT put sidebar in `app/layout.tsx`
- Do NOT hardcode domain colors — always use `DOMAIN_META[domain].color`
- Do NOT change agent slugs without a DB migration
- Do NOT add new pages outside the `(app)` or `(public)` route groups
