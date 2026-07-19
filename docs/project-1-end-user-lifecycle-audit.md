# Project 1: End-User Lifecycle Journey Audit

## Scope

This project reconstructs the complete end-user experience from the moment a person starts a Dynatrace or Datadog trial, or enters a comparable POC motion, through the point where they reach first value and transition toward an adopted production relationship.

This project does **not** design the CSM workspace, CSM enablement, training operations, portfolio management, or internal customer-management tooling. Those belong to a separate project.

## Primary question

What does the customer actually experience, touchpoint by touchpoint, and where does each vendor help or hinder progress from intent to verified value?

## Comparison frame

The first controlled comparison is Dynatrace versus Datadog. The same lifecycle stages, roles, evidence fields, and scoring rules must be used for both.

The audit must compare observed experience rather than vendor claims:

- what the customer sees
- what the customer is asked to provide
- what the system does next
- how long the customer waits
- what arrives by email
- what appears in-product
- whether the next action is clear
- whether the customer can verify success
- what happens when the path breaks

## Lifecycle stages

### Stage 0: Intent and entry

- landing page
- trial or POC CTA
- value proposition clarity
- required information
- identity/account choice
- region and data residency choice
- cloud/provider selection
- role and company questions
- password and verification requirements
- consent and communication choices

### Stage 1: Account creation and provisioning

- form progression
- validation errors
- email verification
- provisioning wait
- confirmation email
- environment-ready message
- tenant URL
- region visibility
- account/tenant identity
- handoff from browser to email and back

### Stage 2: First access

- login and SSO behavior
- account confusion or identity collision
- first landing page
- trial countdown
- environment status
- first assistant or AI affordance
- first support affordance
- first-run checklist or launchpad
- whether the user understands what is ready

### Stage 3: First useful action

- recommended first task
- setup instructions
- data-source selection
- agent or collector installation
- OpenTelemetry path
- cloud integration path
- demo-data or playground path
- exact commands and copyability
- expected time to first signal
- progress feedback
- recovery if the user leaves the setup flow

### Stage 4: First verified signal

- signal arrival
- infrastructure, service, frontend, log, metric, and trace visibility
- data freshness
- source attribution
- contextual explanation
- first dashboard or explorer
- ability to prove that setup worked
- next recommended action

### Stage 5: Investigation and learning

- problem or incident discovery
- assistant guidance
- query creation
- documentation lookup
- community discovery
- University or Learning Center experience
- support route
- course enrollment
- learning-account continuity
- transition back to the tenant

### Stage 6: Support and recovery

- support discoverability
- support entitlement visibility
- ticket or chat creation
- authentication and SSO handoff
- error states
- contact path
- status page
- escalation expectations
- recovery from failed setup or failed login

### Stage 7: POC and production transition

- stakeholder handoff
- role expansion
- permissions and team invitation
- additional data sources
- dashboards and workflows
- security and governance
- documentation and training handoff
- commercial/purchase transition
- continuity of tenant, data, identity, and learning progress

### Stage 8: Adoption, expansion, and renewal

- recurring usage
- coverage expansion
- role-based adoption
- support patterns
- learning progression
- business-value proof
- renewal readiness
- reactivation after inactivity
- six-month lifecycle re-audit

## Evidence model

Every touchpoint receives a record with:

- lifecycle stage
- vendor
- journey type: trial, POC, purchased customer
- user role
- timestamp with timezone
- URL or email subject
- screenshot path
- exact visible text and CTA
- information requested
- information received
- user intent
- expected outcome
- observed outcome
- wait time
- success signal
- failure or ambiguity
- support/documentation/LMS handoff
- business consequence
- severity
- confidence

## Screenshots already captured

The current evidence set is stored in [the screenshot evidence folder](screenshots/2026-07-18/):

- Dynatrace getting-started launchpad
- Datadog Help Center and Bits
- Dynatrace in-product support menu
- Dynatrace University catalog
- Dynatrace Essentials course detail

The Dynatrace support handoff also produced a documented SSO/JIT `Invalid Page` failure in the live trial journey. It remains an observed trial-session failure, not a generalized statement about all Dynatrace support.

## Current observed comparison

### Datadog

- More direct first-session path toward installing the Agent.
- Bits was immediately visible and gave a concrete empty-state plan with approximate timing and current-UI links.
- Help Center preserved trial context while exposing support, documentation, community, tickets, learning, release notes, status, and chat.
- The customer could move from “no data” toward an operational next action without leaving the product navigation model.

### Dynatrace

- Trial provisioning completed and the launch CTA was clear on the confirmation state.
- The getting-started launchpad exposed broad choices: OneAgent, OpenTelemetry, cloud integrations, guided start, demo data, and many platform apps.
- Assist provided useful but more generalized guidance and did not consistently converge on one current-tenant next action in the empty state.
- The support menu exposed a broad resource ecosystem.
- University offered substantial catalog and course detail.
- The authenticated Help & Support handoff reproduced an SSO/JIT failure and did not produce a usable support interaction in the tested session.

## Scoring dimensions

Score each stage from 0 to 5, with evidence:

- entry clarity
- information burden
- provisioning transparency
- identity continuity
- first-action clarity
- time to first useful signal
- setup recoverability
- assistant usefulness
- documentation usability
- support discoverability
- learning continuity
- cross-surface continuity
- role relevance
- success verification
- production-transition continuity

Do not produce a single overall vendor score until every stage has comparable evidence. Report stage scores, evidence confidence, and observed breakpoints separately.

## Required visual outputs for Claude Design

1. Full lifecycle swim lane for Dynatrace.
2. Full lifecycle swim lane for Datadog.
3. Direct comparison swim lane using identical stages.
4. Trial versus POC journey variant.
5. Happy path versus break path.
6. Email-to-product continuity map.
7. Support/documentation/LMS handoff map.
8. First-value funnel with measured wait times.
9. Evidence drawer for every high-severity breakpoint.
10. Six-month re-audit comparison view.

## Next execution sequence

1. Complete the existing trial journey log from account creation through first verified signal for both vendors.
2. Capture the missing Datadog email sequence and Dynatrace email sequence with timestamps.
3. Repeat the support, documentation, community, and LMS paths as an ordinary user and capture each handoff.
4. Run an identical telemetry setup and first-investigation task in both tenants.
5. Run the same trial and POC scenarios with role-specific notes.
6. Build the two independent swim lanes.
7. Review findings with product, UX, support, and onboarding stakeholders.
8. Convert only verified breakpoints into design opportunities.

## Definition of done

Project 1 is complete only when a reviewer can replay both journeys from the evidence packet, understand every important customer touchpoint, see exactly where the journeys diverge, distinguish observed fact from interpretation, and identify the highest-impact improvements without needing the CSM enablement project.
