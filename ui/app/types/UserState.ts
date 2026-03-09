export type Discipline = "sre" | "developer" | "incident-commander" | "platform-engineer";

export type TopicId =
  | "infrastructure"
  | "problems"
  | "dashboards"
  | "services"
  | "notebooks"
  | "settings"
  | "dql"
  | "traces"
  | "dt-intelligence"
  | "metrics"
  | "logs"
  | "smartscape"
  | "kubernetes"
  | "synthetics"
  | "slo"
  | "automation"
  | "security"
  | "bizevents"
  | "dem"
  | "community";

export type TopicLevelName = "Novice" | "Apprentice" | "Practitioner" | "Expert" | "Master";

export interface TopicMeta {
  id: TopicId;
  label: string;
  icon: string;
  active: boolean;
}

export const TOPIC_META: Record<TopicId, TopicMeta> = {
  infrastructure: { id: "infrastructure", label: "Infrastructure", icon: "HostIcon", active: true },
  problems: { id: "problems", label: "Problems", icon: "ProblemIcon", active: true },
  "dt-intelligence": { id: "dt-intelligence", label: "Intelligence", icon: "AiIcon", active: true },
  dql: { id: "dql", label: "DQL", icon: "AnalyticsIcon", active: true },
  traces: { id: "traces", label: "Traces", icon: "TracesIcon", active: true },
  metrics: { id: "metrics", label: "Metrics", icon: "BarChartIcon", active: true },
  logs: { id: "logs", label: "Logs", icon: "LogsIcon", active: true },
  kubernetes: { id: "kubernetes", label: "Kubernetes", icon: "ContainerIcon", active: true },
  synthetics: { id: "synthetics", label: "Synthetics", icon: "HttpIcon", active: true },
  dashboards: { id: "dashboards", label: "Dashboards", icon: "DashboardIcon", active: true },
  services: { id: "services", label: "Services & APM", icon: "ServiceIcon", active: false },
  smartscape: { id: "smartscape", label: "Smartscape", icon: "SmartscapeIcon", active: false },
  notebooks: { id: "notebooks", label: "Notebooks", icon: "NotebookIcon", active: true },
  slo: { id: "slo", label: "SLOs", icon: "ServiceLevelObjectivesIcon", active: false },
  settings: { id: "settings", label: "Settings & Admin", icon: "SettingsIcon", active: true },
  automation: { id: "automation", label: "Automation", icon: "WorkflowsIcon", active: true },
  security: { id: "security", label: "Security", icon: "ApplicationSecurityIcon", active: true },
  bizevents: { id: "bizevents", label: "Biz Events", icon: "EventIcon", active: true },
  dem: { id: "dem", label: "Digital Experience", icon: "UserSessionsIcon", active: true },
  community: { id: "community", label: "Community & Support", icon: "GroupIcon", active: false },
};

export const TOPIC_META_ORDERED: TopicMeta[] = [
  TOPIC_META["infrastructure"],
  TOPIC_META["problems"],
  TOPIC_META["dt-intelligence"],
  TOPIC_META["metrics"],
  TOPIC_META["logs"],
  TOPIC_META["traces"],
  TOPIC_META["dql"],
  TOPIC_META["kubernetes"],
  TOPIC_META["synthetics"],
  TOPIC_META["dashboards"],
  TOPIC_META["services"],
  TOPIC_META["automation"],
  TOPIC_META["smartscape"],
  TOPIC_META["notebooks"],
  TOPIC_META["slo"],
  TOPIC_META["settings"],
  TOPIC_META["security"],
  TOPIC_META["bizevents"],
  TOPIC_META["dem"],
  TOPIC_META["community"],
];

export const TOPIC_THRESHOLDS: { level: number; name: TopicLevelName; xp: number }[] = [
  { level: 1, name: "Novice", xp: 0 },
  { level: 2, name: "Apprentice", xp: 100 },
  { level: 3, name: "Practitioner", xp: 300 },
  { level: 4, name: "Expert", xp: 600 },
  { level: 5, name: "Master", xp: 2000 },
];

export function getTopicLevel(xp: number): { level: number; levelName: TopicLevelName } {
  for (let i = TOPIC_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= TOPIC_THRESHOLDS[i].xp) {
      return { level: TOPIC_THRESHOLDS[i].level, levelName: TOPIC_THRESHOLDS[i].name };
    }
  }
  return { level: 1, levelName: "Novice" };
}

export const DISCIPLINE_META: Record<Discipline, { label: string; color: string }> = {
  sre: { label: "SRE", color: "#4b9cf5" },
  developer: { label: "Developer", color: "#7c5cbf" },
  "incident-commander": { label: "Incident Commander", color: "#e8734a" },
  "platform-engineer": { label: "Platform Engineer", color: "#3dba7e" },
};

export type DisciplineLevelName = "Recruit" | "Analyst" | "Specialist" | "Expert" | "Elite";

export interface DisciplineProgress {
  xp: number;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: DisciplineLevelName;
}

export type ExperienceLevel = "new" | "learning" | "experienced";

export interface ResponsibilityArea {
  id: string;
  label: string;
  icon: string;
  topics: TopicId[];
}

export const RESPONSIBILITY_AREAS: ResponsibilityArea[] = [
  { id: "infra", label: "Servers & Infrastructure", icon: "🖥️", topics: ["infrastructure", "problems", "metrics"] },
  { id: "kubernetes", label: "Kubernetes & Containers", icon: "☸️", topics: ["kubernetes", "infrastructure"] },
  { id: "apm", label: "Application Performance (APM)", icon: "⚡", topics: ["services", "traces", "metrics"] },
  { id: "logs", label: "Logs & Log Analytics", icon: "📋", topics: ["logs", "dql"] },
  { id: "incidents", label: "Incident Response & Alerts", icon: "🚨", topics: ["problems", "dt-intelligence", "metrics"] },
  { id: "dashboards", label: "Dashboards & Reporting", icon: "📊", topics: ["dashboards", "dql"] },
  { id: "rum", label: "Real User Monitoring", icon: "👤", topics: ["synthetics", "services"] },
  { id: "dql", label: "Data Querying (DQL)", icon: "🔍", topics: ["dql", "logs", "metrics"] },
  { id: "automation", label: "Workflows & Automation", icon: "⚙️", topics: ["automation", "dql"] },
  { id: "security", label: "Security & Vulnerability Mgmt", icon: "🔒", topics: ["security"] },
  { id: "admin", label: "Platform Admin & Settings", icon: "🛠️", topics: ["settings", "infrastructure"] },
  { id: "bizevents", label: "Business Events & Analytics", icon: "📈", topics: ["bizevents", "dql"] },
];

export function deriveTopicPriority(selectedAreaIds: string[]): TopicId[] {
  const counts = new Map<TopicId, number>();
  for (const areaId of selectedAreaIds) {
    const area = RESPONSIBILITY_AREAS.find((a) => a.id === areaId);
    if (area) {
      for (const topic of area.topics) {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);
}

export interface UserState {
  userId: string;
  userEmail: string;
  startingDiscipline: Discipline;
  disciplines: Record<Discipline, DisciplineProgress>;
  topicXP: Partial<Record<TopicId, number>>;
  onboardingComplete: boolean;
  createdAt: string;
  completedMissions: string[];
  streakDays: number;
  lastActiveDate: string;
  badges: string[];
  selectedAreas: string[];
  topicTrackPriority: TopicId[];
  experienceLevel: ExperienceLevel;
  selectedRole?: string;
  selectedSubNeed?: string;
  startingCircuit?: string;
}

export function migrateUserState(loaded: Record<string, unknown>): UserState {
  const topicXP = (loaded.topicXP as Record<string, number> | undefined) ?? {};
  if ("davis" in topicXP) {
    topicXP["dt-intelligence"] = topicXP["davis"];
    delete topicXP["davis"];
  }

  return {
    ...(loaded as unknown as UserState),
    completedMissions: (loaded.completedMissions as string[] | undefined) ?? [],
    streakDays: (loaded.streakDays as number | undefined) ?? 0,
    lastActiveDate: (loaded.lastActiveDate as string | undefined) ?? "",
    badges: (loaded.badges as string[] | undefined) ?? [],
    topicXP,
    selectedAreas: (loaded.selectedAreas as string[] | undefined) ?? [],
    topicTrackPriority: (loaded.topicTrackPriority as TopicId[] | undefined) ?? [],
    experienceLevel: (loaded.experienceLevel as ExperienceLevel | undefined) ?? "new",
    selectedRole: (loaded.selectedRole as string | undefined) ?? undefined,
    selectedSubNeed: (loaded.selectedSubNeed as string | undefined) ?? undefined,
    startingCircuit: (loaded.startingCircuit as string | undefined) ?? undefined,
  };
}

export function computeTotalXP(disciplines: Record<string, DisciplineProgress>): number {
  return Object.values(disciplines).reduce((sum, d) => sum + d.xp, 0);
}

export const XP_THRESHOLDS: { level: DisciplineProgress["level"]; name: DisciplineLevelName; xp: number }[] = [
  { level: 1, name: "Recruit", xp: 0 },
  { level: 2, name: "Analyst", xp: 500 },
  { level: 3, name: "Specialist", xp: 1500 },
  { level: 4, name: "Expert", xp: 3000 },
  { level: 5, name: "Elite", xp: 6000 },
];

export function calculateLevel(xp: number): Pick<DisciplineProgress, "level" | "levelName"> {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i].xp) {
      return { level: XP_THRESHOLDS[i].level, levelName: XP_THRESHOLDS[i].name };
    }
  }
  return { level: 1, levelName: "Recruit" };
}

export function createDefaultDisciplines(): Record<Discipline, DisciplineProgress> {
  return {
    sre: { xp: 0, level: 1, levelName: "Recruit" },
    developer: { xp: 0, level: 1, levelName: "Recruit" },
    "incident-commander": { xp: 0, level: 1, levelName: "Recruit" },
    "platform-engineer": { xp: 0, level: 1, levelName: "Recruit" },
  };
}
