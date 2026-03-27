export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
  f1TrackSvgUrl: string;
  countryCode: string;
}

export type DriverTier = "rookie" | "intermediate" | "advanced" | "elite";

export const CIRCUIT_TIER_MAP: Record<string, DriverTier> = {
  "ground-zero": "rookie",
  "operator-readiness": "intermediate",
  "speed-driver": "intermediate",
  "strategist": "advanced",
  "builder": "advanced",
  "reliability-driver": "elite",
  "race-day": "elite",
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
      "mission-know-your-wheel",
      "mission-ask-the-ai",
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
      "mission-read-the-room",
      "mission-follow-the-signal",
      "mission-map-the-service",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/bahrain.svg",
    countryCode: "bh",
  },
  {
    id: "reliability-driver",
    name: "Reliability Driver",
    description: "SRE missions using Dynatrace Assist for incident response, root cause analysis, and proactive reliability",
    missionIds: [
      "mission-causal-chain",
      "mission-slo-burn",
      "mission-predict-failure",
      "mission-operator-debrief",
      "mission-code-fix-brief",
      "mission-command-postmortem",
      "mission-approval-gate",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  {
    id: "strategist",
    name: "The Strategist",
    description: "Incident Commander missions using Dynatrace Assist to lead, communicate, and close incidents with data",
    missionIds: [
      "mission-timeline-reconstruction",
      "mission-customer-impact",
      "mission-escalation-decision",
      "mission-all-clear",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monaco.svg",
    countryCode: "mc",
  },
  {
    id: "speed-driver",
    name: "Speed Driver",
    description: "Developer missions using Dynatrace Assist to investigate performance, OTel signals, and deploy with confidence",
    missionIds: [
      "mission-why-is-it-slow",
      "mission-otel-query",
      "mission-deployment-correlation",
      "mission-log-story",
      "mission-error-budget-dev",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "it",
  },
  {
    id: "builder",
    name: "The Builder",
    description: "Platform Engineer missions using Dynatrace Assist to forecast, automate, and manage infrastructure at scale",
    missionIds: [
      "mission-otel-inventory",
      "mission-log-volume",
      "mission-workflow-builder",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
  {
    id: "race-day",
    name: "Race Day",
    description: "Elite missions for operators who know the platform. No hand-holding. Full investigation, full pressure.",
    missionIds: [
      "mission-ghost-in-the-trace",
      "mission-topology-under-fire",
      "mission-silent-anomaly",
      "mission-close-the-loop",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "ae",
  },
];