import React from "react";
import type { Mission } from "../types/mission.types";

export type Compound = Mission["difficulty"];

export const COMPOUND_META: Record<Compound, { label: "SOFT" | "MEDIUM" | "HARD"; detail: string; color: string; background: string }> = {
  rookie: { label: "SOFT", detail: "Soft compound - quick entry-level run", color: "#ff8a85", background: "rgba(225, 6, 0, 0.16)" },
  operator: { label: "MEDIUM", detail: "Medium compound - working-operator demand", color: "#ffd75e", background: "rgba(255, 209, 46, 0.13)" },
  elite: { label: "HARD", detail: "Hard compound - the most demanding runs", color: "#ececf4", background: "rgba(255, 255, 255, 0.13)" },
  legend: { label: "HARD", detail: "Hard compound - the most demanding runs", color: "#ececf4", background: "rgba(255, 255, 255, 0.13)" },
};

export function CompoundChip({ difficulty, compact = false }: { difficulty: Compound; compact?: boolean }) {
  const meta = COMPOUND_META[difficulty];
  return <span title={meta.detail} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: compact ? "2px 7px" : "3px 8px", borderRadius: 10, background: meta.background, color: meta.color, fontSize: 10, lineHeight: 1, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
    <span style={{ width: 7, height: 7, borderRadius: "50%", border: `1.5px solid ${meta.color}`, display: "inline-block" }} />
    {meta.label}
  </span>;
}
