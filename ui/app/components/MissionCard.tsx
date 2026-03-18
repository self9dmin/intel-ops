import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import type { Mission } from "../types/mission.types";

function getDifficultyColor(
  difficulty: Mission["difficulty"]
): "success" | "warning" | "critical" {
  switch (difficulty) {
    case "rookie":
      return "success";
    case "operator":
      return "warning";
    case "elite":
    case "legend":
      return "critical";
  }
}

function formatMinutes(seconds: number): string {
  return `~${Math.round(seconds / 60)} min`;
}

interface MissionCardProps {
  mission: Mission;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisiteNames?: string[];
}

export const MissionCard = ({
  mission,
  isUnlocked,
  isCompleted,
  prerequisiteNames,
}: MissionCardProps) => {
  const navigate = useNavigate();
  const hasUnmetPrereqs = !isUnlocked && prerequisiteNames && prerequisiteNames.length > 0;

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        background: "var(--dt-colors-background-container-neutral-subdued)",
        border: "1px solid var(--dt-colors-border-neutral-disabled)",
        opacity: hasUnmetPrereqs ? 0.85 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: "8px" }}>
        <Text style={{ fontWeight: 600 }}>{mission.title}</Text>
        <Chip
          color={getDifficultyColor(mission.difficulty)}
          variant="emphasized"
        >
          {mission.difficulty.toUpperCase()}
        </Chip>
      </Flex>
      <Text textStyle="small" style={{ opacity: 0.7, flex: "1 1 auto", marginBottom: "12px" }}>
        {mission.description}
      </Text>
      <Flex justifyContent="space-between" alignItems="center">
        {isCompleted ? (
          <Flex gap={8} alignItems="center">
            <Chip color="success" variant="emphasized">
              Completed
            </Chip>
            <Button
              variant="default"
              onClick={() => navigate(`/missions/${mission.id}`)}
            >
              Replay
            </Button>
          </Flex>
        ) : (
          <Button
            variant="emphasized"
            onClick={() => navigate(`/missions/${mission.id}`)}
          >
            Start Mission
          </Button>
        )}
        <Text textStyle="small" style={{ opacity: 0.6 }}>
          {formatMinutes(mission.timerSeconds)}
        </Text>
      </Flex>
    </div>
  );
};
