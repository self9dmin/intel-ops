import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import {
  Heading,
  Paragraph,
  Strong,
  Text,
} from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { SuccessIcon } from "@dynatrace/strato-icons";
import type { Checkpoint } from "../types/mission.types";
import { getMissionById } from "../data/missions";

interface DebriefState {
  baseScore: number;
  timeBonus: number;
  hintsUsed: number;
  totalScore: number;
  timerSecondsRemaining: number;
  checkpoints: Checkpoint[];
  missionTitle: string;
  codename: string;
  role: string;
  difficulty: string;
}

export const Debrief = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scoreSaved = useRef(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");

  const state = location.state as DebriefState | undefined;
  const mission = id ? getMissionById(id) : undefined;

  // Save score to Document Service on mount
  useEffect(() => {
    if (!state || !id) return;
    if (scoreSaved.current) return;
    scoreSaved.current = true;

    setSaveStatus("saving");
    const user = getCurrentUserDetails();
    const scoreContent = JSON.stringify({
      userName:
        (user.name && !user.name.includes("dt.missing") && user.name) ||
        (user.email && !user.email.includes("dt.missing") && user.email) ||
        user.id,
      userId: user.id,
      missionId: id,
      missionTitle: state.missionTitle,
      mission: id,
      role: state.role,
      difficulty: state.difficulty,
      baseScore: state.baseScore,
      timeBonus: state.timeBonus,
      hintsUsed: state.hintsUsed,
      totalScore: state.totalScore,
      completedAt: new Date().toISOString(),
    });

    documentsClient
      .createDocument({
        body: {
          name: `score-${Date.now()}`,
          type: "intelops-score",
          content: new Blob([scoreContent], { type: "application/json" }),
        },
      })
      .then(() => setSaveStatus("saved"))
      .catch((error: unknown) => {
        console.error("Failed to save score:", error);
        setSaveStatus("failed");
      });
  }, [state, id]);

  if (!state || !id) {
    return (
      <Flex flexDirection="column" gap={32} padding={32} alignItems="center">
        <Surface>
          <Flex flexDirection="column" padding={48} gap={16} alignItems="center">
            <Heading level={2}>NO DEBRIEF DATA</Heading>
            <Paragraph>
              Mission debrief data is unavailable. Complete a mission to view
              your after-action report.
            </Paragraph>
            <Button variant="emphasized" onClick={() => navigate("/")}>
              RETURN TO MISSION BOARD
            </Button>
          </Flex>
        </Surface>
      </Flex>
    );
  }

  const hintPenalty = state.hintsUsed * 50;
  const codename = state.codename || mission?.codename || "UNKNOWN";

  return (
    <Flex flexDirection="column" gap={32} padding={32}>
      <Text textStyle="base-emphasized">
        // MISSION DEBRIEF — {codename}
      </Text>

      <Flex flexDirection="column" alignItems="center" gap={16}>
        <SuccessIcon size="large" />
        <Heading level={1}>MISSION COMPLETE</Heading>
        <Chip color="success" variant="emphasized">
          OPERATION {codename} — SUCCESS
        </Chip>
      </Flex>

      {/* Score Breakdown */}
      <Surface>
        <Flex flexDirection="column" padding={32} gap={16}>
          <Text textStyle="base-emphasized">// SCORE BREAKDOWN</Text>
          <Flex flexDirection="column" gap={8}>
            <Flex justifyContent="space-between">
              <Text>Base Score</Text>
              <Strong>{state.baseScore} pts</Strong>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Time Bonus</Text>
              <Strong>+{state.timeBonus} pts</Strong>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Hints Used ({state.hintsUsed})</Text>
              <Strong>
                {hintPenalty > 0 ? `-${hintPenalty}` : "0"} pts
              </Strong>
            </Flex>
            <Flex justifyContent="space-between">
              <Heading level={3}>Total Score</Heading>
              <Heading level={3}>{state.totalScore} pts</Heading>
            </Flex>
          </Flex>
          {saveStatus === "saving" && (
            <Chip color="neutral">Saving score...</Chip>
          )}
          {saveStatus === "saved" && (
            <Chip color="success" variant="emphasized">
              Score saved
            </Chip>
          )}
          {saveStatus === "failed" && (
            <Chip color="critical" variant="emphasized">
              Score save failed — check console
            </Chip>
          )}
        </Flex>
      </Surface>

      {/* Checkpoint Summary */}
      <Surface>
        <Flex flexDirection="column" padding={32} gap={16}>
          <Text textStyle="base-emphasized">// CHECKPOINT SUMMARY</Text>
          <Flex flexDirection="column" gap={8}>
            {state.checkpoints.map((cp) => (
              <Flex key={cp.id} justifyContent="space-between" alignItems="center">
                <Flex gap={8} alignItems="center">
                  <SuccessIcon />
                  <Text>{cp.title}</Text>
                </Flex>
                <Text>{cp.points} pts</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Surface>

      {/* Actions */}
      <Flex gap={16} justifyContent="center">
        <Button variant="emphasized" onClick={() => navigate("/")}>
          RETURN TO MISSION BOARD
        </Button>
        <Button variant="default" onClick={() => navigate("/leaderboard")}>
          VIEW LEADERBOARD
        </Button>
      </Flex>
    </Flex>
  );
};
