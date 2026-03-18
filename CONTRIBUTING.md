# Contributing to Intel Ops

Thanks for your interest in contributing to Intel Ops! This guide covers how to set up locally, add new missions, and submit changes.

## Prerequisites

- **Node.js 22** (LTS)
- **Dynatrace tenant access** — you need a SaaS tenant with AppEngine enabled
- Ports 3000–3005 and 30000 available locally

## Local Setup

```bash
git clone https://github.com/your-org/intel-ops.git
cd intel-ops
npm install
npx dt-app dev
```

The dev server will open a browser window to authenticate against your configured tenant. Your app runs at `http://localhost:3000/ui`.

## Mission Structure

Missions are defined in `ui/app/data/missions.ts` using the types from `ui/app/data/mission.types.ts`.

Each mission is a `Mission` object containing:

- **id** — unique identifier
- **title** — display name shown on the mission board
- **description** — narrative setup for the scenario
- **role** — the role the user plays (e.g. Incident Commander)
- **difficulty** — Rookie, Operator, Elite, or Legend
- **checkpoints** — ordered array of `Checkpoint` objects the user must complete

## Adding a New Mission

1. Open `ui/app/data/missions.ts`
2. Create a new `Mission` object following the existing shape
3. Add your mission to the `MISSIONS` array
4. Each checkpoint must follow the `Checkpoint` type

### Checkpoint Types

- **action** — the user performs a real action in the Dynatrace UI, validated by querying Grail or DT APIs
- **multiple-choice** — the user selects an answer from provided options

### Scoring

- Each checkpoint awards **base points** on completion
- A **time bonus** is added based on how quickly the user completes the mission
- Using **hints** applies a penalty to the final score

## Branch Naming

Use the following prefixes for your branches:

- `feat/` — new features or missions
- `fix/` — bug fixes
- `chore/` — tooling, config, or maintenance changes

## PR Process

1. Create a branch from `master` using the naming convention above
2. Open a pull request targeting `master`
3. The **typecheck** workflow must pass before merging
4. Once merged, the app **auto-deploys** to the configured Dynatrace tenant via GitHub Actions

## Important

- **Do not modify `app.config.json` directly** — version bumps are handled by the maintainer
