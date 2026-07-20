import React from "react";
import { MISSIONS } from "../data/missions";
import { CIRCUIT_TIER_MAP } from "../data/circuits";
import type { Circuit, DriverTier } from "../data/circuits";

const FORMULA_LABELS: Record<DriverTier, string> = { rookie: "F4 · ROOKIE CLASS", intermediate: "F3 · INTERMEDIATE", advanced: "F2 · ADVANCED", elite: "F1 · ELITE" };

export function CircuitPanel({ circuit, completedMissionIds }: { circuit: Circuit; completedMissionIds: Set<string> }) {
  const tier = CIRCUIT_TIER_MAP[circuit.id] ?? "rookie";
  const completed = circuit.missionIds.filter((id) => completedMissionIds.has(id)).length;
  const estimatedMinutes = circuit.missionIds.reduce((sum, id) => sum + Math.round((MISSIONS.find((m) => m.id === id)?.timerSeconds ?? 0) / 60), 0);
  return (
    <section style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.5fr) minmax(280px, 1fr) 220px", alignItems: "center", gap: 24, padding: "20px 24px", borderRadius: 8, background: "var(--dt-colors-background-container-neutral-subdued)", border: "1px solid var(--dt-colors-border-neutral-disabled)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ display: "inline-block", padding: "4px 8px", borderRadius: 5, background: "rgba(20, 150, 255, .14)", color: "#72bfff", fontSize: 10, fontWeight: 700, letterSpacing: ".05em" }}>{FORMULA_LABELS[tier]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <img src={`/ui/assets/flags/${circuit.countryCode}.png`} alt="" style={{ width: 28, height: 19, objectFit: "cover", borderRadius: 2 }} />
            <strong style={{ fontSize: 24, fontWeight: 600 }}>{circuit.name}</strong>
          </div>
          <p style={{ margin: "8px 0 0", color: "var(--dt-colors-text-neutral-subdued)", fontSize: 12.5, lineHeight: 1.5 }}>{circuit.description}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        <Stat label="Missions" value={String(circuit.missionIds.length)} />
        <Stat label="Est. time" value={`${estimatedMinutes} min`} />
        <Stat label="Completed" value={`${completed}/${circuit.missionIds.length}`} />
      </div>
      {circuit.f1TrackSvgUrl && <img src={circuit.f1TrackSvgUrl} alt="" style={{ width: 200, height: 110, objectFit: "contain", opacity: .28, filter: "invert(1) sepia(1) saturate(5) hue-rotate(190deg)" }} />}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div><div style={{ marginTop: 4, fontSize: 10, color: "var(--dt-colors-text-neutral-disabled)", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div></div>;
}
