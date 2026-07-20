import React from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import type { Mission } from "../types/mission.types";
import { TOPIC_META } from "../types/UserState";
import { CompoundChip } from "../utils/compound";

function formatMinutes(seconds: number): string {
  return `~${Math.round(seconds / 60)} min`;
}

interface MissionCardProps {
  mission: Mission;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisiteNames?: string[];
  tierLocked?: string | null;
  stageLine?: string;
}

export const MissionCard = ({ mission, isUnlocked, isCompleted, prerequisiteNames = [], tierLocked, stageLine }: MissionCardProps) => {
  const navigate = useNavigate();
  const lockReason = tierLocked ?? (prerequisiteNames.length ? `Locked - complete ${prerequisiteNames[0]}` : "Locked");
  const topics = (mission.topics ?? []).map((topic) => TOPIC_META[topic]?.label ?? topic).join(" · ");

  return (
    <div style={{ padding: 16, borderRadius: 8, background: "var(--dt-colors-background-container-neutral-subdued)", border: "1px solid var(--dt-colors-border-neutral-disabled)", display: "flex", flexDirection: "column", gap: 10, minHeight: 220, opacity: !isUnlocked && !isCompleted ? 0.78 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <CompoundChip difficulty={mission.difficulty} />
        <span style={{ fontSize: 11, color: "var(--dt-colors-text-neutral-disabled)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stageLine ?? "Mission"}</span>
      </div>
      <Text style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{mission.title}</Text>
      <Text style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--dt-colors-text-neutral-subdued)", flex: 1 }}>{mission.description}</Text>
      {topics && <span style={{ fontSize: 11, color: "var(--dt-colors-text-neutral-disabled)" }}>{topics}</span>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--dt-colors-text-neutral-subdued)" }}>◷ {formatMinutes(mission.timerSeconds)}</span>
        <span style={{ fontSize: 11, color: "var(--dt-colors-text-neutral-disabled)" }}>{mission.role ?? "Observability practitioner"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        {isCompleted ? (
          <Button variant="default" onClick={() => navigate(`/missions/${mission.id}`)}>Replay</Button>
        ) : isUnlocked ? (
          <Button variant="emphasized" onClick={() => navigate(`/missions/${mission.id}`)}>Start mission</Button>
        ) : (
          <Tooltip text={lockReason}><span style={{ color: "var(--dt-colors-text-neutral-disabled)", fontSize: 12 }}>🔒 {lockReason}</span></Tooltip>
        )}
      </div>
    </div>
  );
};
