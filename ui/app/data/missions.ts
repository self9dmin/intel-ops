import type { Mission } from "../types/mission.types";

export const MISSIONS: Mission[] = [
  {
    id: "operation-3am-database-spike",
    title: "3AM Database Spike",
    codename: "NIGHTWATCH",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "Production database is spiking. Find the root cause before the business wakes up.",
    briefing:
      "0300 hours. PagerDuty just fired. The primary production database is showing anomalous behavior — latency is climbing and error rates are spiking. Your job is to identify the root cause before the business wakes up and customers start calling. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 900,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "incident-commander", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence", "logs", "infrastructure"],
    category: "incident-response",
    apps: ["Problems", "Services", "Logs", "Infrastructure & Operations"],
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
    title: "Silent Rollout",
    codename: "CANARY",
    role: "SRE",
    difficulty: "operator",
    description:
      "A deployment went out 20 minutes ago. No alerts fired. But something is wrong.",
    briefing:
      "A backend service was deployed 20 minutes ago. Automated checks passed. No alerts fired. But a senior engineer has a gut feeling — response times are subtly degraded and one SLO is quietly burning down. Your job: confirm whether the deployment caused a regression before it becomes a customer-facing incident. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "developer", xp: 50 },
    ],
    topics: ["traces", "metrics", "slo", "services"],
    category: "performance",
    apps: ["Services", "Service-Level Objectives", "Distributed Tracing"],
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
    title: "Ghost in the Trace",
    codename: "PHANTOM",
    role: "Developer",
    difficulty: "operator",
    description:
      "Users are reporting slow checkouts. No errors. No alerts. Just latency.",
    briefing:
      "The e-commerce checkout flow is slow. Not broken — just slow. P99 latency doubled in the last hour. No errors in the logs. No alerts from Davis. The problem is hiding somewhere in the distributed call chain. Your job: find the ghost. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["traces", "services"],
    category: "root-cause-analysis",
    apps: ["Distributed Tracing", "Services"],
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
    title: "Three Services Down",
    codename: "BLACKOUT",
    role: "Incident Commander",
    difficulty: "elite",
    description:
      "Three services down. Cascading failures. You have 8 minutes.",
    briefing:
      "CRITICAL. Three production services have gone dark simultaneously. Cascading failures are spreading. Customer impact is confirmed. You have 8 minutes to identify the blast radius, find the origin, and call the remediation path. No hints. No hand-holding. Move. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["operation-3am-database-spike", "operation-silent-rollout"],
    disciplines: [
      { track: "incident-commander", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["problems", "dt-intelligence", "metrics", "services", "infrastructure"],
    category: "incident-response",
    apps: ["Problems", "Services", "Infrastructure & Operations"],
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
    title: "K8s Meltdown",
    codename: "PROMETHEUS",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Pods are crashing in the production cluster. The on-call engineer is offline.",
    briefing:
      "The production Kubernetes cluster is degrading. Pods in the payments namespace are crash-looping. The on-call platform engineer is unreachable. You're up. Find out what's killing the pods, whether it's spreading, and what needs to happen to stabilize the cluster. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["kubernetes", "metrics"],
    category: "configuration",
    apps: ["Kubernetes"],
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
  {
    id: "mission-what-are-you",
    title: "Identify the Signal",
    codename: "WHAT ARE YOU",
    role: "SRE",
    difficulty: "rookie",
    description:
      "Three alerts fire. Three different entity types. Before you can triage anything, you need to know what kind of thing you're looking at.",
    briefing:
      "Entity types are the foundation of everything in Dynatrace. HOST, PROCESS_GROUP, CUSTOM_DEVICE — they behave differently, live in different apps, and fail in different ways. Get your bearings now, before something breaks at 3am. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 360,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "sre", xp: 75 }],
    topics: ["infrastructure", "problems"],
    category: "root-cause-analysis",
    apps: ["Infrastructure & Operations", "Problems"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find a Host Entity",
        instruction:
          "Open the Hosts app (Infrastructure → Hosts). Find the host named 'frontend-high-cpu'. What entity type prefix does Dynatrace use for hosts?",
        hint: "The entity ID appears in the URL when you open any host. Check the URL bar after clicking the host — it starts with the entity type prefix.",
        type: "multiple-choice",
        choices: ["HOST-", "SERVICE-", "PROCESS_GROUP-", "CUSTOM_DEVICE-"],
        correctChoice: "HOST-",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find a Process Group Entity",
        instruction:
          "Open Technologies & Processes. Find the 'webserver' process group running on 'frontend-high-cpu'. What is the entity type prefix for process groups?",
        hint: "In the Problems app, use the Impact filter in the left panel and select 'Infrastructure'. This narrows the list to host/process/network problems. The host 'frontend-high-cpu' is not shown as a standalone row in the list — open problem P-2603734 and check the Impact section in the detail panel to see it listed as a Host entity.",
        type: "multiple-choice",
        choices: ["HOST-", "PROCESS_GROUP-", "PROCESS-", "SERVICE-"],
        correctChoice: "PROCESS_GROUP-",
        points: 150,
      },
      {
        id: "cp3",
        title: "Find a Custom Device Entity",
        instruction:
          "Open the problem P-2603734 ('Process CPU problem'). Look at the Root cause column in the problems list. What entity type is listed?",
        hint: "Check the Root cause column in the problems list view (not the detail panel). For P-2603734, the root cause is shown there directly. Note: the detail panel may show 'No root cause' — use the column value instead.",
        type: "multiple-choice",
        choices: ["Process", "Host", "Service", "No root cause found"],
        correctChoice: "Process",
        points: 200,
      },
      {
        id: "cp4",
        title: "Match Entity Types to Monitoring Methods",
        instruction:
          "Based on what you've seen — 'frontend-high-cpu' (HOST), 'webserver' (PROCESS_GROUP), and the MySQL RDS instance (CUSTOM_DEVICE) — which statement correctly explains the difference?",
        hint: "Think about what each entity type represents in terms of HOW Dynatrace sees it. A HOST has an Agent on it. A PROCESS_GROUP is discovered by that Agent. A CUSTOM_DEVICE is something the Agent can't run on.",
        type: "multiple-choice",
        choices: [
          "HOST = OneAgent installed; PROCESS_GROUP = processes discovered by that OneAgent; CUSTOM_DEVICE = monitored via extension without OneAgent",
          "HOST = physical servers only; PROCESS_GROUP = virtual machines; CUSTOM_DEVICE = cloud services",
          "HOST = AWS resources; PROCESS_GROUP = Kubernetes pods; CUSTOM_DEVICE = on-premise hardware",
          "HOST = monitored with full stack; PROCESS_GROUP = monitored with APM only; CUSTOM_DEVICE = not monitored",
        ],
        correctChoice:
          "HOST = OneAgent installed; PROCESS_GROUP = processes discovered by that OneAgent; CUSTOM_DEVICE = monitored via extension without OneAgent",
        points: 200,
      },
    ],
  },
  {
    id: "mission-grid-search",
    title: "Map the Kubernetes Cluster",
    codename: "GRID SEARCH",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Map the EKS cluster before something breaks at 3am. Nodes, namespaces, workloads — know the terrain.",
    briefing:
      "The EKS cluster is running production workloads across multiple namespaces. You need to map it — node count, workload distribution, namespace health — before you can do anything useful when something breaks. Navigation under pressure starts with navigation when things are calm. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-what-are-you"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["kubernetes", "infrastructure"],
    category: "configuration",
    apps: ["Kubernetes"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open the Kubernetes App and Count the Clusters",
        instruction:
          "Open the Kubernetes app in Dynatrace. How many Kubernetes clusters are visible in the cluster list?",
        hint: "The playground runs workloads on two different cloud providers. Look for both AWS and Azure clusters in the list.",
        type: "multiple-choice",
        choices: ["1", "2", "3", "4"],
        correctChoice: "2",
        points: 100,
      },
      {
        id: "cp2",
        title: "Identify the EKS Cluster Node Count",
        instruction:
          "Select the EKS cluster (aws-eks-3). How many worker nodes does it have?",
        hint: "The cluster summary panel shows total node count near the top. Worker nodes are the ones running your workloads.",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6"],
        correctChoice: "5",
        points: 150,
      },
      {
        id: "cp3",
        title: "Navigate to the hipstershop Namespace",
        instruction:
          "In the aws-eks-3 cluster, navigate to the Namespaces tab and open the 'prod' namespace. How many workloads are running in this namespace?",
        hint: "The namespace detail view shows a Resources analysis section near the top. The workload count is displayed prominently.",
        type: "multiple-choice",
        choices: ["8", "12", "15", "20"],
        correctChoice: "15",
        points: 150,
      },
      {
        id: "cp4",
        title: "Count the Kubernetes Services in the Namespace",
        instruction:
          "Still in the 'prod' namespace on aws-eks-3, how many Kubernetes services are defined in this namespace?",
        hint: "Kubernetes services are the networking layer inside the cluster — different from Dynatrace services. Scroll past the workloads section to find the Kubernetes services list.",
        type: "multiple-choice",
        choices: ["10", "14", "17", "22"],
        correctChoice: "17",
        points: 150,
      },
      {
        id: "cp5",
        title: "Identify the AKS Node Count",
        instruction:
          "Go back to the cluster list and open the AKS cluster (aks-playground). How many nodes does it have?",
        hint: "The AKS cluster is smaller than the EKS cluster. Check the node count in the cluster summary panel.",
        type: "multiple-choice",
        choices: ["2", "3", "5", "7"],
        correctChoice: "3",
        points: 150,
      },
    ],
  },
  {
    id: "mission-follow-the-wire",
    title: "Trace the Service Dependency Chain",
    codename: "FOLLOW THE WIRE",
    role: "Developer",
    difficulty: "operator",
    description:
      "A slowdown is reported in easytrade. Map the service-to-database dependency chain before you can act.",
    briefing:
      "A slowdown is reported in the easytrade application. Before you can find the root cause, you need to understand how the services are wired together — which service calls which database, what technology stack is involved, and who owns what. Map the dependency chain first. Then you can act. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 540,
    status: "available",
    prerequisites: ["mission-what-are-you"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["services", "infrastructure"],
    category: "root-cause-analysis",
    apps: ["Services", "Frontend"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the easytrade Application Owner",
        instruction:
          "Open the Applications app and find the EasyTrade application. What is the dt.owner tag value on this application?",
        hint: "Owner tags use the format dt.owner:teamname. Check the Properties and tags tab on the application entity.",
        type: "multiple-choice",
        choices: ["Avengers", "KDTDemo", "Ninja", "easytrade-squad"],
        correctChoice: "KDTDemo",
        points: 100,
      },
      {
        id: "cp2",
        title: "Count the easytrade Services",
        instruction:
          "Navigate to the Services app. Filter by Kubernetes namespace 'easytrade' on the EKS cluster. How many services are running in this namespace?",
        hint: "Use the filter bar at the top of the Services app to filter by Kubernetes namespace. Type 'easytrade' in the namespace filter.",
        type: "multiple-choice",
        choices: ["8", "12", "17", "24"],
        correctChoice: "17",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Database Service Type",
        instruction:
          "In the easytrade services list, find the service named 'TradeManagementSqlConnection'. What is the Dynatrace service type for this entity?",
        hint: "Dynatrace automatically classifies services by their traffic pattern. A service that exists purely to represent database calls is typed differently from a web service.",
        type: "multiple-choice",
        choices: [
          "WEB_REQUEST_SERVICE",
          "WEB_SERVICE",
          "DATABASE_SERVICE",
          "CUSTOM_SERVICE",
        ],
        correctChoice: "DATABASE_SERVICE",
        points: 200,
      },
      {
        id: "cp4",
        title: "Find the Database Host",
        instruction:
          "Click into TradeManagementSqlConnection. What is the name of the actual database host this service connects to?",
        hint: "The service detail page shows the connection properties for a DATABASE_SERVICE. Look for the hostname or database name — this is an in-cluster database, not the RDS instance.",
        type: "multiple-choice",
        choices: [
          "mysql-8-4-dynatrace-demo.ckhuiwsqmnv8.us-east-1.rds.amazonaws.com",
          "easytrade-db",
          "unguard-mariadb",
          "astroshop-playground-productcatalog-db",
        ],
        correctChoice: "easytrade-db",
        points: 200,
      },
      {
        id: "cp5",
        title: "Identify the Login Service Technology",
        instruction:
          "In the easytrade services list, find 'easyTradeLoginService'. What technology stack does it run on?",
        hint: "The process group name for this service ends in .dll — a strong hint about the technology. Check the technology tags on the service or its backing process group.",
        type: "multiple-choice",
        choices: ["Java", "Go", "ASP.NET Core / .NET", "Node.js"],
        correctChoice: "ASP.NET Core / .NET",
        points: 150,
      },
    ],
  },
  {
    id: "mission-iron-floor",
    title: "Silent Disk Drain",
    codename: "IRON FLOOR",
    role: "SRE",
    difficulty: "rookie",
    description:
      "A host has been silently running out of disk space for nearly a month. Find it, read it, understand it.",
    briefing:
      "A low-disk alert has been open on a production host for almost 30 days. Nobody acted on it. Your job is to find the problem, identify the affected disk, confirm the threshold, and understand the full scope of what's at risk on that host. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "sre", xp: 75 }],
    topics: ["infrastructure", "problems"],
    category: "incident-response",
    apps: ["Problems", "Infrastructure & Operations"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the Chronic Disk Problem",
        instruction:
          "Open the Problems app. Set the timeframe to Last 30 days. Find the oldest open problem on the list — it affects a host named 'frontend-high-cpu'. What is the name of the host shown in the problem title?",
        hint: "In the Problems app, open the timeframe picker — 'Last 30 days' is available as a preset. Select it. Then click the 'Started' column header to sort ascending — oldest problems appear at the TOP of the list.",
        type: "multiple-choice",
        choices: [
          "frontend-high-cpu",
          "frontend-slow-disk",
          "ip-10-0-0-53",
          "webserver",
        ],
        correctChoice: "frontend-high-cpu",
        points: 100,
      },
      {
        id: "cp2",
        title: "Identify the Affected Mount Point",
        instruction:
          "Open the disk problem on frontend-high-cpu. Read the subtitle beneath the 'Disk available %' chart. Which disk mount point is at issue?",
        hint: "Open problem P-2602454. The Overview tab shows a 'Disk available %' time-series chart. The mount point appears in the chart subtitle and in the Davis® side panel under 'Disk: /data'. Full text: 'The total available space on disk /data is lower than 3%'.",
        type: "multiple-choice",
        choices: ["/", "/boot", "/data", "/var"],
        correctChoice: "/data",
        points: 150,
      },
      {
        id: "cp3",
        title: "Confirm the Alert Threshold",
        instruction:
          "Still on the disk problem detail page, what is the alert threshold percentage shown on the dashed line in the Disk available % chart?",
        hint: "The threshold is visible both as text in the event description AND as a dashed red horizontal line on the 'Disk available %' chart on the Overview tab. Look for the dashed red line at 3%.",
        type: "multiple-choice",
        choices: ["1%", "3%", "5%", "10%"],
        correctChoice: "3%",
        points: 150,
      },
      {
        id: "cp4",
        title: "Count the Disks on the Host",
        instruction:
          "From the problem P-2602454, click 'View host' to open the frontend-high-cpu host. Navigate to the 'Disk' or 'Storage' section. How many disks are shown?",
        hint: "From the problem detail, click 'View host'. In the host detail view, look for a Disk or Storage section. You may need to scroll or switch tabs to find the disk list. If you cannot find a disk count in the gen3 host view, try opening the host directly from Infrastructure & Operations and checking the storage section.",
        type: "multiple-choice",
        choices: ["2", "3", "4", "6"],
        correctChoice: "4",
        points: 150,
      },
    ],
  },
  {
    id: "mission-stone-wall",
    title: "Extract the Host Evidence",
    codename: "STONE WALL",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Go beyond the alert. Extract entity IDs, read Grail DQL, and confirm the host OS — the data needed to build automated remediation.",
    briefing:
      "The /data disk on frontend-high-cpu is critically full. The platform team needs more than the alert — they need the exact entity IDs, the Grail DQL metric driving the newer alert, and the host OS version to build an automated remediation workflow. Your job is to extract that data. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-iron-floor"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["infrastructure", "problems", "dql"],
    category: "configuration",
    apps: ["Infrastructure & Operations", "Problems"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the Host Entity ID",
        instruction:
          "Navigate to the Hosts app and open 'frontend-high-cpu'. What is the Dynatrace entity ID for this host? Check the browser URL or Properties and tags tab.",
        hint: "The entity ID appears in the URL bar when you open any host. It starts with HOST- followed by a hex string.",
        type: "multiple-choice",
        choices: [
          "HOST-07DAB01EB3E1AD56",
          "HOST-6C058190F4B22DD1",
          "HOST-BBDC2098409B0274",
          "HOST-3672868CCC50B397",
        ],
        correctChoice: "HOST-07DAB01EB3E1AD56",
        points: 150,
      },
      {
        id: "cp2",
        title: "Count the Open Problems on This Host",
        instruction:
          "On the frontend-high-cpu host detail page, how many open problems are shown in the red badge in the tab strip?",
        hint: "The red badge next to 'Properties and tags' in the host detail tab strip shows the count of active problems for this entity.",
        type: "multiple-choice",
        choices: ["1", "2", "3", "4"],
        correctChoice: "3",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Grail Metric in the Newer Disk Alert",
        instruction:
          "Open the disk alert that opened on March 4 (distinct from the February one). A Grail DQL query is shown on the problem detail page. What is the metric function used in the first line of the DQL?",
        hint: "In the Problems app set timeframe to Last 7 days and find the disk problem that opened on March 4. The Grail query block shows a DQL statement — read the timeseries keyword on line 1.",
        type: "multiple-choice",
        choices: [
          "timeseries disk_free=min(dt.host.disk.free)",
          "timeseries disk_used=max(dt.host.disk.used)",
          "timeseries disk_available=avg(dt.host.disk.avail.percent)",
          "fetch dt.host.disk.free",
        ],
        correctChoice: "timeseries disk_free=min(dt.host.disk.free)",
        points: 200,
      },
      {
        id: "cp4",
        title: "Confirm the Host OS Version",
        instruction:
          "On the frontend-high-cpu Properties and tags page, what Ubuntu version is this host running?",
        hint: "The OS version is listed in Properties and tags. Look for the OS type or OS version row. The kernel string includes -aws.",
        type: "multiple-choice",
        choices: [
          "Ubuntu 22.04.1 LTS",
          "Ubuntu 22.04.3 LTS",
          "Ubuntu 24.04.3 LTS",
          "Amazon Linux 2023",
        ],
        correctChoice: "Ubuntu 24.04.3 LTS",
        points: 150,
      },
    ],
  },
  {
    id: "mission-silent-query",
    title: "Investigate the Database Failure",
    codename: "SILENT QUERY",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "A MySQL database critical to the ecommerce platform has been unavailable for over three days. Investigate, identify, classify.",
    briefing:
      "A MySQL database critical to the ecommerce platform has been unavailable for over three days. Nobody escalated it. Your job is to find the problem, identify the full database endpoint, confirm the alert classification, and extract the entity ID — this all goes in the incident report. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 360,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "incident-commander", xp: 75 },
      { track: "sre", xp: 50 },
    ],
    topics: ["problems", "infrastructure"],
    category: "incident-response",
    apps: ["Problems"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the MySQL Availability Problem",
        instruction:
          "In the Problems app set timeframe to Last 7 days. Find the open AVAILABILITY problem titled 'MySQL availability'. What is the full entity name shown in the problem header?",
        hint: "Filter by AVAILABILITY severity or sort by duration. The entity name in the header is the full RDS connection string, not just a hostname.",
        type: "multiple-choice",
        choices: [
          "MySQL @ mysql-8-4-dynatrace-demo.ckhuiwsqmnv8.us-east-1.rds.amazonaws.com:3306/ecommerce_db",
          "MySQL @ unguard-mariadb:3306/memberships",
          "MySQL @ astroshop-playground-productcatalog-db:5432/postgres",
          "MySQL @ ip-10-0-0-53:3306/ecommerce_db",
        ],
        correctChoice:
          "MySQL @ mysql-8-4-dynatrace-demo.ckhuiwsqmnv8.us-east-1.rds.amazonaws.com:3306/ecommerce_db",
        points: 100,
      },
      {
        id: "cp2",
        title: "Extract the Database Name",
        instruction:
          "From the entity name visible in the MySQL availability problem, what is the database name at the end of the connection string (after the port number)?",
        hint: "The entity name follows the pattern: MySQL @ hostname:port/dbname. The database name is the last segment after the slash.",
        type: "multiple-choice",
        choices: ["mysql_prod", "ecommerce_db", "playground_db", "easytrade"],
        correctChoice: "ecommerce_db",
        points: 150,
      },
      {
        id: "cp3",
        title: "Confirm the Alert Type Classification",
        instruction:
          "In the problem for P-2603263, click the Events tab. Expand the 'MySQL availability' event group. Click the Properties sub-tab. Search for 'db_ready' in the search box. What is the value of event.db_ready_made_alert_type?",
        hint: "Navigate to: Events tab → expand the MySQL availability event → Properties sub-tab → type 'db_ready' in the search bar. The field won't appear by default when scrolling — you need to search for it.",
        type: "multiple-choice",
        choices: [
          "DB_CONNECTION_FAILED",
          "DB_AVAILABILITY_EVENT",
          "DB_SLOW_QUERY_DETECTED",
          "CUSTOM_ALERT",
        ],
        correctChoice: "DB_AVAILABILITY_EVENT",
        points: 200,
      },
      {
        id: "cp4",
        title: "Find the Entity ID",
        instruction:
          "Still in the Properties sub-tab of the MySQL availability event, scroll down to find dt.source_entity. What prefix does the entity ID start with?",
        hint: "In the Properties sub-tab (same place as CP3), scroll through the list — dt.source_entity is visible without searching. RDS instances monitored via extension appear as CUSTOM_DEVICE entities.",
        type: "multiple-choice",
        choices: [
          "HOST-07DAB01EB3E1AD56",
          "CUSTOM_DEVICE-BBDC2098409B0274",
          "SERVICE-5F8F858524885FDD",
          "PROCESS_GROUP-3672868CCC50B397",
        ],
        correctChoice: "CUSTOM_DEVICE-BBDC2098409B0274",
        points: 150,
      },
    ],
  },
  {
    id: "mission-golden-signal",
    title: "Find the Failing SLO",
    codename: "GOLDEN SIGNAL",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "Before you can declare a customer-facing incident, you need to catalogue the SLOs defined in your environment.",
    briefing:
      "Service-Level Objectives define the contract between your platform and your users. Before you can declare a customer-facing incident, you need to catalogue the SLOs that exist — find each target, warning threshold, and signal type across EasyTravel, Astroshop, and CUJ services. This intelligence is required before any incident declaration. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission. Note: The Service-Level Objectives app may be listed under Apps → Software Delivery in your environment.",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "incident-commander", xp: 75 },
      { track: "sre", xp: 25 },
    ],
    topics: ["slo", "services"],
    category: "incident-response",
    apps: ["Service-Level Objectives"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the EasyTravel Performance SLO Target",
        instruction:
          "In the Service-Level Objectives app, find the SLO named 'Performance SLO for my critical EasyTravel services'. What is its target?",
        hint: "Open the SLOs app from Apps → Software Delivery (or search 'Service-Level Objectives' in the Apps search). Search for 'EasyTravel'. The target is shown in the Target column.",
        type: "multiple-choice",
        choices: ["85%", "90%", "95%", "99%"],
        correctChoice: "90%",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find the Astroshop Service Performance SLO",
        instruction:
          "Find the Astroshop service performance SLO. What is its target?",
        hint: "Search for 'Astroshop' in the SLO list. Look for the service performance SLO — the target is shown in the Target column.",
        type: "multiple-choice",
        choices: ["90%", "95%", "98%", "99%"],
        correctChoice: "95%",
        points: 150,
      },
      {
        id: "cp3",
        title: "Find the Astroshop User Conversion Rate SLO Warning",
        instruction:
          "Find the Astroshop user conversion rate SLO. What is the warning threshold?",
        hint: "Search for 'Astroshop' and find the user-conversion rate SLO. The warning threshold is shown in the Warning column (the yellow threshold).",
        type: "multiple-choice",
        choices: ["50%", "60%", "66%", "75%"],
        correctChoice: "66%",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the CUJ Availability SLO Target",
        instruction:
          "Find the availability SLO for CUJ services. What is its target?",
        hint: "Search for 'CUJ' in the SLO list. Find the availability SLO — the target is in the Target column.",
        type: "multiple-choice",
        choices: ["95%", "98%", "99%", "99.9%"],
        correctChoice: "99%",
        points: 150,
      },
    ],
  },
  {
    id: "mission-orient-platform",
    title: "Orient the Platform",
    codename: "GROUND ZERO",
    role: "IT Ops / Admin",
    difficulty: "rookie",
    description:
      "You have access to Dynatrace. Now what? Navigate the platform, find your bearings, and understand what's being monitored.",
    briefing:
      "Every operator needs to know the terrain before anything breaks. Open the Dynatrace Playground and spend 5 minutes mapping the landscape — what's monitored, how the environment is organized, and where to find the controls. Use the playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "platform-engineer", xp: 50 }],
    topics: ["settings", "infrastructure"],
    category: "configuration",
    apps: ["Infrastructure & Operations", "Discovery & Coverage", "Settings"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Infrastructure & Operations",
        instruction:
          "Open the Infrastructure & Operations app (Apps menu → Infrastructure Observability). How many entity types are listed in the left sidebar of the app?",
        hint: "Open the Apps menu and look under the 'Infrastructure Observability' section. The app is listed there as 'Infrastructure & Operations'.",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6 or more"],
        correctChoice: "5",
        points: 100,
      },
      {
        id: "cp2",
        title: "Check Discovery & Coverage",
        instruction:
          "Open the Discovery & Coverage app (Apps menu → Manage). What is the first coverage category shown on the page?",
        hint: "Discovery & Coverage shows your monitoring coverage across entity types. The first category shown has a coverage percentage next to it.",
        type: "multiple-choice",
        choices: ["Host coverage", "Service coverage", "Application coverage", "Infrastructure coverage"],
        correctChoice: "Host coverage",
        points: 100,
      },
      {
        id: "cp3",
        title: "Find Settings",
        instruction:
          "Open the Settings app from the Apps menu (grid icon → search 'Settings'). What is the first main category listed in the Settings left sidebar?",
        hint: "Settings is in the Apps menu, not the left nav bar. Once open, look at the left sidebar — the first category is a data collection topic.",
        type: "multiple-choice",
        choices: [
          "General settings",
          "Collect and capture",
          "Anomaly detection",
          "Environment segmentation",
        ],
        correctChoice: "Collect and capture",
        points: 150,
      },
      {
        id: "cp4",
        title: "Explore Notification Settings",
        instruction:
          "In Settings, navigate to Analyze and alert → Notifications. How many configuration options are listed?",
        hint: "Open Settings from the left sidebar. In the Settings left nav, click 'Analyze and alert', then click 'Notifications' in the main panel. Count every item listed inside the Notifications section.",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6"],
        correctChoice: "5",
        points: 150,
      },
    ],
  },
  {
    id: "mission-read-dashboard",
    title: "Read the Dashboard",
    codename: "GLASS HOUSE",
    role: "Business Analyst",
    difficulty: "rookie",
    description:
      "Dashboards are your single pane of glass. Learn to navigate them, read what they're telling you, and find the signal in the noise.",
    briefing:
      "Before you can report on anything, you need to know where the data lives. Open the Dynatrace Playground and explore what's already built for you — without configuring anything. Use the playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "sre", xp: 50 }],
    topics: ["dashboards", "metrics", "infrastructure"],
    category: "configuration",
    apps: ["Dashboards"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Dashboards",
        instruction:
          "Open the Dashboards app in the Dynatrace Playground. How many dashboards are available out of the box?",
        hint: "Click the 'Ready-made' tab in the Dashboards app to see dashboards pre-built by Dynatrace. The list is paginated — you don't need to count them all, just confirm there are many more than 15.",
        type: "multiple-choice",
        choices: [
          "None — you have to create them",
          "1-5",
          "6-15",
          "More than 15",
        ],
        correctChoice: "More than 15",
        points: 100,
      },
      {
        id: "cp2",
        title: "Open the Infrastructure Observability Dashboard",
        instruction:
          "In the Dashboards app, click the 'Ready-made' tab and open the 'Infrastructure Observability Dashboard'. What does the first row of tiles show?",
        hint: "Search for 'Infrastructure' in the Dashboards list or browse the Ready-made tab. Open the dashboard owned by the Infrastructure & Operations app. Look at the very first row of tiles across the top.",
        type: "multiple-choice",
        choices: [
          "CPU, memory, and disk usage",
          "Host counts, availability, and problem indicators",
          "Request rate and error rate",
          "Log volume and ingestion rate",
        ],
        correctChoice: "Host counts, availability, and problem indicators",
        points: 150,
      },
      {
        id: "cp3",
        title: "Change the timeframe",
        instruction:
          "In the dashboard, change the timeframe selector to 'Last 2 hours'. Does the data in the tiles update?",
        hint: "The timeframe selector is in the top right of the dashboard. Select 'Last 2 hours' and observe whether the tile data refreshes.",
        type: "multiple-choice",
        choices: [
          "Yes, all tiles update to reflect the new timeframe",
          "No, dashboards use a fixed timeframe",
          "Only some tiles update",
          "The option doesn't exist",
        ],
        correctChoice: "Yes, all tiles update to reflect the new timeframe",
        points: 150,
      },
    ],
  },
  {
    id: "mission-find-the-log",
    title: "Find the Log",
    codename: "PAPER TRAIL",
    role: "SRE",
    difficulty: "rookie",
    description:
      "Alerts tell you something is wrong. Logs tell you why. Learn to find, filter, and read logs in Dynatrace before you need them under pressure.",
    briefing:
      "Log analysis is one of the most powerful tools in your arsenal — and one of the most underused. Open the Dynatrace Playground and navigate the Logs app for the first time. You'll need this in every investigation that follows. Use the playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "incident-commander", xp: 25 },
    ],
    topics: ["logs", "problems", "infrastructure"],
    category: "incident-response",
    apps: ["Logs"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open the Logs app",
        instruction:
          "Open the Logs app in the Dynatrace Playground. What is the default timeframe shown when you first open it? The default is Last 30 minutes.",
        hint: "When you first open the Logs app, check what the timeframe selector shows in the top-right. The default is Last 30 minutes.",
        type: "multiple-choice",
        choices: [
          "Last 15 minutes",
          "Last 30 minutes",
          "Last 6 hours",
          "Last 24 hours",
        ],
        correctChoice: "Last 30 minutes",
        points: 100,
      },
      {
        id: "cp2",
        title: "Filter by log level",
        instruction:
          "Filter the logs to show only ERROR level entries. Approximately how many ERROR log entries are visible in the last 2 hours?",
        hint: "In the filter bar, type 'status=error' — the UI will auto-format it to 'status = ERROR'. Alternatively, click the 'Error' checkbox in the left facet panel. Note: the list shows '1K of 34K records' — the table caps at 1,000 rows but the true count is the second number.",
        type: "multiple-choice",
        choices: ["0 — no errors", "Fewer than 50", "50-500", "More than 500"],
        correctChoice: "More than 500",
        points: 150,
      },
      {
        id: "cp3",
        title: "Read a log entry",
        instruction:
          "Click on any ERROR log entry to expand it. Which field tells you which host or service produced this log? Note: Network device and syslog entries may not show these fields. Look for an application or container log (e.g. one with content like 'OTel export failure' or a Kubernetes log).",
        hint: "Click an application-style ERROR log entry. In the expanded view, look in the Topology section for dt.entity.host or the Fields section for host.name. If neither appears, try a different log entry — network device logs use different fields.",
        type: "multiple-choice",
        choices: [
          "dt.entity.host or host.name",
          "log.level",
          "timestamp",
          "message",
        ],
        correctChoice: "dt.entity.host or host.name",
        points: 150,
      },
      {
        id: "cp4",
        title: "Correlate with a problem",
        instruction:
          "In the Logs app, use the filter to search for logs related to 'easytrade'. How many log lines mention easytrade in the last 2 hours?",
        hint: "Type 'easytrade' in the filter bar. A dropdown will appear asking you to select a filter type — choose 'content = *easytrade* (Contains)'. The count will update to show matching records.",
        type: "multiple-choice",
        choices: ["0", "1-100", "100-1000", "More than 1000"],
        correctChoice: "More than 1000",
        points: 200,
      },
    ],
  },
  {
    id: "mission-ask-the-ai",
    title: "Ask the Machine",
    codename: "DAVIS",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "The AI knows your environment. You just have to ask.",
    briefing:
      "Dynatrace Assist is not a chatbot. It's an AI that knows your infrastructure, your services, your logs, and your problems — and can query all of it in plain English. Before you write a single line of DQL, learn what the machine already knows. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-the-dock"],
    disciplines: [
      { track: "sre", xp: 50 },
      { track: "platform-engineer", xp: 25 },
    ],
    topics: ["dt-intelligence", "dql"],
    category: "configuration",
    apps: ["Dynatrace Assist", "Notebooks"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find Dynatrace Assist",
        instruction:
          "In the Dock, what is the keyboard shortcut to open Dynatrace Assist?",
        hint: "Look at the upper section of the Dock — Assist sits alongside Search and Apps. The shortcut is shown next to its label.",
        type: "multiple-choice",
        choices: ["Ctrl+I", "Ctrl+A", "Ctrl+D", "Ctrl+K"],
        correctChoice: "Ctrl+I",
        points: 100,
      },
      {
        id: "cp2",
        title: "Ask About Open Problems",
        instruction:
          "Open Dynatrace Assist and ask: 'What problems are open right now?' What does it return?",
        hint: "Dynatrace Assist has access to your environment data. It can query live data and return a natural language summary — it does not just redirect you to another app.",
        type: "multiple-choice",
        choices: [
          "A summary of open problems from your environment",
          "An error — it requires admin permissions",
          "A link to the Problems app only",
          "Nothing — it needs configuration first",
        ],
        correctChoice: "A summary of open problems from your environment",
        points: 150,
      },
      {
        id: "cp3",
        title: "Natural Language Queries in Notebooks",
        instruction:
          "Open Notebooks and click Add. What is the option called that lets you type a plain English question and have Assist generate a DQL query?",
        hint: "It's in the Add menu alongside DQL, Markdown, and other section types. Look for the AI-powered option.",
        type: "multiple-choice",
        choices: ["Prompt", "AI Query", "Davis CoPilot", "Natural Language"],
        correctChoice: "Prompt",
        points: 150,
      },
      {
        id: "cp4",
        title: "Generate DQL Only",
        instruction:
          "In a Notebooks Prompt section, there is an option to see the generated query before running it. What is this option called?",
        hint: "Look at the dropdown arrow next to the Run button in a Prompt section. There is an alternative action listed there.",
        type: "multiple-choice",
        choices: [
          "Generate DQL only",
          "Preview query",
          "Dry run",
          "Show DQL",
        ],
        correctChoice: "Generate DQL only",
        points: 150,
      },
      {
        id: "cp5",
        title: "What Assist Cannot Do",
        instruction:
          "Which of these is something Dynatrace Assist will NOT do?",
        hint: "Assist can query, explain, summarize, and suggest — but it operates within the boundaries of observability. It does not have write access to your infrastructure.",
        type: "multiple-choice",
        choices: [
          "Automatically fix problems in your environment",
          "Generate a DQL query from plain English",
          "Summarize an open problem's root cause",
          "Explain what an existing DQL query does",
        ],
        correctChoice: "Automatically fix problems in your environment",
        points: 200,
      },
    ],
  },
  {
    id: "mission-find-your-answers",
    title: "Find Your Answers",
    codename: "OPEN SOURCE",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "Dynatrace Assist won't know everything. The community will. Learn where to go before you're stuck at 2am.",
    briefing:
      "Every operator eventually hits a wall — something Assist can't explain, something the docs don't cover, something only someone who's been there can answer. The Dynatrace ecosystem has three lifelines: the community, the university, and the documentation. This mission teaches you where they live and how to reach them — from inside the platform and from the browser. You don't need the Playground for all of this, just a browser and the Dock.",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-ask-the-ai"],
    disciplines: [
      { track: "sre", xp: 50 },
      { track: "platform-engineer", xp: 50 },
    ],
    topics: ["community"],
    category: "configuration",
    apps: [],
    checkpoints: [
      {
        id: "cp1",
        title: "Support Resources in the Dock",
        instruction:
          "Open the Support menu at the bottom of the Dock in the Playground. How many items are listed under Support resources (not Developer resources)?",
        hint: "The Support menu has two groups. Count only the items in the first group — Support resources. Live chat counts as one item.",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6"],
        correctChoice: "5",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find the Community",
        instruction:
          "Navigate to community.dynatrace.com. In the top navigation, what is the name of the section specifically for new Dynatrace users getting started?",
        hint: "Look at the Learn section in the community navigation. There is a dedicated space for users who are just beginning their Dynatrace journey.",
        type: "multiple-choice",
        choices: [
          "Start with Dynatrace",
          "Open Q&A",
          "Troubleshooting",
          "Product News",
        ],
        correctChoice: "Start with Dynatrace",
        points: 100,
      },
      {
        id: "cp3",
        title: "Where to Ask a Question",
        instruction:
          "On community.dynatrace.com, what is the name of the forum section for questions that don't fit a specific category?",
        hint: "Look under the Ask section in the community navigation. There is a catch-all Q&A section for general questions.",
        type: "multiple-choice",
        choices: ["Open Q&A", "Troubleshooting", "Start with Dynatrace", "Ask Moderators"],
        correctChoice: "Open Q&A",
        points: 100,
      },
      {
        id: "cp4",
        title: "Dynatrace University",
        instruction:
          "Navigate to university.dynatrace.com. What is the primary navigation tab for all learning content?",
        hint: "Look at the main tabs across the top of the DTU homepage. The primary tab covers both courses and structured learning plans.",
        type: "multiple-choice",
        choices: [
          "Courses and learning plans",
          "Certifications",
          "Hands-on labs",
          "Live training",
        ],
        correctChoice: "Courses and learning plans",
        points: 150,
      },
      {
        id: "cp5",
        title: "Developer Resources",
        instruction:
          "Back in the Dock Support menu — which of these is listed under Developer resources, not Support resources?",
        hint: "Developer resources are for building on the platform — extensions, apps, APIs. Support resources are for users getting help with the product.",
        type: "multiple-choice",
        choices: [
          "Dynatrace Developer",
          "Documentation",
          "Community",
          "University",
        ],
        correctChoice: "Dynatrace Developer",
        points: 150,
      },
      {
        id: "cp6",
        title: "Live Help",
        instruction:
          "If you need to speak directly with a Dynatrace product expert in real time, which Support resource do you use?",
        hint: "This option puts you in touch with a real human — not a chatbot. It's listed at the bottom of the Support resources section in the Dock.",
        type: "multiple-choice",
        choices: [
          "Live chat",
          "Community",
          "University",
          "Dynatrace Developer",
        ],
        correctChoice: "Live chat",
        points: 150,
      },
    ],
  },
  {
    id: "mission-follow-the-error",
    title: "Follow the Error",
    codename: "WIRE TRACE",
    role: "Developer",
    difficulty: "operator",
    description:
      "A frontend is flagging errors. Trace one from the browser session all the way to the failing backend call.",
    briefing:
      "Users are hitting errors on the Astroshop frontend but nobody has looked at them yet. Your job is to find the error in Experience Vitals, drill into Error Inspector, follow a session, then trace the backend call to root cause. No guessing — follow the chain. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-orient-platform"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 50 },
    ],
    topics: ["dem", "traces", "services"],
    category: "root-cause-analysis",
    apps: ["Experience Vitals", "Error Inspector"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Experience Vitals and Count Frontends",
        instruction:
          "Open the Experience Vitals app (Apps → Digital Experience → Experience Vitals). Click 'Explore'. How many frontends are listed?",
        hint: "Experience Vitals is under Apps → Digital Experience. Click 'Explore' on the landing page to open the full frontend list. Count every row — include all types (Web, Custom).",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6"],
        correctChoice: "5",
        points: 100,
      },
      {
        id: "cp2",
        title: "Check the Astroshop Error Rate",
        instruction:
          "Click into the Astroshop frontend. Find the error rate shown in the overview. What is the approximate error rate per minute displayed?",
        hint: "The Astroshop frontend overview shows an error rate as a rate (e.g. X /min), not a total count. Look for a number followed by '/min' in the Errors section.",
        type: "multiple-choice",
        choices: ["0 /min — no errors", "Less than 0.5 /min", "0.5–2 /min", "More than 2 /min"],
        correctChoice: "Less than 0.5 /min",
        points: 150,
      },
      {
        id: "cp3",
        title: "Open Error Inspector and Find the Error Category",
        instruction:
          "From the Astroshop errors view, open Error Inspector. What is the error category of the top error entry?",
        hint: "Click an error entry to open Error Inspector. The error category badge appears next to the error name — look for labels like 'Failed request', 'JavaScript error', 'Custom error', etc.",
        type: "multiple-choice",
        choices: ["JavaScript error", "Failed request", "Custom error", "Resource error"],
        correctChoice: "Failed request",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the Trace ID",
        instruction:
          "In Error Inspector, look at the Occurrences table for the top error. Is a Trace column present with a trace ID value?",
        hint: "In the error detail view, scroll to the Occurrences section. Look for a 'Trace' column — it shows a shortened trace ID (e.g. '0f7e...'). This links the browser error to a backend trace.",
        type: "multiple-choice",
        choices: [
          "Yes — a Trace column with a trace ID is visible",
          "No — no trace information is shown",
          "Yes — but only for some occurrences",
          "The column exists but all values are empty",
        ],
        correctChoice: "Yes — a Trace column with a trace ID is visible",
        points: 200,
      },
    ],
  },
  {
    id: "mission-find-the-vulnerability",
    title: "Find the Vulnerability",
    codename: "ZERO DAY",
    role: "Developer",
    difficulty: "operator",
    description:
      "A vulnerable library is running in production. Find it, assess the blast radius, and identify where it lives.",
    briefing:
      "Application Security is flagging vulnerabilities in the Playground environment. Before anything gets patched, you need to understand what's exposed — library name, severity, which process it's running in, and how many instances are affected. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-orient-platform"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "platform-engineer", xp: 75 },
    ],
    topics: ["security", "services"],
    category: "root-cause-analysis",
    apps: ["Application Security"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Application Security and Count Critical Vulnerabilities",
        instruction:
          "Open Application Security (search 'Application Security' in the Apps menu). How many CRITICAL vulnerabilities are shown in the overview?",
        hint: "The Application Security overview shows a shield graphic with vulnerability counts by severity. Add the Critical count from both Third-party vulnerabilities and Code-level vulnerabilities sections.",
        type: "multiple-choice",
        choices: ["0", "1–10", "11–25", "More than 25"],
        correctChoice: "11–25",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find the Highest CVSS Score",
        instruction:
          "Navigate to the vulnerabilities list. Enable the CVSS Score column via the Columns button, then sort descending. What is the CVSS score of the top-scored vulnerability?",
        hint: "The CVSS Score column is hidden by default — click the 'Columns' button to enable it. Then click the column header to sort descending. Ignore entries showing 'Not available' — find the highest numeric score.",
        type: "multiple-choice",
        choices: ["7.0–8.9", "9.0–9.4", "9.5–9.9", "10.0"],
        correctChoice: "10.0",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Vulnerable Library",
        instruction:
          "Click into the vulnerability with CVSS score 10.0. What is the name of the vulnerable library?",
        hint: "The vulnerability detail page shows the affected library name and version. Look for the component name in the header — it will be in the format 'groupId:artifactId'. The CVE is CVE-2021-44228 (Log4Shell).",
        type: "multiple-choice",
        choices: ["log4j-core", "spring-webmvc", "netty-codec", "jackson-databind"],
        correctChoice: "log4j-core",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the Affected Namespace",
        instruction:
          "Still in the log4j-core vulnerability detail, find the Affected entities section. What Kubernetes namespace contains the affected process?",
        hint: "The Affected entities section lists the process groups running the vulnerable library. Look for a Kubernetes namespace tag on the process entity — it appears as a tag like '[Kubernetes]namespace:name'.",
        type: "multiple-choice",
        choices: ["default", "prod", "unguard", "easytrade"],
        correctChoice: "unguard",
        points: 200,
      },
    ],
  },
  {
    id: "mission-trace-the-transaction",
    title: "Trace the Transaction",
    codename: "PAPER TRAIL",
    role: "Developer",
    difficulty: "operator",
    description:
      "Business events track what matters to the business. Learn to query them before someone asks you why revenue dropped.",
    briefing:
      "Business events (bizevents) in the Playground capture real application activity — orders, checkouts, user actions. Before you can build alerting on top of them, you need to know how to find them in Grail, what schema they use, and how to aggregate them. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-find-the-log"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 50 },
    ],
    topics: ["bizevents", "dql"],
    category: "performance",
    apps: ["Notebooks"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find Business Events in Grail",
        instruction:
          "Open Notebooks (Apps → Observe and explore → Notebooks). Create a new notebook and add a Code section. Run: `fetch bizevents | limit 5`. What is the value of the event.type field on the first result?",
        hint: "Add a Code tile in the notebook. Run the query exactly as written. The event.type field in the results table identifies the business process. The Playground runs AstroShop workloads — expect AstroShop event types.",
        type: "multiple-choice",
        choices: [
          "consume.order",
          "com.easytrade.buy-shares",
          "com.astroshop.checkout",
          "com.dynatrace.bizevents",
        ],
        correctChoice: "consume.order",
        points: 100,
      },
      {
        id: "cp2",
        title: "Count the Fields",
        instruction:
          'Modify the query to: `fetch bizevents | filter event.type == "consume.order" | limit 10`. How many column headers are visible in the result table?',
        hint: "Run the filtered query. Scroll right through the result table and count every column header. Include all fields — timestamp, event.type, Kubernetes metadata, AWS fields, and any application-specific fields.",
        type: "multiple-choice",
        choices: ["3–5", "6–10", "11–15", "More than 15"],
        correctChoice: "More than 15",
        points: 150,
      },
      {
        id: "cp3",
        title: "Aggregate the Count",
        instruction:
          'Run: `fetch bizevents | filter event.type == "consume.order" | summarize count = count()`. What range does the total count fall in?',
        hint: "The summarize command returns one row with a count column. This represents all consume.order events in the current timeframe (last 2 hours by default). The Playground generates continuous load.",
        type: "multiple-choice",
        choices: ["0–100", "100–1000", "1000–10000", "More than 10000"],
        correctChoice: "100–1000",
        points: 150,
      },
      {
        id: "cp4",
        title: "Identify the Event Provider",
        instruction:
          'Run: `fetch bizevents | filter event.type == "consume.order" | limit 1 | fields event.type, event.provider, event.kind`. What is the value of event.provider?',
        hint: "The fields command selects only the specified columns. event.provider identifies which application or system emitted this business event. Run the query and read the value in the event.provider column.",
        type: "multiple-choice",
        choices: ["astroshop.web", "dynatrace.platform", "easytrade.backend", "otel.collector"],
        correctChoice: "astroshop.web",
        points: 200,
      },
    ],
  },
  {
    id: "mission-map-the-topology",
    title: "Map the Topology",
    codename: "TERRAIN SCAN",
    role: "SRE",
    difficulty: "rookie",
    description:
      "Before an incident, you need to know what calls what. Use the Services app to map the easytrade dependency chain.",
    briefing:
      "When a slowdown fires in easytrade, you need to know the service topology instantly — what calls what, what type each service is, and where the database layer sits. Build that mental map now, before something breaks at 3am. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-what-are-you"],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "developer", xp: 50 },
    ],
    topics: ["services", "infrastructure"],
    category: "root-cause-analysis",
    apps: ["Services"],
    checkpoints: [
      {
        id: "cp1",
        title: "Count the easytrade Services",
        instruction:
          "Open the Services app (Apps → Observe and explore → Services). Filter by Kubernetes namespace 'easytrade'. How many services are listed?",
        hint: "In the Services app, use the filter bar to filter by Kubernetes namespace. Type 'easytrade' and select the namespace filter option. The count shown in the list header is the total.",
        type: "multiple-choice",
        choices: ["8", "12", "17", "24"],
        correctChoice: "17",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find the Database Service",
        instruction:
          "In the easytrade services list, find the service named 'TradeManagementSqlConnection'. What is its Dynatrace service type?",
        hint: "Click into TradeManagementSqlConnection. The service type is shown in the Properties section — it classifies how Dynatrace detected this service. A service that only handles database calls has a different type than a web service.",
        type: "multiple-choice",
        choices: ["WEB_SERVICE", "WEB_REQUEST_SERVICE", "DATABASE_SERVICE", "CUSTOM_SERVICE"],
        correctChoice: "DATABASE_SERVICE",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Database Host",
        instruction:
          "Still in TradeManagementSqlConnection, what is the name of the database host this service connects to?",
        hint: "The service detail page for a DATABASE_SERVICE shows connection properties including the hostname. Look for the host or database name field — this is an in-cluster database, not the RDS instance.",
        type: "multiple-choice",
        choices: [
          "mysql-8-4-dynatrace-demo.ckhuiwsqmnv8.us-east-1.rds.amazonaws.com",
          "easytrade-db",
          "unguard-mariadb",
          "astroshop-playground-productcatalog-db",
        ],
        correctChoice: "easytrade-db",
        points: 150,
      },
      {
        id: "cp4",
        title: "Identify the Login Service Technology",
        instruction:
          "In the easytrade services list, find 'easyTradeLoginService'. What technology stack does it run on?",
        hint: "The process group name for this service ends in .dll — a strong hint about the runtime. Check the technology tags on the service or its backing process group in the service detail.",
        type: "multiple-choice",
        choices: ["Java", "Go", "ASP.NET Core / .NET", "Node.js"],
        correctChoice: "ASP.NET Core / .NET",
        points: 200,
      },
    ],
  },
  {
    id: "mission-write-the-runbook",
    title: "Write the Runbook",
    codename: "FIELD NOTES",
    role: "SRE",
    difficulty: "operator",
    description:
      "A Notebook is your living runbook. Combine DQL queries, markdown context, and visualizations in one place your team can actually use.",
    briefing:
      "The next person on-call shouldn't have to figure out where to look. Build a Notebook that combines a DQL query with enough context that a new team member could follow it at 3am. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-find-the-log"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "platform-engineer", xp: 75 },
      { track: "developer", xp: 50 },
    ],
    topics: ["notebooks", "dql", "logs"],
    category: "configuration",
    apps: ["Notebooks"],
    checkpoints: [
      {
        id: "cp1",
        title: "Create a New Notebook",
        instruction:
          "Open Notebooks (Apps → Observe and explore → Notebooks). Create a new notebook. What is the default name?",
        hint: "Click the '+ Notebook' button. The default name appears in the header immediately. It is two words.",
        type: "multiple-choice",
        choices: ["Untitled", "Untitled notebook", "New Notebook", "My Notebook"],
        correctChoice: "Untitled notebook",
        points: 100,
      },
      {
        id: "cp2",
        title: "Add a DQL Code Section",
        instruction:
          'Add a Code section and run: `fetch logs | filter status == "ERROR" | limit 5 | fields timestamp, content, dt.entity.host`. How many columns appear in the result table?',
        hint: "Click + to add a section and choose Code (shortcut: Shift+D). Paste the query and run it. The fields command at the end selects exactly which columns to show — count the column headers.",
        type: "multiple-choice",
        choices: ["2", "3", "4", "5"],
        correctChoice: "3",
        points: 150,
      },
      {
        id: "cp3",
        title: "Count the Visualization Options",
        instruction:
          "With the DQL result showing, open the visualization switcher (Options button → ≡ icon). How many total visualization types are available?",
        hint: "Click the Options (≡) icon in the DQL section toolbar to open the visualization panel. Count every visualization type shown — include both the standard section and any additional sections like NEW.",
        type: "multiple-choice",
        choices: ["5–10", "11–15", "16–20", "More than 20"],
        correctChoice: "More than 20",
        points: 150,
      },
      {
        id: "cp4",
        title: "Add a Markdown Section",
        instruction:
          "Add a Markdown section to your notebook (shortcut: Shift+M). Does it support tables?",
        hint: "Once the Markdown section is active, look at the formatting toolbar. Check for a table insertion button — it should appear alongside bold, italic, headers, and lists.",
        type: "multiple-choice",
        choices: [
          "No — tables are not supported",
          "Yes — via an Insert table button in the toolbar",
          "Yes — but only via raw HTML",
          "Yes — but only via copy-paste from Excel",
        ],
        correctChoice: "Yes — via an Insert table button in the toolbar",
        points: 200,
      },
    ],
  },
  {
    id: "mission-trigger-the-workflow",
    title: "Trigger the Workflow",
    codename: "PULL THE CORD",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Automation isn't magic — it's a chain of triggers, conditions, and actions. Read one before you build one.",
    briefing:
      "Dynatrace Workflows let you automate responses to events — problems, deployments, schedule-based triggers. Before you write your own, you need to understand what's already running and how the trigger → action chain works. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-orient-platform"],
    disciplines: [
      { track: "platform-engineer", xp: 125 },
      { track: "sre", xp: 75 },
    ],
    topics: ["automation", "problems"],
    category: "configuration",
    apps: ["Workflows"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Workflows and Count All Workflows",
        instruction:
          "Open the Workflows app (accessible from the left sidebar or Apps → Automate → Workflows). Set the Owner filter to 'All'. How many workflows are listed?",
        hint: "The Workflows app defaults to showing only your own workflows. Change the Owner dropdown to 'All' to see the full list. The count is shown in the table header or pagination.",
        type: "multiple-choice",
        choices: ["1–10", "11–20", "21–35", "More than 35"],
        correctChoice: "21–35",
        points: 100,
      },
      {
        id: "cp2",
        title: "Count the Trigger Types",
        instruction:
          "Click '+ Workflow', then 'Create a blank workflow'. Open the trigger side panel. How many trigger types are available?",
        hint: "After clicking '+ Workflow', select 'Create a blank workflow'. The canvas shows a Trigger block — open the side panel (properties icon) to see all trigger type options. Count every distinct type listed.",
        type: "multiple-choice",
        choices: ["3", "5", "7", "9 or more"],
        correctChoice: "7",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Schedule Trigger Formats",
        instruction:
          "How many distinct schedule-based trigger types are available?",
        hint: "In the trigger type list, look for all entries under the Schedule category. Count each one separately — Fixed time, Interval, and Cron are all distinct trigger types.",
        type: "multiple-choice",
        choices: ["1", "2", "3", "4"],
        correctChoice: "3",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the Action Type in an Existing Workflow",
        instruction:
          "Cancel back to the workflow list. Open the workflow named '[Astroshop] Generate delivery event - batch - v1'. What action type does it use?",
        hint: "Open the workflow and look at the first (and only) action block in the canvas. The action type is shown in the block header or the side panel — look for labels like 'Run script', 'HTTP request', 'Send notification', etc.",
        type: "multiple-choice",
        choices: ["HTTP request", "Run script", "Send notification", "Davis problem analysis"],
        correctChoice: "Run script",
        points: 200,
      },
    ],
  },
  {
    id: "mission-the-dock",
    title: "Find Your Footing",
    codename: "DOCK WALK",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "You just logged in. Before anything breaks, learn where everything lives.",
    briefing:
      "Every operator needs to know the terrain before the first alert fires. The Dock is your control panel — navigation, search, support, and your account all live there. Spend 5 minutes mapping it before you need it under pressure. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "platform-engineer", xp: 50 }],
    topics: ["settings", "infrastructure"],
    category: "configuration",
    apps: ["Dock", "Apps"],
    checkpoints: [
      {
        id: "cp1",
        title: "Locate Dynatrace Assist in the Dock",
        instruction:
          "In the Dock, where does the Assist option appear?",
        hint: "The Dock has three sections: upper (home, search, assist, apps), middle (pinned apps), and lower (collapse, support, user). Assist is in the upper section.",
        type: "multiple-choice",
        choices: [
          "At the top, alongside Search and Apps",
          "In the pinned apps section",
          "In the Support menu",
          "In the User menu",
        ],
        correctChoice: "At the top, alongside Search and Apps",
        points: 100,
      },
      {
        id: "cp2",
        title: "Platform Search Shortcut",
        instruction:
          "What is the keyboard shortcut to open platform Search from anywhere in Dynatrace?",
        hint: "The shortcut is shown next to the Search label in the Dock. It works from any screen in the platform.",
        type: "multiple-choice",
        choices: ["Ctrl+K", "Ctrl+S", "Ctrl+F", "Ctrl+Space"],
        correctChoice: "Ctrl+K",
        points: 100,
      },
      {
        id: "cp3",
        title: "Support Menu — Developer Resources",
        instruction:
          "Open the Support menu (bottom of the Dock). Which of these is listed under Developer resources, NOT Support resources?",
        hint: "The Support menu has two groups: Support resources and Developer resources. Documentation, Community, University, and Live chat are Support resources. Developer resources are for building on the platform.",
        type: "multiple-choice",
        choices: [
          "Dynatrace Developer",
          "Documentation",
          "Community",
          "University",
        ],
        correctChoice: "Dynatrace Developer",
        points: 150,
      },
      {
        id: "cp4",
        title: "Account Management",
        instruction:
          "Open your user menu (your name at the bottom of the Dock). Which option opens Account Management?",
        hint: "Account Management opens in a new tab — look for the external link icon next to it in the user menu.",
        type: "multiple-choice",
        choices: [
          "Account Management",
          "User settings",
          "Environments",
          "Appearance",
        ],
        correctChoice: "Account Management",
        points: 150,
      },
      {
        id: "cp5",
        title: "Apps Grid Categories",
        instruction:
          "Open the Apps grid (grid icon in the Dock). How many top-level category sections are listed?",
        hint: "Scroll through the full Apps grid and count every category header — include all sections from Observe and explore through to Other.",
        type: "multiple-choice",
        choices: ["9", "5", "6", "12"],
        correctChoice: "9",
        points: 150,
      },
    ],
  },
  {
    id: "mission-first-dql",
    title: "Your First DQL",
    codename: "QUERY ZERO",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "Plain English gets you started. DQL gets you answers.",
    briefing:
      "Dynatrace Assist can write queries for you — but understanding DQL means you can go further, faster. Open Notebooks in the Playground and learn the four commands every operator needs: fetch, fields, filter, summarize. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-ask-the-ai"],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "developer", xp: 50 },
    ],
    topics: ["dql", "logs"],
    category: "configuration",
    apps: ["Notebooks"],
    checkpoints: [
      {
        id: "cp1",
        title: "Fetch and Fields",
        instruction:
          "Open Notebooks, create a new notebook, add a Code section, and run: `fetch logs | limit 5 | fields timestamp, content, status` — which columns appear in the result?",
        hint: "The fields command selects only the columns you name. Run the query and look at the column headers in the result table.",
        type: "multiple-choice",
        choices: [
          "timestamp, content, status",
          "timestamp, message, level",
          "time, log, severity",
          "date, content, type",
        ],
        correctChoice: "timestamp, content, status",
        points: 100,
      },
      {
        id: "cp2",
        title: "Summarize by Status",
        instruction:
          "Run: `fetch logs | summarize count = count(), by:{status}` — how many distinct status values appear in the result?",
        hint: "The summarize command groups results. Each row in the output represents one distinct status value. Count the rows.",
        type: "multiple-choice",
        choices: ["4", "2", "3", "5 or more"],
        correctChoice: "4",
        points: 150,
      },
      {
        id: "cp3",
        title: "Identify the Status Values",
        instruction:
          "Using the same summarize query, which of these is NOT one of the status values returned?",
        hint: "The four status values in the result are standard log levels. One common log level you might expect to see is missing from the Playground's log schema.",
        type: "multiple-choice",
        choices: ["CRITICAL", "ERROR", "INFO", "WARN"],
        correctChoice: "CRITICAL",
        points: 150,
      },
      {
        id: "cp4",
        title: "Filter with No Results",
        instruction:
          "Run: `fetch logs | limit 5 | fields timestamp, content, status | filter status == \"ERROR\"` — if there are no ERROR logs in the current timeframe, what message does Dynatrace show?",
        hint: "Try running the query. If it returns results, change the timeframe to a quieter window. The message appears below the column headers when no records match.",
        type: "multiple-choice",
        choices: [
          "No records. Try adjusting the timeframe, segment, data or permissions.",
          "An error message saying the query is invalid",
          "An empty table with no message",
          "A timeout error",
        ],
        correctChoice:
          "No records. Try adjusting the timeframe, segment, data or permissions.",
        points: 150,
      },
      {
        id: "cp5",
        title: "Correct Fetch Target for Logs",
        instruction:
          "In DQL, which of these is the correct command to query log data?",
        hint: "DQL uses fetch as the starting command followed by the data source name. Log data has its own dedicated source name.",
        type: "multiple-choice",
        choices: [
          "fetch logs",
          "fetch metrics",
          "get logs",
          "select logs",
        ],
        correctChoice: "fetch logs",
        points: 100,
      },
    ],
  },
  {
    id: "mission-deploy-agent",
    title: "Deploy Your First Agent",
    codename: "FIRST CONTACT",
    role: "Platform Engineer",
    difficulty: "rookie",
    description:
      "No data without an agent. Learn where OneAgent lives in Dynatrace and how to get it onto your infrastructure.",
    briefing:
      "Everything in Dynatrace starts with data — and data starts with OneAgent. Before you can monitor anything in your own environment, you need to know how to deploy the agent, what it does when it lands, and where to track your deployments. This mission uses the Playground to show you what a healthy deployment looks like, then sends you to the docs to learn how to do it yourself. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-orient-platform"],
    disciplines: [
      { track: "platform-engineer", xp: 75 },
      { track: "sre", xp: 25 },
    ],
    topics: ["infrastructure", "settings"],
    category: "configuration",
    apps: ["Deployment Status"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find Deployment Status",
        instruction:
          "Open the Deployment Status app in the Playground (Apps → Manage → Deployment Status). How many OneAgent-monitored hosts are listed?",
        hint: "Deployment Status is under Apps → Manage. The page header shows the total host count — look for 'Showing X hosts' or similar text at the top of the table.",
        type: "multiple-choice",
        choices: ["8", "12", "16", "20 or more"],
        correctChoice: "16",
        points: 100,
      },
      {
        id: "cp2",
        title: "Read an Agent Entry",
        instruction:
          "Look at the first host in the Deployment Status list. What are the three column headers shown in the table?",
        hint: "Look at the table header row across the top of the OneAgents list. There are three column headers.",
        type: "multiple-choice",
        choices: [
          "OS, Host name, Version",
          "Host, Status, Last Seen",
          "Name, IP Address, Version",
          "Host, Agent, Monitoring Mode",
        ],
        correctChoice: "OS, Host name, Version",
        points: 100,
      },
      {
        id: "cp3",
        title: "Understand Monitoring Modes",
        instruction:
          "In Deployment Status, click into any host entry. What monitoring mode is shown for hosts in the Playground?",
        hint: "Click a host row to expand its details. Look for the 'Monitoring mode' field — the Playground runs agents in the most comprehensive mode available.",
        type: "multiple-choice",
        choices: [
          "Full stack",
          "Infrastructure only",
          "Application only",
          "Discovery only",
        ],
        correctChoice: "Full stack",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the OneAgent Installation Page",
        instruction:
          "In your own Dynatrace tenant (not the Playground), where do you go to download the OneAgent installer?",
        hint: "In any Dynatrace environment, open the Apps menu and look under Manage. The deployment and installation page is where you generate installer scripts with your environment's token pre-filled.",
        type: "multiple-choice",
        choices: [
          "Apps → Manage → Deployment Status → OneAgent installation",
          "Settings → Infrastructure → OneAgent",
          "Apps → Infrastructure → Hosts → Install",
          "Account Management → Downloads",
        ],
        correctChoice: "Apps → Manage → Deployment Status → OneAgent installation",
        points: 150,
      },
      {
        id: "cp5",
        title: "The Host Group Parameter",
        instruction:
          "When installing OneAgent on Linux, which command-line parameter assigns the host to a host group at install time?",
        hint: "Navigate to docs.dynatrace.com and search for 'OneAgent host group'. The parameter is passed to the installer script and uses double dashes.",
        type: "multiple-choice",
        choices: [
          "--set-host-group=",
          "--host-group=",
          "--group=",
          "--set-group=",
        ],
        correctChoice: "--set-host-group=",
        points: 200,
      },
    ],
  },
  {
    id: "mission-organize-fleet",
    title: "Organize Your Fleet",
    codename: "GRID ORDER",
    role: "Platform Engineer",
    difficulty: "rookie",
    description:
      "Ungrouped hosts are unmanageable at scale. Learn how host groups work before your fleet grows past the point of control.",
    briefing:
      "When you have 10 hosts, naming them well is enough. When you have 1,000, you need structure. Host groups let you apply settings, alerting thresholds, and OneAgent update policies to entire fleets at once — instead of host by host. This mission teaches you how host groups work in Dynatrace using the Playground, and how to assign them at install time in your own environment. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-deploy-agent"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 25 },
    ],
    topics: ["infrastructure", "settings"],
    category: "configuration",
    apps: ["Infrastructure & Operations", "Deployment Status"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find Host Groups in Infrastructure & Operations",
        instruction:
          "Open the Infrastructure & Operations app in the Playground. In the left sidebar, what are the five entity types listed?",
        hint: "Open Apps → Infrastructure Observability → Infrastructure & Operations. Look at the left sidebar — it lists the entity types you can navigate to. Count all five.",
        type: "multiple-choice",
        choices: [
          "Hosts, Processes, Network, Containers, Technologies",
          "Hosts, Network devices, Other, VMware, Cloud",
          "Hosts, Kubernetes, Services, Databases, Network",
          "Hosts, Processes, Services, Applications, Cloud",
        ],
        correctChoice: "Hosts, Network devices, Other, VMware, Cloud",
        points: 100,
      },
      {
        id: "cp2",
        title: "What Host Groups Do",
        instruction:
          "Which of these is something you can configure at the host group level in Dynatrace?",
        hint: "Think about what makes host groups useful for fleet management — the point is to apply a setting once and have it apply to all hosts in the group, rather than configuring each host individually.",
        type: "multiple-choice",
        choices: [
          "OneAgent update settings and anomaly detection thresholds",
          "DQL query execution permissions",
          "Dashboard visibility and sharing",
          "User access and role assignments",
        ],
        correctChoice: "OneAgent update settings and anomaly detection thresholds",
        points: 150,
      },
      {
        id: "cp3",
        title: "Assign a Host Group at Install Time",
        instruction:
          "When installing OneAgent on Linux, what is the correct syntax to assign a host to a group called 'production-web' at install time?",
        hint: "The parameter is passed to the installer script. You've seen this parameter in a previous mission — it uses double dashes and the set- prefix.",
        type: "multiple-choice",
        choices: [
          "./Dynatrace-OneAgent.sh --set-host-group=production-web",
          "./Dynatrace-OneAgent.sh --host-group=production-web",
          "./Dynatrace-OneAgent.sh --group=production-web",
          "./Dynatrace-OneAgent.sh --set-group=production-web",
        ],
        correctChoice: "./Dynatrace-OneAgent.sh --set-host-group=production-web",
        points: 150,
      },
      {
        id: "cp4",
        title: "Change a Host Group After Install",
        instruction:
          "If you need to move a host to a different host group after OneAgent is already installed, which tool do you use?",
        hint: "After installation, OneAgent configuration changes are made using a command-line tool that ships with the agent. Check docs.dynatrace.com and search for 'change host group after installation'.",
        type: "multiple-choice",
        choices: [
          "oneagentctl --set-host-group=",
          "dt-agent --move-group=",
          "Dynatrace Settings UI only — cannot be changed via CLI",
          "Reinstall OneAgent with the new parameter",
        ],
        correctChoice: "oneagentctl --set-host-group=",
        points: 150,
      },
      {
        id: "cp5",
        title: "How Many Host Groups Can a Host Belong To",
        instruction:
          "How many host groups can a single OneAgent-monitored host belong to at one time?",
        hint: "Host groups are statically assigned — this is by design to keep configuration predictable. Think about what 'group' means structurally.",
        type: "multiple-choice",
        choices: [
          "Exactly one",
          "Up to three",
          "Unlimited",
          "Two — one primary, one secondary",
        ],
        correctChoice: "Exactly one",
        points: 150,
      },
    ],
  },
  {
    id: "mission-first-alert",
    title: "Your First Alert",
    codename: "SIGNAL FIRE",
    role: "Platform Engineer",
    difficulty: "rookie",
    description:
      "Dynatrace detects problems automatically. But without notifications, nobody hears the alarm.",
    briefing:
      "Davis AI detects anomalies and opens problems without any configuration — but getting those problems in front of the right people requires alerting setup. This mission walks you through where alerting lives in Dynatrace, how the trigger-to-notification chain works, and what your options are for getting alerted when something breaks. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-orient-platform"],
    disciplines: [
      { track: "platform-engineer", xp: 75 },
      { track: "incident-commander", xp: 75 },
    ],
    topics: ["problems", "settings"],
    category: "configuration",
    apps: ["Settings"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the Alerting Section in Settings",
        instruction:
          "Open the Settings app in the Playground. What is the name of the section that contains alerting and notification configuration?",
        hint: "Open Apps → search 'Settings' → open the Settings app. Look at the left sidebar — the alerting section is not the first category. Scan down for a section related to analysis and alerts.",
        type: "multiple-choice",
        choices: [
          "Analyze and alert",
          "Collect and capture",
          "Environment segmentation",
          "Dynatrace Intelligence",
        ],
        correctChoice: "Analyze and alert",
        points: 100,
      },
      {
        id: "cp2",
        title: "Settings Sidebar Order",
        instruction:
          "In the Settings app, what is the first category listed in the left sidebar?",
        hint: "When you first open the Settings app, the left sidebar shows all configuration categories. The first one is selected by default.",
        type: "multiple-choice",
        choices: [
          "Collect and capture",
          "Analyze and alert",
          "General",
          "Environment segmentation",
        ],
        correctChoice: "Collect and capture",
        points: 100,
      },
      {
        id: "cp3",
        title: "The Notification Chain",
        instruction:
          "In Dynatrace, what is the correct order of the alerting chain when a problem is detected?",
        hint: "Think about the sequence: Davis detects an anomaly and opens a problem. Then something filters which problems are worth alerting on. Then something defines where to send the notification.",
        type: "multiple-choice",
        choices: [
          "Problem detected → Alerting profile filters it → Notification integration sends it",
          "Notification sent → Alerting profile created → Problem detected",
          "Alerting profile created → Problem detected → Davis AI notified",
          "Problem detected → Notification sent → Alerting profile logs it",
        ],
        correctChoice:
          "Problem detected → Alerting profile filters it → Notification integration sends it",
        points: 150,
      },
      {
        id: "cp4",
        title: "Notification Integration Options",
        instruction:
          "Navigate to Settings → Analyze and alert → Notifications. How many notification configuration options are listed?",
        hint: "Open the Settings app, go to Analyze and alert in the left sidebar, then click Notifications. Count every item listed — each represents a different integration or channel type.",
        type: "multiple-choice",
        choices: ["3", "4", "5", "6 or more"],
        correctChoice: "5",
        points: 150,
      },
      {
        id: "cp5",
        title: "Where Problems Are Created",
        instruction:
          "Which Dynatrace component is responsible for automatically detecting anomalies and opening problems — without any manual configuration?",
        hint: "This is the AI engine at the core of Dynatrace. It uses causal AI to determine root cause and opens problems automatically based on what it detects.",
        type: "multiple-choice",
        choices: [
          "Davis AI",
          "Alerting profiles",
          "Synthetic monitors",
          "OneAgent",
        ],
        correctChoice: "Davis AI",
        points: 150,
      },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
