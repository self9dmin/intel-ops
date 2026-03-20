export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
  f1TrackSvgUrl: string;
  countryCode: string;
}

export const CIRCUITS: Circuit[] = [
  {
    id: "first-response",
    name: "First Response",
    description: "Triage and resolve active incidents under pressure",
    missionIds: [
      "operation-3am-database-spike",
      "operation-flatline",
      "mission-silent-query",
      "mission-iron-floor",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/marina-bay.svg",
    countryCode: "sg",
  },
  {
    id: "reliability-run",
    name: "Reliability Run",
    description: "Build SRE fundamentals — SLOs, deployments, and service health",
    missionIds: [
      "mission-golden-signal",
      "operation-silent-rollout",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/silverstone.svg",
    countryCode: "gb",
  },
  {
    id: "cluster-control",
    name: "Cluster Control",
    description: "Navigate Kubernetes complexity and infrastructure failures",
    missionIds: [
      "mission-grid-search",
      "operation-k8s-meltdown",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/suzuka.svg",
    countryCode: "jp",
  },
  {
    id: "signal-hunt",
    name: "Signal Hunt",
    description: "Trace through distributed systems to pinpoint root cause",
    missionIds: [
      "operation-ghost-in-the-trace",
      "mission-follow-the-wire",
      "mission-stone-wall",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/interlagos.svg",
    countryCode: "br",
  },
  {
    id: "root-cause-run",
    name: "Root Cause Run",
    description: "Work backwards from symptoms to find what actually broke",
    missionIds: [
      "operation-3am-database-spike",
      "mission-what-are-you",
      "operation-ghost-in-the-trace",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monza.svg",
    countryCode: "it",
  },
  {
    id: "terrain-recon",
    name: "Terrain Recon",
    description: "Map the platform and understand entity relationships",
    missionIds: [
      "mission-what-are-you",
      "mission-grid-search",
      "mission-follow-the-wire",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/monaco.svg",
    countryCode: "mc",
  },
  {
    id: "operator-readiness",
    name: "Operator Readiness",
    description: "Get comfortable with core Dynatrace tools and navigation",
    missionIds: [
      "mission-the-dock",
      "mission-orient-platform",
      "mission-ask-the-ai",
      "mission-find-your-answers",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/bahrain.svg",
    countryCode: "bh",
  },
  {
    id: "ground-zero",
    name: "Ground Zero",
    description: "Orient yourself — first steps for anyone new to Dynatrace",
    missionIds: [
      "mission-the-dock",
      "mission-what-are-you",
      "mission-iron-floor",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/melbourne.svg",
    countryCode: "au",
  },
  {
    id: "insight",
    name: "Insight",
    description: "Read the data — dashboards, logs, and observability signals",
    missionIds: [
      "mission-read-dashboard",
      "mission-find-the-log",
      "mission-golden-signal",
    ],
    f1TrackSvgUrl: "/ui/assets/circuits/spa.svg",
    countryCode: "be",
  },
];