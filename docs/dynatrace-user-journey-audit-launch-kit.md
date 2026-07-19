# Dynatrace User Journey Audit: Launch Kit

## Audit objective

Run a repeatable, evidence-backed audit of the Dynatrace user journey and identify the smallest interventions that improve comprehension, time to first evidence, confidence, and successful adoption.

This borrows Customer.io's useful visual language: profiles, events, stages, branches, waits, and intervention points. It does not copy Customer.io's messaging model. The unit of analysis here is a user task and its evidence of success, not a campaign message.

## Launch sequence

### 1. Establish the research boundary

Create a clean SaaS trial tenant for the baseline. Record the environment type, account date, region, product version, enabled capabilities, and test-user permissions. Do not mix Playground observations with trial observations.

### 2. Freeze the test matrix

Run the same core tasks for:

- New learner
- CSM
- Platform administrator
- SRE or operations user
- Developer using an AI coding tool
- User transitioning from another observability platform

Each participant receives a role brief and a goal, not a feature checklist.

### 3. Capture the journey

For each task, record:

- Start URL or entry point
- Screen and state before the action
- User language and expectation
- Action taken
- Time to first useful evidence
- Error, permission, or empty state
- Help source used
- Confidence rating
- Evidence of success
- Next action chosen

### 4. Run the intervention pass

Introduce only one intervention at a time:

- Better launchpad
- Shorter task brief
- In-product explanation
- University or documentation link
- Assist prompt
- MCP/CLI setup guide
- CSM coaching cue

Re-run the task and compare the results.

### 5. Publish the six-month baseline

Publish the journey map, scorecard, friction register, evidence appendix, and intervention backlog. Every finding must link to a recording, screenshot, tenant observation, query, or official documentation source.

## Communication and commercial journey

The product journey is incomplete without the messages that tell the user what to do next. Run three separate communication tracks:

### Trial journey

Capture the full mailbox lifecycle from signup through trial expiration or conversion:

- Welcome and account verification
- Environment-ready message
- First-data guidance
- Playground and learning invitations
- Ingestion reminders
- Help or support prompts
- Feature and capability education
- Trial-expiry messaging
- Conversion or sales handoff

For each message, record the sender, timestamp, audience, promised next step, link destination, required permission, whether the link works, and whether the user can complete the action without prior Dynatrace knowledge.

### POC-to-purchase journey

Treat the POC as a distinct journey, not an extended trial. Capture:

- POC goals and success criteria
- Environment and data setup
- Stakeholder and role mapping
- Evaluation milestones
- Technical validation evidence
- Business-value proof
- Security and access review
- Commercial handoff
- Contract or subscription activation
- Production onboarding handoff

The audit must test whether the user understands what changes after purchase: environment ownership, permissions, licensing, data retention, support path, production rollout, and next success milestone.

### Post-sale onboarding journey

Capture the transition from signed customer to active platform user:

- Welcome and account provisioning
- Admin and user invitation flow
- Initial policy and permission setup
- OneAgent/OTel deployment
- First service verification
- SLO and notification setup
- Hub and Launchpad discovery
- Training and University recommendations
- CSM success plan
- First value review
- Expansion or adoption follow-up

Do not assume a successful POC means successful production onboarding. The handoff itself is an audit stage.

## Mailbox evidence policy

Use a dedicated research mailbox with read-only access for the audit. Do not use a personal inbox. Store message metadata and extracted touchpoint facts in the evidence register; do not copy full messages or customer-sensitive content into source control. Redact names, tenant IDs, account IDs, tokens, and personal data before sharing evidence.

Track:

- Message ID
- Received time
- Journey track
- Sender role
- Recipient role
- Subject and normalized intent
- Call to action
- Destination URL
- Required account state
- Required permission
- Completion status
- Confusion or contradiction
- Evidence reference

The mailbox is a source of journey evidence, not a place to send or reply to customers automatically.

## Visual topology

The Claude Design brief should use a canvas with:

- Horizontal axis: customer journey stages
- Vertical lanes: persona, platform surface, CSM intervention, evidence, and friction
- Nodes: user tasks
- Edges: expected transitions
- Branches: success, missing data, missing permission, wrong entry point, and abandonment
- Badges: Playground, Trial, Production, Official, Community, Custom
- Evidence drawer: screenshots, timestamps, URLs, query text, permission requirements, and confidence
- Replay mode: compare baseline and post-intervention journeys

Recommended top-level stages:

`Discover → Trial → Orient → Ingest → Verify → Investigate → Adopt → Automate → Extend`

## Event model

Use stable, role-neutral events. An event should describe what happened, not what we hoped would happen.

```json
{
  "event": "journey.task.completed",
  "auditCycle": "2026-07",
  "tenantMode": "trial",
  "persona": "new-learner",
  "stage": "verify",
  "taskId": "verify-first-service",
  "surface": "services",
  "result": "success",
  "durationSeconds": 184,
  "evidenceType": "service-visible",
  "helpUsed": ["official-docs"],
  "permissionIssue": false,
  "confidence": 3,
  "sourceRefs": ["recording-004", "screenshot-018"],
  "notes": "User found the service but did not understand why topology was incomplete."
}
```

### Core event vocabulary

- `journey.session.started`
- `journey.stage.entered`
- `journey.task.started`
- `journey.task.completed`
- `journey.task.blocked`
- `journey.task.abandoned`
- `journey.help.opened`
- `journey.permission.denied`
- `journey.data.empty`
- `journey.evidence.confirmed`
- `journey.intervention.applied`
- `journey.confidence.recorded`
- `journey.next-action.selected`

## Tools to use

### Browser control and evidence capture

Use browser automation for deterministic replay, URL capture, DOM inspection, screenshots, viewport checks, and repeated task timing. Use a human participant for emotional response and comprehension; automation cannot replace that observation.

### Screen recording

Use a local screen recorder for participant sessions, with consent and tenant-data handling rules. Store recordings outside the application repository and link them by evidence ID. Do not put customer telemetry or personal data into source control.

### Dynatrace Playground

Use Playground for safe, repeatable sample-data tasks and product discovery. Treat it as a separate environment mode, not a proxy for trial onboarding or production permissions.

### Trial tenant

Use one clean tenant for the baseline and a resettable test tenant for repeat runs. Capture exact timestamps and configuration state because ingestion, app availability, permissions, and feature rollout can change.

### Documentation corpus

Maintain a source register for official docs, University paths, Hub listings, app release notes, and CSM-created assets. Record retrieval date and environment applicability.

### Intel Ops

Use Intel Ops for task scripts, participant progress, evidence IDs, intervention variants, and replay results. Keep customer-tenant evidence separate from learner progress data.

### Claude Design

Use Claude Design to translate the frozen topology and event model into the visual journey map and interaction prototype. Do not let the visual prototype invent journey stages, scores, or capabilities that have not been validated.

## Customer.io-inspired interaction model

The prototype should support:

- Stage filters
- Persona filters
- Baseline/intervention comparison
- Expandable task nodes
- Branch visibility for blocked or abandoned tasks
- “What the user saw” evidence drawer
- “What the CSM can do” intervention drawer
- “What the platform can prove” evidence drawer
- Six-month audit cycle selector
- Change history for each task

The prototype should not initially include:

- Automated customer messaging
- Predictive churn scores
- Unverified health scores
- Cross-tenant customer data aggregation
- Autonomous tenant changes

## Metrics

Primary:

- Time to first useful evidence
- Task completion rate
- Abandonment rate
- Permission-related blockage rate
- Help-seeking frequency
- Confidence after task
- Number of CSM interventions required
- Repeat-task success rate

Secondary:

- Documentation mismatch rate
- Empty-state recovery rate
- App/Hub discoverability
- Launchpad usefulness
- Assist usefulness
- CLI/MCP/SDK setup completion
- Evidence quality of the final customer brief

## Launch checklist

- [ ] Create clean trial tenant
- [ ] Define tenant mode and retention policy
- [ ] Freeze persona scripts
- [ ] Freeze stage and task IDs
- [ ] Set up recording and consent process
- [ ] Create evidence ID convention
- [ ] Capture initial official documentation snapshot
- [ ] Run new-user baseline
- [ ] Run CSM baseline
- [ ] Run administrator permission baseline
- [ ] Run developer/agentic baseline
- [ ] Build first Claude Design topology
- [ ] Review findings with CSM and product stakeholders
- [ ] Select one intervention per high-severity friction
- [ ] Re-run and compare
- [ ] Publish the audit cycle

## First 10-day plan

### Days 1–2

Create the trial account, capture the baseline environment, and freeze the scripts.

### Days 3–4

Run the clean new-user journey and document every blocker, detour, and evidence checkpoint.

### Days 5–6

Run the CSM and platform-administrator journeys, focusing on permissions, Hub, Launchpads, apps, and adoption signals.

### Days 7–8

Run the developer/agentic journey through Assist, MCP, CLI, SDK/API, and OTel guidance.

### Days 9–10

Produce the first topology, select the three highest-value interventions, and prepare the Intel Ops prototype backlog.

## Important limitation

I can prepare the protocol, scripts, event model, topology, documentation register, and local prototype. A new trial signup, consented user session, and any account action requiring your identity still requires you to complete the human authentication step in the browser. Once the tenant is open, the rest of the evidence-capture workflow can be run systematically.

## Cloud Design journey dataset

Time is a first-class dimension. Every event receives an immutable event ID and timestamp in UTC, plus a rendered America/New_York timestamp. Do not infer signup time from an email timestamp; record it as `observed_after` unless the product or browser provides an exact creation event.

### Required event fields

```json
{
  "event_id": "DD-EMAIL-001",
  "vendor": "datadog",
  "journey_id": "2026-07-18-parallel-trials",
  "stage": "welcome_email",
  "channel": "email",
  "occurred_at_utc": "2026-07-19T01:11:33Z",
  "occurred_at_local": "2026-07-18T21:11:33-04:00",
  "time_basis": "mail_received",
  "source": "gmail_message_id:19f77edb28f027d7",
  "user_action": "opened_or_received_email",
  "system_response": "welcome email with Agent setup path",
  "cta": "Install the Datadog Agent",
  "outcome": "observed",
  "confidence": "high",
  "notes": "Do not treat this as exact account-creation time."
}
```

### Initial parallel-trial timeline

All local times use America/New_York. UTC remains the audit source of truth.

| Sequence | Vendor | Local time | Event | Time basis | Evidence |
|---|---|---:|---|---|---|
| 1 | Datadog | 2026-07-18 20:48:54 | Verification email received | Mail received | Gmail `19f77d8f4a8b8e2f` |
| 2 | Dynatrace | 2026-07-18 20:49:43 | Welcome email received | Mail received | Gmail `19f77d9b352566f3` |
| 3 | Datadog | 2026-07-18 21:11:33 | Welcome email received | Mail received | Gmail `19f77edb28f027d7` |
| 4 | Dynatrace | observed after signup | Environment-ready page and Launch Dynatrace CTA | Browser observation; exact time pending | Browser session |
| 5 | Dynatrace | observed after launch | Getting started launchpad opened | Browser observation; exact time pending | Browser session |
| 6 | Datadog | observed after login | Quick Start opened with Install Your First Agent CTA | Browser observation; exact time pending | Browser session |
| 7 | Datadog | observed after login | Bits asked the matched onboarding question | Browser interaction; exact time pending | Browser session |
| 8 | Dynatrace | observed after launch | Assist asked the matched onboarding question | Browser interaction; exact time pending | Browser session |

### Visual-map requirements for Claude Design

Render a horizontal time spine with parallel Datadog and Dynatrace lanes. Each event node should show vendor, stage, local time, time since prior event, channel, CTA, and evidence confidence. Use solid connectors for observed events, dashed connectors for inferred transitions, and a distinct marker for missing or not-yet-observed events. Clicking a node should open the full evidence record, email or screenshot reference, user action, system response, friction classification, and proposed opportunity.

The first view should support three lenses: `timeline` for sequence and elapsed time, `experience` for screen/email/CTA comparison, and `evidence` for audit defensibility. Keep source and displayed timestamps together so Cloud Design can distinguish what happened from when it was noticed.

## Enablement ecosystem audit

The journey audit must treat help beyond the product as part of the experience. For each vendor, capture the route from a blocked task to documentation, contextual help, AI assistance, community, human support, and structured learning. Record whether the resource is discoverable from the current screen, whether it preserves context, whether it requires a separate account, and whether it returns the user to the task.

### Current official baseline

| Capability | Dynatrace | Datadog | Audit question |
|---|---|---|---|
| Product documentation | Dynatrace Docs has a short get-started path: trial, OneAgent or OTel, verify Services/Smartscape, dashboards, notifications, and Playground. | Datadog Docs has Getting Started, Agent setup, product guides, and in-product help. | Does the first guide match the user's role and selected setup path? |
| Community | Dynatrace Community is positioned for questions, feedback, and peer/expert discussion. | Datadog Community is positioned as a user network and links to a Slack channel from the learning hub. | Can a new user find a relevant answer without exposing sensitive tenant data? |
| LMS/training | Dynatrace University provides on-demand learning, live training, and certifications. | Datadog Learning Center provides hands-on paths, including Core Skills, Configuration, Backend Engineer, and certification paths. | Is training connected to the in-product task, and does progress persist? |
| Support | Dynatrace Standard Support includes business-hours in-product assistance and support tickets; Enterprise adds 24/7/365 access, priority handling, ongoing guidance, and success planning. | Datadog documents support tickets and live technical chat; chat hours and routing should be captured during the trial. | Can the user escalate without losing context, and is the support entitlement clear? |
| Context continuity | Dynatrace links from the launchpad and Assist to docs, University, Playground, and platform resources, but the path can branch quickly. | Datadog links from Quick Start/Bits to current setup pages and can request OS/services for more exact guidance. | Does the link preserve tenant, product, role, and current task context? |
| Account friction | Dynatrace University and Community are separate surfaces to verify during the audit. | Datadog Learning Center explicitly uses a separate account from the main Datadog account. | Is the account boundary disclosed before the user reaches the resource? |

### Required support/documentation test script

Run this script for each vendor and record time, clicks, context loss, and result: `find setup docs from empty state`; `find an answer to an Agent/OneAgent failure`; `find a role-specific learning path`; `ask the community a non-sensitive question`; `open live support or create a ticket`; `return to the original setup task`; `verify whether the resource links to the exact current product version`.
