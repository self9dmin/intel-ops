# Mission Control

**Gamified Dynatrace observability training. Built on Dynatrace AppEngine.**

> Train Here. Perform Everywhere.

---

## What Is This

Mission Control is a scenario-based training app that runs inside Dynatrace. Instead of reading documentation, you complete missions on the real Playground — navigating the actual UI, querying Grail, investigating real problems — then earn XP, clear checkpoints, and land on a leaderboard.

The idea is simple: **you learn Dynatrace by doing Dynatrace**. Every mission puts you in the real platform, doing real work, against a clock.

**The core loop:**

```
Mission Briefing → Real Dynatrace Action → Checkpoint Validation → Score + XP → Leaderboard
```

---

## How the Game Works

### Missions

Each mission is a scenario — a problem that needs solving in Dynatrace. You get a briefing, a timer, and a set of checkpoints. Checkpoints are either multiple-choice (find the answer in the UI) or action-based (do the thing, confirm you did it).

- **Hints** are available but cost you points
- **Time bonus** rewards speed — faster completions score higher
- Wrong answers on multiple-choice deduct points

### Difficulty Tiers

| Tier | Who it's for |
|---|---|
| **Rookie** | New to Dynatrace — learn navigation, concepts, and core apps |
| **Operator** | Comfortable with the basics — investigate real problems under pressure |
| **Elite** | No hints, tight timers, complex scenarios |
| **Legend** | Reserved for missions that require mastery across multiple domains |

### XP and Progression

Completing missions awards XP across two axes:

- **Discipline tracks** — SRE, Developer, Incident Commander, Platform Engineer
- **Topic tracks** — Kubernetes, Logs, Traces, DQL, SLOs, and more

Each track has 5 levels: Recruit → Analyst → Specialist → Expert → Elite.

### Circuits

Circuits are curated mission sequences — like a racing season. Each circuit has an F1 track assigned to it (Monaco for Terrain Recon, Monza for Root Cause Run, etc.) and a tier that reflects the experience level required.

| Tier | What it means |
|---|---|
| **Pre-Season Testing** | Orientation — learn the platform, navigation, and core concepts |
| **Qualifying** | Mixed difficulty — start applying skills under real conditions |
| **Race Day** | Expert-level — no hand-holding, full investigation sequences |

Circuits are your guided path through the content. You can also filter the full mission board by circuit to see what's in each one.

### Achievements

F1-themed badges you earn by hitting milestones:

| Badge | How to earn |
|---|---|
| 🚦 Lights Out | Complete your first mission |
| 🔋 In the Window | 3-day activity streak |
| ⚡ Boost Mode | 7-day activity streak |
| 🏆 In the Points | Complete 3 missions |
| ⏱️ Graduated to Q2 | Complete all Rookie missions |
| 🏁 Race Winner | Complete 5 missions |
| 🎯 Understeer-Proof | Reach Analyst level in 3+ disciplines |
| 💥 Grand Slam | Complete every mission in a circuit |
| 🚀 Overtake Mode | Break into the top 10 on the leaderboard |

---

## Mission Design Philosophy

### Standard User Perspective

Missions are designed for a **standard Dynatrace user** — not an admin. Nothing requires elevated permissions. Everything can be validated in the Dynatrace Playground, which any user can access at `playground.apps.dynatrace.com`.

### Playground-First, Docs-Second

The Dynatrace Playground is a shared, public sandbox with real applications running on Kubernetes (EKS and AKS), generating real telemetry, real problems, and real traces. It's the perfect teaching environment because the data is consistent and the apps are always running.

However, some concepts — OneAgent deployment, host groups, alerting profile configuration — can only be *read* in the Playground, not practiced. For these, missions use a two-mode pattern:

- **Playground checkpoints** — find this, read this, understand what it means inside a real environment
- **Docs/Community links** — when you're in your own tenant, here's the documentation for actually doing it

This is intentional. Mission Control teaches you to *navigate and recognize* so that when you're in your own environment under pressure, you already know where to look.

### Mission Structure

Every mission has:
- A **codename** (legacy field, being phased out in favor of circuit context)
- A **role** — the job function the scenario puts you in
- A **briefing** — the scenario setup, written like an ops situation, not a tutorial
- **Checkpoints** — ordered tasks, each with an instruction, a hint (costs points), and a correct answer
- **XP grants** — per discipline and topic track, based on what the mission actually covers

---

## Mission Inventory

### Pre-Season Testing — Orientation

| Mission | Difficulty | What You Learn |
|---|---|---|
| Orient the Platform | Rookie | Apps menu, Infrastructure & Operations, Discovery & Coverage, Settings |
| Ask the AI | Rookie | Davis CoPilot — finding it, asking questions, getting data inline |
| Find Your Answers | Rookie | Community, Dynatrace University, documentation, support |
| Read the Dashboard | Rookie | Ready-made dashboards, timeframes, tile types |

### Qualifying — First Skills

| Mission | Difficulty | What You Learn |
|---|---|---|
| Find the Log | Rookie | Logs app, filtering by level, reading log entries |
| What Are You | Rookie | Entity types — Host, Process Group, Custom Device |
| Iron Floor | Rookie | Host metrics, disk space, infrastructure problems |
| Find the Failing SLO | Rookie | SLOs app, targets, warning thresholds |
| Identify the Signal | Rookie | Problems app, alert types, affected entities |
| Investigate the Database Failure | Rookie | Problems, database entities, entity IDs |
| 3AM Database Spike | Rookie | Root cause investigation, metrics, problems |
| Silent Rollout | Operator | Deployment events, metric impact, service health |
| Map the Kubernetes Cluster | Operator | Kubernetes app, cluster structure, namespaces |
| K8s Meltdown | Operator | Crash loops, pod failure, remediation path |
| Find the Failing SLO | Rookie | SLOs across multiple services |

### Race Day — Full Investigation

| Mission | Difficulty | What You Learn |
|---|---|---|
| Ghost in the Trace | Operator | Distributed tracing, DQL, service dependencies |
| Follow the Wire | Operator | Trace analysis, span filtering, root cause |
| Stone Wall | Operator | Infrastructure investigation, DQL queries |
| Follow the Error | Operator | RUM, Error Inspector, frontend-to-backend trace |
| Map the Topology | Rookie | Services app, dependency mapping |
| Extract the Host Evidence | Operator | Infrastructure deep-dive, DQL, host properties |
| Trigger the Workflow | Operator | Workflows app, trigger types, automation |
| Find the Business Event | Rookie | Bizevents, DQL, event schema |
| Three Services Down | Elite | Cascade failure, blast radius, incident command |
| Silent Disk Drain | Rookie | Slow-burn infrastructure degradation |

---

## Roadmap

### ✅ Shipped

- Mission board with circuit filtering and split-panel circuit view
- F1 track SVG artwork per circuit with country flags
- Mission flow — timer, checkpoints, scoring, hints, time bonus
- XP progression across 4 discipline tracks and 18 topic tracks
- Leaderboard with per-mission and per-difficulty filtering
- Achievements system — 9 F1-themed badges
- Onboarding wizard — role selection, starting circuit assignment
- Progress tab — skill tracks, history, achievements
- Playground-only mode (Live Mode removed pending Phase 3)
- Mission page war room redesign — immersive full-viewport layout with conference room background, three-panel screen wall, F1 operator POV

### 🔄 In Progress

- Mission quality audit — scoring existing missions against 2025-2026 DT use cases
- New missions: OpenTelemetry basics, Dynatrace Assist/Intelligence, Cost optimization with DQL

### 🔒 Planned

**Phase 2 — Content depth**
- DTU course links per mission — static links to relevant university content
- Post-mission "learn more" CTA
- Mission re-validation against latest Playground data
- OpenTelemetry mission track — instrument an app, ingest OTel data, query spans
- Dynatrace Assist mission — use AI to investigate a problem end-to-end

## Maintainer Documentation

- [Mission Control system design](docs/mission-control-system-design.md) - canonical mission qualification, scoring, XP, circuits, and leaderboard rules
- [Mission Control backlog](docs/mission-control-backlog.md) - tracked content and authoring work
- [Track Walk discovery curriculum](docs/track-walk-discovery-curriculum-2026.md) - CSM discovery and source-finding curriculum
- [Track Walk screenshot catalog](docs/track-walk-screenshot-catalog-2026.md) - dated audit evidence and learner tests

The current OpenTelemetry Grand Prix is an evidence-backed prototype. Its trace path has been validated against Playground data; Collector, log-correlation, and metrics missions remain explicitly marked for fixture-level validation before they are treated as production content.
- Cost optimization mission — use DQL to identify expensive queries and unused resources
- AI Observability mission — observe LLM/agent workloads with the AI Observability app

**Phase 3 — Live validation**
- DQL checkpoint validation against synthetic Grail bizevents (`intel-ops.training.*` event prefix)
- Live Mode re-introduction — missions that query the user's own tenant
- Tenant scan on mission start — surface which signals are available

**Phase 4 — Scale**
- Global leaderboard via external backend (Cloudflare Worker + D1) — removes Document Service scaling limits
- Cross-tenant support for Dynatrace partners and MSPs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Dynatrace AppEngine |
| Frontend | React 18 + TypeScript |
| UI | Strato Design System (`@dynatrace/strato-components`) |
| Persistence | Document Service (Grail-backed key-value) |
| Tooling | Dynatrace App Toolkit (`dt-app`) |
| CI/CD | GitHub Actions — typecheck on PRs, auto-deploy on master merge |

---

## Getting Started

### Prerequisites

- Node.js v22
- Access to a Dynatrace SaaS tenant with AppEngine enabled
- Ports 3000–3005 available locally

### Install & Run

```bash
npm install
npx dt-app dev
```

The dev server opens a browser window authenticated against your configured tenant. The app runs at `http://localhost:3000/ui`.

> `getCurrentUserDetails()` returns placeholder values on localhost — resolves correctly on tenant. Document Service works on localhost against real tenant data.

### Configuration

`app.config.json` controls the environment URL, app ID, and permission scopes. **Do not edit this file manually** — version bumps and deployments are handled by the CI/CD pipeline.

### Deploy

Merging to `master` automatically bumps the patch version and deploys to the configured tenant via GitHub Actions.

```bash
# Manual deploy if needed — bump version in app.config.json first
npx dt-app deploy
```

---

## Project Structure

```
intel-ops/
├── ui/
│   └── app/
│       ├── components/       # Shared UI components (MissionCard, CircuitPanel, PlayerStatusStrip...)
│       ├── context/          # React context — UserState, Leaderboard
│       ├── data/             # Static data — missions, circuits, badges
│       ├── hooks/            # Custom hooks — filters, unlocks, XP, recommendations
│       ├── pages/            # Route-level pages — Mission, Debrief, OnboardingWizard
│       ├── tabs/             # Tab-level views — MissionsTab, ProgressTab, LeaderboardTab
│       ├── types/            # TypeScript interfaces — Mission, UserState, ScoreRecord
│       └── App.tsx           # Root component and routing
├── ui/assets/
│   ├── circuits/             # F1 track SVGs (local, sourced from julesr0y/f1-circuits-svg, MIT)
│   └── flags/                # Country flag PNGs (local, sourced from flagcdn.com)
├── app.config.json           # App manifest — DO NOT edit manually
└── README.md
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add missions, run locally, and submit PRs.

Key rules:
- Never modify `app.config.json` directly
- Run `cd ui && npx tsc --noEmit` before every PR — typecheck must pass
- No external UI libraries — Strato only
- No `any` types

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built by Dan Quintero.  
Deployed at `https://nom24698.apps.dynatrace.com`
