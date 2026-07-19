# Audit Cycle 2026-07: Early Observations

Status: preliminary, before first-data completion

## Accounts

| Vendor | Account state | Evidence |
|---|---|---|
| Dynatrace | Trial account created; welcome email received | Gmail message from `noreply@dynatrace.com`, July 19, 2026 UTC |
| Datadog | Signup flow reached verification and guided setup | Gmail verification message and screenshots |

## Initial comparison

### Datadog

Observed signup and onboarding behavior:

- The trial form asks for region, password, first and last name, then job title and company.
- The initial product experience asks what the user wants to monitor first.
- The choices include infrastructure/backend applications, frontend applications, logs from any source, and LLM-based applications.
- Selecting infrastructure/backend applications leads directly to an explicit Agent path.
- The next screen asks how the user wants to monitor the infrastructure/backend systems.
- The primary CTA is “Install the Datadog Agent.”
- The setup screen offers container platforms, host-based systems, configuration management, cloud platforms, and OpenTelemetry.
- The screen explains what the Agent does before asking the user to install it.
- The setup state visibly waits for the Agent to connect and keeps the completion action disabled until evidence arrives.

Preliminary interpretation: Datadog is using signup intent to narrow the first task and make the CTA operational. This is an observed strength in first-run findability and task direction. It is not yet evidence of lower total time to value.

### Datadog post-login state

The first visible product state now shows:

- “Let's start monitoring your stack” as the primary framing.
- Journey tabs for Infrastructure, Services, Frontend, and Integrations.
- An explicit “No Infrastructure Detected” state with “Install Your First Agent” as the dominant CTA.
- A host-live success state after Agent connection, with immediately visible infrastructure metrics.
- Bits Chat visible as a persistent right-side surface with documentation, incident-summary, and action prompts.
- A user-comprehensible success message: “Your first host is live.”

Preliminary interpretation: Datadog closes the loop from setup to evidence in the same surface. The user can see both what is missing and what success looks like, while the Agent CTA remains available. The embedded Bits Chat is discoverable at the point where the user is beginning to operate the platform rather than being hidden in a secondary app catalog.

## Live browser audit: first interaction pass

### Datadog quick-start page

Observed directly in the authenticated tenant:

- The page is titled “Hi Daniel, let's start monitoring your stack.”
- The primary state is “No Infrastructure Detected.”
- “Install Your First Agent” is an explicit link and has a stable destination.
- The quick-start page is organized into Infrastructure, Services, Frontend, and Integrations tabs.
- Bits Chat is visible as “Ask Bits” and offers page-aware documentation lookup, incident summarization, and a general action prompt.
- A bounded question was submitted to Bits: “What should I do first to get useful value from this trial?”
- Bits responded that it would check what data is already flowing before giving tailored advice.

### Dynatrace getting-started launchpad

Observed directly in the authenticated tenant:

- The launchpad is titled “Getting started with Dynatrace.”
- The main heading says “Welcome to Dynatrace! Get started with monitoring your environment.”
- The visible starter choices include OneAgent, OpenTelemetry, Amazon Web Services, Microsoft Azure, Google Cloud Platform, and Guided start.
- The same launchpad exposes broad app categories and pinned applications, including Dashboards, Problems, Notebooks, Vulnerabilities, Experience Vitals, Services, Kubernetes, Clouds, Infrastructure & Operations, Logs, and Distributed Tracing.
- Assist is available from the global dock and opens a side panel.
- Assist presents starter prompts for getting started, Dynatrace Intelligence, DQL basics, comparing OpenTelemetry and OneAgent, and building a first app.
- Assist includes an explicit AI verification notice.

Preliminary interpretation: Datadog's quick-start page is more task-convergent: one missing-state, one dominant setup CTA, and a clear success condition. Dynatrace's launchpad is more capability-expansive: it exposes several data-ingestion paths, learning prompts, and a broad platform map. The tradeoff is breadth versus first-task convergence. This is now an observed comparison from authenticated product states, not a screenshot-only inference.

### Dynatrace

Observed email and screen behavior:

- The welcome email is broad rather than persona-specific.
- It leads with downloading and installing OneAgent.
- It links to a Getting Started guide.
- It includes an “Access Your Environment” link.
- It links to Dynatrace University and Support Center.
- The provisioning confirmation screen says “Your environment is ready” and provides a “Launch Dynatrace” CTA.
- After launch, the user lands on “Getting started with Dynatrace,” with cards for OneAgent, OpenTelemetry, AWS, Azure, Google Cloud Platform, Guided start, and a live demo.
- The landing page then exposes a broad app catalog including Dashboards, Problems, Smartscape, Vulnerabilities, Experience Vitals, Services, Kubernetes, Clouds, Infrastructure & Operations, Logs, Distributed Tracing, Notebooks, Workflows, Site Reliability Guardian, Investigations, and Explore Business Events.
- The trial countdown and “Contact us” affordance are prominent, but there is no single dominant “complete your first useful task” action after launch.

Preliminary interpretation: Dynatrace provides a clear provisioning CTA, but the email did not make that handoff salient enough for the user. After launch, the product presents a broad set of valid starting points without narrowing the user to one first outcome. This is an observed weakness in email-to-product continuity and first-task prioritization, not a claim that the environment is unavailable.

## Evidence still required

- Dynatrace Access Your Environment landing state
- Whether the environment is provisioned and usable [confirmed: environment ready]
- Dynatrace first-run prompt after login [captured: Getting started with Dynatrace]
- Dynatrace first-data path and completion evidence
- Datadog verification completion and first-data timing
- Datadog Agent setup state before and after connection
- Datadog Bits Chat behavior and permission boundaries
- Email follow-up sequence from both vendors
- Permission and role defaults
- Recovery behavior when no data is available

## Matched Assist prompt evidence

The exact question `What should I do first to get useful value from this trial?` was submitted to Dynatrace Assist in the authenticated `meg46195` tenant. Assist returned a six-step checklist: deploy OneAgent; connect AWS, Azure, GCP, and Kubernetes where relevant; define key applications/services and RUM; create dashboards and alerting profiles; use Davis AI and Problems; and explore integrations.

Because this is a newly provisioned free-trial tenant, the absence of customer telemetry is expected and should not be scored as a product weakness. The fairer question is whether Assist recognizes the empty-state context and converts it into one safe, concrete first action. In this test, the response remained a general checklist: it did not explicitly say that the tenant was empty, choose a recommended deployment path, name one next click in the current UI, provide a direct setup CTA, or ask for the user's environment before branching into multiple paths. The panel also displayed Dynatrace's explicit AI verification notice: `Dynatrace Intelligence uses AI. Always verify important information and decisions.` This supports a narrower comparison: Assist has broad platform guidance and safety framing, while the observed answer was less empty-state-aware and less task-convergent than the Datadog Bits interaction.

## Matched empty-state guidance test

At `2026-07-19T01:35:55Z` (2026-07-18 21:35:55 America/New_York), the same prompt was submitted to both assistants: `I have no data yet. What is the fastest safe path to see value?`

- Dynatrace Assist recommended three alternatives: use the Dynatrace Playground with sample data; deploy Dynatrace in the user's environment, described as under five minutes; or use Dynatrace University resources. It linked to the Playground/trial path and named courses for navigating the interface, creating a dashboard, and creating a workflow. It did not choose between Playground and OneAgent based on a stated user goal, nor did it give a single current-tenant CTA.
- Datadog Bits recommended a concrete `15-Minute Path to Value`: install the Agent on one host, verify the host in Infrastructure within about 30 seconds, enable logs, then add one integration. It provided current-UI links for Agent Setup, Infrastructure List, Logs Explorer, and Integrations, plus approximate task times and a request for OS/services to generate exact commands.

Interpretation: this is a meaningful onboarding-guidance difference, not proof that Datadog is technically superior. Bits was more task-convergent and operationally specific in this empty-state test; Assist was more resource- and option-oriented. The next controlled test is to follow each recommended first path and measure time to the first verified signal.

## Updated scoring stance

Do not assign vendor rankings yet. The only defensible preliminary statement is:

> Datadog currently shows stronger observed intent-to-first-action guidance. Dynatrace successfully provisions an environment and provides a clear launch CTA on the confirmation screen, but its email handoff and post-launch experience do not yet narrow the user to one first useful outcome. Final scoring still waits until both platforms produce verified telemetry.

## Live support, documentation, community, and LMS audit

This pass followed visible in-product routes as an ordinary authenticated trial user rather than relying on search results.

### Dynatrace support route

- The expanded in-product `Support` menu exposed Documentation, What's new, Community, University, Dynatrace Developer, Dynatrace API, Developer Forum, and Help & Support.
- The Help & Support link carried the current environment URL and account identifier into the support URL and requested chat start.
- Following that link opened the Dynatrace support domain, then redirected through Dynatrace SSO. The authenticated trial session landed on `Invalid Page` with an error URL stating `ApexSAML_ExpSite_JITHandler ... Single sign-on failed` and directing the user to Dynatrace contact support.
- No support chat, ticket form, or contextual help conversation became available in this test. This is a concrete journey failure for the trial user, not evidence that Dynatrace has no support capability.

### Dynatrace University route

- The University link opened a public catalog without requiring sign-in to browse.
- The catalog exposed learning plans and courses with free labels, course counts, durations, content types, and language indicators.
- The observed catalog included Administration, Associate Certification, Implementation, Logs Case Studies, and Implementor's Journey learning plans, plus courses such as Dynatrace Essentials, Introduction to Observability, AIOPS & SRE for Beginners, Power Dashboarding, DQL/Grail, Logs, RUM, Traces, Dynatrace Assist, and a Support Portal course.
- Opening `Dynatrace Essentials` exposed a real syllabus: nine lessons, four hours thirty minutes, lesson-level `Not started` status, and a certificate exam. The course content was browseable without sign-in; progress/account continuity was not established because the sign-in action did not visibly complete in the trial session.
- This is a strong learning-content surface, but the route is a separate platform from the tenant and the audit found no confirmed return-to-task handoff from the course page to the empty trial state.

### Datadog Help and Learning route

- The tenant's visible `Help` route opened a first-party Help Center inside the authenticated Datadog experience.
- The Help surface exposed Support Portal, Quick Start, Documentation, APIs for Developers, a Datadog community Slack link, New Support Ticket, Manage Tickets, Datadog Learning Center, Foundation Enablement Sessions, release notes, status, and the blog.
- The Datadog Learning Center route is a separate learning account from the main Datadog account according to the live support/docs journey and official learning-center guidance; this is a potential account-friction point even though the product makes the entry link easy to discover.
- The same Help surface preserved the trial context, remaining trial days, upgrade CTA, Bits access, and the current empty-state Quick Start page. The user can move from a missing-data state to Agent Setup, docs, support, learning, and tickets without leaving the product navigation model.
- Datadog therefore showed stronger observed support/resource discoverability and context continuity in this pass. That is a UX finding, not a claim about the relative quality of human support response.

### Screenshot/evidence record

The browser actions generated five verified PNG viewport captures in `docs/screenshots/2026-07-18/`:

- `01-dynatrace-getting-started.png` - Dynatrace launchpad and first-run choices.
- `02-datadog-help-center.png` - Datadog Help Center, Bits, support, learning, and resource routing.
- `03-dynatrace-support-menu.png` - Dynatrace support/developer/community resource menu.
- `04-dynatrace-university-catalog.png` - University learning-plan catalog.
- `05-dynatrace-university-essentials.png` - University course detail and enrollment state.

The support handoff error is documented above from the live URL/title/error state, but a sixth PNG was not retained because the browser session wrapper exposed the newly opened tab without a callable tab-claim method in this run. Screenshots are state evidence, not substitutes for the interaction and outcome record above.

### Current score adjustment

For the enablement-ecosystem dimension only, the observed evidence supports:

- Datadog: stronger first-party in-product routing across support, docs, community, LMS, ticketing, status, and release notes; strong continuity with the current tenant.
- Dynatrace: broad and valuable in-product resource map plus a substantial public University catalog; material trial-user friction at the authenticated Support handoff, and weaker evidence of a closed loop back to the current task.

Do not convert this into a total platform score until the controlled telemetry task, support entitlement test, and learning-account sign-in test are complete.

## GenAI, developer tooling, and in-platform building audit

This is a separate dimension from onboarding. A platform can be easy to enter yet weak for developers, or powerful for developers yet difficult for a new user to discover. The audit therefore evaluates four distinct jobs: query and investigate with AI, operate from a CLI/API/SDK, build extensions inside the platform, and move from prototype to governed production delivery.

### Dynatrace: verified capability profile

- **GenAI and agent access:** The official Dynatrace MCP Server documentation, updated July 13, 2026, describes external-agent use through MCP clients such as VS Code/GitHub Copilot or Claude Desktop. Documented tools include DQL generation, DQL explanation, product help, data analysis, problem and vulnerability investigation, Kubernetes event analysis, time-series analysis, documentation search, and entity resolution. Several tools are marked Early Access; Data Analysis Agent is marked Public. Access requires a bearer token or confidential OAuth client plus MCP gateway and data permissions.
- **CLI and developer loop:** Dynatrace documents the Dynatrace app Toolkit and command-line development workflow for creating, building, and deploying custom apps. The July 2026 What's New page also calls out the `dtctl` CLI and AI agent skills. This is meaningful developer evidence, but the audit still needs a hands-on `dtctl`/App Toolkit build to score setup friction, local feedback, permissions, and deployment time.
- **SDK and application runtime:** AppEngine supports React/TypeScript front ends, Strato design components, TypeScript SDKs for platform services, TypeScript app functions as back ends, and a JavaScript runtime. Apps can use platform APIs, intents, third-party systems, and EdgeConnect for on-premises integrations.
- **Data and query substrate:** Grail is a unified observability/security/business-data lakehouse with DQL, topology context, notebooks, dashboards, workflows, APIs, and custom-app access. DQL is schema-on-read and can query heterogeneous data in context. This is materially deeper than a dashboard-only extension layer because the data, topology, query language, automation, and app runtime are designed to compose.
- **Critical qualification:** AppEngine, Grail, AutomationEngine, MCP, and related capabilities are entitlement- and permission-dependent. The existence of the documented capability must not be represented as “included in every free trial.”

### Datadog: verified capability profile

- **GenAI and agent access:** The official Datadog MCP Server documentation describes remote access from MCP clients including Cursor, OpenAI Codex, Claude Code, and custom agents, with access to APM, logs, metrics, monitors, dashboards, security signals, and more. Datadog separately documents a narrower local Code Security MCP Server. The audit should test read-only versus action-enabled toolsets and the approval boundary before scoring autonomous operations.
- **CLI/API/SDK loop:** Datadog provides a REST API, official client libraries for Java, Python, Ruby, Go, TypeScript, and Rust, plus client SDKs and DogStatsD libraries. The API documentation includes language-specific examples and an AI-agent-friendly Markdown page and `llms.txt`, which lowers retrieval friction for coding agents. The current audit has not yet run a real CLI/API/SDK task in the trial tenant.
- **In-platform building:** App Builder is a low-code canvas with components, queries, JavaScript expressions, Action Catalog integrations, HTTP requests, and JavaScript functions. It can be embedded in dashboards. Datadog Apps adds a code-first React/TypeScript path with server-side backend functions, GitHub/CI/CD, and custom APIs; the official docs currently label Apps Preview and state that App Builder is Preview on the documented site. Locally built Apps do not receive App Builder's drag-and-drop editing, variables, events, and expressions UI.
- **Agentic building:** Datadog documents Bits Agent Builder and MCP-connected workflows, including case-management agents. This is strong evidence for agent-enabled operational workflows, but preview/site availability and action permissions need to be tested in the actual US5 tenant rather than inferred from documentation.
- **Data substrate qualification:** Datadog has a broad observability data model, APIs, notebooks, dashboards, workflows, App Builder, and MCP access. The evidence reviewed here does not establish a direct equivalent to Dynatrace Grail's unified topology-aware lakehouse plus native AppEngine runtime. That is a product-architecture comparison, not a claim that Datadog cannot build sophisticated applications.

### Grounded comparison

| Dimension | Dynatrace | Datadog | Current audit stance |
|---|---|---|---|
| AI from external coding agents | MCP server with DQL, help, analysis, investigations, Kubernetes, forecasting, and entity tools; several Early Access | MCP server across major observability/security surfaces; Cursor, Codex, Claude Code, custom agents explicitly documented | Both credible; Datadog has clearer named coding-client positioning, Dynatrace has stronger documented query/topology semantics |
| CLI and SDK developer loop | App Toolkit, `dtctl`, TypeScript SDKs, app functions, platform APIs | REST API, official multi-language clients, client SDKs, DogStatsD, code-first Apps | Both broad; hands-on setup test still required |
| Low-code building | AppEngine is code-first platform app development with governed runtime and intents | App Builder provides drag/drop, queries, actions, JavaScript, and dashboard embedding | Datadog is easier for a quick internal tool; Dynatrace is deeper as a governed platform runtime |
| Pro-code building | React/TypeScript apps, SDKs, app functions, EdgeConnect, platform intents | React/TypeScript Apps, backend functions, GitHub/CI/CD, custom APIs; Preview caveat | Dynatrace appears more platform-native; Datadog's code path is attractive but maturity/availability must be verified per site |
| Query/data foundation for agents | Grail + DQL + Smartscape context + permissions | API/query surfaces across products, dashboards, notebooks, workflows | Dynatrace has the clearer unified data/topology story; Datadog has broad product reach |
| Documentation for AI coding | MCP setup, permissions, VS Code configuration, DQL references, AppEngine docs | MCP docs, client examples, API Markdown, `llms.txt`, Apps/App Builder docs | Datadog currently has lower retrieval friction; Dynatrace has deeper platform concepts but more permission/setup surface |

### Business-value translation

For a CSM or developer, the meaningful distinction is not “who has MCP.” It is whether an agent can safely move from a customer question to an evidence-backed answer, then to a governed change. Dynatrace's strongest differentiator is the combination of Grail, DQL, Smartscape context, AppEngine, AutomationEngine, and permission-aware MCP. Datadog's strongest differentiator is packaging: Bits, MCP, API examples, App Builder, code-first Apps, and established client libraries create a more immediately legible path from existing engineering tools to an operational workflow. Neither advantage should be scored as complete until the same read-only investigation, query generation, dashboard/app build, and approved remediation task is executed in both tenants.

### Next controlled lab

The full repeatable protocol is in [GenAI and Developer Platform Lab](genai-developer-platform-lab.md). It separates observed capability from documentation-only claims and keeps the platform-use lens separate from agent-observability.
The execution queue and evidence rules are tracked in [Agentic Platform Audit Runbook](agentic-platform-audit-runbook.md).

1. Run the same incident question through Dynatrace Assist/MCP and Datadog Bits/MCP, recording answer quality, citations, permissions, and time to evidence.
2. Build the same small CSM utility: trial-health summary, missing telemetry checklist, links to learning/support, and tenant metadata.
3. Implement once with Dynatrace AppEngine/App Toolkit and once with Datadog App Builder, then repeat with the pro-code path where available.
4. Measure setup time, number of credentials, permission scopes, local-to-cloud feedback, deployment, embedding, auditability, and rollback.
5. Treat Preview, Early Access, site restrictions, and paid entitlements as explicit score penalties or availability flags rather than silently treating them as GA.
