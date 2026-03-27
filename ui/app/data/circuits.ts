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
    missionIds: [],
    f1TrackSvgUrl: "/ui/assets/circuits/bahrain.svg",
    countryCode: "bh",
  },
  {
    id: "reliability-driver",
    name: "Reliability Driver",
    description: "SRE missions using Dynatrace Assist for incident response, root cause analysis, and proactive reliability",
    missionIds: [
      "mission-first-briefing",
      "mission-blast-radius",
      "mission-causal-chain",
      "mission-slo-burn",
      "mission-predict-failure",
      "mission-operator-debrief",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  {
    id: "strategist",
    name: "The Strategist",
    description: "Incident Commander missions using Dynatrace Assist to lead, communicate, and close incidents with data",
    missionIds: [
      "mission-war-room-brief",
      "mission-timeline-reconstruction",
      "mission-customer-impact",
      "mission-escalation-decision",
      "mission-all-clear",
      "mission-command-postmortem",
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
      "mission-code-fix-brief",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "it",
  },
  {
    id: "builder",
    name: "The Builder",
    description: "Platform Engineer missions using Dynatrace Assist to forecast, automate, and manage infrastructure at scale",
    missionIds: [
      "mission-fleet-report",
      "mission-disk-forecast",
      "mission-otel-inventory",
      "mission-log-volume",
      "mission-workflow-builder",
      "mission-approval-gate",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
];