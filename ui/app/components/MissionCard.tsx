import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
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
  recommendReason?: string;
}

export const MissionCard = ({
  mission,
  isUnlocked,
  isCompleted,
  prerequisiteNames,
  recommendReason,
}: MissionCardProps) => {
  const navigate = useNavigate();
  const isLocked = !isUnlocked;

  return (
    <Surface>
      <Flex
        flexDirection="column"
        padding={12}
        gap={8}
        style={{ opacity: isLocked ? 0.5 : 1 }}
      >
        {recommendReason && (
          <Text textStyle="small" style={{ opacity: 0.7, fontStyle: "italic" }}>
            {recommendReason}
          </Text>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <Text textStyle="small">
            <span style={{ fontFamily: "monospace", opacity: 0.7 }}>
              {mission.codename}
            </span>
          </Text>
          <Chip
            color={getDifficultyColor(mission.difficulty)}
            variant="emphasized"
          >
            {mission.difficulty.toUpperCase()}
          </Chip>
        </Flex>
        <Heading level={5}>{mission.title}</Heading>
        <Flex gap={4} style={{ flexWrap: "wrap" }}>
          <Chip color="neutral">{mission.role}</Chip>
        </Flex>
        <Text textStyle="small" style={{ opacity: 0.7 }}>
          {mission.description}
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          {isLocked ? (
            <div
              title={
                prerequisiteNames && prerequisiteNames.length > 0
                  ? `Requires: ${prerequisiteNames.join(", ")}`
                  : "Locked"
              }
            >
              <Button variant="default" disabled>
                Locked
              </Button>
            </div>
          ) : isCompleted ? (
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
            {isLocked
              ? prerequisiteNames && prerequisiteNames.length > 0
                ? `Requires: ${prerequisiteNames.join(", ")}`
                : "Locked"
              : formatMinutes(mission.timerSeconds)}
          </Text>
        </Flex>
      </Flex>
    </Surface>
  );
};
