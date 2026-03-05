# Intel Ops

**Gamified observability training built on Dynatrace AppEngine.**  
Learn by doing. Compete to win.

---

## What Is This

Intel Ops is a scenario-based training app that runs natively inside the Dynatrace platform. Instead of reading documentation, users complete real observability missions — navigating the actual Dynatrace UI, querying Grail, and investigating problems — then get scored and ranked on a leaderboard.

The core loop: **Scenario → Real DT Action → Validation → Score → Leaderboard**

Built with React + TypeScript on Dynatrace AppEngine using the Strato design system.

---

## Current Status

**Phase 1 — In Progress**

- [x] Home screen with mission board and leaderboard
- [x] Mission flow with timer, checkpoints, and scoring
- [x] Simulated checkpoint validation (mock)
- [ ] Score persistence via Document Service
- [ ] Live leaderboard from stored scores
- [ ] Real DQL validation against tenant data
- [ ] Synthetic scenario data injection

---

## Missions

| Mission | Role | Difficulty | Status |
|---|---|---|---|
| Operation: 3am Database Spike | Incident Commander | Rookie | ✅ Built |
| More coming in Phase 2 | — | — | 🔒 Locked |

---

## Tech Stack

- **Runtime:** Dynatrace AppEngine
- **Frontend:** React + TypeScript
- **UI:** Strato Design System (`@dynatrace/strato-components`)
- **Data:** Grail via DQL, Document Service for persistence
- **Tooling:** Dynatrace App Toolkit (`dt-app`)

---

## Getting Started

### Prerequisites

- Node.js v22
- Access to a Dynatrace SaaS tenant
- Ports 3000–3005 and 30000 available locally

### Install & Run

```bash
npm install
npx dt-app dev
```

The dev server will open a browser window to authenticate against your configured tenant. Your app runs at `http://localhost:3000/ui` and live inside your tenant at the URL shown in the terminal.

### Configuration

Edit `app.config.json` to set your environment URL and app scopes:

```json
{
  "environmentUrl": "https://your-tenant.apps.dynatrace.com/",
  "app": {
    "name": "Intel Ops",
    "id": "com.intelops.training"
  }
}
```

---

## Available Commands

| Command | Description |
|---|---|
| `npx dt-app dev` | Start local dev server with hot reload |
| `npx dt-app build` | Build for production |
| `npx dt-app deploy` | Build and deploy to configured tenant |
| `npx dt-app uninstall` | Remove app from tenant |
| `npx dt-app update` | Update DT packages to latest |
| `npx dt-app info` | Print CLI and environment info |

---

## Project Structure

```
intel-ops/
├── ui/
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages (Home, Mission)
│   │   └── App.tsx        # Root component and routing
│   └── assets/
├── app.config.json         # App manifest — scopes, ID, env URL
├── CLAUDE.md               # AI coding agent instructions
└── README.md
```

---

## Deployment

Merging to `master` automatically deploys to the configured Dynatrace tenant via GitHub Actions.

For manual deploys:
1. Bump the version in `app.config.json`
2. Run `npx dt-app deploy`

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add missions, run locally, and submit PRs.

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built by [Dan Quintero](https://danquintero.com)
