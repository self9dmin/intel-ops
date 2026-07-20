import type {
  Mission,
  MissionReviewDecision,
  MissionReviewDimension,
  MissionReviewRatings,
} from "../types/mission.types";

export const REVIEW_DIMENSIONS: {
  id: MissionReviewDimension;
  label: string;
  weight: number;
  prompt: string;
}[] = [
  { id: "accuracy", label: "Accuracy", weight: 25, prompt: "Are the claims, answers, and product behaviors correct?" },
  { id: "evidence", label: "Evidence", weight: 25, prompt: "Can a reviewer reproduce the answer from current data or authoritative documentation?" },
  { id: "clarity", label: "Clarity", weight: 15, prompt: "Can the target learner understand the task and what good evidence looks like?" },
  { id: "difficulty", label: "Difficulty", weight: 10, prompt: "Does the difficulty match the reasoning burden and prerequisite level?" },
  { id: "outcome", label: "Learner outcome", weight: 15, prompt: "Does the mission produce a useful operational finding or decision?" },
  { id: "operability", label: "Operability", weight: 10, prompt: "Are permissions, entitlements, fallback paths, and safety limits clear?" },
];

export const REVIEW_ISSUE_TAGS = [
  "wrong-answer",
  "stale-ui",
  "missing-data",
  "permission-blocked",
  "unclear-instruction",
  "too-easy",
  "too-hard",
  "no-operational-outcome",
] as const;

export interface MissionQualityCheck {
  label: string;
  passed: boolean;
  blocking: boolean;
  detail: string;
}

export interface MissionQualitySummary {
  score: number;
  decision: MissionReviewDecision;
  checks: MissionQualityCheck[];
}

export function calculateReviewScore(ratings: MissionReviewRatings): number {
  let weighted = 0;
  let weightTotal = 0;
  for (const dimension of REVIEW_DIMENSIONS) {
    const value = ratings[dimension.id];
    if (typeof value !== "number" || value < 1 || value > 5) continue;
    weighted += (value / 5) * dimension.weight;
    weightTotal += dimension.weight;
  }
  return weightTotal === 0 ? 0 : Math.round((weighted / weightTotal) * 100);
}

export function evaluateMissionQuality(
  mission: Mission,
  ratings: MissionReviewRatings = {}
): MissionQualitySummary {
  const checks: MissionQualityCheck[] = [
    {
      label: "Core mission fields",
      passed: Boolean(mission.title && mission.description && mission.briefing && mission.role),
      blocking: true,
      detail: "Title, role, description, and briefing are required.",
    },
    {
      label: "Checkpoint structure",
      passed: mission.checkpoints.length >= 3 && mission.checkpoints.every((checkpoint) => checkpoint.points > 0),
      blocking: true,
      detail: "Use at least three checkpoints with positive point values.",
    },
    {
      label: "Answer integrity",
      passed: mission.checkpoints.every((checkpoint) =>
        checkpoint.type === "action" ||
        (Boolean(checkpoint.correctChoice) && Boolean(checkpoint.choices?.includes(checkpoint.correctChoice ?? "")))
      ),
      blocking: true,
      detail: "Every multiple-choice checkpoint must have a valid answer in its choices.",
    },
    {
      label: "Evidence record",
      passed: Boolean(mission.evidence?.status && mission.evidence.sourceUrls.length > 0),
      blocking: true,
      detail: "Record source URLs and the current validation status before merge.",
    },
    {
      label: "Prerequisites resolve",
      passed: mission.prerequisites.every((id) => id !== mission.id),
      blocking: false,
      detail: "A mission cannot list itself as a prerequisite; referenced IDs need repository validation.",
    },
    {
      label: "Review ratings complete",
      passed: REVIEW_DIMENSIONS.every(({ id }) => typeof ratings[id] === "number"),
      blocking: true,
      detail: "Each rubric dimension needs a 1-5 reviewer rating.",
    },
  ];

  const score = calculateReviewScore(ratings);
  const hasBlockingFailure = checks.some((check) => check.blocking && !check.passed);
  const decision: MissionReviewDecision = hasBlockingFailure || score < 60
    ? "blocked"
    : score < 80
      ? "revise"
      : "ready";

  return { score, decision, checks };
}
