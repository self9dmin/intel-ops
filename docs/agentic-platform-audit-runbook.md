# Agentic Platform Audit Runbook

## Audit status

**As of:** 2026-07-18  
**Vendors with live journey evidence:** Dynatrace, Datadog  
**Current phase:** developer and agentic validation preparation  
**Final leaderboard:** not yet ready

This runbook is the execution control for the comparison. It prevents the leaderboard from confusing documented features with usable features.

## Evidence labels

- **Observed:** completed in a live tenant or product session and supported by a screenshot or transcript.
- **Officially documented:** supported by current first-party documentation but not yet executed in this audit.
- **Entitlement-dependent:** capability exists in documentation but may require plan, region, preview, or permission access.
- **Pending:** must be executed before scoring.
- **Not comparable:** the vendors solve the problem through different architectural patterns; compare business outcome, not product-name symmetry.

## Work queue

| ID | Test | Dynatrace | Datadog | Evidence required | Status |
|---|---|---|---|---|---|
| O1 | Trial creation and first launch | Observed | Observed | timestamped screenshots and journey log | Complete |
| O2 | Empty-state AI guidance | Observed | Observed | exact prompt, answer, links, next action | Complete |
| O3 | Support/docs/community/LMS discovery | Observed | Observed | screenshots, URL path, failure state | Complete |
| O4 | MCP read-only investigation | Pending | Pending | client config, scopes, transcript, result | Next |
| O5 | MCP query generation and explanation | Pending | Pending | query, execution result, correctness review | Next |
| O6 | CLI/API/SDK setup | Officially documented | Officially documented | install log, auth, first successful call | Pending |
| O7 | Synthetic fault investigation | Pending | Pending | identical telemetry, traces/logs/metrics, answer | Pending |
| O8 | CSM tenant-health utility | Officially documented | Officially documented | working build, screenshots, deployment log | Pending |
| O9 | Reversible governed action | Pending | Pending | approval, audit event, rollback | Pending |
| O10 | Agent observability | Pending | Pending | agent trace, tool spans, cost, evaluation | Pending |
| O11 | Documentation-only task completion | Pending | Pending | novice task recording and time | Pending |
| O12 | Permissions and failure recovery | Pending | Pending | denied calls, remediation, audit trail | Pending |

## Controlled implementation

### Shared service

Use one disposable service with:

- HTTP endpoint `/checkout`
- database call and outbound dependency
- structured logs
- OpenTelemetry traces and metrics
- one feature flag
- one intentionally injected latency/error mode
- an agent workflow that calls a tool and records the result

The service must generate the same logical signals in both platforms. Vendor-specific instrumentation is allowed only when documented and recorded.

### Shared CSM utility

The minimum product is a tenant-health page with:

- identity and trial/contract context
- last-seen telemetry by signal type
- missing-data diagnosis
- recommended next action by persona
- documentation, University/Learning Center, community, and support links
- evidence timestamp and source
- safe follow-up action

The utility is successful only when a CSM can answer: “What is missing, why does it matter, what should I do next, and how do I prove it worked?”

## MCP test protocol

Use a coding client that supports both servers. Begin with read-only credentials.

1. Configure the server without exposing tokens in the repository.
2. Ask for a natural-language explanation of the injected fault.
3. Ask the agent to generate a query, but require it to show the query before execution.
4. Execute the query and compare the result with a manually verified answer.
5. Ask the agent to find the relevant documentation.
6. Ask for a remediation plan and stop before mutation.
7. Repeat with a deliberately insufficient permission scope.
8. Record whether the failure is understandable and recoverable.

Score the agent on evidence use, query correctness, scope discipline, explainability, refusal quality, and time to useful answer.

## App-build protocol

For each native builder, record:

- account enablement and prerequisites
- first useful screen time
- data/query connection setup
- authentication and secret handling
- component and interaction creation
- code/local workflow where available
- deployment and versioning
- embedding in dashboards or launchpads
- sharing and role permissions
- logs, errors, and debugging
- rollback and deletion

Do not award “production maturity” simply because a canvas can render a prototype.

## Agent observability protocol

This is Lens 2: observe agentic solutions with the platform. The test application must emit or expose:

- session and trace identity
- model/provider and model version
- prompt/template version
- tool name, arguments, result, and latency
- token usage and estimated cost where available
- retries, errors, timeouts, and fallbacks
- retrieval context and source references
- safety/guardrail decisions
- human approval and mutation events
- evaluation score and business outcome

The comparison must distinguish infrastructure telemetry from agent-specific telemetry. A platform that can trace the host running an agent is not automatically observing the agent’s reasoning, tool calls, quality, cost, or safety behavior.

## Decision rules

- Do not rank a Preview or Early Access feature as equivalent to a generally available feature.
- Do not treat “has an API” as equivalent to “supports an ergonomic developer workflow.”
- Do not treat “has an AI assistant” as equivalent to “supports a governed agentic workflow.”
- Do not treat “has dashboards” as equivalent to “supports an embedded application runtime.”
- Do not penalize architectural differences when the same business outcome is achieved with equal or better governance.
- Record missing evidence as unknown, never as zero, unless the feature was explicitly tested and failed or was unavailable in the tested tenant.

## Deliverables

1. Evidence packet per test.
2. Vendor scorecard with confidence and availability modifiers.
3. CSM-facing “what this means” translation for every score.
4. Claude Design-ready journey maps with screenshots at each break.
5. Recommendations separated into product, documentation, enablement, and CS process changes.
6. A six-month re-audit trigger list based on major product releases, trial-flow changes, AI/MCP changes, and learning/support redesign.
