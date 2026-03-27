import type { DriverTier } from "../data/circuits";
import { TIER_XP_THRESHOLDS } from "../data/circuits";

export function getUnlockedTier(totalXP: number): DriverTier {
  if (totalXP >= TIER_XP_THRESHOLDS.elite) return "elite";
  if (totalXP >= TIER_XP_THRESHOLDS.advanced) return "advanced";
  if (totalXP >= TIER_XP_THRESHOLDS.intermediate) return "intermediate";
  return "rookie";
}

const TIER_ORDER: DriverTier[] = ["rookie", "intermediate", "advanced", "elite"];

export function isTierUnlocked(tier: DriverTier, unlockedTier: DriverTier): boolean {
  return TIER_ORDER.indexOf(tier) <= TIER_ORDER.indexOf(unlockedTier);
}

export function getNextTierInfo(
  unlockedTier: DriverTier
): { tier: DriverTier; xpRequired: number; label: string } | null {
  const idx = TIER_ORDER.indexOf(unlockedTier);
  if (idx >= TIER_ORDER.length - 1) return null;
  const nextTier = TIER_ORDER[idx + 1];
  const labelMap: Record<DriverTier, string> = {
    rookie: "Recruit",
    intermediate: "Analyst",
    advanced: "Specialist",
    elite: "Expert",
  };
  return {
    tier: nextTier,
    xpRequired: TIER_XP_THRESHOLDS[nextTier],
    label: labelMap[nextTier],
  };
}
