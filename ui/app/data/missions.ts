import type { Mission } from "../types/mission.types";

export const MISSIONS: Mission[] = [
  {
    id: "mission-what-are-you",
    title: "Welcome to the Playground",
    codename: "FIRST CONTACT",
    role: "All Roles",
    difficulty: "rookie",
    description:
      "You just logged in. The Playground is live. Before anything breaks, learn what Dynatrace is showing you and where everything lives.",
    briefing:
      "Every operator needs to know the terrain before the first alert fires. The Playground home screen is your starting point — it shows you what Dynatrace can do, where to get help, and how to navigate the platform. Open https://playground.apps.dynatrace.com and spend 10 minutes here before you need it under pressure.",
    timerSeconds: 600,
    status: "available",
    prerequisites: [],
    disciplines: [{ track: "platform-engineer", xp: 75 }],
    topics: ["infrastructure", "dt-intelligence"],
    category: "root-cause-analysis",
    apps: ["Dynatrace Home", "Dynatrace Assist"],
    checkpoints: [
      {
        id: "cp1",
        title: "The Platform Model",
        instruction:
          "On the Playground home screen, click 'What is Dynatrace?' under 'Get started with Dynatrace'. Once on that page, scroll down past the YouTube guides to the section titled 'What Makes Dynatrace Unique?' — what is the role of Producers in the Dynatrace model?",
        hint: "Read the Producers/Consumers diagram carefully. Producers are on the left side of the model — what do they do?",
        type: "multiple-choice",
        choices: [
          "Producers consume insights and build dashboards",
          "Producers generate data — applications, services, infrastructure, cloud platforms, and digital user experiences",
          "Producers analyze and predict anomalies using AI",
          "Producers manage user access and permissions",
        ],
        correctChoice:
          "Producers generate data — applications, services, infrastructure, cloud platforms, and digital user experiences",
        points: 100,
      },
      {
        id: "cp2",
        title: "The Intelligence Workflow",
        instruction:
          "Still on the 'What is Dynatrace?' page. The platform model shows a 7-step workflow from data collection to action. What are the first and last steps in that workflow?",
        hint: "Look at the workflow steps shown in the middle of the Producers/Consumers diagram — they go from raw data all the way to taking action.",
        type: "multiple-choice",
        choices: [
          "Ingest → Deploy",
          "Monitor → Alert",
          "Collect → Solve",
          "Capture → Automate",
        ],
        correctChoice: "Collect → Solve",
        points: 125,
      },
      {
        id: "cp3",
        title: "The DQL Foundation",
        instruction:
          "Go back to the home screen and click 'Learn and develop'. What does the tip on this page say about DQL?",
        hint: "Look for a tip callout on the Learn & Develop page — it specifically mentions DQL and three tools it helps with.",
        type: "multiple-choice",
        choices: [
          "Tip: DQL is only needed for advanced users building custom dashboards",
          "Tip: Start by learning Dynatrace Query Language (DQL)—it'll give you a jumpstart with Dashboards, Notebooks, and Logs",
          "Tip: DQL replaces all other query languages in Dynatrace",
          "Tip: Learn DQL after you complete your first certification",
        ],
        correctChoice:
          "Tip: Start by learning Dynatrace Query Language (DQL)—it'll give you a jumpstart with Dashboards, Notebooks, and Logs",
        points: 100,
      },
      {
        id: "cp4",
        title: "The App Categories",
        instruction:
          "Open the Apps grid (grid icon in the Dock). How many top-level category sections are listed?",
        hint: "Scroll through the full Apps grid and count every category header — start from 'Observe and explore' all the way to the bottom.",
        type: "multiple-choice",
        choices: ["6", "8", "10", "12"],
        correctChoice: "10",
        points: 100,
      },
      {
        id: "cp5",
        title: "Ask the Machine",
        instruction:
          "Open Dynatrace Assist (Ctrl+I). Type: 'What is Dynatrace and what can you help me with?' — which of these best describes what Assist returns?",
        hint: "Assist is not a search engine or a link directory. It has access to your environment data and can reason about it.",
        type: "multiple-choice",
        choices: [
          "A list of links to documentation pages",
          "A natural language summary of what Dynatrace does and an offer to query your environment, analyze problems, or explain platform concepts",
          "An error message saying it cannot answer general questions",
          "A redirect to Dynatrace University",
        ],
        correctChoice:
          "A natural language summary of what Dynatrace does and an offer to query your environment, analyze problems, or explain platform concepts",
        points: 125,
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
