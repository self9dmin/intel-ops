# Dynatrace User Journey Audit

## Purpose

This is a separate, recurring research program for understanding how Dynatrace feels to a new or transitioning user. It is not a product tour, a feature inventory, or a marketing review. The goal is to identify where users understand the next step, where they stall, what they learn, and what a CSM can do to reduce friction without hiding the platform's complexity.

The audit should run at least every six months and after major changes to the platform, onboarding, Hub, permissions model, or core learning surfaces.

## Operating Principle

Audit the journey that exists for the user's role and job to be done, not the platform's internal product taxonomy.

For every major step, answer:

1. What is the user trying to accomplish?
2. What does Dynatrace ask the user to know already?
3. What does the user see and understand without help?
4. What data, permission, app, or license is required?
5. What proves that the step worked?
6. What is the next useful action?
7. What should a CSM say, demonstrate, or avoid promising?

## Scope

### In scope

- Account creation, trial activation, environment access, and first-run experience
- Playground and sample-data discovery
- First data ingestion through OneAgent and OpenTelemetry
- Services, Smartscape, Problems, Logs, Distributed Tracing, SLOs, Dashboards, and Notifications
- Launcher and Launchpads
- Dynatrace Hub discovery, installation, update, permissions, intents, and app metadata
- AppEngine concepts and the experience of using custom or community apps
- Identity, access, ABAC/RBAC, management zones, and missing-permission recovery
- Workflows and AutomationEngine onboarding
- Dynatrace Assist, Dynatrace Intelligence, MCP, `dtctl`, SDKs, APIs, and IDE workflows
- Role-specific learning paths, University, documentation, community, and CSM-created assets
- Handoffs between CSM, platform administrator, SRE, developer, security, product, and executive users
- Emotional experience: confidence, confusion, perceived risk, cognitive load, and sense of progress

### Out of scope for the first audit

- Benchmarking Dynatrace against another vendor's entire product experience
- A complete accessibility certification
- Full pricing or contract analysis
- Production remediation or destructive workflow testing
- Treating public documentation as proof of actual tenant behavior

## Research Tracks

### Track A: New trial user

Start with a clean SaaS trial tenant and record the journey from signup through first useful customer outcome. The test user should not rely on prior Dynatrace expertise.

Minimum milestones:

1. Create or activate the account
2. Find the environment and understand where to begin
3. Use Playground before ingesting data
4. Ingest data with OneAgent or OTel
5. Verify data arrival
6. Locate the first service and topology
7. Investigate a problem
8. Create or use a dashboard, notebook, or launchpad
9. Configure a notification or SLO
10. Find an app in Hub and understand its prerequisites
11. Use Assist for a bounded question
12. Find the relevant developer or agentic workflow

### Track B: Existing Dynatrace customer

Test a user who inherits an existing environment with partial instrumentation, established dashboards, multiple teams, and uneven permissions.

Focus on:

- Finding the right starting point
- Distinguishing missing data from missing permission
- Understanding inherited dashboards and launchpads
- Discovering unused platform capabilities
- Moving from Classic workflows to current platform workflows
- Understanding cost, adoption, and ownership signals

### Track C: User transitioning from another platform

Test users familiar with another observability platform. Do not assume that familiarity transfers cleanly.

Focus on:

- Terminology translation
- Data model and topology differences
- Query and dashboard expectations
- Alerting and incident workflow differences
- What OTel does and does not solve
- Which Dynatrace concepts need explicit teaching

### Track D: Agentic developer journey

Test a developer or platform engineer who uses an AI coding tool.

Focus on:

- Assist discovery and trust
- MCP setup and permission boundaries
- `dtctl` discoverability and structured output
- SDK/API documentation and first successful call
- IDE workflows
- OTel and OneAgent instrumentation decisions
- Runtime evidence flowing back into code and deployment work
- Human approval, auditability, and post-deploy verification

## Personas

Each audit must test at least these personas:

- Executive sponsor: wants outcome, risk, and progress
- CSM: needs account context, adoption evidence, and next actions
- Platform administrator: owns access, ingestion, apps, and governance
- SRE/operations user: investigates problems and protects reliability
- Developer: needs service context, traces, logs, APIs, and agent tooling
- Security user: needs vulnerabilities, posture, permissions, and evidence
- Business/application owner: needs user and business impact
- New learner: has no Dynatrace mental model

Every persona gets a separate task list. Do not use one “average user” score.

## Journey Map Format

Record every journey stage using this structure:

| Field | Required evidence |
|---|---|
| Stage | Named customer outcome, not product name |
| Persona | Role, experience level, technology background |
| User goal | What they are trying to accomplish |
| Entry point | Link, Launcher, Hub, email, CSM instruction, or direct URL |
| Expected action | What documentation or UI asks them to do |
| Actual action | What they really do, including detours |
| Friction | Confusion, missing data, permission, terminology, or dead end |
| Emotional signal | Confidence, uncertainty, anxiety, or momentum |
| Evidence of success | Observable result in the platform |
| Recovery path | What happens when the step fails |
| CSM intervention | The smallest useful human intervention |
| Agentic assist | Assist, MCP, CLI, SDK, API, or automation opportunity |
| Severity | Blocker, major, moderate, minor, or positive pattern |
| Source | Screenshot, recording, documentation URL, query, or tenant observation |

## Experience Scorecard

Score each journey stage from 1 to 5 and record evidence for the score.

| Dimension | 1 means | 5 means |
|---|---|---|
| Findability | User cannot locate the next step | The next step is obvious |
| Comprehension | Terminology or purpose is unclear | User can explain the purpose |
| Time to evidence | No clear proof of success | Evidence appears quickly and is easy to verify |
| Permission clarity | Failure looks like a product defect | User understands access requirements and recovery |
| Role relevance | Generic feature tour | Content matches the user's job |
| Cross-surface continuity | User gets lost between apps/docs/Hub | The handoff is coherent |
| Learning load | Requires extensive prior knowledge | User can build understanding progressively |
| Confidence | User hesitates or abandons the task | User knows what to do next |
| Business translation | Technical data has no outcome connection | User can explain business significance |
| Agentic readiness | AI tooling is unclear or unsafe | The user can use it with bounded trust |

## UX and onboarding evaluation standard

Use a mixed-method standard rather than a single “UX score.” The audit should combine:

- **ISO 9241-11:** evaluate usability as effectiveness, efficiency, and satisfaction in a specified context of use. The context must include persona, role, technology background, tenant mode, and task.
- **Nielsen's usability heuristics:** inspect visibility of system status, match to the user's world, user control, consistency, error prevention, recognition over recall, efficiency, minimalist presentation, recovery from errors, and help/documentation. Apply them to the actual task path, not to isolated screens.
- **Google HEART:** map goals, signals, and metrics across Happiness, Engagement, Adoption, Retention, and Task Success. Use this for trend reporting across six-month audit cycles.
- **Microsoft Inclusive Design:** test for exclusion caused by mismatches in experience, including technical vocabulary, cognitive load, accessibility, time pressure, and different technology backgrounds.
- **Task-based usability research:** observe users attempting realistic goals without leading them. Ask what they expect, what they think happened, and what they would do next.

The audit conclusion should never be “the onboarding scored 78.” It should say which users can complete which goals, with what evidence, under what conditions, and where the experience fails.

### Required UX outputs

For every high-severity finding, include:

1. The user goal and context
2. The observed behavior
3. The violated usability or onboarding principle
4. The evidence and severity
5. The likely cause: product, content, permission, data, or process
6. The smallest intervention
7. The measurable success signal
8. The re-test result

## App and Hub Audit

For every app, extension, dashboard, notebook, launchpad, or workflow used in the journey, capture:

- Provider and verification status
- Current Hub listing and release date
- Intended user and job to be done
- First-use experience
- Prerequisites and permissions
- Required data and whether sample data works
- Supported intents and cross-app navigation
- Included dashboards, notebooks, workflow actions, or functions
- Installation, update, uninstall, and recovery experience
- Empty states and missing-data behavior
- Documentation quality
- Whether the artifact teaches or merely exposes capability
- Whether it duplicates an existing platform surface
- Whether it is suitable for Playground, trial, production, or internal enablement

The audit must distinguish official Dynatrace apps, verified apps, community assets, custom apps, and CSM-created artifacts.

## Documentation Audit

For each key step, compare the user experience against official documentation and record:

- Does the documentation describe the current UI?
- Does it state prerequisites before the user reaches a blocker?
- Does it define permissions in user language?
- Does it provide a known-good starting example?
- Does it distinguish Playground, trial, SaaS, managed, and environment-specific behavior?
- Does it link to the next task?
- Does it explain expected evidence of success?
- Does it tell the reader what to do when the result is empty or forbidden?

Documentation is evidence of intended experience, not evidence that the experience is actually good.

## Six-Month Cadence

### Month 0: Baseline

- Freeze the test accounts, personas, scripts, and tenant data
- Run the clean-trial journey
- Run the existing-customer journey
- Capture current screenshots, URLs, permissions, and timings

### Month 1: Synthesis

- Cluster friction by journey stage and persona
- Identify the highest-severity blockers
- Separate product problems from enablement problems
- Separate documentation defects from discoverability defects

### Month 2: Intervention design

- Propose documentation, app, launchpad, training, and CSM interventions
- Select the smallest testable interventions
- Define success measures before implementation

### Month 3: Re-test

- Run the same tasks with the proposed intervention
- Compare time, success, confidence, and support required

### Month 4–5: Adoption follow-through

- Check whether CSMs actually use the assets
- Check whether customers complete the next step
- Check whether the intervention reduces repeated support work

### Month 6: Re-baseline

- Re-run the full high-risk journey
- Publish a change log
- Retire stale guidance
- Start the next cycle

## Deliverables

Each cycle produces:

1. Journey topology
2. Role-based task scripts
3. Evidence-backed friction register
4. App and Hub inventory
5. Documentation gap report
6. Permission and data-availability matrix
7. CSM intervention playbook
8. Recommended product backlog
9. Before-and-after usability measures
10. Six-month change log

## Product Implications for Intel Ops

Intel Ops should consume the audit outputs rather than attempt to become the audit itself.

The first useful surfaces are:

- Journey stage tracker
- Role-based onboarding paths
- Tenant evidence checklist
- Enablement asset catalog
- Permission and prerequisite explainer
- CSM meeting brief
- Friction and intervention register
- Assist/CLI/MCP/SDK readiness guide

The application should remain read-only for tenant evidence in the first release. It may write learner progress and internal notes, but it should not create, edit, or delete customer configuration without an explicit approval workflow.

## Official Starting References

- [Get started with Dynatrace](https://docs.dynatrace.com/docs/discover-dynatrace/get-started)
- [Discover Dynatrace and Playground](https://docs.dynatrace.com/docs/discover-dynatrace)
- [Dynatrace Hub](https://docs.dynatrace.com/docs/manage/hub)
- [Launcher and Launchpads](https://docs.dynatrace.com/docs/discover-dynatrace/get-started/dynatrace-ui/launchpads)
- [What is Dynatrace](https://docs.dynatrace.com/docs/discover-dynatrace/what-is-dynatrace)
- [Access management concepts](https://docs.dynatrace.com/docs/manage/identity-access-management/permission-management/access-concepts)
- [Manage workflow permissions](https://docs.dynatrace.com/docs/analyze-explore-automate/workflows/security)
- [Dynatrace Customer Success open-source solutions](https://github.com/dynatrace-oss/CustomerSuccess)
- [ISO 9241-11:2018 usability framework](https://www.iso.org/standard/63500.html)
- [Google HEART research](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/)
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/)
- [Microsoft Fluent onboarding guidance](https://fluent2.microsoft.design/onboarding/)

## Current Research Boundary

Public documentation can establish intended capabilities and prerequisites. It cannot establish how a new user emotionally experiences the journey, how long tasks take, or whether a current UI is understandable. Those claims require fresh tenant observation with a clean account and recorded task sessions.

Do not publish a journey score as factual until the task has been re-run in the relevant environment and the evidence has been attached.
