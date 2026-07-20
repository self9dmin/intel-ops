# AI Coding Agent Instructions

## DQL - Dynatrace Query Language

Before writing any DQL query, always use the knowledge base (`dql_search` tool) to search for relevant DQL documentation, syntax, and examples, whenever the tool is available.

## UI Components - Strato

Before using any Strato UI component, always use the knowledge base tools to search for relevant component documentation:
- Use `strato_search` to search by name or keyword.
- Use `strato_get_component` to retrieve detailed documentation, props, and examples.
- Use `strato_get_usecase_details` to get code for specific use cases.

---

## Project Overview

**Mission Control** is a gamified Dynatrace observability training app built on Dynatrace AppEngine. It teaches Dynatrace skills through mission-based challenges, XP tracks, and checkpoint validation.

- **Repo**: `github.com/self9dmin/intel-ops`
- **Deployed at**: `https://meg46195.apps.dynatrace.com`
- **Stack**: dt-app CLI, React, TypeScript, Strato Design System, Document Service

### App Identity
- Facing name: **Mission Control** (set in `app.config.json` — do not change)
- Nav tabs: **Race Control** (default, route `/`) | **Progress**
- Learning Paths → **Circuits**
- Mission difficulty levels: `rookie` | `operator` | `elite` | `legend`

### Document Types
Do not rename or add document types without explicit instruction:
- `intelops-score` — per-mission completion records
- `intelops-user-state` — user profile, XP, completed missions, data mode, tenant capabilities

---

## Hard Rules

1. **Never modify `app.config.json`** — version, scopes, and app ID are managed externally.
2. **No `any` types** — all TypeScript must be properly typed.
3. **No external UI libraries** — Strato only. No MUI, Chakra, Tailwind, etc.
4. **Functional components and hooks only** — no class components.
5. **Always use functional updaters on `setUserState`** — use `setUserState(prev => ({ ...prev, ... }))` to avoid stale closure bugs. Never build a new state object from the `userState` closure directly when calling write functions.
6. **tsc must run from `ui/`** — never from the repo root. Run `cd ui && npx tsc --noEmit` to typecheck.

---

## Architecture

### Route Map
```
/                   → MissionsPage (Race Control tab)
/missions/:id       → MissionPage
/debrief/:id        → DebriefPage
/progress           → ProgressPage
/onboarding         → OnboardingWizard (shown when no userState exists)
```

### Key Files
```
ui/app/
├── App.tsx                          # Router
├── types/
│   ├── mission.types.ts             # Mission interface
│   └── UserState.ts                 # UserState, DataMode, TenantCapabilities, migrateUserState
├── data/
│   ├── missions.ts                  # All 23 missions (MISSIONS array)
│   └── circuits.ts                  # Circuit/learning path definitions
├── context/
│   ├── UserStateContext.tsx         # Exposes userState, setDataMode, saveTenantCapabilities
│   └── LeaderboardContext.tsx
├── hooks/
│   ├── useUserState.ts              # Document Service read/write with optimistic locking
│   ├── useUnlockedMissions.ts
│   └── useFilteredMissions.ts
├── components/
│   ├── MissionCard.tsx              # Card with flex layout, button pinned to bottom
│   ├── PlayerStatusStrip.tsx        # Stats bar (plain div, no Surface)
│   └── AppSidebar.tsx               # Status/difficulty/topic filters
├── pages/
│   └── Mission.tsx                  # War room mission page (immersive 3-panel layout with room-bg.jpg background)
└── tabs/
    └── MissionsTab.tsx              # Main mission grid view

ui/assets/
└── room-bg.jpg                      # Conference room background photo for mission page

ui/types.d.ts                        # JPG module declaration for asset imports
```

> **Note:** Live Mode removed — app is Playground-only pending Phase 3. DataModeToggle and TenantCoveragePanel are no longer active.

### Data Mode (Live vs Playground)
The app supports two modes stored in `userState.dataMode`:
- `'playground'` (default) — missions use static data from `playground.apps.dynatrace.com`
- `'live'` — missions query the user's own tenant via DQL

When `dataMode === 'live'`:
- Playground missions are hidden
- `TenantCoveragePanel` shows capability chips
- Empty state is shown: "Live Mode Active — live missions coming soon"

`DataModeToggle` triggers `useTenantScan` on enable, which runs 7 parallel DQL queries and saves results to `userState.tenantCapabilities`.

### Tenant Scan Queries (`useTenantScan.ts`)
These queries run against the user's own tenant. 403s are expected in local dev (missing OAuth scopes) — do not change the queries to work around this.
```typescript
hasProblems: `fetch events | filter event.type == "DAVIS_PROBLEM" AND davis.status == "OPEN" | limit 1 | fields timestamp`
hasLogs:     `fetch logs | limit 1 | fields timestamp`
hasMetrics:  `timeseries avg(dt.host.cpu.usage), by:{dt.entity.host} | limit 1`
hasTraces:   `fetch spans | limit 1 | fields timestamp`
hasSLOs:     `fetch events | filter event.type == "SERVICE_LEVEL_OBJECTIVE" | limit 1 | fields timestamp`
hasKubernetes: `fetch dt.entity.cloud_application | limit 1 | fields entity.name`
hasBizevents: `fetch bizevents | limit 1 | fields timestamp`
```

**Critical DQL rule**: `fetch metrics` is INVALID DQL and returns a 400 error. Always use `timeseries` for metrics queries.

---

## Strato Design System — Project-Specific Rules

### Layout
- Use **CSS grid** (`display: grid`) for mission card grids — not Strato Grid or Flex
- Use **plain divs** for stat strips and metric displays — Surface has hardcoded 24px inset padding
- Use **Strato Surface** only for cards that need DT card styling
- **Never nest Surface inside Surface**
- **MatrixBackground** component uses `position: absolute; inset: 0; width: 100%; height: 100%` — it fills whatever parent container it sits in. Parent must have `position: relative` and defined dimensions.
- **Do not use `flex: 1` directly on Strato components** — wrap in a plain div instead
- Strato `Flex` does not reliably pass through `flex: 1` to children

### MissionCard Layout
Cards use `display: flex; flex-direction: column`. The description `Text` has `flex: "1 1 auto"` so the button row stays pinned to the bottom regardless of description length.

### Imports — Always Use Subpaths
```typescript
// Correct
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { DataTable, DataTableColumnDef } from "@dynatrace/strato-components-preview/tables";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { Switch } from "@dynatrace/strato-components-preview/forms";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";

// Wrong — never import from package root
import { Flex, Heading } from "@dynatrace/strato-components";
```

### TypeScript Gotchas
- `DataTableColumnDef` requires generic: `DataTableColumnDef<YourType>[]`
- `useParams` requires generic: `useParams<{ id: string }>()`
- Always check `.d.ts` files in `node_modules/@dynatrace/strato-components[-preview]/` for component APIs

---

## Document Service — Optimistic Locking Pattern

User state is stored as a single document per user. Always use the optimistic locking pattern — never delete and recreate.
```typescript
// Writing user state — always use functional updater
setUserState(prev => ({ ...prev, newField: value }));

// The write hook retries on 409 conflict
// Track version locally; UpdateDocumentMetadata does not expose version directly
```

Key rules:
- Content field requires `new Blob([JSON.stringify(data)], { type: "application/json" })`
- Use `updateDocument()` with retry-on-conflict, not delete+recreate
- `document:documents:delete` scope is required in `app.config.json` for delete operations (already configured)

---

## DQL Reference

### Valid Data Sources
| Query | Table |
|---|---|
| `fetch events` | Davis events, problems, SLOs |
| `fetch logs` | Log records |
| `fetch spans` | Distributed traces |
| `fetch bizevents` | Business events |
| `fetch dt.entity.*` | Entity records |
| `timeseries` | Metrics (NOT `fetch metrics`) |

### Problems API (v2) — if used via REST
- `nextPageKey` must be used alone — do not combine with `problemSelector` or `pageSize` (returns 400)

### Entities API — if used via REST
- `fields` does not accept `displayName` (returns 400)
- Valid `fields` values: `properties`, `tags`, `managementZones`, `fromRelationships`, `toRelationships`, `firstSeenTms`, `lastSeenTms`, `icon`
- Entity name is returned by default

---

## Development Workflow

### Critical Rule
**NEVER merge locally then push master.** Always push the feat/ branch and open a PR on GitHub: `git push origin feat/x` → PR → merge on GitHub → Action auto-deploys. Merging locally and pushing master bypasses the PR and goes straight to prod.

### Branch Strategy
```
master                    # Auto-deploys on push via GitHub Actions
└── feat/your-feature     # Feature branches — PR to master
    └── claude/xxx        # Claude Code pushes here — merge into feat/ branch
```

### After Claude Code Session
```bash
git fetch origin
git merge origin/claude/<branch-name>   # merge Claude's branch into feat/
cd ui && npx tsc --noEmit               # always typecheck from ui/, not repo root
npx dt-app dev                          # test locally
git push origin feat/your-feature
# Open PR on GitHub → typecheck runs → merge → auto-deploy
```

### CI/CD
- GitHub Actions auto-deploys on master push (bumps patch version, commits with `[skip ci]`, then deploys)
- Typecheck runs on PRs from `ui/` directory
- OAuth secrets: `DT_APP_OAUTH_CLIENT_ID`, `DT_APP_OAUTH_CLIENT_SECRET`

### Local Dev Notes
- `getCurrentUserDetails()` returns `dt.missing.user.id` / `dt.missing.user.name` locally — resolves correctly on tenant
- All Grail table queries (logs, events, metrics, etc.) return 403 locally — expected, not a bug
- Document Service works on localhost against real tenant data

---

## Environments

| Environment | URL | Purpose |
|---|---|---|
| Trial tenant | `https://meg46195.apps.dynatrace.com` | Deployment target, user data |
| Playground tenant | `https://playground.apps.dynatrace.com` | Playground mission data (public, no login) |

Playground tenant contains: 11 open problems, 16 hosts, EKS cluster `aws-eks-3`, AKS cluster `aks-playground`, apps: easytrade, hipstershop, astroshop, unguard.

Cross-tenant queries from UI code are not supported — outbound JS runtime calls are sandboxed.
