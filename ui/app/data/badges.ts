import type { DisciplineProgress } from "../types/UserState";
import { MISSIONS } from "./missions";
import { CIRCUITS } from "./circuits";

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
    name: "Lights Out",
    icon: "lights-out",
    description: "Completed your first mission",
    howToEarn: "Complete any mission",
    predicate: (ctx) => ctx.completedMissions.length >= 1,
  },
  {
    id: "streak-3",
    name: "In the Window",
    icon: "in-the-window",
    description: "3-day activity streak — staying in the ERS window",
    howToEarn: "Complete missions on 3 consecutive days",
    predicate: (ctx) => ctx.streakDays >= 3,
  },
  {
    id: "streak-7",
    name: "Boost Mode",
    icon: "boost-mode",
    description: "7-day activity streak — maximum power deployed",
    howToEarn: "Complete missions on 7 consecutive days",
    predicate: (ctx) => ctx.streakDays >= 7,
  },
  {
    id: "in-the-points",
    name: "In the Points",
    icon: "in-the-points",
    description: "Completed 3 missions — consistently scoring",
    howToEarn: "Complete 3 different missions",
    predicate: (ctx) => ctx.completedMissions.length >= 3,
  },
  {
    id: "all-rookie",
    name: "Graduated to Q2",
    icon: "graduated-q2",
    description: "Cleared the first elimination round",
    howToEarn: "Complete every Rookie-difficulty mission",
    predicate: (ctx) => {
      const rookieMissions = MISSIONS.filter((m) => m.difficulty === "rookie");
      return rookieMissions.every((m) => ctx.completedMissions.includes(m.id));
    },
  },
  {
    id: "race-winner",
    name: "Race Winner",
    icon: "race-winner",
    description: "Completed 5 missions — taken the chequered flag",
    howToEarn: "Complete 5 different missions",
    predicate: (ctx) => ctx.completedMissions.length >= 5,
  },
  {
    id: "multi-discipline",
    name: "Understeer-Proof",
    icon: "understeer-proof",
    description: "Reached Analyst level in 3+ disciplines",
    howToEarn: "Reach Analyst level (100 XP) in 3 or more disciplines",
    predicate: (ctx) => {
      const analysts = Object.values(ctx.disciplines).filter((d) => d.xp >= 100);
      return analysts.length >= 3;
    },
  },
  {
    id: "grand-slam",
    name: "Grand Slam",
    icon: "grand-slam",
    description: "Completed every mission in a circuit",
    howToEarn: "Complete all missions in any single circuit",
    predicate: (ctx) => {
      return CIRCUITS.some((circuit) =>
        circuit.missionIds.every((id) => ctx.completedMissions.includes(id))
      );
    },
  },
  {
    id: "overtake-mode",
    name: "Overtake Mode",
    icon: "overtake-mode",
    description: "Climbed into the top 10 on the leaderboard",
    howToEarn: "Reach a top 10 position on the global leaderboard",
    predicate: (ctx) => ctx.totalXP >= 500,
  },
];
