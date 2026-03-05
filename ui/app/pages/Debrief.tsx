import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Divider } from "@dynatrace/strato-components/layouts";
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
import type { Checkpoint, XPGrant } from "../types/mission.types";
import { getMissionById } from "../data/missions";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext } from "../context/LeaderboardContext";

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
  const { awardXP, completeMission, updateStreak } = useUserStateContext();
  const { markStale } = useLeaderboardContext();

  const state = location.state as DebriefState | undefined;
  const mission = id ? getMissionById(id) : undefined;

  // Save score to Document Service on mount
  useEffect(() => {
    if (!state || !id || !mission) return;
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

    // Step 1: Update user state (completeMission + streak + XP)
    completeMission(id);
    updateStreak();

    // Step 2: Build XP grants from mission data
    const xpGrants: XPGrant[] = [];
    for (const disc of mission.disciplines) {
      xpGrants.push({ discipline: disc.track, amount: disc.xp });
    }
    for (const topic of mission.topics ?? []) {
      xpGrants.push({ topic, amount: 25 });
    }

    // Step 3: Award XP (writes user state)
    awardXP(xpGrants).catch((xpError: unknown) => {
      console.error("Failed to award XP for mission", id, xpError);
    });

    // Step 4: Save score document
    documentsClient
      .createDocument({
        body: {
          name: `score-${Date.now()}`,
          type: "intelops-score",
          content: new Blob([scoreContent], { type: "application/json" }),
        },
      })
      .then(() => {
        setSaveStatus("saved");
        markStale();
      })
      .catch((saveError: unknown) => {
        console.error("Failed to save score:", saveError);
        setSaveStatus("failed");
      });
  }, [state, id, mission, awardXP, completeMission, updateStreak, markStale]);

  if (!state || !id) {
    return (
      <Flex flexDirection="column" gap={32} padding={32} alignItems="center">
        <Surface>
          <Flex flexDirection="column" padding={48} gap={16} alignItems="center">
            <Heading level={2}>No Debrief Data</Heading>
            <Paragraph>
              Mission debrief data is unavailable. Complete a mission to view
              your after-action report.
            </Paragraph>
            <Button variant="emphasized" onClick={() => navigate("/missions")}>
              Back to Missions
            </Button>
          </Flex>
        </Surface>
      </Flex>
    );
  }

  const hintPenalty = state.hintsUsed * 50;
  const codename = state.codename || mission?.codename || "UNKNOWN";

  return (
    <Flex flexDirection="column" gap={24} padding={24} style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Top — success header */}
      <Flex flexDirection="column" alignItems="center" gap={8}>
        <SuccessIcon size="large" />
        <Heading level={1}>Mission Complete</Heading>
        <Text textStyle="small" style={{ opacity: 0.6 }}>
          <span style={{ fontFamily: "monospace" }}>{codename}</span> — Success
        </Text>
      </Flex>

      <Divider />

      {/* Score Breakdown */}
      <Surface>
        <Flex flexDirection="column" padding={20} gap={12}>
          <Heading level={4}>Score Breakdown</Heading>
          <Flex flexDirection="column" gap={6}>
            <Flex justifyContent="space-between">
              <Text>Base Score</Text>
              <Text>
                <span style={{ fontFamily: "monospace" }}>{state.baseScore} pts</span>
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Time Bonus</Text>
              <Text>
                <span style={{ fontFamily: "monospace" }}>+{Math.round(state.timeBonus)} pts</span>
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Hints Penalty ({state.hintsUsed})</Text>
              <Text>
                <span style={{ fontFamily: "monospace" }}>
                  {hintPenalty > 0 ? `-${hintPenalty}` : "0"} pts
                </span>
              </Text>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" alignItems="center">
              <Strong>Total Score</Strong>
              <Heading level={2}>
                <span style={{ fontFamily: "monospace" }}>
                  {Math.round(state.totalScore)}
                </span>
              </Heading>
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
        <Flex flexDirection="column" padding={20} gap={8}>
          <Heading level={4}>Checkpoint Summary</Heading>
          <Flex flexDirection="column" gap={6}>
            {state.checkpoints.map((cp) => (
              <Flex key={cp.id} justifyContent="space-between" alignItems="center">
                <Flex gap={8} alignItems="center">
                  <SuccessIcon />
                  <Text>{cp.title}</Text>
                </Flex>
                <Text textStyle="small">
                  <span style={{ fontFamily: "monospace" }}>{cp.points} pts</span>
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Surface>

      {/* Actions */}
      <Flex gap={16} justifyContent="center">
        <Button variant="emphasized" onClick={() => navigate("/missions")}>
          Back to Missions
        </Button>
        <Button variant="default" onClick={() => navigate("/progress?tab=leaderboard")}>
          View Leaderboard
        </Button>
      </Flex>
    </Flex>
  );
};
