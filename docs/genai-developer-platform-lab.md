# GenAI and Developer Platform Lab

## Purpose

This lab tests whether a CSM can move from a customer question to an evidence-backed answer, a small governed build, and a safe operational action. It is intentionally separate from the first-run onboarding audit.

The lab compares Dynatrace and Datadog using the same task, same synthetic service, same operator role, and the same read-only-first policy. It does not treat a documented feature, preview, or marketing claim as equivalent to a working tenant capability.

## Test environment

Use two fresh trial or sandbox tenants where possible. Record:

- tenant/site, region, creation time, trial or paid entitlement
- operator role and permissions
- AI feature availability and model/provider disclosures
- CLI, SDK, API, MCP, App Builder/AppEngine, and workflow entitlements
- synthetic service name, repository, runtime, and telemetry volume
- exact browser, CLI, Node, Python, and agent versions
- start/end timestamps for every task

Never place customer secrets, production credentials, or personal access tokens in screenshots or the lab repository.

## Controlled task set

### T1: Empty-state orientation

Prompt both assistants:

> This tenant has no telemetry yet. I am a CSM helping a customer with a Kubernetes service. Give me the fastest safe path to see one verified signal. Name the exact next action, required permission, expected result, and rollback or cleanup step.

Capture the answer, links, assumptions, permission requests, whether the assistant recognizes the empty state, and whether it gives one path or a menu of options.

### T2: Evidence-backed investigation

Inject the same controlled fault into a disposable service: elevated latency on one endpoint plus a correlated log error. Ask:

> What changed, which service and dependency are involved, what evidence supports that conclusion, and what should I check next? Do not make changes.

Score factual accuracy, trace/log/metric correlation, topology context, links back to evidence, uncertainty handling, and whether the answer invents data.

### T3: Agentic coding workflow

From VS Code, Cursor, Claude Code, or Codex CLI, ask the agent to:

1. inspect the service's recent error and latency telemetry;
2. explain the relevant query;
3. propose a small instrumentation or configuration change;
4. produce a patch and test plan;
5. stop before deployment.

Record setup time, MCP authentication, required permissions, tool discovery, query quality, source links, diff quality, and whether the agent respects the stop boundary.

### T4: Equivalent CSM utility

Build a small tenant-health utility with the same requirements:

- tenant name, trial days, data-source status, and last-seen telemetry
- missing-data checklist with role-appropriate next actions
- links to documentation, support, community, and learning
- one safe “open setup” or “create follow-up” action
- visible owner, timestamp, source, and permission status

Implement through the easiest native path first, then the pro-code path if available:

- Dynatrace: AppEngine/App Toolkit, app functions, platform APIs, Grail/DQL, and optionally MCP-assisted development.
- Datadog: App Builder, Workflow Automation/Action Catalog, Datadog APIs, and optionally code-first Datadog Apps.

Do not force architectural equivalence. Record where each platform requires an external service, separate datastore, custom backend, or manual handoff.

### T5: Governed action

Add one reversible action, such as creating a ticket, adding a tag in the sandbox, or starting a workflow. Test:

- read-only default
- explicit approval before mutation
- least-privilege permission failure
- audit trail and actor identity
- idempotency or duplicate prevention
- rollback and error recovery

## Scoring model

Score each dimension from 0 to 5 and attach evidence. Do not award more than 3 without a successful hands-on task.

| Dimension | 0 | 3 | 5 |
|---|---|---|---|
| AI answer quality | unavailable or unsafe | useful with manual verification | accurate, evidence-linked, uncertainty-aware |
| Empty-state guidance | generic or dead end | several workable options | one safe, contextual next action |
| MCP/agent setup | undocumented or blocked | works with manual token/configuration | discoverable, scoped, auditable, and easy to reset |
| CLI/API/SDK workflow | no practical path | documented path with friction | quick install, strong examples, testable feedback |
| Query/data context | siloed or opaque | useful product-level query | unified context with topology and permissions |
| Native building | unavailable | prototype possible | governed, reusable, embeddable production path |
| Pro-code building | unavailable | local code can be uploaded | source control, CI/CD, backend, permissions, observability |
| Governance | mutation is implicit | permissions exist | approval, scope, audit, rollback, and ownership are clear |
| Documentation usability | search-only or stale | answer found with effort | task-oriented, copyable, version/site-aware, agent-readable |
| CSM business value | raw technical output | useful summary | reusable customer-health workflow with clear owner/action |

### Availability modifiers

Apply these after scoring:

- `GA`: available and documented for the tested site/tenant.
- `Preview`: documented but limited or opt-in; cap the dimension at 3 unless the test proves otherwise.
- `Early Access`: cap at 2 for production-readiness scoring.
- `Entitlement blocked`: record capability, but score availability as 0 for that tenant.
- `Documentation-only`: do not award hands-on capability points.

## What “better” means for the CSM

Datadog is better when packaging reduces the number of translation steps from “customer has a problem” to “here is the next supported action.” Dynatrace is better when contextual data, topology, DQL, automation, and a native app runtime let the CSM create a durable customer-specific workflow without exporting the operating context. The lab must test both claims directly.

## Evidence packet per task

For every task, save:

1. one before screenshot;
2. one or more state/result screenshots;
3. exact prompt or command;
4. URLs, tool names, versions, and timestamps;
5. permission/token scopes without secret values;
6. observed result and expected result;
7. failure mode and recovery;
8. business-value translation in one sentence;
9. confidence: high, medium, or low.

## Recommended execution order

Run T1 and T2 in the existing tenants first. Run T3 only after creating a sandbox token or OAuth client with read-only access. Run T4 in disposable environments. Run T5 last and only after explicit approval of the mutation test.

The final leaderboard should show separate results for **use the platform with agents** and **observe agentic applications with the platform**. This lab covers the first lens; the second lens requires instrumenting an agent application and testing traces, tool calls, token/cost data, evaluations, guardrails, prompt/version context, and end-to-end business outcomes.
