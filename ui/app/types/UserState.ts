export type Discipline = "sre" | "developer" | "incident-commander" | "platform-engineer";

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
  onboardingComplete: boolean;
  createdAt: string;
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
