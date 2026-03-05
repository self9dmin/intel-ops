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
import type { Checkpoint } from "../types/mission.types";
import type { Discipline } from "../types/UserState";
import { TOPIC_META } from "../types/UserState";
import { getMissionById } from "../data/missions";
import { useUserStateContext } from "../context/UserStateContext";
import {
  AnalyticsIcon,
  TracesIcon,
  DavisAIIcon,
  BarChartIcon,
  LogsIcon,
  SmartscapeIcon,
  ContainerIcon,
  HttpIcon,
  ServiceLevelObjectivesIcon,
  WorkflowsIcon,
  ApplicationSecurityIcon,
  EventIcon,
} from "@dynatrace/strato-icons";

const TOPIC_ICON_MAP: Record<string, typeof AnalyticsIcon> = {
  AnalyticsIcon,
  TracesIcon,
  DavisAIIcon,
  BarChartIcon,
  LogsIcon,
  SmartscapeIcon,
  ContainerIcon,
  HttpIcon,
  ServiceLevelObjectivesIcon,
  WorkflowsIcon,
  ApplicationSecurityIcon,
  EventIcon,
};

const DISCIPLINE_META: Record<Discipline, { label: string; icon: string; color: string }> = {
  sre: { label: "SRE", icon: "\u{1F6E1}\uFE0F", color: "#4b9cf5" },
  developer: { label: "Developer", icon: "\u{1F4BB}", color: "#7c5cbf" },
  "incident-commander": { label: "Incident Commander", icon: "\u{1F6A8}", color: "#e8734a" },
  "platform-engineer": { label: "Platform Engineer", icon: "\u2699\uFE0F", color: "#3dba7e" },
};

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
  const { awardXP } = useUserStateContext();

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
      .then(() => {
        setSaveStatus("saved");
        awardXP(id).catch((xpError: unknown) => {
          console.error("Failed to award XP for mission", id, xpError);
        });
      })
      .catch((error: unknown) => {
        console.error("Failed to save score:", error);
        setSaveStatus("failed");
      });
  }, [state, id, awardXP]);

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
            <Button variant="emphasized" onClick={() => navigate("/")}>
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

      {/* XP Earned */}
      {mission?.disciplines && mission.disciplines.length > 0 && (
        <Surface>
          <Flex flexDirection="column" padding={20} gap={8}>
            <Heading level={4}>XP Earned</Heading>
            <Text textStyle="small" style={{ opacity: 0.5 }}>Disciplines</Text>
            <Flex flexDirection="column" gap={6}>
              {mission.disciplines.map((d) => {
                const meta = DISCIPLINE_META[d.track];
                return (
                  <Flex key={d.track} justifyContent="space-between" alignItems="center">
                    <Flex gap={8} alignItems="center">
                      <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                      <Text style={{ color: meta.color, fontWeight: 500 }}>{meta.label}</Text>
                    </Flex>
                    <Text textStyle="small">
                      <span style={{ fontFamily: "monospace", color: meta.color }}>+{d.xp} XP</span>
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
            {mission.topics && mission.topics.length > 0 && (
              <>
                <Divider />
                <Text textStyle="small" style={{ opacity: 0.5 }}>Topics</Text>
                <Flex flexDirection="column" gap={6}>
                  {mission.topics.map((topicId) => {
                    const topicMeta = TOPIC_META[topicId];
                    const IconComponent = TOPIC_ICON_MAP[topicMeta.icon];
                    return (
                      <Flex key={topicId} justifyContent="space-between" alignItems="center">
                        <Flex gap={8} alignItems="center">
                          {IconComponent && <IconComponent size="small" />}
                          <Text style={{ fontWeight: 500 }}>{topicMeta.label}</Text>
                        </Flex>
                        <Text textStyle="small">
                          <span style={{ fontFamily: "monospace" }}>+50 XP</span>
                        </Text>
                      </Flex>
                    );
                  })}
                </Flex>
              </>
            )}
          </Flex>
        </Surface>
      )}

      {/* Actions */}
      <Flex gap={16} justifyContent="center">
        <Button variant="emphasized" onClick={() => navigate("/")}>
          Back to Missions
        </Button>
        <Button variant="default" onClick={() => navigate("/leaderboard")}>
          View Leaderboard
        </Button>
      </Flex>
    </Flex>
  );
};
