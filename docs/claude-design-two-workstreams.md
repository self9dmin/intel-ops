# Claude Design Brief: Two Separate Workstreams

The design work must be split into two independent work motions. They may share evidence and visual language, but they must not share a navigation model, success metric, or primary user.

## Workstream 1: Customer Lifecycle Journey Audit

### Primary user

The audit team, product/design leaders, onboarding owners, support leaders, and anyone responsible for understanding the customer's experience from first contact through adoption and renewal.

### Purpose

Reconstruct the customer's complete journey as an end user. This is a research and service-design product, not a CSM task-management dashboard.

### Required swim lanes

The lifecycle map must contain three parallel areas:

#### Lane A: Customer touchpoints

- trial or POC creation
- confirmation and provisioning emails
- account verification
- login and identity choice
- tenant/environment readiness
- first product landing page
- first guidance or assistant interaction
- first telemetry connection
- first visible signal
- first investigation
- documentation and learning discovery
- support request or escalation
- stakeholder handoff
- purchase or production transition
- expansion and adoption
- renewal and re-audit

Capture every visible page, email, CTA, redirect, waiting state, error, form, and handoff.

#### Lane B: Customer experience interpretation

For every touchpoint record:

- customer goal
- role and technical context
- what the customer likely understands
- what is ambiguous
- emotional/friction signal
- time required
- information requested
- information returned
- next-action clarity
- continuity from the previous touchpoint
- whether the customer knows they succeeded

This lane answers: “What did this experience feel like and what did it enable?”

#### Lane C: Business and operating outcome

For every touchpoint record:

- lifecycle stage
- owner
- system or team involved
- activation event
- adoption signal
- risk created
- support burden
- commercial implication
- evidence strength
- recommended improvement

This lane answers: “What did this moment mean for adoption, retention, cost, and operational ownership?”

### Required views

- full lifecycle swim lane
- role-specific journey: developer, platform engineer, SRE, security, manager, executive
- trial versus POC versus purchased-customer journey
- happy path versus friction path
- touchpoint evidence drawer
- six-month audit comparison
- severity and opportunity overlay
- email-to-product continuity view
- support/documentation/learning handoff map

### Success criteria

The team can identify exactly where a customer is, what they saw, what they were trying to do, what broke, who owns the next step, and what evidence supports the conclusion.

### Design constraints

- Do not make this a CSM task list.
- Do not collapse multiple customer touchpoints into one generic onboarding card.
- Do not show only product UI; include email, identity, support, documentation, learning, sales/POC, and transition events.
- Every visual node must support timestamp, screenshot, URL, role, outcome, and confidence.

## Workstream 2: CSM Enablement and Customer Management Workspace

### Primary user

CSMs, technical CSMs, enablement leaders, managers, and internal teams helping many customers use Dynatrace and adopt agentic development practices.

### Purpose

Help CSMs manage customer portfolios, guide next actions, learn the platform, and translate technical capabilities into customer value.

### Core workspace areas

- portfolio health and attention queue
- tenant readiness and missing-data checklist
- customer plan and milestones
- onboarding/playbook execution
- learning-path assignment and completion
- CLI, SDK, API, MCP, Assist, and app-building enablement
- customer-facing guidance generator
- support and escalation tracking
- adoption and outcome tracking
- Lens 1 platform-use enablement
- Lens 2 agent-observability enablement
- audit history and six-month re-audit preparation

### CSM-specific questions

- Which customers need attention today?
- What is missing in the tenant?
- What should the CSM do next?
- What should the customer do next?
- Which role-specific learning path applies?
- Is the recommendation supported by evidence?
- What can be automated safely?
- What needs a technical specialist or support escalation?

### Required views

- multi-tenant portfolio dashboard
- tenant detail workspace
- customer plan timeline
- enablement checklist
- learning and certification tracker
- platform-tool readiness matrix
- customer-facing value narrative
- escalation and follow-up queue
- vendor comparison and competitive enablement
- Lens 1 and Lens 2 training labs

### Success criteria

A CSM can manage many customers consistently, see the next best action, understand why it matters, guide the customer without overclaiming, and demonstrate measurable adoption and business value.

### Design constraints

- This is not the raw customer journey research map.
- It must optimize for repeated work across many tenants.
- It must distinguish customer action from CSM action.
- It must expose evidence, ownership, due dates, and follow-up state.
- It must avoid turning every platform capability into a checklist item without a customer outcome.

## Shared evidence, separate products

Both workstreams can reference the same:

- live screenshots
- email captures
- support and LMS observations
- tenant telemetry
- documentation links
- audit findings
- feature entitlement notes

However:

- Workstream 1 is a **customer experience reconstruction and service-design artifact**.
- Workstream 2 is a **CSM operating system and enablement workspace**.

Claude Design should generate separate information architectures, separate navigation trees, separate user flows, and separate design reviews. Only after both are complete should a shared evidence repository or cross-linking layer be designed.
