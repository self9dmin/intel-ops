# Contributing to Mission Control

Thanks for your interest in contributing. This guide covers local setup, how to add missions, and the PR process.

---

## Prerequisites

- Node.js 22
- A Dynatrace SaaS tenant with AppEngine enabled
- Ports 3000–3005 available locally

---

## Local Setup

```bash
git clone https://github.com/self9dmin/intel-ops.git
cd intel-ops
npm install
npx dt-app dev
```

The dev server opens a browser window authenticated against your configured tenant. The app runs at `http://localhost:3000/ui`.

> `getCurrentUserDetails()` returns placeholder values on localhost — this is expected. Document Service works against real tenant data.

---

## Branch Strategy

```
master                    # Auto-deploys on push — always deployable
└── feat/your-feature     # Feature branches — PR to master
```

Always branch from `master`. Never push directly to `master`.

```bash
git checkout master
git pull origin master
git checkout -b feat/your-feature-name
git push -u origin feat/your-feature-name
```

---

## Making Changes

1. Make your changes on your `feat/` branch
2. Run `cd ui && npx tsc --noEmit` — typecheck must pass before opening a PR
3. Test locally with `npx dt-app dev`
4. Commit and push to your branch
5. Open a PR targeting `master`

The typecheck GitHub Action runs automatically on every PR. The PR cannot be merged until it passes.

Once merged, the deploy Action runs automatically — it bumps the patch version and deploys to the configured Dynatrace tenant.

---

## Adding a Mission

Missions are defined in `ui/app/data/missions.ts` using the `Mission` type from `ui/app/types/mission.types.ts`.

Each mission requires:

- `id` — unique string identifier, prefixed with `mission-` or `operation-`
- `title` — display name shown on the mission board
- `codename` — short uppercase ops name (e.g. `SILENT QUERY`)
- `role` — the job function the scenario puts the user in
- `difficulty` — `rookie` | `operator` | `elite` | `legend`
- `description` — one-line narrative shown on the mission card
- `briefing` — full scenario briefing shown at mission start
- `timerSeconds` — total time allowed
- `prerequisites` — array of mission IDs that must be completed first (`[]` for no prerequisites)
- `topics` — array of topic track IDs this mission covers
- `disciplines` — array of `{ track, xp }` grants awarded on completion
- `checkpoints` — ordered array of `Checkpoint` objects

### Checkpoint Types

- `multiple-choice` — user selects the correct answer from options; requires `choices` and `correctChoice`
- `action` — user performs a real action in the Dynatrace UI and confirms completion

### Scoring

- Each checkpoint has a `points` value awarded on correct completion
- A time bonus is added based on seconds remaining when the mission is completed (`0.5 pts/sec`)
- Using a hint deducts 50 points from the final score
- Wrong answers on multiple-choice deduct 100 points

### Validation Rule

All multiple-choice checkpoint answers must be verifiable in the Dynatrace Playground at `playground.apps.dynatrace.com`. Test your checkpoints manually before submitting.

---

## Adding a Circuit

Circuits are defined in `ui/app/data/circuits.ts`. Each circuit is a curated sequence of mission IDs with an associated F1 track SVG and country flag.

To add a circuit:
1. Add the circuit object to the `CIRCUITS` array in `circuits.ts`
2. Add the F1 track SVG to `ui/assets/circuits/` (MIT-licensed SVGs from `julesr0y/f1-circuits-svg`)
3. Add the country flag PNG to `ui/assets/flags/` (from `flagcdn.com`)
4. Reference the local asset paths — do not use CDN URLs (CSP will block them)

---

## Important Rules

- **Never modify `app.config.json` directly** — version bumps are handled by the deploy pipeline
- **No `any` types** — all TypeScript must be properly typed
- **No external UI libraries** — Strato only (`@dynatrace/strato-components`)
- **Functional components and hooks only** — no class components
- **Typecheck must pass** — run `cd ui && npx tsc --noEmit` before every PR

---

## Branch Naming

| Prefix | Use for |
|---|---|
| `feat/` | New features or missions |
| `fix/` | Bug fixes |
| `chore/` | Tooling, config, or maintenance |

---

## PR Checklist

Before opening a PR, confirm:

- [ ] TypeScript compiles clean (`cd ui && npx tsc --noEmit`)
- [ ] Tested locally with `npx dt-app dev`
- [ ] No changes to `app.config.json`
- [ ] Branch follows naming convention
- [ ] New mission checkpoints verified against the Playground
