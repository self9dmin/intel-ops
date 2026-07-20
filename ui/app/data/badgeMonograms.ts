const BADGE_MONOGRAMS: Record<string, string> = {
  "lights-out": "LO",
  "in-the-window": "IW",
  "boost-mode": "BM",
  "in-the-points": "IP",
  "graduated-q2": "GQ",
  "race-winner": "RW",
  "understeer-proof": "UP",
  "grand-slam": "GS",
  "overtake-mode": "OM",
};

export function getBadgeMonogram(icon: string): string {
  return BADGE_MONOGRAMS[icon] ?? "MC";
}
