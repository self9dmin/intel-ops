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
import { getMissionById, MISSIONS } from "../data/missions";
import { CIRCUITS } from "../data/circuits";
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
  timedOut?: boolean;
}

export const Debrief = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scoreSaved = useRef(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");
  const { awardXP, completeMission, updateStreak, userState } = useUserStateContext();
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

    // A timeout still earns an after-action score, but it is not a completed race.
    if (!state.timedOut) {
      completeMission(id);
      updateStreak();

      const xpGrants: XPGrant[] = [];
      for (const disc of mission.disciplines) {
        xpGrants.push({ discipline: disc.track, amount: disc.xp });
      }
      for (const topic of mission.topics ?? []) {
        xpGrants.push({ topic, amount: 25 });
      }

      awardXP(xpGrants).catch((xpError: unknown) => {
        console.error("Failed to award XP for mission", id, xpError);
      });
    }

    // Step 4: Save score document (fire once, no retry on timeout)
    const saveScore = async () => {
      try {
        const created = await documentsClient.createDocument({
          body: {
            name: `score-${Date.now()}`,
            type: "intelops-score",
            content: new Blob([scoreContent], { type: "application/json" }),
          },
        });
        setSaveStatus("saved");
        markStale();

        // Best-effort: make score public for leaderboard
        try {
          await documentsClient.updateDocument({
            id: created.id,
            optimisticLockingVersion: created.version,
            body: {
              name: created.name,
              type: created.type,
              isPrivate: false,
              content: new Blob([scoreContent], { type: "application/json" }),
            },
          });
        } catch (visibilityError: unknown) {
          console.warn("Could not make score public:", visibilityError);
        }
      } catch (saveError: unknown) {
        console.error("Failed to save score:", saveError);
        setSaveStatus("failed");
      }
    };
    void saveScore().catch(() => { /* single attempt, no retry */ });
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
      {/* Time Expired banner */}
      {state.timedOut && (
        <Flex justifyContent="center" padding={12} style={{
          background: "var(--dt-colors-background-critical-default, rgba(231, 76, 60, 0.15))",
          borderRadius: "8px",
        }}>
          <Heading level={2}>
            <span style={{ color: "var(--dt-colors-text-critical-default, #e74c3c)" }}>
              Time Expired
            </span>
          </Heading>
        </Flex>
      )}

      {/* Top — header */}
      <Flex flexDirection="column" alignItems="center" gap={8}>
        {!state.timedOut && <SuccessIcon size="large" />}
        <Heading level={1}>{state.timedOut ? "Mission Incomplete" : "Mission Complete"}</Heading>
        <Text textStyle="small" style={{ opacity: 0.6 }}>
          <span style={{ fontFamily: "monospace" }}>{codename}</span> — {state.timedOut ? "Time Expired" : "Success"}
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

      {/* What's Next */}
      {(() => {
        const completedMissions = [
          ...(userState?.completedMissions ?? []),
          ...(id && !(userState?.completedMissions ?? []).includes(id) ? [id] : []),
        ];
        const completedSet = new Set(completedMissions);

        // Circuit (Learning Path) Progress
        const matchingPaths = CIRCUITS.filter((p) =>
          p.missionIds.includes(id ?? "")
        );

        // Next Recommended Mission
        const nextMission = MISSIONS.find(
          (m) =>
            m.id !== id &&
            !completedSet.has(m.id) &&
            m.prerequisites.every((pre) => completedSet.has(pre))
        );

        if (matchingPaths.length === 0 && !nextMission) return null;

        return (
          <Surface>
            <Flex flexDirection="column" padding={20} gap={12}>
              <Heading level={3}>What&apos;s Next</Heading>

              {matchingPaths.map((path) => (
                <div key={path.id}>
                  <Text
                    textStyle="small"
                    style={{
                      opacity: 0.6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {path.name}
                  </Text>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {path.missionIds.map((mId) => {
                      const m = getMissionById(mId);
                      if (!m) return null;
                      const isCompleted = completedSet.has(mId);
                      const isUnlocked = m.prerequisites.every((pre) =>
                        completedSet.has(pre)
                      );
                      const icon = isCompleted
                        ? "\u2714"
                        : isUnlocked
                          ? "\u23F3"
                          : "\uD83D\uDD12";
                      return (
                        <div key={mId} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span>{icon}</span>
                          <Text>{m.title}</Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {nextMission && (
                <>
                  {matchingPaths.length > 0 && <Divider />}
                  <Surface>
                    <Flex flexDirection="column" padding={16} gap={8}>
                      <Text
                        textStyle="small"
                        style={{
                          opacity: 0.6,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        NEXT MISSION
                      </Text>
                      <Heading level={4}>{nextMission.title}</Heading>
                      <Text
                        textStyle="small"
                        style={{ fontFamily: "monospace", opacity: 0.6 }}
                      >
                        {nextMission.codename}
                      </Text>
                      <Button
                        variant="emphasized"
                        onClick={() => navigate(`/missions/${nextMission.id}`)}
                      >
                        Start Mission
                      </Button>
                    </Flex>
                  </Surface>
                </>
              )}
            </Flex>
          </Surface>
        );
      })()}

      {/* Actions */}
      <Flex gap={16} justifyContent="center">
        <Button variant="emphasized" onClick={() => navigate("/missions")}>
          Back to Missions
        </Button>
        <Button variant="default" onClick={() => navigate("/progress?tab=leaderboard")}>
          View Leaderboard
        </Button>
        <Button variant="default" onClick={() => navigate(`/review?mission=${id}`)}>
          Review Mission
        </Button>
      </Flex>
    </Flex>
  );
};
