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

export type MissionEvidenceStatus =
  | "playground-validated"
  | "tenant-validated"
  | "documentation-backed"
  | "content-review";

export interface MissionEvidence {
  status: MissionEvidenceStatus;
  sourceUrls: string[];
  capturedAt?: string;
  dataMode?: "playground" | "tenant" | "fixture" | "documentation";
  requiredCapabilities?: string[];
  notes?: string;
}

import type { Discipline } from "./UserState";

export interface MissionDisciplineXP {
  track: Discipline;
  xp: number;
}

export type MissionCategory =
  | "incident-response"
  | "performance"
  | "root-cause-analysis"
  | "configuration"
  | "cost-optimization";

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
  prerequisites: string[];
  topics: string[];
  category: MissionCategory;
  apps?: string[];
  evidence?: MissionEvidence;
}

export interface XPGrant {
  discipline?: Discipline;
  topic?: string;
  amount: number;
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

export type MissionReviewKind = "internal" | "community";
export type MissionReviewDecision = "ready" | "revise" | "blocked";
export type MissionReviewDimension =
  | "accuracy"
  | "evidence"
  | "clarity"
  | "difficulty"
  | "outcome"
  | "operability";

export type MissionReviewRatings = Partial<
  Record<MissionReviewDimension, number>
>;

export interface MissionReview {
  id?: string;
  missionId: string;
  missionTitle: string;
  kind: MissionReviewKind;
  reviewerId: string;
  reviewerName: string;
  ratings: MissionReviewRatings;
  overallRating?: number;
  decision?: MissionReviewDecision;
  issueTags?: string[];
  notes?: string;
  createdAt: string;
  appVersion?: string;
}
