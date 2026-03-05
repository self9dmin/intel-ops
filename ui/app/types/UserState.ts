export type Discipline = "sre" | "developer" | "incident-commander" | "platform-engineer";

export type TopicId =
  | "dql"
  | "traces"
  | "davis"
  | "metrics"
  | "logs"
  | "smartscape"
  | "kubernetes"
  | "synthetics"
  | "slo"
  | "automation"
  | "security"
  | "bizevents";

export type TopicLevelName = "Novice" | "Apprentice" | "Practitioner" | "Expert" | "Master";

export interface TopicMeta {
  id: TopicId;
  label: string;
  icon: string;
}

export const TOPIC_META: Record<TopicId, TopicMeta> = {
  dql: { id: "dql", label: "DQL", icon: "AnalyticsIcon" },
  traces: { id: "traces", label: "Traces", icon: "TracesIcon" },
  davis: { id: "davis", label: "Davis AI", icon: "DavisAIIcon" },
  metrics: { id: "metrics", label: "Metrics", icon: "BarChartIcon" },
  logs: { id: "logs", label: "Logs", icon: "LogsIcon" },
  smartscape: { id: "smartscape", label: "Smartscape", icon: "SmartscapeIcon" },
  kubernetes: { id: "kubernetes", label: "Kubernetes", icon: "ContainerIcon" },
  synthetics: { id: "synthetics", label: "Synthetics", icon: "HttpIcon" },
  slo: { id: "slo", label: "SLOs", icon: "ServiceLevelObjectivesIcon" },
  automation: { id: "automation", label: "Automation", icon: "WorkflowsIcon" },
  security: { id: "security", label: "Security", icon: "ApplicationSecurityIcon" },
  bizevents: { id: "bizevents", label: "Biz Events", icon: "EventIcon" },
};

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

export type DisciplineLevelName = "Recruit" | "Analyst" | "Specialist" | "Expert" | "Elite";

export interface DisciplineProgress {
  xp: number;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: DisciplineLevelName;
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
}

export function migrateUserState(loaded: Record<string, unknown>): UserState {
  return {
    ...(loaded as unknown as UserState),
    completedMissions: (loaded.completedMissions as string[] | undefined) ?? [],
    streakDays: (loaded.streakDays as number | undefined) ?? 0,
    lastActiveDate: (loaded.lastActiveDate as string | undefined) ?? "",
    badges: (loaded.badges as string[] | undefined) ?? [],
    topicXP: (loaded.topicXP as Record<string, number> | undefined) ?? {},
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
