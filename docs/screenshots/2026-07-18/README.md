# Observability Onboarding Comparison Screenshots

Captured from the authenticated Chrome audit session on 2026-07-18. These are live viewport evidence captures for Cloud Design / Claude Design; use the interaction log in `docs/audit-cycle-2026-07-early-observations.md` for workflow outcomes.

| File | Surface | State represented | Design question |
|---|---|---|---|
| `01-dynatrace-getting-started.png` | Dynatrace trial | Getting-started launchpad with multiple ingestion and platform paths | Does the user get one first task or a broad capability map? |
| `02-datadog-help-center.png` | Datadog trial | In-product Help Center with Bits open | How much support, documentation, community, ticketing, status, release-note, and learning access is available without leaving the tenant? |
| `03-dynatrace-support-menu.png` | Dynatrace trial | In-product support menu | Are documentation, community, University, support, developer, API, and forum resources discoverable? |
| `04-dynatrace-university-catalog.png` | Dynatrace University | Catalog with learning plans, course counts, durations, and free labels | Can a new user find a role-relevant learning path? |
| `05-dynatrace-university-essentials.png` | Dynatrace University | Course detail with syllabus, duration, enrollment, and metadata | Does the course page make commitment and next action clear? |

## Recommended pairs

1. `01` vs `02`: product onboarding and path to first value.
2. `03` vs `02`: support-resource discoverability and contextual continuity.
3. `04` vs `05`: catalog breadth versus course-level commitment and enrollment.

## Capture notes

- Files were captured from the live Chrome session with the browser screenshot API.
- No passwords, verification codes, API keys, or customer telemetry are intentionally included.
- The Dynatrace support handoff failure is documented in `docs/audit-cycle-2026-07-early-observations.md`: selecting Help & Support from the authenticated trial opened the SSO route and landed on an Invalid Page / JIT-handler error. The current browser wrapper exposed that new tab but did not provide a callable tab-claim method in this run, so no sixth image is represented here.
- The support failure is an observed trial-session result, not a generalized claim that all Dynatrace support paths fail.
