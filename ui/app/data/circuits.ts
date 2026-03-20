export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
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
  },
  {
    id: "reliability-run",
    name: "Reliability Run",
    description: "Build SRE fundamentals — SLOs, deployments, and service health",
    missionIds: [
      "mission-golden-signal",
      "operation-silent-rollout",
    ],
  },
  {
    id: "cluster-control",
    name: "Cluster Control",
    description: "Navigate Kubernetes complexity and infrastructure failures",
    missionIds: [
      "mission-grid-search",
      "operation-k8s-meltdown",
    ],
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
  },
  {
    id: "ground-zero",
    name: "Ground Zero",
    description: "Orient yourself — first steps for anyone new to Dynatrace",
    missionIds: [
      "mission-the-dock",
      "mission-deploy-agent",
      "mission-what-are-you",
      "mission-iron-floor",
    ],
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
  },
];
