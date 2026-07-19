# Observability Vendor Journey Audit Model

## Purpose

Compare observability platforms through matched user outcomes, not feature-count claims. The first cohort is Dynatrace and Datadog. The model is reusable for New Relic, Splunk, Grafana Cloud, Elastic, Sentry, AppDynamics, and other platforms.

## Comparison rule

Run equivalent tasks where the vendors support them. Mark a task as **not comparable** when the product model, trial limitation, or required infrastructure differs. Never convert “not comparable” into a zero.

Separate three findings:

- **Observed:** directly seen in the account or user session
- **Documented:** supported by current official documentation
- **Inferred:** a reasoned interpretation that requires confirmation

## Matched accounts

Create accounts as close together as practical and record:

- Signup date and time
- Trial duration and region
- Account and environment model
- Default role and permissions
- Product version or site
- Emails received
- Enabled products and trial limits
- Data source and instrumentation method
- User persona and task script

Do not claim the accounts are identical if the vendors provision different defaults.

## Core journey stages

1. Discover and evaluate
2. Signup and verify
3. Orient and find the next step
4. Connect data
5. Verify first evidence
6. Explore application and infrastructure context
7. Investigate a problem
8. Build a dashboard or notebook
9. Create an SLO or monitor
10. Configure notifications or workflow automation
11. Add users and govern access
12. Use APIs, CLIs, SDKs, MCP, or IDE tooling
13. Learn and self-serve
14. Move from trial/POC to production

## Matched task set: Dynatrace and Datadog

### Task 1: First orientation

“I am new to this product. Show me what to do first and how I will know I succeeded.”

Capture welcome screen, launchpad/navigation, product vocabulary, help links, and time to identify the first task.

### Task 2: First data

Use the vendor’s recommended low-risk path for a test host or sample application. Record installation friction, credentials/API keys, supported platforms, guidance, and time to first data.

Datadog’s official path centers on account creation, API key/site configuration, Agent installation, and optional Fleet Automation. Dynatrace’s current path includes trial signup, OneAgent or OTel ingestion, service verification, Smartscape, dashboards, and notifications. These are comparable outcomes but not identical workflows. [Datadog Agent](https://docs.datadoghq.com/getting_started/agent/) · [Dynatrace getting started](https://docs.dynatrace.com/docs/discover-dynatrace/get-started)

### Task 3: Verify data

Find the first host, service, trace, log, or metric and explain what proves collection is working.

### Task 4: Investigate a known issue

Use a seeded or documented scenario. Measure time to identify affected entities, cause or contributing factors, impact, and next action.

### Task 5: Build a stakeholder view

Create or use a dashboard, notebook, or equivalent view for an application owner. Record defaults, templates, query learning curve, sharing, and linkability.

### Task 6: Define reliability

Create an SLO or equivalent monitor objective. Capture terminology, configuration burden, alert semantics, and whether a non-specialist can explain the result.

### Task 7: Govern the environment

Add a read-only user, inspect roles, identify the minimum permissions for the task, and test a deliberate permission failure and recovery path.

### Task 8: Learn and extend

Find the official learning path, integration catalog, app/marketplace surface, API, CLI, SDK, and agent or MCP path. Record whether the user can discover the next tool from inside the product.

### Task 9: Produce business evidence

Create a one-page account brief with verified facts, unknowns, business impact, recommended next action, and evidence links.

## Scorecard

Score each stage from 1 to 5 with evidence.

| Dimension | Question |
|---|---|
| Time to value | How long until the user sees useful evidence? |
| Findability | Can the user find the next step without coaching? |
| Comprehension | Can the user explain what the screen means? |
| Instrumentation | How much setup is required and how recoverable is failure? |
| Evidence quality | Can the platform show why a result is true? |
| Investigation | Can the user move from symptom to cause and impact? |
| Workflow depth | Can the user move from insight to controlled action? |
| Learning support | Are help, examples, and courses available at the point of need? |
| Governance | Are permissions clear, least-privilege, and recoverable? |
| Extensibility | Are APIs, CLIs, SDKs, integrations, and agent tools discoverable? |
| Business translation | Can the user turn telemetry into an outcome narrative? |
| Handoff quality | Does trial or POC evidence carry into production onboarding? |
| Confidence | Does the user know what to do next and trust the result? |

## Evidence package

Each vendor gets the same package:

- Account metadata
- Email timeline
- Screen recording or structured session notes
- Screenshots at major checkpoints
- Task duration and completion status
- Permission matrix
- Documentation links and retrieval dates
- Data-source configuration
- Final user brief
- Researcher observations
- Participant confidence ratings
- Known trial limitations

## What not to compare directly

- Raw number of integrations
- Marketing claims about AI
- Trial email volume by itself
- Dashboard count
- Product breadth without task relevance
- A feature available only under a different paid plan
- A missing feature that is not needed for the matched job

## First Datadog/Dynatrace cohort

Run one clean trial of each vendor with the same research identity where allowed, the same browser, same test host, same sample application, same task order, and same observer. Start with read-only tasks after initial setup. Do not connect production data.

The first report should answer:

- Which platform gets a new user to first evidence faster?
- Which platform explains its data model more clearly?
- Which platform makes instrumentation easier to recover?
- Which platform makes problem investigation more understandable?
- Which platform gives better point-of-need learning?
- Which platform makes permission failures clearer?
- Which platform creates a better bridge from operator workflow to developer and agentic tooling?
- Which platform gives the CSM better evidence for a customer conversation?

## References

- [Datadog Getting Started](https://docs.datadoghq.com/getting_started/application/)
- [Datadog Agent onboarding](https://docs.datadoghq.com/getting_started/agent/)
- [Datadog access control](https://docs.datadoghq.com/account_management/rbac/)
- [Dynatrace getting started](https://docs.dynatrace.com/docs/discover-dynatrace/get-started)
- [Dynatrace Hub](https://docs.dynatrace.com/docs/manage/hub)
- [Dynatrace Launcher and Launchpads](https://docs.dynatrace.com/docs/discover-dynatrace/get-started/dynatrace-ui/launchpads)
