import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  RadioGroup,
  Radio,
} from "@dynatrace/strato-components-preview/forms";
import { SuccessIcon } from "@dynatrace/strato-icons";
import { getMissionById } from "../data/missions";
import { MatrixBackground } from "../components/MatrixBackground";

type CheckpointStatus = "locked" | "active" | "completed";

const TIME_BONUS_PER_SECOND = 0.5;
const HINT_PENALTY = 50;
const WRONG_ANSWER_PENALTY = 100;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export const Mission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mission = id ? getMissionById(id) : undefined;

  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>(
    []
  );
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [baseScore, setBaseScore] = useState(0);
  const [wrongAnswerGiven, setWrongAnswerGiven] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<string[]>([]);
  const [abandonConfirm, setAbandonConfirm] = useState(false);
  const hasTimedOutRef = useRef(false);

  // Initialize timer when mission loads
  useEffect(() => {
    if (mission) {
      setTimerSeconds(mission.timerSeconds);
      hasTimedOutRef.current = false;
    }
  }, [mission]);

  // Timer countdown
  useEffect(() => {
    if (!mission) return;
    if (timerSeconds === null || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mission, timerSeconds]);

  const getCheckpointStatus = useCallback(
    (index: number): CheckpointStatus => {
      if (completedCheckpoints.includes(index)) return "completed";
      if (index === currentCheckpoint) return "active";
      return "locked";
    },
    [completedCheckpoints, currentCheckpoint]
  );

  const completeCheckpoint = useCallback(
    (index: number, points: number) => {
      if (!mission) return;

      setCompletedCheckpoints((prev) => [...prev, index]);
      setBaseScore((prev) => prev + points);

      const isLastCheckpoint = index === mission.checkpoints.length - 1;
      if (isLastCheckpoint) {
        const newBaseScore = baseScore + points;
        const timeBonus = Math.max(0, (timerSeconds ?? 0) * TIME_BONUS_PER_SECOND);
        const hintPenalty = hintsUsed.length * HINT_PENALTY;
        const totalScore = Math.max(0, newBaseScore + timeBonus - hintPenalty);

        navigate(`/debrief/${mission.id}`, {
          state: {
            baseScore: newBaseScore,
            timeBonus,
            hintsUsed: hintsUsed.length,
            totalScore,
            timerSecondsRemaining: timerSeconds ?? 0,
            checkpoints: mission.checkpoints,
            missionTitle: mission.title,
            codename: mission.codename,
            role: mission.role,
            difficulty: mission.difficulty,
          },
        });
      } else {
        setCurrentCheckpoint(index + 1);
        setSelectedAnswer("");
        setAnswerError("");
        setWrongAnswerGiven(false);
      }
    },
    [mission, baseScore, timerSeconds, hintsUsed, navigate]
  );

  const handleValidate = useCallback(
    (index: number) => {
      if (isValidating || !mission) return;

      const checkpoint = mission.checkpoints[index];

      if (checkpoint.type === "multiple-choice") {
        if (!selectedAnswer) return;
        setIsValidating(true);
        setAnswerError("");

        setTimeout(() => {
          setIsValidating(false);
          if (selectedAnswer === checkpoint.correctChoice) {
            const points = wrongAnswerGiven
              ? checkpoint.points - WRONG_ANSWER_PENALTY
              : checkpoint.points;
            completeCheckpoint(index, Math.max(0, points));
          } else {
            setWrongAnswerGiven(true);
            setAnswerError("Incorrect — review the evidence and try again");
          }
        }, 1000);
        return;
      }

      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        completeCheckpoint(index, checkpoint.points);
      }, 1000);
    },
    [isValidating, mission, selectedAnswer, wrongAnswerGiven, completeCheckpoint]
  );

  const handleRequestHint = useCallback(
    (checkpointId: string) => {
      if (!hintsUsed.includes(checkpointId)) {
        setHintsUsed((prev) => [...prev, checkpointId]);
      }
      if (!hintsRevealed.includes(checkpointId)) {
        setHintsRevealed((prev) => [...prev, checkpointId]);
      }
    },
    [hintsUsed, hintsRevealed]
  );

  const colorTier = useMemo(() => {
    if (!mission || timerSeconds === null) return "green" as const;
    const pct = timerSeconds / mission.timerSeconds;
    if (pct < 0.2) return "red" as const;
    if (pct < 0.5) return "amber" as const;
    return "green" as const;
  }, [timerSeconds, mission]);

  // Timer expiry — navigate to debrief as a failed mission
  useEffect(() => {
    if (!mission || timerSeconds !== 0) return;
    if (hasTimedOutRef.current) return;
    hasTimedOutRef.current = true;
    const hintPenalty = hintsUsed.length * HINT_PENALTY;
    const totalScore = Math.max(0, baseScore - hintPenalty);
    navigate(`/debrief/${mission.id}`, {
      state: {
        baseScore,
        timeBonus: 0,
        hintsUsed: hintsUsed.length,
        totalScore,
        timerSecondsRemaining: 0,
        checkpoints: mission.checkpoints,
        missionTitle: mission.title,
        codename: mission.codename,
        role: mission.role,
        difficulty: mission.difficulty,
        timedOut: true,
      },
    });
  }, [mission, timerSeconds, baseScore, hintsUsed, navigate]);

  // Mission not found
  if (!mission) {
    return (
      <Flex flexDirection="column" gap={32} padding={32} alignItems="center">
        <Surface>
          <Flex flexDirection="column" padding={48} gap={16} alignItems="center">
            <Heading level={2}>Mission Not Found</Heading>
            <Paragraph>
              The requested mission does not exist or has been decommissioned.
            </Paragraph>
            <Button variant="emphasized" onClick={() => navigate("/missions")}>
              Back to Missions
            </Button>
          </Flex>
        </Surface>
      </Flex>
    );
  }

  const displaySeconds = timerSeconds ?? mission.timerSeconds;
  const timerIsLow = displaySeconds < 60;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <MatrixBackground colorTier={colorTier} />
    <Flex gap={24} padding={24} style={{ alignItems: "flex-start", position: "relative", zIndex: 1 }}>
      {/* Left column — Briefing panel */}
      <Flex
        flexDirection="column"
        gap={8}
        style={{ flex: "0 0 40%", minWidth: 300 }}
      >
        <Heading level={3}>Mission</Heading>
        <Surface>
          <Flex flexDirection="column" padding={20} gap={12}>
            {/* Title + codename */}
            <Text textStyle="small">
              <span style={{ fontFamily: "monospace", opacity: 0.6 }}>
                {mission.codename}
              </span>
            </Text>
            <Heading level={2}>{mission.title}</Heading>

            {/* Role + difficulty badges */}
            <Flex gap={8}>
              <Chip color="neutral">{mission.role}</Chip>
              <Chip
                color={
                  mission.difficulty === "rookie"
                    ? "success"
                    : mission.difficulty === "operator"
                      ? "warning"
                      : "critical"
                }
                variant="emphasized"
              >
                {mission.difficulty.toUpperCase()}
              </Chip>
            </Flex>

            {/* Briefing */}
            <Paragraph>{mission.briefing}</Paragraph>

            {/* Timer */}
            <Surface>
              <Flex flexDirection="column" alignItems="center" padding={16} gap={4}>
                <Text textStyle="small">Time Remaining</Text>
                <Heading level={1}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: timerIsLow ? "var(--dt-colors-text-critical-default, #e74c3c)" : undefined,
                    }}
                  >
                    {formatTime(displaySeconds)}
                  </span>
                </Heading>
              </Flex>
            </Surface>

            {/* Hint cost notice */}
            <Text textStyle="small" style={{ opacity: 0.6 }}>
              Intel requested: -{HINT_PENALTY} pts per hint used
            </Text>

          </Flex>
        </Surface>

        {/* Abandon Mission */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          {!abandonConfirm ? (
            <button
              onClick={() => setAbandonConfirm(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--dt-colors-text-neutral-default)",
                fontSize: "20px",
                fontWeight: "600",
                cursor: "pointer",
                letterSpacing: "0.3px",
                padding: "0",
              }}
            >
              Abandon Mission
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                color: "var(--dt-colors-text-neutral-default)",
                fontSize: "13px",
                marginTop: "32px",
              }}
            >
              <span>This will end your mission.</span>
              <div style={{ display: "flex", gap: "24px" }}>
                <button
                  onClick={() => navigate("/missions")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--dt-colors-text-critical-default)",
                    fontSize: "20px",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    padding: "0",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setAbandonConfirm(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--dt-colors-text-neutral-default)",
                    fontSize: "20px",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    padding: "0",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Flex>

      {/* Right column — Checkpoints */}
      <Flex
        flexDirection="column"
        gap={8}
        style={{ flex: "1 1 60%" }}
      >
        <Heading level={3}>Checkpoints</Heading>

        {mission.checkpoints.map((checkpoint, index) => {
          const status = getCheckpointStatus(index);
          const isMultipleChoice = checkpoint.type === "multiple-choice";
          const hintAvailable = checkpoint.hint.length > 0;
          const hintRevealed = hintsRevealed.includes(checkpoint.id);
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const isLocked = status === "locked";

          return (
            <Surface key={checkpoint.id}>
              <Flex
                padding={16}
                gap={12}
                alignItems="flex-start"
                style={{
                  opacity: isLocked ? 0.4 : 1,
                  borderLeft: isActive
                    ? "3px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                    : "3px solid transparent",
                }}
              >
                {/* Step number / status indicator */}
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  style={{ minWidth: 32 }}
                >
                  {isCompleted ? (
                    <SuccessIcon />
                  ) : (
                    <Text textStyle="base-emphasized">
                      <span style={{ fontFamily: "monospace" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Text>
                  )}
                </Flex>

                {/* Content */}
                <Flex flexDirection="column" gap={8} flexGrow={1}>
                  <Flex gap={8} alignItems="center">
                    <Strong>{checkpoint.title}</Strong>
                    {isCompleted && (
                      <Flex gap={8} alignItems="center">
                        <Chip color="success" variant="emphasized">
                          Complete
                        </Chip>
                        <Text textStyle="small">
                          <span style={{ fontFamily: "monospace" }}>
                            {checkpoint.points} pts
                          </span>
                        </Text>
                      </Flex>
                    )}
                    {isActive && (
                      <Chip color="primary" variant="emphasized">
                        Active
                      </Chip>
                    )}
                    {isLocked && (
                      <Chip color="neutral">Locked</Chip>
                    )}
                  </Flex>

                  {!isLocked && (
                    <Paragraph>{checkpoint.instruction}</Paragraph>
                  )}

                  {/* Hint system */}
                  {isActive && hintAvailable && !hintRevealed && (
                    <Flex>
                      <Button
                        variant="default"
                        onClick={() => handleRequestHint(checkpoint.id)}
                      >
                        Request Intel
                      </Button>
                    </Flex>
                  )}

                  {hintRevealed && (
                    <Surface>
                      <Flex flexDirection="column" padding={12} gap={4}>
                        <Chip color="warning" variant="emphasized">
                          Intel
                        </Chip>
                        <Text>{checkpoint.hint}</Text>
                        <Text textStyle="small" style={{ opacity: 0.6 }}>
                          Intel requested: -{HINT_PENALTY} pts
                        </Text>
                      </Flex>
                    </Surface>
                  )}

                  {/* Multiple choice options */}
                  {isActive && isMultipleChoice && checkpoint.choices && (
                    <Flex flexDirection="column" gap={8}>
                      <RadioGroup
                        value={selectedAnswer}
                        onChange={(value: string) => setSelectedAnswer(value)}
                      >
                        {checkpoint.choices.map((option) => (
                          <Radio key={option} value={option}>
                            {option}
                          </Radio>
                        ))}
                      </RadioGroup>
                      {answerError && (
                        <Chip color="critical" variant="emphasized">
                          {answerError}
                        </Chip>
                      )}
                    </Flex>
                  )}

                  {/* Validate button */}
                  {isActive && (
                    <Flex padding={4}>
                      <Button
                        variant="accent"
                        disabled={
                          isValidating ||
                          (isMultipleChoice && !selectedAnswer)
                        }
                        onClick={() => handleValidate(index)}
                      >
                        {isValidating
                          ? "Confirming..."
                          : isMultipleChoice
                            ? "Submit"
                            : "Complete"}
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Surface>
          );
        })}
      </Flex>
    </Flex>
    </div>
  );
};
