export interface Circuit {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
}

export const CIRCUITS: Circuit[] = [
  {
    id: "incident-response",
    name: "First Response",
    description: "Master the art of incident triage and resolution",
    missionIds: ["operation-3am-database-spike", "operation-flatline"],
  },
  {
    id: "sre-fundamentals",
    name: "Reliability Run",
    description: "Build reliability engineering skills from the ground up",
    missionIds: ["operation-silent-rollout", "operation-3am-database-spike"],
  },
  {
    id: "platform-mastery",
    name: "Cluster Control",
    description: "Deep dive into Kubernetes and infrastructure observability",
    missionIds: ["operation-k8s-meltdown", "operation-silent-rollout"],
  },
  {
    id: "developer-debugging",
    name: "Signal Hunt",
    description: "Trace and resolve application-level issues",
    missionIds: ["operation-ghost-in-the-trace", "operation-silent-rollout"],
  },
];
