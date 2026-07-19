# Claude Design Prompt: Project 1 End-User Lifecycle Journey Audit

You are designing **Project 1 only: the complete end-user lifecycle journey audit** for an observability-platform comparison.

Do not design the CSM enablement workspace, CSM portfolio dashboard, internal learning tracker, or customer-management operating system. Those belong to a separate future project.

## Evidence directory

You must inspect the full screenshot set from this Windows directory:

`C:\temp\DTapp\projects\intel-ops\docs\screenshots\2026-07-18`

The directory contains:

```text
C:\temp\DTapp\projects\intel-ops\docs\screenshots\2026-07-18\
├── 01-dynatrace-getting-started.png
├── 02-datadog-help-center.png
├── 03-dynatrace-support-menu.png
├── 04-dynatrace-university-catalog.png
├── 05-dynatrace-university-essentials.png
└── README.md
```

Read the supporting audit brief here:

`C:\temp\DTapp\projects\intel-ops\docs\project-1-end-user-lifecycle-audit.md`

Use the evidence directory as the source for visual states. Do not invent screens, copy, or outcomes that are not supported by the screenshots or audit notes.

## Design objective

Reconstruct the complete experience of a customer from the moment they begin a Dynatrace or Datadog trial or POC through first value, production transition, adoption, expansion, renewal, and six-month re-audit.

The central question is:

> What does the customer experience at every touchpoint, where does the journey help or break, and what does each moment mean for adoption and business outcome?

## Compare these vendors

- Dynatrace
- Datadog

Use the same lifecycle stages, evidence fields, and visual structure for both vendors. Distinguish observed evidence from interpretation and recommendation.

## Required three swim lanes

### Swim lane 1: Customer touchpoints

Map every relevant customer-facing moment:

- trial or POC CTA
- signup form
- information requested
- identity and verification
- provisioning and waiting
- confirmation email
- tenant/environment handoff
- first login
- first landing page
- trial countdown
- assistant or AI affordance
- first setup recommendation
- agent, OpenTelemetry, cloud, or integration setup
- first telemetry signal
- first dashboard or investigation
- documentation discovery
- community discovery
- University or Learning Center discovery
- support request
- chat or ticket handoff
- error and recovery state
- POC-to-production transition
- team onboarding
- adoption and expansion
- renewal and six-month re-audit

### Swim lane 2: Customer experience interpretation

For every touchpoint show:

- customer goal
- customer role
- what the customer knows
- what the customer does not know
- information burden
- emotional/friction signal
- clarity of next action
- expected wait time
- continuity from previous touchpoint
- whether success is visible
- whether the user can recover if they leave or fail

### Swim lane 3: Business and operating outcome

For every touchpoint show:

- lifecycle stage
- owner
- system or team involved
- activation signal
- adoption implication
- support burden
- commercial implication
- risk created
- severity
- evidence confidence
- recommended improvement

## Required lifecycle stages

1. Intent and entry
2. Account creation and provisioning
3. First access
4. First useful action
5. First verified signal
6. Investigation and learning
7. Support and recovery
8. POC and production transition
9. Adoption, expansion, and renewal

## Required screens and artifacts

Create these as separate views, not one overloaded dashboard:

1. Dynatrace full lifecycle swim lane
2. Datadog full lifecycle swim lane
3. Direct comparison swim lane with identical stages
4. Trial versus POC journey variant
5. Happy path versus break path
6. Email-to-product continuity map
7. Support, documentation, community, and LMS handoff map
8. First-value funnel with wait times
9. Evidence drawer for each major breakpoint
10. Six-month re-audit comparison view

## Known evidence to represent accurately

Datadog showed a more direct first-session path toward Agent installation. Bits was visible in the tenant and gave a concrete empty-state plan with approximate timing and current-UI links. Datadog Help exposed support, documentation, community, tickets, learning, release notes, status, and chat while preserving trial context.

Dynatrace successfully provisioned the environment and showed a broad getting-started launchpad with OneAgent, OpenTelemetry, cloud integrations, guided start, demo data, and many platform apps. Dynatrace Assist gave broader, more generalized guidance in the empty state. Dynatrace exposed a substantial University catalog and course detail. The tested authenticated Help & Support handoff reproduced an SSO/JIT `Invalid Page` failure. Represent this as an observed trial-session break, not as a universal claim that Dynatrace support always fails.

## Evidence interaction requirements

Every journey node must support an evidence drawer containing:

- screenshot
- timestamp and timezone
- URL or email subject
- visible CTA
- user role
- expected outcome
- observed outcome
- wait time
- failure or ambiguity
- confidence level
- business consequence

Use a visible distinction between:

- observed fact
- interpretation
- recommendation
- unknown or untested

## UX requirements

- Make the full journey readable without forcing a massive horizontal table.
- Use tabs, zoomable timeline sections, expandable touchpoints, and evidence drawers.
- Preserve side-by-side comparison without making text microscopic.
- Make breakpoints visually distinct from normal steps.
- Show email, product, support, documentation, learning, and identity surfaces as connected touchpoints.
- Make wait states and handoffs first-class visual elements.
- Design for reviewers who are not observability experts.
- Explain why each difference matters to customer adoption.
- Avoid marketing language and unsupported superiority claims.

## Deliverables

Return:

1. Information architecture
2. Navigation model for this project only
3. Full Dynatrace journey
4. Full Datadog journey
5. Direct comparison journey
6. High-friction breakpoint inventory
7. Evidence-driven design opportunities
8. Mobile and desktop behavior
9. Empty, loading, error, and incomplete-evidence states
10. A short critique identifying what the design still cannot prove

The final design must make it possible to replay the customer journey from the evidence, understand where the two vendors diverge, and identify the highest-impact lifecycle improvements without relying on the separate CSM enablement project.
