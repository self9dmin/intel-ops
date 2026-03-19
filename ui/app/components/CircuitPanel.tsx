import React, { useMemo } from "react";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { MISSIONS } from "../data/missions";
import type { Circuit } from "../data/circuits";

interface CircuitPanelProps {
  circuit: Circuit;
  completedMissionIds: Set<string>;
}

function getCircuitTier(circuitId: string): string {
  const preSeason = new Set(["terrain-recon", "ground-zero", "operator-readiness"]);
  const raceDay = new Set(["signal-hunt", "root-cause-run"]);
  if (preSeason.has(circuitId)) return "Pre-Season Testing";
  if (raceDay.has(circuitId)) return "Race Day";
  return "Qualifying";
}

function getTierColors(tier: string): { bg: string; text: string } {
  if (tier === "Pre-Season Testing") return { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)" };
  if (tier === "Race Day") return { bg: "rgba(232,0,30,0.15)", text: "#e8001e" };
  return { bg: "rgba(20,150,255,0.15)", text: "#1496ff" };
}

export function CircuitPanel({ circuit, completedMissionIds }: CircuitPanelProps) {
  const tier = getCircuitTier(circuit.id);
  const tierColors = getTierColors(tier);

  const totalXP = useMemo(() => {
    return circuit.missionIds.reduce((sum, mId) => {
      const m = MISSIONS.find((mission) => mission.id === mId);
      if (!m) return sum;
      return sum + m.checkpoints.reduce((s, cp) => s + cp.points, 0);
    }, 0);
  }, [circuit]);

  const completedCount = circuit.missionIds.filter((id) =>
    completedMissionIds.has(id)
  ).length;

  return (
    <div
      style={{
        borderLeft: "2px solid var(--dt-colors-border-neutral-default)",
        paddingLeft: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {circuit.f1TrackSvgUrl && (
        <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={circuit.f1TrackSvgUrl}
            alt={circuit.name}
            style={{
              maxHeight: "160px",
              maxWidth: "100%",
              objectFit: "contain",
              opacity: 0.35,
              filter: "invert(1) sepia(1) saturate(5) hue-rotate(190deg)",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "2px 8px",
            borderRadius: "4px",
            background: tierColors.bg,
            color: tierColors.text,
          }}
        >
          {tier}
        </span>
      </div>

      <Heading level={3}>{circuit.name}</Heading>

      <Text textStyle="small" style={{ opacity: 0.7 }}>
        {circuit.description}
      </Text>

      <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "20px", fontWeight: 600 }}>{circuit.missionIds.length}</span>
          <span style={{ fontSize: "11px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Missions</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "20px", fontWeight: 600 }}>{totalXP}</span>
          <span style={{ fontSize: "11px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>XP Available</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "20px", fontWeight: 600 }}>{completedCount}/{circuit.missionIds.length}</span>
          <span style={{ fontSize: "11px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Completed</span>
        </div>
      </div>
    </div>
  );
}
