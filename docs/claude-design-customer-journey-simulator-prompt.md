# Claude Design Prompt: Intel Ops Customer Journey Simulator

Design the next Intel Ops module: **Walk in the Customer’s Shoes**.

This is an interactive learning exercise for CSMs and enablement users. It teaches them to understand the complete customer lifecycle by making decisions at realistic customer touchpoints. It is not the raw lifecycle audit and it is not the portfolio-management workspace.

## Existing Intel Ops context

Intel Ops is an existing Dynatrace AppEngine training app currently shaped as Mission Control:

- scenario-based missions
- mission briefings
- ordered checkpoints
- hints and scoring
- XP and progression
- discipline and topic tracks
- circuits and learning paths
- onboarding wizard
- progress, history, achievements, and leaderboard
- Playground-first learning
- React 18 and TypeScript
- Dynatrace AppEngine
- Strato Design System
- `dt-app` tooling
- Document Service persistence

The simulator should extend this mission/checkpoint model. Do not create a disconnected standalone LMS or a generic dashboard.

Read the existing repository context first:

```text
C:\temp\DTapp\projects\intel-ops\README.md
C:\temp\DTapp\projects\intel-ops\IMPLEMENTATION_PLAN.md
C:\temp\DTapp\projects\intel-ops\ui\app
```

Read the customer-lifecycle evidence and screenshots here:

```text
C:\temp\DTapp\projects\intel-ops\docs\project-1-end-user-lifecycle-audit.md
C:\temp\DTapp\projects\intel-ops\docs\screenshots\2026-07-18
```

Screenshot directory:

```text
C:\temp\DTapp\projects\intel-ops\docs\screenshots\2026-07-18\
├── 01-dynatrace-getting-started.png
├── 02-datadog-help-center.png
├── 03-dynatrace-support-menu.png
├── 04-dynatrace-university-catalog.png
├── 05-dynatrace-university-essentials.png
└── README.md
```

## Product goal

Help a CSM practice the customer’s experience from trial or POC entry through first value and adoption.

The learner should be required to:

- identify the customer’s current lifecycle stage
- understand the customer’s role and technical context
- infer what the customer knows and does not know
- choose the next best CSM action
- distinguish product guidance from escalation
- avoid unsupported claims
- recognize friction and adoption risk
- understand the business consequence of a poor handoff

## Core exercise

### Scenario

The learner is assigned a customer who has started an observability trial. The customer may be a developer, SRE, platform engineer, security practitioner, manager, or executive sponsor.

### Journey loop

```text
Customer touchpoint
  -> evidence appears
  -> learner interprets customer state
  -> learner chooses an action
  -> outcome and consequence are revealed
  -> next touchpoint begins
```

### Example touchpoints

1. Trial signup form asks for region, cloud provider, role, and company information.
2. Customer receives or does not receive the expected email.
3. Tenant is provisioning.
4. Customer reaches the first landing page with no data.
5. Customer sees a broad launchpad or a direct setup action.
6. Customer asks an AI assistant what to do first.
7. Customer attempts Agent, OpenTelemetry, cloud, or integration setup.
8. Customer cannot verify whether telemetry arrived.
9. Customer searches documentation or learning.
10. Customer reaches support and encounters a successful or broken handoff.
11. Customer needs to transition from POC to production.

Use the captured Dynatrace and Datadog screenshots as actual evidence states, not decorative backgrounds.

## Exercise structure

### Mission briefing

Show:

- customer role
- customer company context
- lifecycle stage
- customer goal
- what the customer has already done
- what evidence is available
- time pressure or risk

### Checkpoint types

- **Recognize:** identify the current customer stage.
- **Interpret:** choose what the customer is likely experiencing.
- **Prioritize:** select the next best action.
- **Guide:** choose accurate customer-facing language.
- **Escalate:** decide whether to involve support, a technical specialist, or product.
- **Verify:** identify what proves the customer succeeded.
- **Reflect:** explain the adoption or business consequence.

### Feedback

Feedback must explain:

- why the selected answer was strong or weak
- what evidence supported the answer
- what the customer would likely experience next
- what risk the choice creates
- what a better CSM response would be

Do not use arbitrary gamification. XP should reward customer understanding, evidence use, safe guidance, and business reasoning.

## Initial content set

Create the first three missions:

### Mission 1: The First Login

Compare the first Dynatrace and Datadog trial landing experiences. Teach first-value clarity, empty-state interpretation, trial context, and next-action design.

### Mission 2: The Missing Signal

The customer installed or configured something but cannot see data. Teach verification, expected wait time, recovery, documentation lookup, and when to escalate.

### Mission 3: The Broken Handoff

The customer follows a support or learning route and encounters a confusing redirect or failed identity handoff. Teach empathy, accurate communication, workaround design, and ownership.

## Proposed routes

Add the simulator as a new learning area that fits the existing Intel Ops shell. Recommended conceptual routes:

```text
/journeys
/journeys/:id
/journeys/:id/checkpoint/:checkpointId
/journeys/:id/debrief
```

Use the repository’s existing routing and mission patterns where they already solve the problem. Do not duplicate mission state logic without a clear reason.

## Required screens

1. Journey library
2. Mission briefing
3. Customer context panel
4. Evidence touchpoint screen
5. Decision checkpoint
6. Feedback and consequence state
7. Journey progress timeline
8. Debrief with strengths, risks, and learning recommendations
9. Comparison mode for Dynatrace versus Datadog

## Strato and Dynatrace implementation guidance

Use the current Dynatrace Developer and Strato guidance:

- Design system overview: https://developer.dynatrace.com/design/
- AppEngine platform guidance: https://developer.dynatrace.com/develop/platform-services/services/app-engine/
- AppRoot: https://developer.dynatrace.com/design/components/core/components/AppRoot/
- Strato components: https://developer.dynatrace.com/design/components/
- Data visualization guidance: https://developer.dynatrace.com/quickstart/tutorial/improve-visualizations/
- App performance/lazy loading: https://developer.dynatrace.com/develop/guides/code-optimization/lazy-loading/

Follow these rules:

- Use Strato components and tokens instead of custom lookalike controls.
- Respect the existing AppRoot/theme/localization behavior.
- Use proper loading, empty, error, and disabled states.
- Keep repeated mission items as sibling surfaces, not nested cards.
- Use tabs, drawers, timelines, and progressive disclosure to prevent giant horizontal tables.
- Lazy-load secondary journey detail, evidence drawers, and debrief modules when appropriate.
- Keep evidence screenshots readable and allow full-size inspection.
- Avoid custom SVG UI controls when Strato icons/components provide the pattern.
- Preserve keyboard navigation and accessible labels.
- Keep state local until persistence is genuinely needed; use Document Service for durable progress and scoring.
- Use app functions only when a server-side or platform API operation is required.
- Do not expose secrets or customer data in the exercise.

## Data model direction

```ts
type JourneyMission = {
  id: string;
  title: string;
  vendor: 'dynatrace' | 'datadog' | 'comparison';
  persona: string;
  lifecycleStage: string;
  briefing: string;
  touchpoints: JourneyTouchpoint[];
};

type JourneyTouchpoint = {
  id: string;
  stage: string;
  evidenceImage?: string;
  visibleState: string;
  customerGoal: string;
  customerContext: string;
  choices: JourneyChoice[];
  expectedOutcome: string;
  businessConsequence: string;
};

type JourneyChoice = {
  id: string;
  label: string;
  isBestPractice: boolean;
  feedback: string;
  risk: string;
  xp: number;
};
```

Align the final model with existing Intel Ops types and persistence patterns before adding new abstractions.

## Design review questions

- Does the learner understand the customer before choosing an action?
- Is each choice grounded in visible evidence?
- Does the feedback teach judgment rather than merely mark answers right or wrong?
- Can the learner compare vendors without turning the exercise into marketing?
- Is the distinction between customer action and CSM action obvious?
- Does the experience reveal lifecycle risk and business consequence?
- Can the same structure support trial, POC, and production scenarios?
- Does the UI feel native to Dynatrace and existing Intel Ops?
- Are all important states represented: loading, missing email, provisioning, no data, support failure, recovery, completion, and replay?

## Output requested from Claude Design

Return:

1. information architecture
2. route and component map
3. first three mission flows
4. desktop and mobile layouts
5. Strato component mapping
6. evidence screenshot placement strategy
7. state and transition model
8. scoring and feedback model
9. accessibility and loading/error states
10. implementation notes tied to the existing Intel Ops repository

Build the concept around the existing Mission Control foundation and the evidence in the specified Windows directory.
