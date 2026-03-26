export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
  f1TrackSvgUrl: string;
  countryCode: string;
}

export const CIRCUITS: Circuit[] = [
  // ─── PRE-SEASON TESTING ───────────────────────────────────────────
  {
    id: "ground-zero",
    name: "Ground Zero",
    description: "First steps for anyone new to Dynatrace",
    missionIds: [
      "mission-the-dock",
      "mission-what-are-you",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/melbourne.svg",
    countryCode: "au",
  },
  {
    id: "operator-readiness",
    name: "Operator Readiness",
    description: "Core tools, AI, and support resources every operator needs",
    missionIds: [
      "mission-ask-the-ai",
      "mission-first-alert",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/bahrain.svg",
    countryCode: "bh",
  },
  {
    id: "terrain-recon",
    name: "Terrain Recon",
    description: "Read the signals — dashboards, logs, and observability data",
    missionIds: [
      "mission-identify-signal",
      "mission-read-dashboard",
      "mission-find-the-log",
      "mission-map-topology",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monaco.svg",
    countryCode: "mc",
  },
  // ─── QUALIFYING ───────────────────────────────────────────────────
  {
    id: "insight",
    name: "Insight",
    description: "SLOs, deployments, DQL — turning data into decisions",
    missionIds: [
      "mission-golden-signal",
      "mission-first-dql",
      "mission-silent-disk-drain",
      "operation-silent-rollout",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
  {
    id: "reliability-run",
    name: "Reliability Run",
    description: "Infrastructure and database investigation under real pressure",
    missionIds: [
      "mission-iron-floor",
      "mission-investigate-database-failure",
      "operation-3am-database-spike",
      "operation-k8s-meltdown",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  // ─── RACE DAY ─────────────────────────────────────────────────────
  {
    id: "signal-hunt",
    name: "Signal Hunt",
    description: "Trace through distributed systems to pinpoint root cause",
    missionIds: [
      "operation-ghost-in-the-trace",
      "mission-follow-the-wire",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/interlagos.svg",
    countryCode: "br",
  },
  {
    id: "first-response",
    name: "First Response",
    description: "Triage and resolve active incidents under pressure",
    missionIds: [
      "mission-silent-query",
      "operation-3am-database-spike",
      "mission-follow-the-error",
      "operation-flatline",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/marina-bay.svg",
    countryCode: "sg",
  },
  {
    id: "root-cause-run",
    name: "Root Cause Run",
    description: "Work backwards from symptoms to find what actually broke",
    missionIds: [
      "operation-ghost-in-the-trace",
      "operation-flatline",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "it",
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
    missionIds: [],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
];