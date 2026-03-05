export interface Checkpoint {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  type: "action" | "multiple-choice";
  choices?: string[];
  correctChoice?: string;
  points: number;
}

import type { Discipline, TopicId } from "./UserState";

export interface MissionDisciplineXP {
  track: Discipline;
  xp: number;
}

export interface Mission {
  id: string;
  title: string;
  codename: string;
  role: string;
  difficulty: "rookie" | "operator" | "elite" | "legend";
  description: string;
  briefing: string;
  timerSeconds: number;
  checkpoints: Checkpoint[];
  status: "available" | "locked";
  disciplines: MissionDisciplineXP[];
  topics: TopicId[];
}

export interface ScoreRecord {
  missionId: string;
  missionTitle: string;
  role: string;
  difficulty: string;
  baseScore: number;
  timeBonus: number;
  totalScore: number;
  completedAt: string;
  userName: string;
  userId: string;
}
