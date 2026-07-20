export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
  journeyIds?: string[];
  f1TrackSvgUrl: string;
  countryCode: string;
}

export type DriverTier = "rookie" | "intermediate" | "advanced" | "elite";

export const CIRCUIT_TIER_MAP: Record<string, DriverTier> = {
  "ground-zero": "rookie",
  "operator-readiness": "intermediate",
  "strategist": "advanced",
  "builder": "advanced",
  "reliability-driver": "elite",
  "race-day": "elite",
  "opentelemetry-grand-prix": "intermediate",
  "ai-grand-prix": "advanced",
  "ai-observability-grand-prix": "advanced",
  "track-walk": "rookie",
};

export const TIER_XP_THRESHOLDS: Record<DriverTier, number> = {
  "rookie": 0,
  "intermediate": 500,
  "advanced": 1500,
  "elite": 3000,
};

export const CIRCUITS: Circuit[] = [
  // ─── PRE-SEASON TESTING ───────────────────────────────────────────
  {
    id: "ground-zero",
    name: "Ground Zero",
    description: "First steps for anyone new to Dynatrace",
    missionIds: [
      "mission-the-dock",
      "mission-what-are-you",
      "mission-ingest-first-signal",
      "mission-verify-the-data",
      "mission-build-first-view",
      "mission-first-briefing",
      "mission-first-alert",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/melbourne.svg",
    countryCode: "au",
  },
  {
    id: "operator-readiness",
    name: "Operator Readiness",
    description: "Core tools, AI, and support resources every operator needs",
    missionIds: [
      "mission-first-alert",
      "mission-know-your-wheel",
      "mission-follow-the-signal",
      "mission-map-the-service",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/bahrain.svg",
    countryCode: "bh",
  },
  {
    id: "track-walk",
    name: "Track Walk",
    description: "D1 customer-lifecycle practice: walk the journey before you race it",
    missionIds: [],
    journeyIds: [
      "journey-first-login",
      "journey-find-the-signal",
      "journey-missing-signal",
      "journey-broken-handoff",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monaco.svg",
    countryCode: "mc",
  },
  {
    id: "reliability-driver",
    name: "Reliability Grand Prix",
    description: "The SRE circuit: incident response, root cause analysis, and proactive reliability",
    missionIds: [
      "mission-causal-chain",
      "mission-slo-burn",
      "mission-command-postmortem",
      "mission-approval-gate",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  {
    id: "strategist",
    name: "Incident Command Grand Prix",
    description: "The Incident Commander circuit: lead, communicate, and close incidents with evidence",
    missionIds: [
      "mission-timeline-reconstruction",
      "mission-customer-impact",
      "mission-all-clear",
      "mission-command-postmortem",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monaco.svg",
    countryCode: "mc",
  },
  {
    id: "opentelemetry-grand-prix",
    name: "OTel Grand Prix",
    description: "The Developer circuit: OpenTelemetry collection, traces, metrics, and logs — investigate performance and deploy with confidence",
    missionIds: [
      "mission-why-is-it-slow",
      "mission-otel-collector-validation",
      "mission-otel-trace-investigation",
      "mission-otel-log-trace-correlation",
      "mission-otel-metrics-exploration",
      "mission-otel-query",
      "mission-deployment-correlation",
      "mission-log-story",
      "mission-error-budget-dev",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "it",
  },
  {
    id: "ai-grand-prix",
    name: "Davis Intelligence Grand Prix",
    description: "A staged circuit for using Davis and Dynatrace Assist in investigation, prediction, and operator debriefs",
    missionIds: [
      "mission-first-briefing",
      "mission-blast-radius",
      "mission-causal-chain",
      "mission-slo-burn",
      "mission-all-clear",
      "mission-command-postmortem",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  {
    id: "ai-observability-grand-prix",
    name: "AI Observability Grand Prix",
    description: "A staged circuit for instrumenting, exploring, and troubleshooting AI agents and LLM workloads in Dynatrace",
    missionIds: [
      "mission-ai-signal-map",
      "mission-ai-trace-investigation",
      "mission-ai-token-economics",
      "mission-ai-agent-topology",
      "mission-ai-instrumentation-check",
      "mission-ai-model-health",
      "mission-ai-incident-bridge",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/suzuka.svg",
    countryCode: "jp",
  },
  {
    id: "builder",
    name: "Platform Ops Grand Prix",
    description: "The Platform Engineer circuit: forecast, automate, and manage infrastructure at scale",
    missionIds: [
      "mission-otel-inventory",
      "mission-log-volume",
      "mission-workflow-builder",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
];
