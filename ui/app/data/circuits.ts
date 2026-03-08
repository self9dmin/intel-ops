import type { Mission } from "../types/mission.types";

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
    description: "Triage, investigate, and resolve incidents before the business wakes up.",
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
    description: "SLOs, synthetic monitors, and deployment gates — keep the system honest.",
    missionIds: [
      "mission-golden-signal",
      "operation-silent-rollout",
    ],
  },
  {
    id: "cluster-control",
    name: "Cluster Control",
    description: "Navigate Kubernetes infrastructure before something breaks at 3am.",
    missionIds: [
      "mission-grid-search",
      "operation-k8s-meltdown",
    ],
  },
  {
    id: "signal-hunt",
    name: "Signal Hunt",
    description: "Trace distributed systems and extract evidence from raw telemetry.",
    missionIds: [
      "operation-ghost-in-the-trace",
      "mission-follow-the-wire",
      "mission-stone-wall",
    ],
  },
  {
    id: "root-cause-run",
    name: "Root Cause Run",
    description: "Go from alert to root cause using problems, traces, and logs.",
    missionIds: [
      "operation-3am-database-spike",
      "mission-what-are-you",
      "operation-ghost-in-the-trace",
    ],
  },
  {
    id: "terrain-recon",
    name: "Terrain Recon",
    description: "Learn the lay of the land — infrastructure, services, and entity topology.",
    missionIds: [
      "mission-what-are-you",
      "mission-grid-search",
      "mission-follow-the-wire",
    ],
  },
];
