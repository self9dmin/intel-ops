# Intel Ops — CLAUDE.md

## What This Is
Intel Ops is a gamified, scenario-based observability training app built on the Dynatrace AppEngine platform. It runs inside the Dynatrace UI as a native Dynatrace App (React + TypeScript).

The core loop:
> Scenario presented → User takes real action in Dynatrace → App validates the action via Grail/API → Score recorded → Leaderboard updated

This is NOT a tutorial overlay or clickthrough guide. Users learn by doing real things in the real Dynatrace platform. The competitive leaderboard is the retention mechanic.

## Tech Stack
- Runtime: Dynatrace AppEngine
- Frontend: React + TypeScript
- UI Components: Strato Design System (@dynatrace/strato-components) — use this for ALL UI elements, no custom CSS frameworks
- Data: Grail via DQL queries, DT SDK (@dynatrace-sdk/*)
- Backend: App Functions (TypeScript, DT JS runtime — not Node.js)
- Storage: Document Service for user progress and scores

## Project Structure
```
intel-ops/
├── ui/
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level page components
│   │   └── App.tsx        # Root component and routing
│   ├── assets/            # Static assets
│   └── main.tsx           # Entry point — do not modify
├── app.config.json        # App manifest — scopes, ID, env URL
└── CLAUDE.md              # This file
```

## Code Conventions
- All components in TypeScript (.tsx), strictly typed
- Use Strato components exclusively for UI — never raw HTML div soup or Tailwind
- Import from @dynatrace/strato-components subpackages (e.g. /layouts, /typography, /core)
- Use @dynatrace-sdk/* for all DT platform data access
- No external UI libraries (no MUI, no Chakra, no Tailwind)
- Functional components only, hooks-based state
- Keep pages thin — logic goes in hooks or utility files

## Game Architecture

### Core Concepts
- **Scenario**: A simulated incident or observability challenge with a narrative, role, difficulty, and ordered checkpoints
- **Checkpoint**: A discrete step the user must complete in DT. Validated by querying Grail or DT APIs
- **Score**: Calculated from completion, time taken, precision, and DT Intelligence usage
- **Leaderboard**: Stored in Document Service, scoped per scenario and role

### Roles
- Incident Commander
- SRE / Reliability Engineer
- Security Analyst
- Developer
- Platform Engineer
- Digital Experience Manager

### Difficulty Tiers
- Rookie (guided, hints on)
- Operator (minimal hints)
- Elite (no hints, time pressure)
- Legend (multi-problem, no assistance)

### Scoring Model
- Base: 1000pts for full completion
- Time Bonus: up to +500pts
- Precision Bonus: up to +300pts (no wrong paths)
- DT Intelligence Usage: +100pts
- DQL Query Written: +150pts
- Streak Multiplier: 1.1x–2x

## Phase 1 Scope (Build This First)
One complete game loop:
- Single scenario: "3am Database Spike" (War Room)
- Role: Incident Commander
- Difficulty: Rookie
- 6 checkpoints validated via Grail DQL
- Score calculated and stored in Document Service
- Per-tenant leaderboard displayed on completion

Do not build beyond Phase 1 until the full loop is proven end-to-end.

## What NOT to Do
- Do not use localStorage or sessionStorage
- Do not install external UI component libraries
- Do not use Node.js-specific APIs in App Functions (DT JS runtime only)
- Do not hardcode tenant URLs — use the SDK's environment context
- Do not skip TypeScript types — no `any`
- Do not build Phase 2 features until Phase 1 loop is complete and validated
```

---

Now here's the prompt to paste into Claude Code to kick it off:

---
```
Please read CLAUDE.md in the project root first. Then read the current contents of:
- app.config.json
- ui/app/App.tsx
- ui/app/pages/Home.tsx
- ui/app/components/Card.tsx

Once you've read all four files, confirm you understand the Intel Ops concept and the Phase 1 scope. Do not write any code yet. Just summarize what we're building and what the current scaffold gives us to work with. Wait for further instructions before making any changes.