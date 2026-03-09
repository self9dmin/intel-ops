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
        hint: "In the Problems app, use the Impact filter in the left panel and select 'Infrastructure'. This will narrow the list to problems affecting hosts, processes, and network devices.",
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
        hint: "In the Problems app, open the timeframe picker and manually type 'now()-30d' in the custom field — there is no 'Last 30 days' preset. Then sort by 'Started' ascending. The oldest problem will appear at the TOP of the list (ascending = oldest first).",
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
        hint: "Open the problem P-2602454. On the Overview tab, expand the impact row or click into the Events tab. The mount point is stated in plain text in the event description: 'The total available space on disk /data is lower than 3%'. There is no chart — look for the description text.",
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
        hint: "The threshold percentage appears in the same event description text as the mount point: 'The total available space on disk /data is lower than 3%'. There is no chart or dashed line in the gen3 UI — the value is in the text description.",
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
      "Service-Level Objectives define the contract between your platform and your users. Before you can declare a customer-facing incident, you need to catalogue the SLOs that exist — find each target, warning threshold, and signal type across EasyTravel, Astroshop, and CUJ services. This intelligence is required before any incident declaration. Use the Dynatrace Playground at https://playground.apps.dynatrace.com to complete this mission.",
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
        hint: "Open the SLOs app from Apps → Observe and explore. Search for 'EasyTravel'. The target percentage is shown in the Target column.",
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
        title: "Count Settings Categories",
        instruction:
          "Still in the Settings app, how many main categories are listed in the left sidebar?",
        hint: "Scroll through the full left sidebar in Settings and count each top-level category. Do not count sub-items — only the main section headers.",
        type: "multiple-choice",
        choices: ["5", "7", "10", "12"],
        correctChoice: "10",
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
    title: "Ask the AI",
    codename: "DAVIS CALL",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "Davis CoPilot is your always-on AI analyst. Learn how to use it before you're in the middle of an incident.",
    briefing:
      "Every role in Mission Control eventually needs to ask Dynatrace a question. Davis CoPilot — the AI assistant built into the platform — is the fastest way to get answers. Open the playground and find it. Use the playground at https://playground.apps.dynatrace.com",
    timerSeconds: 240,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "sre", xp: 25 },
      { track: "incident-commander", xp: 25 },
    ],
    topics: ["dt-intelligence", "problems"],
    category: "incident-response",
    apps: ["Davis CoPilot"],
    checkpoints: [
      {
        id: "cp1",
        title: "Find Davis CoPilot",
        instruction:
          "Open the Dynatrace Playground and locate Davis CoPilot. Where is it accessed from?",
        hint: "Look for 'Assist' with a sparkle (✦) icon near the top of the left nav. Keyboard shortcut: Ctrl+I. In gen3, this feature is labeled 'Assist' in the nav — you may also see it referred to as 'Dynatrace Intelligence' inside the panel.",
        type: "multiple-choice",
        choices: [
          "Top of the left navigation bar",
          "Top right of the interface",
          "Inside the Problems app only",
          "Settings menu",
        ],
        correctChoice: "Top of the left navigation bar",
        points: 100,
      },
      {
        id: "cp2",
        title: "Ask a real question",
        instruction:
          "Ask Davis CoPilot: 'What problems are currently open in my environment?' What does it return?",
        hint: "Type the question directly into Davis CoPilot. It should respond with a summary of active problems or confirm there are none.",
        type: "multiple-choice",
        choices: [
          "A list or summary of open problems",
          "An error — it can't answer that",
          "A link to the Problems app only",
          "Nothing — it needs configuration first",
        ],
        correctChoice: "A list or summary of open problems",
        points: 150,
      },
      {
        id: "cp3",
        title: "Ask about a specific entity",
        instruction:
          "Ask Davis CoPilot: 'Show me the top hosts by CPU usage'. Does it respond with data?",
        hint: "Davis CoPilot can query Grail and return real data inline. Ask it and see what comes back.",
        type: "multiple-choice",
        choices: [
          "Yes — it returns host CPU data inline",
          "No — it redirects you to Infrastructure Monitoring",
          "It returns an error",
          "It asks for clarification first",
        ],
        correctChoice: "Yes — it returns host CPU data inline",
        points: 150,
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
      "When Davis can't help, the community can. Learn where Dynatrace users go for answers — before you're stuck at 2am with no one to ask.",
    briefing:
      "The Dynatrace Community, DTU, and documentation are your extended team. This mission teaches you where they live and how to use them effectively. You don't need the playground for this one — just a browser.",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-ask-the-ai"],
    disciplines: [
      { track: "sre", xp: 25 },
      { track: "platform-engineer", xp: 25 },
    ],
    topics: ["community"],
    category: "configuration",
    apps: [],
    checkpoints: [
      {
        id: "cp1",
        title: "Find the Dynatrace Community",
        instruction:
          "Navigate to community.dynatrace.com. What is the name of the section where users ask troubleshooting questions?",
        hint: "On community.dynatrace.com, click the 'Ask' menu in the top nav. Look for the general-purpose Q&A section — it's called 'Open Q&A' and is described as the place for questions that don't fit a specific subforum.",
        type: "multiple-choice",
        choices: [
          "Troubleshooting",
          "Open Q&A",
          "Product Ideas",
          "Start with Dynatrace",
        ],
        correctChoice: "Open Q&A",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find Dynatrace University",
        instruction:
          "Go to university.dynatrace.com. What is the name of the main navigation tab for learning content?",
        hint: "Look at the navigation tabs on the DTU homepage. The primary tab for all learning content is labeled 'Courses and learning plans'.",
        type: "multiple-choice",
        choices: [
          "Courses and learning plans",
          "Courses, certifications, and hands-on labs",
          "Video tutorials only",
          "Live instructor-led training only",
        ],
        correctChoice: "Courses and learning plans",
        points: 150,
      },
      {
        id: "cp3",
        title: "Find the documentation",
        instruction:
          "In the Playground, press the ? key. What does it open? Then find where to access Documentation.",
        hint: "The ? key opens the Keyboard Shortcuts panel. Documentation is NOT accessible via keyboard shortcut — click the ? icon button in the top-right corner of the UI, then select 'Documentation' from the dropdown.",
        type: "multiple-choice",
        choices: [
          "? opens Keyboard Shortcuts; Documentation is under the ? icon button",
          "? opens Documentation directly",
          "Documentation is in the Settings menu",
          "There is no documentation shortcut",
        ],
        correctChoice:
          "? opens Keyboard Shortcuts; Documentation is under the ? icon button",
        points: 150,
      },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
