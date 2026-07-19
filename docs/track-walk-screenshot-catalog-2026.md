# Track Walk screenshot catalog: 2026 discovery audit

Captured July 19, 2026 for the CSM discovery curriculum. These are viewport captures from the live public pages, stored under `ui/assets/journeys/`. They are evidence for the exercise, not a claim that every learner sees an identical layout in every region or account.

## Evidence

| File | Surface | What the learner should notice | Suggested test |
| --- | --- | --- | --- |
| `06-dynatrace-search-2026.jpg` | Dynatrace Search | One search surface spans Documentation, Community, University, News and resources, Hub, Marketing, and Developer. It also exposes content type, skill level, tags, and source counts. | Search for a customer problem, then narrow to Documentation or University and explain why the chosen source is authoritative enough for the task. |
| `07-dynatrace-community-tips-2026.jpg` | Community > Dynatrace tips | Tips are user-oriented workarounds and practices, with sorting, search, Q&A, and a visible Community sign-in path. | Find one 2026 tip, identify its author/date, reproduce the idea in a safe sandbox, and write one useful follow-up question or reply. |
| `08-dynatrace-whats-new-2026.jpg` | What's New | Release information is a first-class product surface and must be checked before teaching a workflow that may have changed. | Find the current SaaS release and summarize one relevant change, one risk, and one customer-facing implication. |
| `09-dynatrace-eol-2026.jpg` | End-of-life announcements | EOL is a lifecycle state distinct from general product news. | Find one affected component, its date, and the migration/upgrade action; do not infer support status from a blog post. |
| `10-dynatrace-eos-2026.jpg` | End-of-support news | EoS is separate from EOL and may be version/runtime-specific. | Find an affected runtime or platform version and state exactly what is no longer supported. |
| `11-dynatrace-devrel-2026.jpg` | Developer Relations | Developer material is a separate learning and build channel, including current videos and podcasts. | Find one 2026 developer item relevant to an agent, SDK, API, or automation use case and translate it into a customer action. |
| `12-dynatrace-perform-2026.jpg` | Perform on-demand | Event recordings provide context and strategic/product education that does not replace implementation docs. | Select one session, identify the role it serves, and record what must still be verified in product documentation. |
| `13-dynatrace-playground-otel-2026.jpg` | Dynatrace Playground | The Playground launchpad exposes OpenTelemetry, Distributed Tracing, Logs, Services, Kubernetes, Notebooks, and ingestion-oriented starting points. | Locate the OTel path, name the downstream investigation surface, and record which data fixture must be verified before a mission is published. |
| `14-playground-otel-traces-validated-2026.jpg` | Playground > Distributed Tracing | Live trace explorer shows populated request data, service and endpoint facets, request/span status, Kubernetes context, and `otel-demo` rows. | Filter a service or endpoint, inspect the request evidence, and state what the trace proves versus what still needs log or metric correlation. |

## Ground rules for the CSM lab

1. Every answer needs a source URL, capture date, and source type: Documentation, University, Community, Developer, News/resources, or Hub.
2. Community material is useful field knowledge, not automatically product policy. Learners must label it as community guidance and verify production-impacting claims against documentation or support.
3. A passing “community participation” task is active contribution: ask a precise question, answer one peer question with evidence, or publish a small reproducible tip. Merely bookmarking the Community page does not count.
4. For any release, EoS, or EOL finding, record the exact version/component, date, customer impact, and next action. “It is deprecated” without those four fields fails the exercise.
5. When a learner encounters a product limitation, route it through the three-way debrief: **Guide the customer**, **Escalate/support**, or **Flag to product**. Do not train around a product gap as though it were user error.

## Evidence limitations

- These captures are point-in-time July 2026 evidence. Search counts, page ordering, cookie banners, and navigation chrome can change.
- Mission 2 still needs authenticated, role-specific captures for the exact University/LMS course flow and support entitlement flow.
- YouTube and podcast prompts should be validated as learner tasks with a current episode/video URL before a cohort starts; the curriculum should not rely on a stale title alone.
