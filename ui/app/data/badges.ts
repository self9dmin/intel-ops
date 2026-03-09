import type { DisciplineProgress } from "../types/UserState";
import { MISSIONS } from "./missions";

export interface BadgeContext {
  completedMissions: string[];
  streakDays: number;
  disciplines: Record<string, DisciplineProgress>;
  topicXP: Record<string, number>;
  totalXP: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  howToEarn: string;
  predicate: (ctx: BadgeContext) => boolean;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: "first-mission",
    name: "First Contact",
    icon: "rocket",
    description: "Completed your first mission",
    howToEarn: "Complete any mission",
    predicate: (ctx) => ctx.completedMissions.length >= 1,
  },
  {
    id: "streak-3",
    name: "On Fire",
    icon: "flame",
    description: "3-day activity streak",
    howToEarn: "Complete missions on 3 consecutive days",
    predicate: (ctx) => ctx.streakDays >= 3,
  },
  {
    id: "streak-7",
    name: "Unstoppable",
    icon: "lightning",
    description: "7-day activity streak",
    howToEarn: "Complete missions on 7 consecutive days",
    predicate: (ctx) => ctx.streakDays >= 7,
  },
  {
    id: "all-rookie",
    name: "Graduated",
    icon: "graduation",
    description: "Completed all Rookie missions",
    howToEarn: "Complete every Rookie-difficulty mission",
    predicate: (ctx) => {
      const rookieMissions = MISSIONS.filter((m) => m.difficulty === "rookie");
      return rookieMissions.every((m) => ctx.completedMissions.includes(m.id));
    },
  },
  {
    id: "multi-discipline",
    name: "Renaissance Operator",
    icon: "star",
    description: "Reached Analyst in 3+ disciplines",
    howToEarn: "Reach Analyst level (100 XP) in 3 or more disciplines",
    predicate: (ctx) => {
      const analysts = Object.values(ctx.disciplines).filter((d) => d.xp >= 100);
      return analysts.length >= 3;
    },
  },
  {
    id: "five-missions",
    name: "Veteran",
    icon: "shield",
    description: "Completed 5 missions",
    howToEarn: "Complete 5 different missions",
    predicate: (ctx) => ctx.completedMissions.length >= 5,
  },
];
