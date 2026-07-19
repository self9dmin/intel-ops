# Mission Control use-case audit

**Review date:** 2026-07-19  
**Scope:** All missions currently defined in `ui/app/data/missions.ts`, plus the OpenTelemetry and AI prototype circuits.

## Executive judgment

The library is a strong navigation and investigation foundation, but it is not yet a complete 2026 observability curriculum. The core use cases remain valid; the weak points are evidence freshness, excessive Dynatrace Assist framing, and missing production-grade workflows around AI observability, cost, governance, and remediation. The first strengthening pass is now implemented: Davis/Assist remains its own circuit, a separate seven-mission AI Observability circuit covers workload signals, traces, token economics, agent topology, instrumentation, model health, and incident bridging, and nine duplicative or weak missions have been retired. These missions are content-ready but still require target-tenant execution before publication-ready status.

## Use-case health by family

| Family | Current missions | Status | Assessment |
| --- | --- | --- | --- |
| Orientation and platform navigation | Welcome to the Playground, Find Your Footing, Know Your Wheel | Valid but light | Useful for first access, but several checkpoints test location more than customer outcome. Add a “find, explain, and use” requirement. |
| Alerting and problem triage | Your First Alert, First Briefing, Read the Room, Blast Radius | Valid | Good foundation. Revalidate labels, permissions, and current Davis surfaces in Playground. |
| Davis causal investigation | Causal Chain, Predict the Failure, SLO Burn, Operator Debrief | Valid but over-framed around Assist | The reasoning is strong, but missions need a visible evidence chain: problem, entity, causal evidence, query or chart, action, and verification. |
| Incident command | War Room Brief, Timeline, Customer Impact, Escalation Decision, All-Clear, Command Postmortem | Valid but repetitive | Strong role fit, but several missions use a similar prompt-and-interpret pattern. Add artifacts: timeline, stakeholder update, escalation record, and postmortem action item. |
| Developer performance | Why Is It Slow, Deploy with Confidence, Code Fix Brief, Error Budget | Valid | Good developer path. Strengthen with current IDE/CLI/SDK/MCP handoff and a reproducible trace-to-code workflow. |
| OpenTelemetry | OTel Query, OTel Inventory, four new OTel missions | Prototype | Trace path is validated in Playground. Collector, log-correlation, and metric missions remain fixture-level validation items. |
| Logs and DQL | Follow the Signal, Log Story, Log Volume Intelligence | Valid but query-light | The missions teach filtering and query recognition, but they need executable DQL checkpoints, schema awareness, and a “no results” diagnosis. |
| Infrastructure and Kubernetes | Fleet Report, Disk Forecast, OTel Inventory, Map Kubernetes Cluster | Valid but shallow | Good orientation, limited remediation and capacity tradeoffs. Add resource saturation, workload ownership, and safe change verification. |
| Automation and workflows | Workflow Builder, Approval Gate, Know Your Wheel | Valid | Approval and safety concepts are valuable. Add failure recovery, permissions, dry-run, and audit evidence. |
| AI Observability | AI Observability Grand Prix plus the Davis Intelligence circuit | Strengthened prototype | The new track covers workload telemetry, traces, tokens/cost, topology, instrumentation, model health, and incidents. It remains fixture-validation work until AI data is confirmed in the target Playground or tenant. |
| Cost and consumption | Log Volume Intelligence only | Missing | No dedicated host-unit, DEM, DDU/DPS, usage, or billing workflow exists yet. |
| Support, learning, and lifecycle | Track Walk journeys | Strong prototype | Best evidence-backed content currently. Needs authenticated University/LMS and support entitlement validation before being called complete. |

## Highest-priority weaknesses

### 1. AI Observability is not the same as AI assistance

The current AI missions focus on finding Assist, writing prompts, interpreting Davis output, and communicating incidents. Those are useful skills, but current Dynatrace AI Observability documentation describes a wider workflow: OTel/OpenInference instrumentation, AI application onboarding, agent topology, prompts, model/provider dimensions, token and cost metrics, and integrations for agent frameworks and MCP.

Strengthen the AI track with missions for:

- Instrument an agent or LLM service with GenAI semantic conventions.
- Verify model, token, latency, error, and cost telemetry.
- Investigate an agent topology from user request to tool/model call.
- Inspect prompt and response quality signals without exposing sensitive content.
- Correlate an AI failure with downstream service and infrastructure impact.
- Monitor an MCP or agent-framework integration.
- Compare model versions or A/B experiments.

The official reference points are the [AI Observability app](https://docs.dynatrace.com/docs/observe/dynatrace-for-ai-observability/ai-observability-app), [AI Observability FAQ](https://docs.dynatrace.com/docs/observe/dynatrace-for-ai-observability/frequently-asked-questions), and [AI Observability integrations](https://docs.dynatrace.com/docs/observe/dynatrace-for-ai-observability/integrations).

### 2. Assist claims need current evidence

Several missions assume that Assist can answer a prompt or expose a named agent. That may be true in some tenant configurations but is entitlement-, role-, and product-version-sensitive. Each Assist checkpoint should record the required permission, app location, data source, expected response shape, and fallback path if the capability is unavailable.

### 3. The library is too multiple-choice-heavy

Multiple-choice is appropriate for vocabulary and interpretation, but it cannot prove that a learner can operate the platform. The next wave should include:

- DQL execution checkpoints
- Filter and pivot tasks
- Evidence capture or structured finding submission
- Safe remediation or workflow-preview tasks
- “Explain what this proves” debrief fields

### 4. Cost optimization is absent from the use-case map

The backlog item is justified. Cost should not be taught as a generic licensing lecture; it should connect telemetry choices to consumption, retention, cardinality, sampling, DEM usage, and governance. Pricing and unit terminology must be pulled from current official documentation at content-build time.

### 5. Many missions test navigation, not outcomes

“Find the app” is a reasonable rookie checkpoint, but a mission should quickly progress to “use the app to answer a customer or operational question.” Orientation missions should be capped at one navigation checkpoint, followed by an evidence and decision checkpoint.

## Recommended strengthening order

1. Revalidate all current Playground-dependent questions and labels.
2. Execute and validate the new AI Observability Grand Prix against a tenant or fixture with AI telemetry; keep Davis Assist missions as an Intelligence sub-track.
3. Add executable DQL and structured-evidence checkpoints to logs, traces, SLOs, and OTel.
4. Build the Cost Optimization track against current Usage & Billing and consumption data.
5. Add remediation and recovery outcomes to automation, Kubernetes, and infrastructure missions.
6. Only then expand the Visual Mission Builder, because the builder should encode the strengthened checkpoint types and evidence requirements.

## Publication gates

A use case should not be marked production-ready unless:

- Its core path was executed in the target Playground or a documented tenant fixture.
- Every UI label and app route was checked within the last six months.
- The expected answer is supported by visible data or an official source.
- Permissions, entitlements, and fallback paths are documented.
- Difficulty matches the reasoning burden, not just the number of checkpoints.
- The mission produces an operational artifact or a verifiable decision, not only a correct option.
