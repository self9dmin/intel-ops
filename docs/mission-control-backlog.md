# Mission Control backlog

Product backlog for future content and authoring work. These are backlog commitments, not claims that the missions or capabilities already exist. Priority is expressed as the supplied impact/complexity rating; dependencies are preserved for later planning.

## 0. Dynamic Version Display

- **Status:** Implemented
- **Complexity:** Low
- **Impact:** Low
- **Dependencies:** None
- **Scope:** Generate a build-time TypeScript module from `package.json` and render that value in the app info panel.
- **User story:** As a developer, I want automatic version display so I never forget to update the version string.
- **Acceptance criteria:**
  - The info panel matches the package version.
  - Bumping `package.json` updates the displayed version on the next build.
  - No release version remains hardcoded in component code.
  - The build injects the value before bundling.
- **Implementation:** `scripts/write-version.mjs` runs as part of `npm run build`; the generated `ui/app/buildVersion.ts` is ignored because it is derived output.

## 1. OpenTelemetry Mission Track

- **Status:** Prototype circuit added; track expansion pending Playground validation
- **Complexity:** Medium
- **Impact:** High
- **Dependencies:** None
- **Circuit:** OpenTelemetry Grand Prix (prototype)
- **Scope:** Create 6-8 missions covering OTel signals in Dynatrace, OTel trace analysis, metric exploration, log correlation, collector configuration, and instrumentation troubleshooting. Progress from rookie understanding to elite diagnosis.
- **User stories:**
  - As a developer, I want to practice analyzing OpenTelemetry traces in Dynatrace so I can troubleshoot OTel-instrumented services.
  - As a platform engineer, I want to learn OTel Collector configuration through guided missions so I can set up reliable telemetry pipelines.
- **Acceptance criteria:**
  - 6-8 missions cover traces, metrics, logs, collectors, and troubleshooting.
  - A new `opentelemetry` topic is added to topic tracking and XP.
  - Missions use real OpenTelemetry data in Dynatrace Playground.
  - At least two missions use DQL-query checkpoints when feature-7 is available.
  - Difficulty progresses from rookie to elite.
- **Why it matters:** Generic labs teach portable infrastructure concepts but do not teach how to investigate OTel data inside Dynatrace. This track turns a fast-growing standard into vendor-specific operational skill.
- **Validation note:** July 19, 2026 browser validation confirmed populated Playground trace data, including service facets, endpoints, request/span status, Kubernetes context, and `otel-demo` rows. The Playground exposes Logs and Notebooks, but this session did not expose a Collector YAML validation surface or a stable metric-query result. Keep the trace mission validated; keep Collector, log-correlation, and metrics missions in evidence-required review until their exact fixtures are reproduced.
- **July 2026 research anchors:** Dynatrace documents the Collector as a receiver/processor/exporter pipeline, supports OTLP traces, metrics, and logs, and recommends batching, memory limiting, and Kubernetes enrichment. Collector configuration also has a `validate` command and a delta-temporality requirement for metrics. See [Collector overview](https://docs.dynatrace.com/docs/ingest-from/opentelemetry/collector), [configuration](https://docs.dynatrace.com/docs/ingest-from/opentelemetry/collector/configuration), and [system requirements](https://docs.dynatrace.com/docs/ingest-from/opentelemetry/collector/system-requirements).
- **Next mission to prototype:** OTel Collector Configuration Validation. It has a bounded, testable success condition: identify receiver, processor, exporter, and pipeline wiring; catch invalid configuration; and explain the delta-temporality and resource implications before deployment.

## 2. AI Observability Mission Track

- **Status:** Prototype circuit added; AI workload monitoring missions pending
- **Complexity:** Medium
- **Impact:** High
- **Dependencies:** None
- **Circuit:** AI Grand Prix (prototype)
- **Scope:** Create 5-7 missions covering Davis problem detection, AI-assisted investigation, Davis CoPilot usage, anomaly detection configuration, and monitoring AI/ML workloads including model-performance concerns.
- **User stories:**
  - As an SRE, I want to investigate Davis-detected problems so I can respond faster when alerts fire in production.
  - As a developer, I want to monitor AI/ML workloads in Dynatrace so I can detect model drift and performance issues.
- **Acceptance criteria:**
  - 5-7 missions cover Davis analysis, anomaly detection, CoPilot, and AI workload monitoring.
  - Existing `dt-intelligence` is used for XP tracking.
  - Missions progress from rookie Davis interpretation to elite anomaly-tuning work.
  - At least one mission follows a Davis-detected problem end to end.
  - Missions reference real Davis detections in Dynatrace Playground.
- **Why it matters:** Incident-process training alone does not build the technical investigation skill required to read telemetry, write queries, and validate AI-assisted conclusions.
- **Validation note:** Separate “use Dynatrace AI” from “observe customer AI systems”; verify current product names, entitlements, and Playground scenarios before committing screenshots.

## 3. Cost Optimization Mission Track

- **Status:** Backlog
- **Complexity:** Medium
- **Impact:** Medium
- **Dependencies:** None
- **Category:** `cost-optimization`
- **Scope:** Create 4-6 missions covering consumption analysis, host-unit optimization, DEM-unit management, DDU/DPS monitoring, licensing concepts, waste identification, and right-sizing.
- **User stories:**
  - As a platform engineer, I want to analyze Dynatrace consumption so I can identify optimization opportunities and reduce cost.
  - As a manager, I want my team to understand the licensing model so configuration decisions are cost-conscious.
- **Acceptance criteria:**
  - 4-6 missions cover host units, DEM, DDU/DPS, licensing, and optimization.
  - Difficulty progresses from licensing-model basics to advanced optimization.
  - Missions teach the relevant Settings > Usage & Billing views and related DQL.
  - At least one mission includes a DQL query for consumption trends.
- **Why it matters:** Cost visibility becomes a retention and governance issue as monitored estates scale; this content should help customers act before spend becomes a renewal objection.
- **Validation note:** Pricing and consumption terminology are time-sensitive. Tie every mission to current official billing documentation and avoid hard-coded rates.

## 4. Visual Mission Builder

- **Status:** Backlog
- **Complexity:** High
- **Impact:** Medium
- **Dependencies:** feature-7, feature-8
- **Scope:** Build a no-code authoring tool for CSMs, trainers, partners, and Dynatrace experts. It should support drag-and-drop checkpoints, DQL validation, preview, draft/publish workflow, Document Service persistence, and a separate Community Missions area.
- **User stories:**
  - As a CSM, I want to create a customer-specific mission without writing TypeScript.
  - As a Dynatrace trainer, I want to author and preview missions visually.
  - As a partner, I want to create industry-specific mission packs.
- **Acceptance criteria:**
  - Author title, briefing, timer, difficulty, and checkpoints in the UI.
  - Support multiple-choice, action-based, and DQL-query checkpoints.
  - Test DQL validation queries against Grail from the builder.
  - Preview the learner experience before publishing.
  - Save drafts and publish only after required fields and quality gates pass.
  - Store published content in Document Service and show it separately from built-in missions.
  - Provide templates for common scenarios.
- **Why it matters:** TypeScript-only authoring limits content supply to developers. A governed builder could let CSMs and partners contribute without turning the product into an unreviewed content marketplace.
- **Validation note:** Start with a small schema editor and preview prototype. Do not build a full marketplace until permissions, review, versioning, rollback, tenancy, and DQL execution boundaries are designed.

## Cross-track sequencing

1. Validate Playground data, current entitlements, and feature-7/8 definitions.
2. Build OpenTelemetry and AI Observability content prototypes against real evidence.
3. Add Cost Optimization once current billing terminology and safe sample data are confirmed.
4. Prototype the Visual Mission Builder against the proven mission schema and quality rubric.

## Source and evidence discipline

Each mission proposal must carry a source URL, capture date, tenant/data mode, expected learner role, and whether the claim is official documentation, product behavior, community guidance, or an internal teaching interpretation. Competitor comparisons are context for prioritization, not evidence that a competitor lacks a capability.
