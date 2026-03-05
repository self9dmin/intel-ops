import type { Mission } from "../types/mission.types";

export const MISSIONS: Mission[] = [
  {
    id: "operation-3am-database-spike",
    title: "Operation: 3am Database Spike",
    codename: "NIGHTWATCH",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "Production database is spiking. Find the root cause before the business wakes up.",
    briefing:
      "0300 hours. PagerDuty just fired. The primary production database is showing anomalous behavior — latency is climbing and error rates are spiking. Your job is to identify the root cause before the business wakes up and customers start calling.",
    timerSeconds: 900,
    status: "available",
    prerequisites: [],
    topics: ["databases", "logs", "metrics"],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "incident-commander", xp: 75 },
    ],
    checkpoints: [
      {
        id: "cp1",
        title: "Open the Problems Feed",
        instruction:
          "Navigate to the Problems app in Dynatrace and locate the active anomaly affecting the production environment.",
        hint: "In the Dynatrace left nav, look for 'Problems'. Active problems show a red indicator. Filter by 'Open' status if needed.",
        type: "action",
        points: 150,
      },
      {
        id: "cp2",
        title: "Identify the Affected Service",
        instruction:
          "From the problem card, drill into the affected service and open its topology map.",
        hint: "Click the problem title to expand it. Look for the 'Affected entities' section — click the service name to open Service details, then find the 'Service flow' or topology view.",
        type: "action",
        points: 150,
      },
      {
        id: "cp3",
        title: "Read the Root Cause Chain",
        instruction:
          "Open the Dynatrace Intelligence analysis panel and review the full root cause chain.",
        hint: "In the problem detail view, scroll to the 'Root cause' section. Dynatrace Intelligence (formerly Davis AI) shows a causal chain — read each step from the triggering event down.",
        type: "action",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the Preceding Log Event",
        instruction:
          "Switch to the Logs app and find the error-level log entry that preceded the anomaly.",
        hint: "Open 'Logs' from the left nav. Filter by: Log level = ERROR, and set the time window to the 15 minutes before the problem was detected. Look for entries from the database service.",
        type: "action",
        points: 150,
      },
      {
        id: "cp5",
        title: "Identify the Origin Host",
        instruction:
          "Drill into the infrastructure layer and identify the specific host where the problem originated.",
        hint: "From the problem card, look for 'Infrastructure' in the affected entities. Click through to the host. Check the 'Metrics' tab for disk I/O, CPU, and memory anomalies around the incident time.",
        type: "action",
        points: 150,
      },
      {
        id: "cp6",
        title: "Submit Root Cause",
        instruction:
          "Based on your investigation, identify the root cause of the database spike.",
        hint: "You found error logs preceding the anomaly, and the host metrics showed one resource exhausted before the others. What ran out first?",
        type: "multiple-choice",
        choices: [
          "Memory leak in the application layer",
          "Disk I/O saturation on the database host",
          "Network packet loss between services",
        ],
        correctChoice: "Disk I/O saturation on the database host",
        points: 200,
      },
    ],
  },
  {
    id: "operation-silent-rollout",
    title: "Operation: Silent Rollout",
    codename: "CANARY",
    role: "SRE",
    difficulty: "operator",
    description:
      "A deployment went out 20 minutes ago. No alerts fired. But something is wrong.",
    briefing:
      "A backend service was deployed 20 minutes ago. Automated checks passed. No alerts fired. But a senior engineer has a gut feeling — response times are subtly degraded and one SLO is quietly burning down. Your job: confirm whether the deployment caused a regression before it becomes a customer-facing incident.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    topics: ["slos", "metrics", "tracing"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "developer", xp: 50 },
    ],
    checkpoints: [
      {
        id: "cp1",
        title: "Locate the Recent Deployment",
        instruction:
          "Find the deployment event in Dynatrace and confirm the timestamp and service affected.",
        hint: "Check 'Releases' or look for deployment events in the Events feed. You can also find deployment markers in service-level charts — they appear as vertical lines on the timeline.",
        type: "action",
        points: 150,
      },
      {
        id: "cp2",
        title: "Compare Pre/Post Metrics",
        instruction:
          "Open the affected service and compare response time and error rate before and after the deployment.",
        hint: "In the Service detail view, set a custom time window that spans the deployment event. Look at the 'Response time' and 'Failure rate' charts. Enable the comparison baseline if available.",
        type: "action",
        points: 150,
      },
      {
        id: "cp3",
        title: "Check the SLO Status",
        instruction:
          "Open the SLO app and find the SLO that is burning error budget.",
        hint: "Navigate to 'Service Level Objectives' in the left nav. Sort by 'Error budget remaining' ascending — the most at-risk SLO will be at the top. Check its burn rate trend.",
        type: "action",
        points: 150,
      },
      {
        id: "cp4",
        title: "Identify the Degraded Endpoint",
        instruction:
          "Drill into distributed traces to find which specific endpoint regressed after the deployment.",
        hint: "Open 'Distributed Tracing'. Filter traces to the affected service, post-deployment time window, and sort by duration descending. The outlier endpoint will stand out.",
        type: "action",
        points: 150,
      },
      {
        id: "cp5",
        title: "Submit Your Verdict",
        instruction:
          "Based on the evidence, what is your recommendation?",
        hint: "You have deployment timing, metric delta, SLO burn rate, and a degraded endpoint. Is this a rollback situation or a monitor-and-hold?",
        type: "multiple-choice",
        choices: [
          "Rollback immediately — SLO breach is imminent",
          "Hold and monitor — degradation is within acceptable bounds",
          "Escalate to the dev team — root cause is in the code, not infra",
        ],
        correctChoice: "Rollback immediately — SLO breach is imminent",
        points: 200,
      },
    ],
  },
  {
    id: "operation-ghost-in-the-trace",
    title: "Operation: Ghost in the Trace",
    codename: "PHANTOM",
    role: "Developer",
    difficulty: "operator",
    description:
      "Users are reporting slow checkouts. No errors. No alerts. Just latency.",
    briefing:
      "The e-commerce checkout flow is slow. Not broken — just slow. P99 latency doubled in the last hour. No errors in the logs. No alerts from Davis. The problem is hiding somewhere in the distributed call chain. Your job: find the ghost.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    topics: ["tracing", "databases", "alerting"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Distributed Tracing",
        instruction:
          "Navigate to Distributed Tracing and filter for the checkout service in the last hour.",
        hint: "Left nav → 'Distributed Tracing'. Use the service filter to select the checkout or payment service. Set time range to last 1 hour. Sort by duration descending to surface slow traces.",
        type: "action",
        points: 150,
      },
      {
        id: "cp2",
        title: "Identify the Slowest Trace",
        instruction:
          "Open the slowest trace and examine the full call chain waterfall.",
        hint: "Click the trace with the highest duration. The waterfall view shows each span. Look for spans with unusually long gaps between start and the first child call — that gap is latency with no explanation.",
        type: "action",
        points: 150,
      },
      {
        id: "cp3",
        title: "Pinpoint the Slow Span",
        instruction:
          "Identify which service and operation is responsible for the majority of the latency.",
        hint: "In the trace waterfall, look at span durations. The slow span will be disproportionately wide compared to its siblings. Check the span details panel for the service name and operation.",
        type: "action",
        points: 150,
      },
      {
        id: "cp4",
        title: "Check the Service Flow",
        instruction:
          "Open the Service Flow for the slow service and identify any unexpected downstream dependencies.",
        hint: "From the service detail view, open 'Service flow'. This shows the full upstream/downstream call map. Look for a dependency that shouldn't be there, or one with unusually high call counts.",
        type: "action",
        points: 150,
      },
      {
        id: "cp5",
        title: "Identify the Root Cause",
        instruction:
          "Based on the trace analysis, what is causing the checkout latency?",
        hint: "The slow span pointed to a specific service. The service flow showed an unexpected dependency. What type of problem causes latency without errors?",
        type: "multiple-choice",
        choices: [
          "A downstream database query missing an index",
          "A third-party payment API with increased response times",
          "A misconfigured retry loop in the checkout service",
        ],
        correctChoice: "A downstream database query missing an index",
        points: 200,
      },
    ],
  },
  {
    id: "operation-flatline",
    title: "Operation: Flatline",
    codename: "BLACKOUT",
    role: "Incident Commander",
    difficulty: "elite",
    description:
      "Three services down. Cascading failures. You have 8 minutes.",
    briefing:
      "CRITICAL. Three production services have gone dark simultaneously. Cascading failures are spreading. Customer impact is confirmed. You have 8 minutes to identify the blast radius, find the origin, and call the remediation path. No hints. No hand-holding. Move.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["operation-3am-database-spike", "operation-silent-rollout"],
    topics: ["alerting", "metrics", "dashboards"],
    disciplines: [
      { track: "incident-commander", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    checkpoints: [
      {
        id: "cp1",
        title: "Assess the Blast Radius",
        instruction:
          "Identify all affected services and the scope of customer impact.",
        hint: "",
        type: "action",
        points: 150,
      },
      {
        id: "cp2",
        title: "Find the Origin Service",
        instruction:
          "Determine which service failed first and triggered the cascade.",
        hint: "",
        type: "action",
        points: 150,
      },
      {
        id: "cp3",
        title: "Confirm the Failure Mode",
        instruction:
          "Identify whether this is a dependency failure, resource exhaustion, or external trigger.",
        hint: "",
        type: "action",
        points: 150,
      },
      {
        id: "cp4",
        title: "Check for Upstream Cause",
        instruction:
          "Determine if a deployment, config change, or infrastructure event preceded the failures.",
        hint: "",
        type: "action",
        points: 150,
      },
      {
        id: "cp5",
        title: "Call the Remediation",
        instruction:
          "Based on your investigation, what is the correct remediation path?",
        hint: "",
        type: "multiple-choice",
        choices: [
          "Rollback the last deployment and restart affected services",
          "Scale up the origin service and clear the queue backlog",
          "Failover to the secondary region immediately",
        ],
        correctChoice:
          "Rollback the last deployment and restart affected services",
        points: 200,
      },
    ],
  },
  {
    id: "operation-k8s-meltdown",
    title: "Operation: K8s Meltdown",
    codename: "PROMETHEUS",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Pods are crashing in the production cluster. The on-call engineer is offline.",
    briefing:
      "The production Kubernetes cluster is degrading. Pods in the payments namespace are crash-looping. The on-call platform engineer is unreachable. You're up. Find out what's killing the pods, whether it's spreading, and what needs to happen to stabilize the cluster.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    topics: ["kubernetes", "logs", "metrics"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Kubernetes in Dynatrace",
        instruction:
          "Navigate to the Kubernetes app and locate the production cluster.",
        hint: "Left nav → 'Kubernetes'. Select the production cluster from the cluster list. Check the cluster health overview for node and pod status indicators.",
        type: "action",
        points: 150,
      },
      {
        id: "cp2",
        title: "Find the Crashing Pods",
        instruction:
          "Drill into the payments namespace and identify the crash-looping pods.",
        hint: "In the cluster view, navigate to 'Namespaces' → payments. Filter pods by status. CrashLoopBackOff pods will show in red. Click a pod to see restart count and last exit code.",
        type: "action",
        points: 150,
      },
      {
        id: "cp3",
        title: "Read the Pod Logs",
        instruction:
          "Open the logs for a crashing pod and find the error that's causing the crash.",
        hint: "From the pod detail view, open 'Logs'. Look at the final log lines before each crash. The exit reason is usually in the last 10 lines — look for OOMKilled, error codes, or missing config references.",
        type: "action",
        points: 150,
      },
      {
        id: "cp4",
        title: "Check Node Resources",
        instruction:
          "Identify whether the node running the affected pods has resource pressure.",
        hint: "From the cluster view, go to 'Nodes'. Check CPU and memory utilization. A node under memory pressure will show >85% memory used. Compare against pod resource requests and limits.",
        type: "action",
        points: 150,
      },
      {
        id: "cp5",
        title: "Identify the Root Cause",
        instruction:
          "Based on pod logs and node metrics, what is causing the crash loop?",
        hint: "You have an exit code from the pod logs and memory pressure on the node. These two pieces of evidence point to one cause.",
        type: "multiple-choice",
        choices: [
          "Pods are being OOMKilled due to insufficient memory limits",
          "A missing environment variable is causing the application to fail on startup",
          "A node taint is preventing pods from scheduling correctly",
        ],
        correctChoice:
          "Pods are being OOMKilled due to insufficient memory limits",
        points: 200,
      },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
