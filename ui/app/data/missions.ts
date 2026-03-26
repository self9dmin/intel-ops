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
    id: "mission-the-dock",
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
    prerequisites: ["mission-the-dock"],
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
    prerequisites: ["mission-the-dock"],
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
    prerequisites: ["mission-the-dock"],
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
    prerequisites: ["mission-the-dock"],
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
  {
    id: "mission-first-briefing",
    title: "First Briefing",
    codename: "SITUATION REPORT",
    role: "SRE",
    difficulty: "rookie",
    description:
      "Before you touch a single dashboard, ask Assist what's happening. This is how modern SREs start every shift.",
    briefing:
      "Your shift just started. Something may be wrong — or everything may be fine. The old way: open 5 dashboards, scan for red. The new way: open Assist and ask. This mission teaches you the difference between a vague prompt and an operator-grade prompt, and why it matters when every second counts. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-the-dock"],
    disciplines: [
      { track: "sre", xp: 75 },
      { track: "incident-commander", xp: 25 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Open Assist",
        instruction:
          "Open Dynatrace Assist on the Playground. What is the keyboard shortcut to open it?",
        hint: "The shortcut is shown as a tooltip when you hover over the Assist icon in the left dock.",
        type: "multiple-choice",
        choices: ["Ctrl+K", "Ctrl+I", "Ctrl+A", "Ctrl+Space"],
        correctChoice: "Ctrl+I",
        points: 75,
      },
      {
        id: "cp2",
        title: "The Vague Prompt",
        instruction:
          "You type: 'show me problems'. Assist returns a list. What is the problem with this prompt for a production SRE?",
        hint: "Think about what is missing — scope, timeframe, severity, grouping. A good prompt gives Assist enough context to return actionable intelligence, not just a list.",
        type: "multiple-choice",
        choices: [
          "It returns too many results with no prioritization or grouping",
          "Assist cannot understand plain English",
          "Problems are not available in the Playground",
          "You need to use DQL instead",
        ],
        correctChoice:
          "It returns too many results with no prioritization or grouping",
        points: 100,
      },
      {
        id: "cp3",
        title: "The Operator Prompt",
        instruction:
          "Which of these prompts would give an SRE the most actionable shift briefing from Assist?",
        hint: "A good operator prompt specifies what you want grouped, filtered, and prioritized. Assist uses this context to run the right Grail queries and apply the right agent.",
        type: "multiple-choice",
        choices: [
          "show me problems",
          "what is broken",
          "Summarize all open problems grouped by severity and impact level, highlighting any that affect more than one entity",
          "list active alerts",
        ],
        correctChoice:
          "Summarize all open problems grouped by severity and impact level, highlighting any that affect more than one entity",
        points: 150,
      },
      {
        id: "cp4",
        title: "Which Agent Fired",
        instruction:
          "When you ask Assist to summarize open problems, which Dynatrace Intelligence agent handles the response?",
        hint: "Assist shows which agent is working in the response header. Problem analysis uses a specific agent designed for root cause reasoning.",
        type: "multiple-choice",
        choices: [
          "Grail Query Agent",
          "Root Cause Agent",
          "Forecasting Agent",
          "Help Agent",
        ],
        correctChoice: "Root Cause Agent",
        points: 125,
      },
    ],
  },
  {
    id: "mission-blast-radius",
    title: "Blast Radius",
    codename: "CONTAIN THE BLAST",
    role: "SRE",
    difficulty: "rookie",
    description:
      "An alert fired. Before you do anything else, use Assist to map what is affected. Scope first, fix second.",
    briefing:
      "A problem opened on frontend-high-cpu. Your first instinct might be to SSH in and look around. Do not. First, understand the blast radius — what else is affected, what depends on this host, what is downstream. Assist can map this in seconds using Smartscape. This mission teaches you to scope before you act. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-first-briefing"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "incident-commander", xp: 50 },
    ],
    topics: ["problems", "dt-intelligence", "infrastructure"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Blast Radius Prompt",
        instruction:
          "Which prompt best asks Assist to map the impact of the CPU saturation on frontend-high-cpu?",
        hint: "You want Assist to use Smartscape to find what depends on this host and what downstream services could be affected.",
        type: "multiple-choice",
        choices: [
          "what is wrong with frontend-high-cpu",
          "For the CPU saturation problem on frontend-high-cpu, identify all downstream services and entities affected using Smartscape topology",
          "show me the frontend-high-cpu host",
          "how do I fix high CPU",
        ],
        correctChoice:
          "For the CPU saturation problem on frontend-high-cpu, identify all downstream services and entities affected using Smartscape topology",
        points: 125,
      },
      {
        id: "cp2",
        title: "What Smartscape Provides",
        instruction:
          "When Assist uses Smartscape to map blast radius, what type of information does it provide that a simple metrics query cannot?",
        hint: "Smartscape is a real-time dependency graph, not a metrics store. Think about relationships between entities, not just numbers.",
        type: "multiple-choice",
        choices: [
          "Current CPU and memory percentages for each host",
          "Causal dependency relationships between services, processes, and infrastructure",
          "Historical log entries from the affected host",
          "The DQL query used to detect the problem",
        ],
        correctChoice:
          "Causal dependency relationships between services, processes, and infrastructure",
        points: 150,
      },
      {
        id: "cp3",
        title: "Scope Before Action",
        instruction:
          "An SRE receives a CPU alert on a host. What is the correct order of operations using Assist?",
        hint: "Modern incident response with AI: understand the full scope first, then act. Acting before scoping risks missing related issues or making things worse.",
        type: "multiple-choice",
        choices: [
          "Restart the affected process, then ask Assist what broke",
          "Ask Assist for blast radius, understand impact, then decide on remediation",
          "Open the host in the UI, check metrics manually, then use Assist if confused",
          "Escalate immediately without investigation",
        ],
        correctChoice:
          "Ask Assist for blast radius, understand impact, then decide on remediation",
        points: 125,
      },
    ],
  },
  {
    id: "mission-causal-chain",
    title: "The Causal Chain",
    codename: "FOLLOW THE CAUSE",
    role: "SRE",
    difficulty: "operator",
    description:
      "Root cause is not always where the alert fires. Use Assist to trace the causal chain through Smartscape and find where it actually started.",
    briefing:
      "The problem is on the host. But is the host the root cause — or just where the symptom surfaced? Dynatrace Intelligence uses causal AI, not correlation. It traces dependencies through Smartscape to find what actually triggered the chain. This mission teaches you to ask Assist for root cause reasoning, not just symptom reporting. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-blast-radius"],
    disciplines: [
      { track: "sre", xp: 125 },
      { track: "incident-commander", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence", "infrastructure"],
    category: "root-cause-analysis",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Causal AI vs Correlation",
        instruction:
          "What is the key difference between causal AI (what Dynatrace uses) and correlation-based alerting?",
        hint: "Correlation finds things that happen at the same time. Causal AI finds what caused what — the difference between a symptom and a root cause.",
        type: "multiple-choice",
        choices: [
          "Causal AI is faster but less accurate than correlation",
          "Causal AI determines cause-and-effect relationships using topology; correlation only finds things that happen simultaneously",
          "Correlation uses Smartscape; causal AI uses DQL",
          "They are the same — both analyze metrics over time",
        ],
        correctChoice:
          "Causal AI determines cause-and-effect relationships using topology; correlation only finds things that happen simultaneously",
        points: 150,
      },
      {
        id: "cp2",
        title: "The Root Cause Prompt",
        instruction:
          "Which prompt asks Assist to trace the causal chain for an active problem, not just describe its symptoms?",
        hint: "You want Assist to use its Root Cause Agent and Smartscape to reason backwards from the symptom to the origin.",
        type: "multiple-choice",
        choices: [
          "Describe the CPU saturation problem on frontend-high-cpu",
          "For the most critical active problem, trace the causal chain through Smartscape and identify the root cause entity and what triggered it",
          "What is the CPU usage on frontend-high-cpu right now",
          "Show me all problems affecting frontend-high-cpu",
        ],
        correctChoice:
          "For the most critical active problem, trace the causal chain through Smartscape and identify the root cause entity and what triggered it",
        points: 150,
      },
      {
        id: "cp3",
        title: "Root Cause Entity",
        instruction:
          "Assist identifies the root cause entity for the CPU saturation problem as a Process Group. What does this tell you about where to focus remediation?",
        hint: "If the root cause is a Process Group, not the Host itself, what does that mean about where the fix needs to happen?",
        type: "multiple-choice",
        choices: [
          "The host hardware is faulty and needs replacement",
          "A specific process is causing the saturation — fixing the host will not solve it, the process needs investigation",
          "The Kubernetes cluster needs to be restarted",
          "The network is the root cause, not the host",
        ],
        correctChoice:
          "A specific process is causing the saturation — fixing the host will not solve it, the process needs investigation",
        points: 150,
      },
      {
        id: "cp4",
        title: "Next Prompt in the Chain",
        instruction:
          "After Assist identifies the webserver process as the root cause entity, what is the best follow-up prompt?",
        hint: "You now know the root cause entity. The next logical question is: what is that process doing and what changed?",
        type: "multiple-choice",
        choices: [
          "Show me all hosts in the environment",
          "What is the webserver process, what is its normal CPU baseline, and did anything change before the saturation started?",
          "Close the problem and mark it resolved",
          "Show me the DQL for CPU usage",
        ],
        correctChoice:
          "What is the webserver process, what is its normal CPU baseline, and did anything change before the saturation started?",
        points: 125,
      },
    ],
  },
  {
    id: "mission-slo-burn",
    title: "SLO Burn Rate",
    codename: "BUDGET ON FIRE",
    role: "SRE",
    difficulty: "operator",
    description:
      "SLOs do not just pass or fail. They burn. Use Assist to find which objectives are consuming error budget before they breach.",
    briefing:
      "An SLO breach is a customer-facing failure. But by the time an SLO breaches, it is too late — the error budget was burning for hours. Your job is to catch the burn before the breach. Assist can analyze SLO status and error budget consumption across the environment in one prompt. This mission teaches you to monitor SLO health proactively. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-causal-chain"],
    disciplines: [
      { track: "sre", xp: 125 },
      { track: "incident-commander", xp: 50 },
    ],
    topics: ["slo", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "SLO Status Prompt",
        instruction:
          "Which prompt gives you the most complete view of SLO health across the environment?",
        hint: "You want current status AND threshold context, not just a pass/fail list.",
        type: "multiple-choice",
        choices: [
          "show me SLOs",
          "Show me all SLOs and their current status, warning thresholds, and targets",
          "which SLOs are failing",
          "list service level objectives",
        ],
        correctChoice:
          "Show me all SLOs and their current status, warning thresholds, and targets",
        points: 100,
      },
      {
        id: "cp2",
        title: "Error Budget Meaning",
        instruction:
          "An SLO has a 95% target with a 66% warning threshold. The current value is 68%. What does this mean for operations?",
        hint: "The value is above the warning threshold but close to it. What state is this SLO in and what action is appropriate?",
        type: "multiple-choice",
        choices: [
          "The SLO is healthy — no action needed",
          "The SLO has breached — declare an incident immediately",
          "The SLO is in warning state — monitor closely and investigate what is consuming error budget",
          "The SLO target needs to be lowered",
        ],
        correctChoice:
          "The SLO is in warning state — monitor closely and investigate what is consuming error budget",
        points: 150,
      },
      {
        id: "cp3",
        title: "Which Agent for SLOs",
        instruction:
          "When you ask Assist about SLO status and burn rate, which combination of agents handles the response?",
        hint: "SLO data lives in Grail. Assist needs to query it and then analyze the results.",
        type: "multiple-choice",
        choices: [
          "Root Cause Agent only",
          "Help Agent only",
          "Grail Query Agent followed by Data Analysis Agent",
          "Forecasting Agent only",
        ],
        correctChoice: "Grail Query Agent followed by Data Analysis Agent",
        points: 125,
      },
    ],
  },
  {
    id: "mission-predict-failure",
    title: "Predict the Failure",
    codename: "AHEAD OF THE CURVE",
    role: "SRE",
    difficulty: "operator",
    description:
      "The best incident is the one that never happens. Use Assist to forecast resource exhaustion before it becomes a problem.",
    briefing:
      "frontend-high-cpu has been running hot for weeks. The disk is filling. Nobody acted. This is the failure mode Dynatrace Intelligence is designed to prevent. The Forecasting Agent can predict when resources will exhaust based on historical trends — before the alert fires. This mission teaches you to use predictive AI for proactive operations. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-slo-burn"],
    disciplines: [
      { track: "sre", xp: 150 },
      { track: "platform-engineer", xp: 75 },
    ],
    topics: ["infrastructure", "dt-intelligence", "metrics"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Forecast Prompt",
        instruction:
          "Which prompt correctly asks Assist to forecast CPU usage for all hosts over the next 24 hours?",
        hint: "Specify the prediction window and the data source for the forecast. Assist needs to know how far ahead to predict and what historical data to base it on.",
        type: "multiple-choice",
        choices: [
          "show me CPU usage",
          "Predict CPU usage for all hosts over the next 24 hours based on the last 30 days of data",
          "what will CPU be tomorrow",
          "forecast metrics",
        ],
        correctChoice:
          "Predict CPU usage for all hosts over the next 24 hours based on the last 30 days of data",
        points: 100,
      },
      {
        id: "cp2",
        title: "Forecasting Agent Output",
        instruction:
          "When the Forecasting Agent responds to a CPU prediction request, what does it return for each host?",
        hint: "The Forecasting Agent gives you a range and a trend description — not a single number.",
        type: "multiple-choice",
        choices: [
          "A single predicted CPU percentage",
          "A forecasted range with a trend description — stable, increasing, or decreasing",
          "A list of recommended actions to reduce CPU",
          "The DQL query used to compute the forecast",
        ],
        correctChoice:
          "A forecasted range with a trend description — stable, increasing, or decreasing",
        points: 125,
      },
      {
        id: "cp3",
        title: "Proactive vs Reactive",
        instruction:
          "A host is forecasted to reach 100% CPU in the next 6 hours with a stable trend. What is the correct proactive response?",
        hint: "You have 6 hours. This is the advantage of predictive AI — you can act before the incident, not during it.",
        type: "multiple-choice",
        choices: [
          "Wait for the alert to fire before acting",
          "Investigate the process causing the trend now and either scale the host or optimize the process before saturation hits",
          "Disable the forecasting to avoid false alarms",
          "Acknowledge the prediction and close it",
        ],
        correctChoice:
          "Investigate the process causing the trend now and either scale the host or optimize the process before saturation hits",
        points: 150,
      },
    ],
  },
  {
    id: "mission-operator-debrief",
    title: "The Postmortem",
    codename: "AFTER ACTION",
    role: "SRE",
    difficulty: "operator",
    description:
      "The incident is over. Use Assist to write the postmortem before memory fades and tickets pile up.",
    briefing:
      "Every incident deserves a postmortem. Most do not get one because writing them takes time nobody has. Assist can reconstruct the timeline from Grail data and generate a stakeholder-ready summary in seconds. This is how modern SRE teams close the loop — not with a Confluence page written three days later, but with Grail-backed intelligence generated while the data is fresh. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-predict-failure"],
    disciplines: [
      { track: "sre", xp: 100 },
      { track: "incident-commander", xp: 150 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Postmortem Prompt",
        instruction:
          "Which prompt asks Assist to generate a stakeholder-ready incident summary for the CPU saturation problem on frontend-high-cpu?",
        hint: "Be specific about the problem and what format you need. Assist returns structured output when you specify the audience.",
        type: "multiple-choice",
        choices: [
          "summarize the CPU problem",
          "Write a stakeholder-ready incident summary for the CPU saturation problem on frontend-high-cpu including problem ID, timeline, affected entities, impact, and recommended next steps",
          "what happened on frontend-high-cpu",
          "close the incident",
        ],
        correctChoice:
          "Write a stakeholder-ready incident summary for the CPU saturation problem on frontend-high-cpu including problem ID, timeline, affected entities, impact, and recommended next steps",
        points: 125,
      },
      {
        id: "cp2",
        title: "What Assist Includes",
        instruction:
          "When Assist generates an incident summary, which of these is included in the structured response?",
        hint: "Assist pulls data from Grail — it has access to the problem record, timestamps, entity metadata, and cloud context.",
        type: "multiple-choice",
        choices: [
          "Only the start time and end time",
          "Problem ID, affected entities, cloud provider and region, impact description, and recommended next steps",
          "Only the DQL query used to detect the problem",
          "A list of engineers who should be blamed",
        ],
        correctChoice:
          "Problem ID, affected entities, cloud provider and region, impact description, and recommended next steps",
        points: 150,
      },
      {
        id: "cp3",
        title: "Grail-Backed vs Memory-Based",
        instruction:
          "Why is an Assist-generated postmortem more reliable than one written manually from memory 48 hours after the incident?",
        hint: "Think about where Assist gets its data and what happens to human memory over time.",
        type: "multiple-choice",
        choices: [
          "Assist writes faster than humans",
          "Assist queries Grail for exact timestamps, entity IDs, and event sequences — not human recollection which fades and distorts",
          "Assist postmortems are shorter",
          "Manual postmortems require admin permissions",
        ],
        correctChoice:
          "Assist queries Grail for exact timestamps, entity IDs, and event sequences — not human recollection which fades and distorts",
        points: 150,
      },
    ],
  },
  {
    id: "mission-war-room-brief",
    title: "The War Room Brief",
    codename: "BRIEF ME",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "You just walked into the war room. You have 60 seconds to understand what is happening. Use Assist.",
    briefing:
      "You are the Incident Commander. The war room is live. Everyone is looking at you. You have not been following the incident — you were just called in. The old way: ask five engineers to explain five different things. The new way: one prompt, full picture. Assist can give you an executive-level briefing across infrastructure, security, and performance in seconds. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-the-dock"],
    disciplines: [
      { track: "incident-commander", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Executive Brief Prompt",
        instruction:
          "Which prompt gives an Incident Commander the fastest full-picture briefing on environment state?",
        hint: "You want Assist to cross-correlate problems, security, and performance in one response. The prompt needs to ask for all three.",
        type: "multiple-choice",
        choices: [
          "show me what is broken",
          "Give me an executive briefing on the current state of this environment — what is broken, what is at risk, and what needs immediate attention",
          "list all alerts",
          "open the problems app",
        ],
        correctChoice:
          "Give me an executive briefing on the current state of this environment — what is broken, what is at risk, and what needs immediate attention",
        points: 125,
      },
      {
        id: "cp2",
        title: "Cross-Signal Intelligence",
        instruction:
          "The executive briefing Assist returns covers active problems, security vulnerabilities, AND performance degradation in one response. What Dynatrace capability makes this possible?",
        hint: "A single query across infrastructure, security, and performance data requires a unified data store — not separate siloed tools.",
        type: "multiple-choice",
        choices: [
          "The Problems app has a built-in security tab",
          "Grail — the unified data lakehouse that stores observability, security, and business data in one place",
          "Assist queries three separate APIs and merges the results manually",
          "The Settings app shows all active issues",
        ],
        correctChoice:
          "Grail — the unified data lakehouse that stores observability, security, and business data in one place",
        points: 150,
      },
      {
        id: "cp3",
        title: "Immediate vs At-Risk",
        instruction:
          "Assist's executive briefing separates items into 'Active Problems' and 'At-Risk Areas'. What is the operational difference between these two categories?",
        hint: "Active problems are happening now. At-risk areas could become problems if not addressed. The distinction changes your response priority.",
        type: "multiple-choice",
        choices: [
          "There is no difference — both require immediate escalation",
          "Active problems need immediate response; at-risk areas need monitoring and preventive action before they escalate",
          "Active problems are infrastructure; at-risk areas are security",
          "At-risk areas are more urgent than active problems",
        ],
        correctChoice:
          "Active problems need immediate response; at-risk areas need monitoring and preventive action before they escalate",
        points: 125,
      },
    ],
  },
  {
    id: "mission-timeline-reconstruction",
    title: "The Timeline",
    codename: "REWIND",
    role: "Incident Commander",
    difficulty: "rookie",
    description:
      "When did it start? What happened first? Use Assist to reconstruct the incident timeline from Grail data.",
    briefing:
      "The hardest question in any incident is: what happened first? Engineers have different timelines. Logs contradict each other. Assist can reconstruct the sequence of events from Grail data — exact timestamps, entity transitions, and problem progressions — without anyone needing to remember. This mission teaches you to use Assist as your incident historian. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-war-room-brief"],
    disciplines: [
      { track: "incident-commander", xp: 100 },
      { track: "sre", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Timeline Prompt",
        instruction:
          "Which prompt asks Assist to reconstruct an incident timeline with exact timestamps?",
        hint: "You need to specify which problem you want the timeline for and that you want chronological sequence — not just a summary.",
        type: "multiple-choice",
        choices: [
          "when did the problem start",
          "Reconstruct the timeline of events for the most critical active problem — when did it start, what happened first, what followed?",
          "show me problem history",
          "what time did the alert fire",
        ],
        correctChoice:
          "Reconstruct the timeline of events for the most critical active problem — when did it start, what happened first, what followed?",
        points: 125,
      },
      {
        id: "cp2",
        title: "What Grail Provides",
        instruction:
          "Assist reconstructs the timeline using Grail data. What makes Grail timestamps more reliable than engineer recollection?",
        hint: "Grail stores event data at the time it happens, immutably. Human memory is reconstructive and degrades under stress.",
        type: "multiple-choice",
        choices: [
          "Grail timestamps are in UTC which is more accurate than local time",
          "Grail stores event sequences immutably at the moment they occur — there is no memory degradation or reconstruction bias",
          "Engineers exaggerate timelines to avoid blame",
          "Grail synchronizes with PagerDuty for accurate timestamps",
        ],
        correctChoice:
          "Grail stores event sequences immutably at the moment they occur — there is no memory degradation or reconstruction bias",
        points: 150,
      },
      {
        id: "cp3",
        title: "Timeline to Decision",
        instruction:
          "Assist tells you the Redis connection error started at 00:00 UTC, and the cart service degradation followed at 00:01 UTC. What does this sequence tell you as Incident Commander?",
        hint: "If A happened before B, and B is the symptom, what is the likely cause?",
        type: "multiple-choice",
        choices: [
          "The cart service caused the Redis failure",
          "They are unrelated — coincidence in timing proves nothing",
          "The Redis failure is likely the root cause — it preceded the cart service degradation by one minute",
          "Redis and cart service both failed independently at the same time",
        ],
        correctChoice:
          "The Redis failure is likely the root cause — it preceded the cart service degradation by one minute",
        points: 150,
      },
    ],
  },
  {
    id: "mission-customer-impact",
    title: "Customer Impact",
    codename: "COUNT THE COST",
    role: "Incident Commander",
    difficulty: "operator",
    description:
      "Leadership wants to know: how many customers are affected? Use Assist to quantify business impact from technical signals.",
    briefing:
      "The VP is calling. They do not want to hear about CPU percentages or disk mount points. They want to know: are our customers affected? How many? What are they experiencing? Assist can correlate technical problems with user-facing impact — connecting infrastructure signals to business events. This mission teaches you to translate technical data into business language. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-timeline-reconstruction"],
    disciplines: [
      { track: "incident-commander", xp: 150 },
      { track: "sre", xp: 50 },
    ],
    topics: ["dt-intelligence", "dem", "bizevents"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Business Impact Prompt",
        instruction:
          "Which prompt asks Assist to connect technical problems to customer-facing impact?",
        hint: "You need Assist to look at both the technical problem AND user experience data — not just infrastructure metrics.",
        type: "multiple-choice",
        choices: [
          "show me affected entities",
          "How many users are currently affected by active problems in this environment, and what are they experiencing?",
          "what is the error rate",
          "show me the astroshop frontend",
        ],
        correctChoice:
          "How many users are currently affected by active problems in this environment, and what are they experiencing?",
        points: 125,
      },
      {
        id: "cp2",
        title: "Technical to Business Translation",
        instruction:
          "Assist reports 100% CPU saturation on frontend-high-cpu affecting the webserver process. How do you translate this for a VP who asks 'are customers affected?'",
        hint: "The technical problem is on infrastructure. The business question is about user experience. What is the connection?",
        type: "multiple-choice",
        choices: [
          "Tell the VP the CPU is at 100% — they should understand",
          "Say it is an infrastructure issue with no customer impact",
          "Explain that webserver CPU saturation typically causes slower response times or timeouts for users hitting that service — check RUM or synthetic data to quantify",
          "Ask engineering to handle the VP communication",
        ],
        correctChoice:
          "Explain that webserver CPU saturation typically causes slower response times or timeouts for users hitting that service — check RUM or synthetic data to quantify",
        points: 150,
      },
      {
        id: "cp3",
        title: "Business Events Correlation",
        instruction:
          "What prompt would you use to correlate active problems with business event drop-offs in the last 30 days?",
        hint: "Business events in Dynatrace track things like checkout completions, page views, and conversions. You want to see if technical problems correlate with drops in these events.",
        type: "multiple-choice",
        choices: [
          "show me business events",
          "What business events dropped off in the last 30 days and correlate those drops with any active or resolved problems in the same timeframe",
          "show me the astroshop conversion rate",
          "list all bizevents",
        ],
        correctChoice:
          "What business events dropped off in the last 30 days and correlate those drops with any active or resolved problems in the same timeframe",
        points: 150,
      },
    ],
  },
  {
    id: "mission-escalation-decision",
    title: "Escalation Decision",
    codename: "MAKE THE CALL",
    role: "Incident Commander",
    difficulty: "operator",
    description:
      "Do you escalate or hold? Use Assist to get the data you need to make the call in under 60 seconds.",
    briefing:
      "The hardest decision in incident command is escalation. Escalate too early and you burn out your team. Escalate too late and the customer impact grows. Assist can give you a rapid situation assessment — blast radius, severity, trend — so you can make a data-driven escalation decision. This mission teaches you the Assist-first escalation workflow. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-customer-impact"],
    disciplines: [
      { track: "incident-commander", xp: 150 },
      { track: "sre", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Escalation Assessment Prompt",
        instruction:
          "Which prompt gives you the fastest data to decide whether to escalate an active incident?",
        hint: "You need severity, blast radius, and trend in one response. A good escalation prompt asks for all three.",
        type: "multiple-choice",
        choices: [
          "show me the problem",
          "For the most critical active problem: what is the severity, how many entities are affected, is it getting better or worse, and what is the recommended immediate action?",
          "should I escalate",
          "who is on call",
        ],
        correctChoice:
          "For the most critical active problem: what is the severity, how many entities are affected, is it getting better or worse, and what is the recommended immediate action?",
        points: 150,
      },
      {
        id: "cp2",
        title: "Escalation Criteria",
        instruction:
          "Assist reports: severity HIGH, 2 entities affected, trend STABLE, impact level INFRASTRUCTURE. Based on this, what is the appropriate escalation decision?",
        hint: "STABLE trend means the problem is not spreading. INFRASTRUCTURE impact means no direct user-facing impact yet.",
        type: "multiple-choice",
        choices: [
          "Escalate immediately to P1 — any HIGH severity requires full escalation",
          "Hold — monitor closely but do not escalate yet. Stable trend and infrastructure-only impact suggest there is time to investigate before customer impact",
          "Close the incident — stable trend means it is resolving",
          "Escalate only if the VP asks",
        ],
        correctChoice:
          "Hold — monitor closely but do not escalate yet. Stable trend and infrastructure-only impact suggest there is time to investigate before customer impact",
        points: 175,
      },
      {
        id: "cp3",
        title: "When to Escalate",
        instruction:
          "Which signal from Assist should trigger an immediate escalation decision?",
        hint: "Think about what changes the risk profile of an incident from investigate to all hands.",
        type: "multiple-choice",
        choices: [
          "Any problem with HIGH severity regardless of trend or impact",
          "When affected entity count grows, trend shows worsening, and impact level reaches APPLICATION or SERVICES",
          "When the problem has been open for more than 1 hour",
          "When any SLO drops below its warning threshold",
        ],
        correctChoice:
          "When affected entity count grows, trend shows worsening, and impact level reaches APPLICATION or SERVICES",
        points: 150,
      },
    ],
  },
  {
    id: "mission-all-clear",
    title: "The All-Clear",
    codename: "STAND DOWN",
    role: "Incident Commander",
    difficulty: "operator",
    description:
      "The incident is resolving. Use Assist to confirm resolution and write the all-clear communication.",
    briefing:
      "Declaring all-clear too early is as dangerous as not declaring it at all. Before you stand down the team, you need confirmation that the root cause is gone, affected entities have recovered, and no new problems have opened. Assist can verify resolution from Grail data and generate the stakeholder communication. This mission teaches you to close incidents with data, not assumptions. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-escalation-decision"],
    disciplines: [
      { track: "incident-commander", xp: 125 },
      { track: "sre", xp: 75 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Resolution Verification Prompt",
        instruction:
          "Which prompt asks Assist to confirm that a specific problem has fully resolved and no related issues remain open?",
        hint: "You need Assist to check both the original problem AND scan for any new problems that may have opened as a result.",
        type: "multiple-choice",
        choices: [
          "is the problem fixed",
          "Confirm whether the CPU saturation problem on frontend-high-cpu has resolved, and check if any related problems opened in the last hour",
          "close the incident",
          "show me closed problems",
        ],
        correctChoice:
          "Confirm whether the CPU saturation problem on frontend-high-cpu has resolved, and check if any related problems opened in the last hour",
        points: 125,
      },
      {
        id: "cp2",
        title: "Why Data-Driven All-Clear Matters",
        instruction:
          "An engineer says it feels like it is back to normal. Why is this not sufficient before declaring all-clear?",
        hint: "Feeling and data are different things. What specific verification does Assist provide that gut feeling cannot?",
        type: "multiple-choice",
        choices: [
          "Engineers are always wrong about incident resolution",
          "Assist can verify from Grail that problem status changed to RESOLVED, entity metrics returned to baseline, and no new related problems opened — gut feeling cannot confirm all three",
          "You need to wait 24 hours before declaring all-clear",
          "Only the VP can declare all-clear",
        ],
        correctChoice:
          "Assist can verify from Grail that problem status changed to RESOLVED, entity metrics returned to baseline, and no new related problems opened — gut feeling cannot confirm all three",
        points: 150,
      },
      {
        id: "cp3",
        title: "Stakeholder Communication Prompt",
        instruction:
          "After confirming resolution, which prompt generates a stakeholder-ready all-clear communication?",
        hint: "Specify the audience and the format. Stakeholders need plain language, not technical jargon.",
        type: "multiple-choice",
        choices: [
          "write an email",
          "Generate a stakeholder-ready all-clear communication for the CPU saturation incident on frontend-high-cpu — include what happened, when it was resolved, and what prevents recurrence",
          "send a Slack message",
          "update the Jira ticket",
        ],
        correctChoice:
          "Generate a stakeholder-ready all-clear communication for the CPU saturation incident on frontend-high-cpu — include what happened, when it was resolved, and what prevents recurrence",
        points: 150,
      },
    ],
  },
  {
    id: "mission-command-postmortem",
    title: "Command Postmortem",
    codename: "LESSONS LEARNED",
    role: "Incident Commander",
    difficulty: "elite",
    description:
      "Use Assist to generate a full postmortem the engineering team can act on — not a retrospective nobody reads.",
    briefing:
      "A postmortem that sits in Confluence is worthless. A postmortem that drives process change is priceless. Assist can generate a structured postmortem from Grail data — timeline, root cause, contributing factors, action items — in the format your team can actually use. This mission teaches you to produce postmortems at the speed of incidents. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-all-clear"],
    disciplines: [
      { track: "incident-commander", xp: 200 },
      { track: "sre", xp: 100 },
    ],
    topics: ["problems", "dt-intelligence"],
    category: "incident-response",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Full Postmortem Prompt",
        instruction:
          "Which prompt generates the most complete and actionable postmortem from Assist?",
        hint: "A good postmortem prompt specifies the incident, the sections you need, and the audience.",
        type: "multiple-choice",
        choices: [
          "write a postmortem for the CPU problem",
          "Generate a complete postmortem for the CPU saturation incident on frontend-high-cpu including: timeline of events, root cause analysis, blast radius, contributing factors, and three specific action items to prevent recurrence",
          "summarize what happened",
          "create an incident report",
        ],
        correctChoice:
          "Generate a complete postmortem for the CPU saturation incident on frontend-high-cpu including: timeline of events, root cause analysis, blast radius, contributing factors, and three specific action items to prevent recurrence",
        points: 150,
      },
      {
        id: "cp2",
        title: "Action Items vs Observations",
        instruction:
          "A postmortem action item must be what?",
        hint: "Think about what makes an action item actually get done versus just being documented.",
        type: "multiple-choice",
        choices: [
          "A general observation about what went wrong",
          "Specific, assigned, time-bound, and tied to a system or process change — not a vague recommendation",
          "A description of the symptoms that were observed",
          "A list of who was on call during the incident",
        ],
        correctChoice:
          "Specific, assigned, time-bound, and tied to a system or process change — not a vague recommendation",
        points: 150,
      },
      {
        id: "cp3",
        title: "Grail-Powered Postmortems",
        instruction:
          "What is the advantage of Assist generating the postmortem timeline from Grail versus engineers writing it from memory or chat logs?",
        hint: "Think about accuracy, speed, and completeness.",
        type: "multiple-choice",
        choices: [
          "Assist writes faster than engineers can type",
          "Grail contains immutable, precise event data with exact timestamps — no reconstruction bias, no missing gaps, no blame-shifting between engineers",
          "Engineers make spelling mistakes in postmortems",
          "Grail postmortems are shorter",
        ],
        correctChoice:
          "Grail contains immutable, precise event data with exact timestamps — no reconstruction bias, no missing gaps, no blame-shifting between engineers",
        points: 200,
      },
    ],
  },
  {
    id: "mission-why-is-it-slow",
    title: "Why Is It Slow?",
    codename: "LATENCY HUNT",
    role: "Developer",
    difficulty: "rookie",
    description:
      "A service is slow. Instead of opening 4 tabs, ask Assist. This is how developers investigate performance in 2026.",
    briefing:
      "You got a Slack message: astroshop-checkout is slow. The old workflow: open distributed traces, filter by service, scan for slow spans, find the outlier. The new workflow: ask Assist. One prompt, full latency breakdown, root cause hypothesis. This mission teaches you the Assist-first performance investigation workflow. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-the-dock"],
    disciplines: [
      { track: "developer", xp: 75 },
      { track: "sre", xp: 25 },
    ],
    topics: ["traces", "dt-intelligence", "services"],
    category: "performance",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Latency Prompt",
        instruction:
          "Which prompt gives a developer the fastest actionable answer about why astroshop-checkout is slow?",
        hint: "You want Assist to look at trace data and identify where latency is being introduced — not just confirm that the service is slow.",
        type: "multiple-choice",
        choices: [
          "show me astroshop-checkout",
          "Why is astroshop-checkout slow? Analyze trace data for the last 30 days and identify where latency is being introduced in the request chain",
          "what is the response time",
          "show me slow spans",
        ],
        correctChoice:
          "Why is astroshop-checkout slow? Analyze trace data for the last 30 days and identify where latency is being introduced in the request chain",
        points: 100,
      },
      {
        id: "cp2",
        title: "Trace vs Metrics",
        instruction:
          "When investigating latency, why does Assist analyze trace data rather than just host metrics?",
        hint: "Host metrics tell you the host is slow. Trace data tells you which specific operation in which specific service call introduced the delay.",
        type: "multiple-choice",
        choices: [
          "Metrics are not available in Dynatrace",
          "Trace data shows the exact request path and which specific span — database call, external API, internal service — introduced the latency",
          "Traces are faster to query than metrics",
          "Host metrics are always inaccurate",
        ],
        correctChoice:
          "Trace data shows the exact request path and which specific span — database call, external API, internal service — introduced the latency",
        points: 150,
      },
      {
        id: "cp3",
        title: "Deployment Correlation",
        instruction:
          "Assist identifies that latency in astroshop-checkout increased after a deployment. What is the next prompt to investigate?",
        hint: "You know when it started and what changed. Now you need to understand what specifically in the deployment caused the regression.",
        type: "multiple-choice",
        choices: [
          "roll back the deployment",
          "Which deployment event correlates with the latency increase in astroshop-checkout, and what changed between the previous and current version?",
          "show me the deployment logs",
          "ignore it — deployments always cause temporary slowdowns",
        ],
        correctChoice:
          "Which deployment event correlates with the latency increase in astroshop-checkout, and what changed between the previous and current version?",
        points: 150,
      },
    ],
  },
  {
    id: "mission-otel-query",
    title: "The OTel Query",
    codename: "OPEN SIGNALS",
    role: "Developer",
    difficulty: "operator",
    description:
      "Your app sends OpenTelemetry signals. Use Assist to query them and understand what your instrumentation is telling you.",
    briefing:
      "OpenTelemetry is how modern applications speak to observability platforms. Dynatrace ingests OTel traces, metrics, and logs natively. But raw OTel data is meaningless without the ability to query it intelligently. Assist can translate your natural language questions into DQL queries against OTel span data — so you can get answers without knowing the schema. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-why-is-it-slow"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 50 },
    ],
    topics: ["traces", "dql", "dt-intelligence"],
    category: "performance",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "OTel Service Inventory Prompt",
        instruction:
          "Which prompt asks Assist to list all OpenTelemetry-instrumented services in the environment?",
        hint: "You want to understand what is sending OTel signals before querying specific services.",
        type: "multiple-choice",
        choices: [
          "show me OTel",
          "Show me all OpenTelemetry-instrumented services and their instrumentation libraries in this environment",
          "what services use OpenTelemetry",
          "list instrumented services",
        ],
        correctChoice:
          "Show me all OpenTelemetry-instrumented services and their instrumentation libraries in this environment",
        points: 100,
      },
      {
        id: "cp2",
        title: "OTel vs OneAgent",
        instruction:
          "What is the key difference between a service instrumented with OneAgent versus OpenTelemetry in Dynatrace?",
        hint: "Think about who installs the instrumentation and what level of automation is involved.",
        type: "multiple-choice",
        choices: [
          "OneAgent only monitors infrastructure; OTel only monitors applications",
          "OneAgent auto-instruments without code changes; OTel requires developers to add instrumentation libraries to their code",
          "OTel is more accurate than OneAgent",
          "OneAgent is open source; OTel is proprietary",
        ],
        correctChoice:
          "OneAgent auto-instruments without code changes; OTel requires developers to add instrumentation libraries to their code",
        points: 150,
      },
      {
        id: "cp3",
        title: "DQL Behind the Prompt",
        instruction:
          "When you ask Assist to find OTel spans where duration exceeded 2 seconds, it generates a DQL query. Which Grail table does that query fetch from?",
        hint: "Trace data in Dynatrace is stored in a specific Grail table. Think about what DQL command queries trace spans.",
        type: "multiple-choice",
        choices: [
          "fetch logs",
          "fetch events",
          "fetch spans",
          "fetch metrics",
        ],
        correctChoice: "fetch spans",
        points: 125,
      },
      {
        id: "cp4",
        title: "Instrumentation Library Value",
        instruction:
          "Assist returns that my-otel-demo-frontend uses the @opentelemetry/instrumentation-fetch library. What does this tell a developer?",
        hint: "The library name tells you what kind of operations are being instrumented — HTTP fetch calls in this case.",
        type: "multiple-choice",
        choices: [
          "The service is written in Python",
          "The service is automatically capturing browser fetch API calls as OTel spans — every HTTP request made by the frontend is traced",
          "The service does not support tracing",
          "The service uses a legacy instrumentation method",
        ],
        correctChoice:
          "The service is automatically capturing browser fetch API calls as OTel spans — every HTTP request made by the frontend is traced",
        points: 150,
      },
    ],
  },
  {
    id: "mission-deployment-correlation",
    title: "Deploy with Confidence",
    codename: "CANARY CHECK",
    role: "Developer",
    difficulty: "operator",
    description:
      "You just deployed. Use Assist to immediately verify whether your deployment affected service health.",
    briefing:
      "Every deployment is a risk. The question is: did this one cause a regression? Instead of waiting for an alert or a customer complaint, use Assist to immediately correlate your deployment event with service metrics. If something changed, you want to know in the first 5 minutes — not the first 5 hours. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-otel-query"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 75 },
    ],
    topics: ["traces", "dt-intelligence", "services"],
    category: "performance",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Deployment Correlation Prompt",
        instruction:
          "Which prompt asks Assist to check if any recent deployment caused a service regression?",
        hint: "You want Assist to correlate deployment events with error rate and latency changes — not just list deployments.",
        type: "multiple-choice",
        choices: [
          "show me deployments",
          "Did any deployment in the last 30 days cause a spike in service error rates or latency? Correlate deployment events with metric changes",
          "what deployed recently",
          "show me the deployment log",
        ],
        correctChoice:
          "Did any deployment in the last 30 days cause a spike in service error rates or latency? Correlate deployment events with metric changes",
        points: 125,
      },
      {
        id: "cp2",
        title: "What Correlation Proves",
        instruction:
          "Assist reports: a deployment of frontendreverseproxy occurred, and no error rate spikes were detected. What does this tell you?",
        hint: "No correlation found is also a valid and useful result. What can you conclude?",
        type: "multiple-choice",
        choices: [
          "The deployment was not recorded by Dynatrace",
          "The deployment appears safe — no measurable error rate or latency regression was detected in the 30-day window",
          "You need to wait 24 hours before drawing conclusions",
          "Assist cannot correlate deployments with metrics",
        ],
        correctChoice:
          "The deployment appears safe — no measurable error rate or latency regression was detected in the 30-day window",
        points: 150,
      },
      {
        id: "cp3",
        title: "Early Regression Detection",
        instruction:
          "Assist finds that a deployment correlates with a 20% error rate increase on astroshop-checkout. What is the correct immediate action?",
        hint: "You have detected a regression within minutes of deployment. You have options — rollback, hotfix, or investigate further first.",
        type: "multiple-choice",
        choices: [
          "Wait and see if the error rate stabilizes",
          "Immediately assess whether the increase is within acceptable bounds — if not, initiate rollback or hotfix and open an incident",
          "Close the deployment event and reopen a new one",
          "Disable error rate monitoring for astroshop-checkout",
        ],
        correctChoice:
          "Immediately assess whether the increase is within acceptable bounds — if not, initiate rollback or hotfix and open an incident",
        points: 150,
      },
    ],
  },
  {
    id: "mission-log-story",
    title: "The Log Story",
    codename: "PAPER TRAIL",
    role: "Developer",
    difficulty: "operator",
    description:
      "Logs tell the story your traces do not. Use Assist to surface error patterns from log data across astroshop services.",
    briefing:
      "Traces show you the path. Logs show you what happened along the way. When a service fails silently — no obvious exception, no obvious span failure — the logs hold the answer. Assist can query log data across all astroshop services, group by error type, and surface patterns you would never find manually scrolling through raw log output. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-deployment-correlation"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 75 },
    ],
    topics: ["logs", "dql", "dt-intelligence"],
    category: "root-cause-analysis",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Log Query Prompt",
        instruction:
          "Which prompt asks Assist to find error log patterns across astroshop services?",
        hint: "You want logs filtered to ERROR level, grouped by service, so you can see which service is generating the most errors.",
        type: "multiple-choice",
        choices: [
          "show me logs",
          "Find all ERROR logs from astroshop services in the last 30 days, grouped by service name, sorted by count",
          "what errors are in the logs",
          "open the logs app",
        ],
        correctChoice:
          "Find all ERROR logs from astroshop services in the last 30 days, grouped by service name, sorted by count",
        points: 100,
      },
      {
        id: "cp2",
        title: "DQL Behind the Log Query",
        instruction:
          "When Assist queries error logs, which Grail table and filter does the generated DQL use?",
        hint: "Logs in Dynatrace are stored in a specific Grail table. ERROR level filtering uses a specific field.",
        type: "multiple-choice",
        choices: [
          "fetch events | filter level == 'ERROR'",
          "fetch logs | filter status == 'ERROR'",
          "fetch spans | filter error == true",
          "fetch metrics | filter type == 'log'",
        ],
        correctChoice: "fetch logs | filter status == 'ERROR'",
        points: 150,
      },
      {
        id: "cp3",
        title: "No Results Meaning",
        instruction:
          "Assist returns no ERROR logs from astroshop services in the last 30 days. What are the two most likely explanations?",
        hint: "No results could mean the system is healthy, or it could mean the query did not find what it was looking for for a different reason.",
        type: "multiple-choice",
        choices: [
          "Astroshop has no errors and the logs app is broken",
          "Either astroshop services genuinely had no ERROR-level logs in 30 days, or the log ingestion or filtering for astroshop services is not configured correctly",
          "Dynatrace does not support log querying",
          "ERROR logs are automatically deleted after 7 days",
        ],
        correctChoice:
          "Either astroshop services genuinely had no ERROR-level logs in 30 days, or the log ingestion or filtering for astroshop services is not configured correctly",
        points: 150,
      },
    ],
  },
  {
    id: "mission-error-budget-dev",
    title: "Your Error Budget",
    codename: "BURN RATE",
    role: "Developer",
    difficulty: "operator",
    description:
      "Your team owns the SLO. Use Assist to check how fast you are burning through the error budget before someone else notices.",
    briefing:
      "Developers own reliability now — not just features. Your service has an SLO. It has an error budget. And right now, that budget is either healthy, at risk, or burning fast. Assist can tell you in one prompt. This mission teaches developers to treat error budget like a resource — something you monitor and protect, not something you discover is gone after a breach. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-log-story"],
    disciplines: [
      { track: "developer", xp: 125 },
      { track: "sre", xp: 100 },
    ],
    topics: ["slo", "dt-intelligence"],
    category: "performance",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "SLO Status for Developers",
        instruction:
          "Which prompt gives a developer the clearest view of which SLOs are at risk right now?",
        hint: "You want current SLO values, targets, and warning thresholds — not just a pass/fail.",
        type: "multiple-choice",
        choices: [
          "show me SLOs",
          "Show me all SLOs and their current status, warning thresholds, and targets — highlight any that are in warning state or below target",
          "are my SLOs passing",
          "what is the error rate",
        ],
        correctChoice:
          "Show me all SLOs and their current status, warning thresholds, and targets — highlight any that are in warning state or below target",
        points: 100,
      },
      {
        id: "cp2",
        title: "Error Budget Ownership",
        instruction:
          "An SLO target is 95% and the current value is 94.8%. The SLO has breached. Who owns the error budget and what should happen next?",
        hint: "In modern SRE practice, the team that owns the service owns the SLO. A breach triggers a specific response.",
        type: "multiple-choice",
        choices: [
          "The SRE team owns all SLOs — developers just write code",
          "The team that owns the service owns the SLO. A breach should freeze non-reliability work until the budget is restored and root cause is investigated",
          "SLO breaches are automatically resolved by Dynatrace",
          "Lower the SLO target to match current performance",
        ],
        correctChoice:
          "The team that owns the service owns the SLO. A breach should freeze non-reliability work until the budget is restored and root cause is investigated",
        points: 175,
      },
      {
        id: "cp3",
        title: "Proactive Budget Monitoring",
        instruction:
          "How often should a developer check their service SLO status using Assist?",
        hint: "Error budget burns continuously. Checking it only when alerted is reactive.",
        type: "multiple-choice",
        choices: [
          "Only when a customer complains",
          "Only when an SLO breach alert fires",
          "Regularly during normal operations — ideally as part of daily workflow — so budget burn is caught before a breach, not after",
          "Once per quarter during planning",
        ],
        correctChoice:
          "Regularly during normal operations — ideally as part of daily workflow — so budget burn is caught before a breach, not after",
        points: 150,
      },
    ],
  },
  {
    id: "mission-code-fix-brief",
    title: "The Code Fix Brief",
    codename: "ROOT TO BRANCH",
    role: "Developer",
    difficulty: "elite",
    description:
      "Production is broken. Use Assist to generate a developer-ready brief with enough context to fix it without a war room call.",
    briefing:
      "The SRE has found the problem. Now they need to hand it off to you. In the old world: a Slack message with a screenshot and a prayer. In the new world: Assist generates a structured brief with root cause, affected code context, and a recommended fix direction — all from Grail data. No war room call. No context switching. Just the information you need to open the right file. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-error-budget-dev"],
    disciplines: [
      { track: "developer", xp: 200 },
      { track: "sre", xp: 75 },
    ],
    topics: ["traces", "logs", "dt-intelligence"],
    category: "root-cause-analysis",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Developer Handoff Prompt",
        instruction:
          "Which prompt generates the most useful developer-ready brief for a production issue?",
        hint: "A developer needs: what broke, which service, what the error is, and where in the code to look. Specify all of this in the prompt.",
        type: "multiple-choice",
        choices: [
          "what is broken",
          "Generate a developer-ready incident brief for the most critical active problem — include the affected service, error type, example log lines, and a recommended starting point for investigation",
          "show me the error",
          "which team should fix this",
        ],
        correctChoice:
          "Generate a developer-ready incident brief for the most critical active problem — include the affected service, error type, example log lines, and a recommended starting point for investigation",
        points: 150,
      },
      {
        id: "cp2",
        title: "MCP Server Value",
        instruction:
          "The Dynatrace MCP Server allows a developer to query Assist from inside VS Code or GitHub Copilot. What is the main benefit of this workflow?",
        hint: "Think about context switching — the biggest productivity killer for developers during incident response.",
        type: "multiple-choice",
        choices: [
          "VS Code runs faster than the Dynatrace UI",
          "Developers can query production observability data and get root cause context without leaving their IDE — eliminating context switching between tools",
          "The MCP Server provides code auto-completion",
          "GitHub Copilot can automatically fix bugs using Dynatrace data",
        ],
        correctChoice:
          "Developers can query production observability data and get root cause context without leaving their IDE — eliminating context switching between tools",
        points: 175,
      },
      {
        id: "cp3",
        title: "From Insight to Fix",
        instruction:
          "Assist provides a developer brief showing the astroshop-checkout service is failing with a Redis connection error. What is the correct developer workflow from here?",
        hint: "The brief gives you the context. Now you need to act on it — but in the right order.",
        type: "multiple-choice",
        choices: [
          "Immediately push a fix without testing",
          "Use the brief to locate the Redis connection handling code, reproduce the failure locally if possible, implement and test the fix, then deploy with monitoring active",
          "Reassign the ticket to the infrastructure team",
          "Ask Assist to write the fix automatically",
        ],
        correctChoice:
          "Use the brief to locate the Redis connection handling code, reproduce the failure locally if possible, implement and test the fix, then deploy with monitoring active",
        points: 175,
      },
    ],
  },
  {
    id: "mission-fleet-report",
    title: "The Fleet Report",
    codename: "FULL INVENTORY",
    role: "Platform Engineer",
    difficulty: "rookie",
    description:
      "You manage the infrastructure. Use Assist to get a full health report across hosts, clusters, and services in one prompt.",
    briefing:
      "Platform engineers live and die by their ability to quickly understand the state of the infrastructure they own. The old way: open Infrastructure and Operations, then Kubernetes, then Services — three apps, three mental models. The new way: one Assist prompt, full picture. This mission teaches you the Assist-first infrastructure overview workflow. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 300,
    status: "available",
    prerequisites: ["mission-the-dock"],
    disciplines: [
      { track: "platform-engineer", xp: 75 },
      { track: "sre", xp: 25 },
    ],
    topics: ["infrastructure", "kubernetes", "dt-intelligence"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Fleet Report Prompt",
        instruction:
          "Which prompt gives a Platform Engineer the fastest full infrastructure health summary?",
        hint: "You want hosts, Kubernetes clusters, and services in one response — not three separate queries.",
        type: "multiple-choice",
        choices: [
          "show me infrastructure",
          "Give me a full infrastructure health report — hosts, Kubernetes clusters, and services — current status summary",
          "how many hosts do we have",
          "open Infrastructure and Operations",
        ],
        correctChoice:
          "Give me a full infrastructure health report — hosts, Kubernetes clusters, and services — current status summary",
        points: 100,
      },
      {
        id: "cp2",
        title: "What the Report Covers",
        instruction:
          "The infrastructure health report from Assist covers three layers. What are they?",
        hint: "Think compute, orchestration, and application — the three tiers of a modern cloud-native environment.",
        type: "multiple-choice",
        choices: [
          "CPU, memory, and disk",
          "Hosts, Kubernetes clusters, and services",
          "Development, staging, and production",
          "AWS, Azure, and GCP",
        ],
        correctChoice: "Hosts, Kubernetes clusters, and services",
        points: 125,
      },
      {
        id: "cp3",
        title: "Report to Action",
        instruction:
          "Assist reports 11 active problems across the environment with 2 services directly affected. What is the Platform Engineer's correct next step?",
        hint: "You have the overview. Now you need to prioritize — not investigate everything at once.",
        type: "multiple-choice",
        choices: [
          "Restart all affected services immediately",
          "Triage the 11 problems by severity and blast radius — use Assist to get the causal chain for the highest severity items first",
          "Wait for the SRE team to handle it",
          "Open each problem in the UI manually",
        ],
        correctChoice:
          "Triage the 11 problems by severity and blast radius — use Assist to get the causal chain for the highest severity items first",
        points: 150,
      },
    ],
  },
  {
    id: "mission-disk-forecast",
    title: "Disk Forecast",
    codename: "SPACE INVADER",
    role: "Platform Engineer",
    difficulty: "rookie",
    description:
      "Disk does not fail suddenly — it fills slowly. Use Assist to predict which hosts run out of space before the alert fires.",
    briefing:
      "The disk alert on frontend-high-cpu has been open for 30 days. Nobody acted. That is the failure mode. The Forecasting Agent can predict disk exhaustion before it happens — giving you days to act instead of minutes. This mission teaches you to use predictive AI for proactive infrastructure management. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 360,
    status: "available",
    prerequisites: ["mission-fleet-report"],
    disciplines: [
      { track: "platform-engineer", xp: 100 },
      { track: "sre", xp: 50 },
    ],
    topics: ["infrastructure", "dt-intelligence", "metrics"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Disk Forecast Prompt",
        instruction:
          "Which prompt correctly asks Assist to predict disk space exhaustion across all hosts in the next 7 days?",
        hint: "Specify the prediction window and the data source. Assist needs both to run the Forecasting Agent.",
        type: "multiple-choice",
        choices: [
          "show me disk usage",
          "Which hosts are predicted to run out of disk space in the next 7 days based on the last 30 days of data?",
          "what is disk space",
          "forecast storage",
        ],
        correctChoice:
          "Which hosts are predicted to run out of disk space in the next 7 days based on the last 30 days of data?",
        points: 100,
      },
      {
        id: "cp2",
        title: "Forecast Output Structure",
        instruction:
          "When the Forecasting Agent responds to a disk prediction request, what does it return for each host?",
        hint: "The Forecasting Agent gives you a predicted percentage — not a binary yes or no — so you can prioritize by risk level.",
        type: "multiple-choice",
        choices: [
          "A simple yes or no — will it run out or not",
          "A predicted percentage of free disk space remaining at the end of the forecast window",
          "The exact date and time of disk exhaustion",
          "A list of files consuming the most disk space",
        ],
        correctChoice:
          "A predicted percentage of free disk space remaining at the end of the forecast window",
        points: 125,
      },
      {
        id: "cp3",
        title: "Proactive vs Reactive",
        instruction:
          "A host is predicted to have 50% disk free in 7 days — not critical. Another shows 3% free currently with an active alert. How do you prioritize?",
        hint: "One is a current problem, one is a future risk. Both need attention but in different timeframes.",
        type: "multiple-choice",
        choices: [
          "Handle the 50% host first because forecasting identified it proactively",
          "Address the 3% host immediately as an active incident, then schedule disk expansion for the 50% host within the week",
          "Ignore both — disk alerts resolve themselves",
          "Escalate both to P1 immediately",
        ],
        correctChoice:
          "Address the 3% host immediately as an active incident, then schedule disk expansion for the 50% host within the week",
        points: 150,
      },
    ],
  },
  {
    id: "mission-otel-inventory",
    title: "OTel Inventory",
    codename: "SIGNAL CENSUS",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Before you can manage telemetry at scale, you need to know what is sending signals. Use Assist to build a complete OTel inventory.",
    briefing:
      "Your organization has 100+ services. Some use OneAgent. Some use OpenTelemetry. Some use both. Some use neither. Before you can enforce observability standards or optimize ingestion costs, you need to know what is instrumented, how, and with which libraries. Assist can build that inventory in one prompt. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-disk-forecast"],
    disciplines: [
      { track: "platform-engineer", xp: 125 },
      { track: "developer", xp: 50 },
    ],
    topics: ["infrastructure", "dt-intelligence"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "OTel Inventory Prompt",
        instruction:
          "Which prompt asks Assist to return a complete list of OpenTelemetry-instrumented services with their libraries?",
        hint: "You want both the service name AND the instrumentation library — not just a count.",
        type: "multiple-choice",
        choices: [
          "show me OTel services",
          "Show me all OpenTelemetry-instrumented services and their instrumentation libraries in this environment",
          "which services use OpenTelemetry",
          "list instrumentation",
        ],
        correctChoice:
          "Show me all OpenTelemetry-instrumented services and their instrumentation libraries in this environment",
        points: 100,
      },
      {
        id: "cp2",
        title: "Instrumentation Library Patterns",
        instruction:
          "Assist returns that multiple services use the grpc instrumentation library. What does this tell a Platform Engineer about those services?",
        hint: "The library name tells you the communication protocol being traced. gRPC is a specific protocol.",
        type: "multiple-choice",
        choices: [
          "Those services are written in Go",
          "Those services communicate via gRPC protocol — their inter-service calls are being traced as OTel spans",
          "Those services do not support HTTP",
          "gRPC is a legacy instrumentation method that should be replaced",
        ],
        correctChoice:
          "Those services communicate via gRPC protocol — their inter-service calls are being traced as OTel spans",
        points: 150,
      },
      {
        id: "cp3",
        title: "Coverage Gap Identification",
        instruction:
          "Assist returns 35 OTel-instrumented services in an environment with 100+ total services. What should a Platform Engineer do with this information?",
        hint: "35 out of 100+ means the majority are not OTel-instrumented. What is the platform engineering response to an observability coverage gap?",
        type: "multiple-choice",
        choices: [
          "Nothing — 35 services is enough",
          "Identify which of the remaining services are business-critical and prioritize adding OTel instrumentation or OneAgent coverage to close the gap",
          "Remove OTel from all 35 services and standardize on OneAgent only",
          "Ask developers to instrument all 100 services this sprint",
        ],
        correctChoice:
          "Identify which of the remaining services are business-critical and prioritize adding OTel instrumentation or OneAgent coverage to close the gap",
        points: 150,
      },
    ],
  },
  {
    id: "mission-log-volume",
    title: "Log Volume Intelligence",
    codename: "LOG ECONOMY",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Log ingestion costs money. Use Assist to identify which services generate the most volume and where to optimize.",
    briefing:
      "Every log line costs compute and storage. At scale, unmanaged log volume becomes a budget problem. Before you can optimize, you need to know which services are generating the most logs and whether that volume is signal or noise. Assist can surface this — but at scale, complex log volume queries can hit Assist tool call limits. This mission teaches you how to scope queries effectively. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-otel-inventory"],
    disciplines: [
      { track: "platform-engineer", xp: 125 },
      { track: "sre", xp: 50 },
    ],
    topics: ["logs", "dql", "dt-intelligence"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Scoped Log Volume Prompt",
        instruction:
          "Asking Assist for log volume across ALL services at once can hit tool call limits. Which prompt is better scoped for reliable results?",
        hint: "Assist can make up to 10 internal tool calls per response. A query scoped to a namespace or specific services is less likely to exceed this limit.",
        type: "multiple-choice",
        choices: [
          "Which services are generating the most log volume in the last 30 days? Show top 10",
          "Show me all logs from all services for the last 30 days",
          "Which astroshop services generated the most ERROR logs in the last 30 days, grouped by service?",
          "fetch logs | summarize count()",
        ],
        correctChoice:
          "Which astroshop services generated the most ERROR logs in the last 30 days, grouped by service?",
        points: 125,
      },
      {
        id: "cp2",
        title: "Tool Call Limit Meaning",
        instruction:
          "Assist returns: the maximum number of tool calls has been reached for this request. What does this mean and what should you do?",
        hint: "Assist uses internal MCP tools to query Grail. Complex or broad queries require more tool calls. The limit is 10 per response.",
        type: "multiple-choice",
        choices: [
          "Dynatrace is down — try again later",
          "The query was too broad and required more than 10 internal tool calls. Narrow the scope — target a specific namespace, service, or timeframe — and retry",
          "You have run out of Assist credits for the day",
          "The logs app is unavailable",
        ],
        correctChoice:
          "The query was too broad and required more than 10 internal tool calls. Narrow the scope — target a specific namespace, service, or timeframe — and retry",
        points: 175,
      },
      {
        id: "cp3",
        title: "Log Volume to Cost Action",
        instruction:
          "Assist identifies that a single service generates 80% of all log volume. What are the two options a Platform Engineer should evaluate?",
        hint: "High log volume from one service is either justified by the signal value or wasteful noise. Both cases have different responses.",
        type: "multiple-choice",
        choices: [
          "Delete all logs from that service immediately",
          "Evaluate whether the high volume is valuable signal — if yes, optimize ingestion with OpenPipeline filtering; if noise, work with the team to reduce log verbosity at the source",
          "Increase the log storage quota to accommodate the volume",
          "Move the service to a different cluster",
        ],
        correctChoice:
          "Evaluate whether the high volume is valuable signal — if yes, optimize ingestion with OpenPipeline filtering; if noise, work with the team to reduce log verbosity at the source",
        points: 175,
      },
    ],
  },
  {
    id: "mission-workflow-builder",
    title: "Build the Workflow",
    codename: "AUTOMATE IT",
    role: "Platform Engineer",
    difficulty: "operator",
    description:
      "Stop responding to the same alert manually. Use Assist to design a workflow that handles it automatically.",
    briefing:
      "The CPU alert on frontend-high-cpu has fired dozens of times. Every time, an engineer manually investigates and restarts the process. That is toil. Dynatrace Workflows can automate this — triggered by a metric event, executing a remediation action. Assist can design the workflow for you. This mission teaches you to use Assist as your automation architect. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 420,
    status: "available",
    prerequisites: ["mission-log-volume"],
    disciplines: [
      { track: "platform-engineer", xp: 150 },
      { track: "sre", xp: 75 },
    ],
    topics: ["automation", "dt-intelligence"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Workflow Design Prompt",
        instruction:
          "Which prompt asks Assist to design a complete workflow for CPU-based auto-remediation?",
        hint: "Specify the trigger condition, the notification action, and the remediation action. The more specific the prompt, the more complete the workflow design.",
        type: "multiple-choice",
        choices: [
          "create a workflow",
          "Generate a Dynatrace workflow that fires when CPU usage exceeds 90% on any host for more than 5 minutes, sends a Slack notification, and restarts the affected process group",
          "how do I automate alerts",
          "show me workflows",
        ],
        correctChoice:
          "Generate a Dynatrace workflow that fires when CPU usage exceeds 90% on any host for more than 5 minutes, sends a Slack notification, and restarts the affected process group",
        points: 125,
      },
      {
        id: "cp2",
        title: "Workflow Trigger Type",
        instruction:
          "For a workflow that fires when CPU exceeds 90% for more than 5 minutes, which trigger type should you configure in Dynatrace Workflows?",
        hint: "You are triggering on a sustained metric threshold — not an event, not a schedule, not a problem.",
        type: "multiple-choice",
        choices: [
          "Schedule trigger — runs every 5 minutes",
          "Problem detected trigger — fires when Davis opens a problem",
          "Metric event trigger — fires when a metric crosses a defined threshold for a sustained duration",
          "Webhook trigger — fires when an external system calls Dynatrace",
        ],
        correctChoice:
          "Metric event trigger — fires when a metric crosses a defined threshold for a sustained duration",
        points: 150,
      },
      {
        id: "cp3",
        title: "Assist vs Manual Workflow Design",
        instruction:
          "What is the advantage of using Assist to design a workflow versus building it manually in the Workflows UI?",
        hint: "Think about what Assist provides that the UI canvas does not — especially for someone new to workflow configuration.",
        type: "multiple-choice",
        choices: [
          "Assist workflows deploy automatically without any manual configuration",
          "Assist generates a step-by-step design with specific metric names, trigger conditions, and action types — giving you a blueprint to implement rather than starting from a blank canvas",
          "Assist workflows are faster than manually configured ones",
          "The Workflows UI does not support CPU-based triggers",
        ],
        correctChoice:
          "Assist generates a step-by-step design with specific metric names, trigger conditions, and action types — giving you a blueprint to implement rather than starting from a blank canvas",
        points: 150,
      },
    ],
  },
  {
    id: "mission-approval-gate",
    title: "The Approval Gate",
    codename: "HUMAN IN THE LOOP",
    role: "Platform Engineer",
    difficulty: "elite",
    description:
      "Full automation is powerful but dangerous. Use Assist to design a workflow with a human approval gate before any remediation runs.",
    briefing:
      "Auto-remediation without human oversight is how you make a bad situation catastrophic. A workflow that automatically restarts a process during a cascade failure could make things worse. The approval gate pattern puts a human in the loop before any destructive action runs — Assist sends the notification, a human reviews and approves, then the workflow proceeds. This is responsible automation. Use the Dynatrace Playground at https://playground.apps.dynatrace.com",
    timerSeconds: 480,
    status: "available",
    prerequisites: ["mission-workflow-builder"],
    disciplines: [
      { track: "platform-engineer", xp: 200 },
      { track: "incident-commander", xp: 100 },
    ],
    topics: ["automation", "dt-intelligence"],
    category: "configuration",
    apps: ["Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "Approval Gate Prompt",
        instruction:
          "Which prompt asks Assist to design a workflow that includes a human approval gate before remediation?",
        hint: "You need to explicitly specify the approval gate in the prompt — Assist will include it in the workflow design if you ask for it.",
        type: "multiple-choice",
        choices: [
          "create a workflow with approval",
          "Generate a Dynatrace workflow that sends a Slack notification when any host CPU exceeds 90% for more than 5 minutes, and include an approval gate before any remediation action runs",
          "how do I add an approval to a workflow",
          "show me approval workflows",
        ],
        correctChoice:
          "Generate a Dynatrace workflow that sends a Slack notification when any host CPU exceeds 90% for more than 5 minutes, and include an approval gate before any remediation action runs",
        points: 125,
      },
      {
        id: "cp2",
        title: "Why Approval Gates Matter",
        instruction:
          "A workflow detects CPU saturation and automatically restarts the webserver process without an approval gate. During a cascade failure affecting 5 services, what is the risk?",
        hint: "Think about what restarting a process does to in-flight requests during a cascade failure.",
        type: "multiple-choice",
        choices: [
          "No risk — restarting always resolves CPU issues",
          "Restarting the process during a cascade drops all in-flight requests, potentially worsening the failure and making root cause analysis harder",
          "The workflow would be blocked by Dynatrace security policies",
          "Approval gates slow down remediation too much to be useful",
        ],
        correctChoice:
          "Restarting the process during a cascade drops all in-flight requests, potentially worsening the failure and making root cause analysis harder",
        points: 175,
      },
      {
        id: "cp3",
        title: "Approval Gate Workflow Order",
        instruction:
          "What is the correct sequence of steps in an approval gate workflow?",
        hint: "The human needs enough information to make the approval decision — so notification must come before the gate, not after.",
        type: "multiple-choice",
        choices: [
          "Trigger → Remediation → Notification → Approval gate",
          "Trigger → Notification with context → Approval gate → Remediation",
          "Approval gate → Trigger → Notification → Remediation",
          "Trigger → Approval gate → Remediation → Notification",
        ],
        correctChoice:
          "Trigger → Notification with context → Approval gate → Remediation",
        points: 175,
      },
      {
        id: "cp4",
        title: "Responsible Automation Principle",
        instruction:
          "When should a Platform Engineer choose full automation versus human-in-the-loop automation?",
        hint: "Think about risk level, reversibility, and confidence in the remediation action.",
        type: "multiple-choice",
        choices: [
          "Always use full automation — humans are the bottleneck",
          "Always use approval gates — automation is never safe",
          "Use full automation for low-risk, reversible, well-understood actions with high confidence. Use approval gates for high-risk, irreversible, or novel remediation actions",
          "Use approval gates only during business hours",
        ],
        correctChoice:
          "Use full automation for low-risk, reversible, well-understood actions with high confidence. Use approval gates for high-risk, irreversible, or novel remediation actions",
        points: 200,
      },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
