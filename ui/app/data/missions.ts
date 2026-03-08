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
      "0300 hours. PagerDuty just fired. The primary production database is showing anomalous behavior — latency is climbing and error rates are spiking. Your job is to identify the root cause before the business wakes up and customers start calling.",
    timerSeconds: 900,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "incident-commander", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence", "metrics"],
    category: "incident-response",
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
      "A backend service was deployed 20 minutes ago. Automated checks passed. No alerts fired. But a senior engineer has a gut feeling — response times are subtly degraded and one SLO is quietly burning down. Your job: confirm whether the deployment caused a regression before it becomes a customer-facing incident.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "developer", xp: 50 },
    ],
    topics: ["traces", "metrics"],
    category: "performance",
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
      "The e-commerce checkout flow is slow. Not broken — just slow. P99 latency doubled in the last hour. No errors in the logs. No alerts from Davis. The problem is hiding somewhere in the distributed call chain. Your job: find the ghost.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["traces", "dql", "services"],
    category: "root-cause-analysis",
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
      "CRITICAL. Three production services have gone dark simultaneously. Cascading failures are spreading. Customer impact is confirmed. You have 8 minutes to identify the blast radius, find the origin, and call the remediation path. No hints. No hand-holding. Move.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["operation-3am-database-spike", "operation-silent-rollout"],
    disciplines: [
      { track: "incident-commander", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["problems", "dt-intelligence", "metrics"],
    category: "incident-response",
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
      "The production Kubernetes cluster is degrading. Pods in the payments namespace are crash-looping. The on-call platform engineer is unreachable. You're up. Find out what's killing the pods, whether it's spreading, and what needs to happen to stabilize the cluster.",
    timerSeconds: 720,
    status: "available",
    prerequisites: ["operation-3am-database-spike"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["kubernetes", "infrastructure", "metrics"],
    category: "configuration",
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
      "Entity types are the foundation of everything in Dynatrace. HOST, PROCESS_GROUP, CUSTOM_DEVICE — they behave differently, live in different apps, and fail in different ways. Get your bearings now, before something breaks at 3am.",
    timerSeconds: 360,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "sre", xp: 75 }],
    topics: ["entities", "infrastructure", "databases"],
    category: "root-cause-analysis",
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
        hint: "Processes in Dynatrace are grouped by their executable path — all instances of the same binary roll up into one PROCESS_GROUP. Check the URL when you open it.",
        type: "multiple-choice",
        choices: ["HOST-", "PROCESS_GROUP-", "PROCESS-", "SERVICE-"],
        correctChoice: "PROCESS_GROUP-",
        points: 150,
      },
      {
        id: "cp3",
        title: "Find a Custom Device Entity",
        instruction:
          "Navigate to the Problems app and find the open MySQL availability problem. Click into it and then click the affected entity link. What entity type prefix does the MySQL RDS instance use — and why is it different from a HOST?",
        hint: "Open the Problems app, set timeframe to Last 7 days, and find the problem titled 'MySQL availability'. Click the problem, then click the affected entity name under '1 impacted infrastructure component'. The entity ID prefix is visible in the URL or Properties panel.",
        type: "multiple-choice",
        choices: [
          "HOST- — because databases are always monitored as hosts",
          "SERVICE- — because databases are accessed via service calls",
          "CUSTOM_DEVICE- — because it is monitored via an extension, not a OneAgent",
          "PROCESS_GROUP- — because MySQL is a process running on a server",
        ],
        correctChoice:
          "CUSTOM_DEVICE- — because it is monitored via an extension, not a OneAgent",
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
      "The EKS cluster is running production workloads across multiple namespaces. You need to map it — node count, workload distribution, namespace health — before you can do anything useful when something breaks. Navigation under pressure starts with navigation when things are calm.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-what-are-you"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["kubernetes", "infrastructure"],
    category: "configuration",
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
      "A slowdown is reported in the easytrade application. Before you can find the root cause, you need to understand how the services are wired together — which service calls which database, what technology stack is involved, and who owns what. Map the dependency chain first. Then you can act.",
    timerSeconds: 540,
    status: "available",
    prerequisites: ["mission-what-are-you"],
    disciplines: [
      { track: "developer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["services", "databases", "entities"],
    category: "root-cause-analysis",
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
      "A low-disk alert has been open on a production host for almost 30 days. Nobody acted on it. Your job is to find the problem, identify the affected disk, confirm the threshold, and understand the full scope of what's at risk on that host.",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "sre", xp: 75 }],
    topics: ["infrastructure", "problems"],
    category: "incident-response",
    checkpoints: [
      {
        id: "cp1",
        title: "Find the Chronic Disk Problem",
        instruction:
          "Open the Problems app. Set the timeframe to Last 30 days. Find the oldest open problem on the list — it affects a host named 'frontend-high-cpu'. What is the name of the host shown in the problem title?",
        hint: "Sort the problem list by Start date ascending — oldest problems appear at the bottom. Look for a RESOURCE_CONTENTION problem on a host named 'frontend-high-cpu' that started in early February.",
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
        hint: "The subtitle under the chart header states the exact mount path that breached the threshold.",
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
        hint: "The dashed red line on the chart is labeled with the threshold value. It is also stated verbatim in the problem subtitle.",
        type: "multiple-choice",
        choices: ["1%", "3%", "5%", "10%"],
        correctChoice: "3%",
        points: 150,
      },
      {
        id: "cp4",
        title: "Count the Disks on the Host",
        instruction:
          "From the problem detail page, click the 'frontend-high-cpu' entity link to open the host. Scroll to the Disk analysis section. How many disks does this host have?",
        hint: "The Disk analysis section header states 'Contains N Disks.' Count all mount points shown in the table.",
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
      "The /data disk on frontend-high-cpu is critically full. The platform team needs more than the alert — they need the exact entity IDs, the Grail DQL metric driving the newer alert, and the host OS version to build an automated remediation workflow. Your job is to extract that data.",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-iron-floor"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["infrastructure", "problems", "dql"],
    category: "configuration",
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
      "A MySQL database critical to the ecommerce platform has been unavailable for over three days. Nobody escalated it. Your job is to find the problem, identify the full database endpoint, confirm the alert classification, and extract the entity ID — this all goes in the incident report.",
    timerSeconds: 360,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "incident-commander", xp: 75 },
      { track: "sre", xp: 50 },
    ],
    topics: ["problems", "infrastructure"],
    category: "incident-response",
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
          "On the MySQL availability problem detail page, expand the 'Show details' link beneath the MySQL availability event. What is the value of the event.db_ready_made_alert_type field?",
        hint: "After clicking Show details, a table of event properties appears. Look for the row labeled event.db_ready_made_alert_type.",
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
          "Still in the Show details panel, what is the value of the dt.source_entity field? This is the Dynatrace entity ID for the MySQL instance.",
        hint: "Look for the dt.source_entity field in the Show details panel. It starts with CUSTOM_DEVICE- because RDS instances monitored via extension appear as custom devices, not HOST entities.",
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
      "Before you can declare a customer-facing incident for EasyTrade, you need to catalogue its SLOs.",
    briefing:
      "The EasyTrade trading platform has three SLOs defined. Before you can declare a customer-facing incident, you need to catalogue them — find each SLO target, warning threshold, and signal type. Then locate the hipstershop CartService SLO for comparison. This intelligence is required before any incident declaration.",
    timerSeconds: 300,
    status: "available",
    prerequisites: [],
    disciplines: [
      { track: "incident-commander", xp: 75 },
      { track: "sre", xp: 25 },
    ],
    topics: ["slos", "services", "synthetics"],
    category: "incident-response",
    checkpoints: [
      {
        id: "cp1",
        title: "Find the EasyTrade Availability SLO Target",
        instruction:
          "Navigate to the SLOs section in Dynatrace. Filter for SLOs with 'EasyTrade' in the name. What is the target percentage for the SLO named 'EasyTrade - Application - Availability'?",
        hint: "This SLO covers synthetic test results — its target is notably lower than typical 99.x% targets. The value is not a whole number.",
        type: "multiple-choice",
        choices: ["95%", "99.9%", "87.5%", "60%"],
        correctChoice: "87.5%",
        points: 100,
      },
      {
        id: "cp2",
        title: "Find the EasyTrade Success Rate SLO",
        instruction:
          "For the SLO named 'EasyTrade - Application - Success Rate', what is the target percentage and what service name pattern does the entity filter apply to (look for the SLO_SVC tag value)?",
        hint: "The entity filter in this SLO uses a tag with a wildcard pattern. Look at the full filter expression — the SLO_SVC tag contains the service name with a -* suffix.",
        type: "multiple-choice",
        choices: [
          "95% / frontendreverseproxy-*",
          "99% / easytradeloginservice-*",
          "95% / easytrade-frontend",
          "99.9% / frontentreverseproxy",
        ],
        correctChoice: "95% / frontendreverseproxy-*",
        points: 150,
      },
      {
        id: "cp3",
        title: "Find the EasyTrade User Experience SLO Warning",
        instruction:
          "For the SLO 'EasyTrade - Application - User Experience', what is the warning threshold? This SLO is measured against the EasyTrade APPLICATION entity.",
        hint: "Warning sits just above the target. Both are relatively low — this SLO measures Apdex/user satisfaction, not availability. The target is 60%.",
        type: "multiple-choice",
        choices: ["60%", "64%", "70%", "80%"],
        correctChoice: "64%",
        points: 150,
      },
      {
        id: "cp4",
        title: "Find the Hipstershop CartService SLO Target",
        instruction:
          "Locate the SLO for hipstershop's CartService (name contains 'hipstershop.CartService'). What is its target percentage?",
        hint: "CartService is a core commerce service — expect a high-availability target. Note: the SLO name has a typo ('avaliability' not 'availability') — use that to find it.",
        type: "multiple-choice",
        choices: ["98%", "99%", "99.9%", "99.98%"],
        correctChoice: "99.98%",
        points: 150,
      },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
