import React, { useState, useEffect, useCallback } from "react";
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

type CheckpointStatus = "locked" | "active" | "completed";

const TIME_BONUS_PER_SECOND = 2;
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
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [baseScore, setBaseScore] = useState(0);
  const [wrongAnswerGiven, setWrongAnswerGiven] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<string[]>([]);

  // Initialize timer when mission loads
  useEffect(() => {
    if (mission) {
      setTimerSeconds(mission.timerSeconds);
    }
  }, [mission]);

  // Timer countdown
  useEffect(() => {
    if (!mission) return;
    if (timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
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
        // Mission complete — calculate final score and navigate to debrief
        const newBaseScore = baseScore + points;
        const timeBonus = Math.max(0, timerSeconds * TIME_BONUS_PER_SECOND);
        const hintPenalty = hintsUsed.length * HINT_PENALTY;
        const totalScore = Math.max(0, newBaseScore + timeBonus - hintPenalty);

        navigate(`/debrief/${mission.id}`, {
          state: {
            baseScore: newBaseScore,
            timeBonus,
            hintsUsed: hintsUsed.length,
            totalScore,
            timerSecondsRemaining: timerSeconds,
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

      // Multiple choice — answer validation
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

      // Action checkpoints — simulated validation
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

  // Mission not found
  if (!mission) {
    return (
      <Flex flexDirection="column" gap={32} padding={32} alignItems="center">
        <Surface>
          <Flex flexDirection="column" padding={48} gap={16} alignItems="center">
            <Heading level={2}>MISSION NOT FOUND</Heading>
            <Paragraph>
              The requested mission does not exist or has been decommissioned.
            </Paragraph>
            <Button variant="emphasized" onClick={() => navigate("/")}>
              RETURN TO MISSION BOARD
            </Button>
          </Flex>
        </Surface>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" gap={24} padding={32}>
      {/* Mission Header */}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <Text textStyle="small">// {mission.codename}</Text>
          <Heading level={1}>{mission.title}</Heading>
        </Flex>
        <Chip
          color={timerSeconds < 60 ? "critical" : "neutral"}
          variant="emphasized"
        >
          {formatTime(timerSeconds)}
        </Chip>
      </Flex>

      {/* Briefing */}
      <Surface>
        <Flex flexDirection="column" padding={24} gap={8}>
          <Strong>SITUATION REPORT</Strong>
          <Paragraph>{mission.briefing}</Paragraph>
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
        </Flex>
      </Surface>

      {/* Checkpoints */}
      <Flex flexDirection="column" gap={12}>
        {mission.checkpoints.map((checkpoint, index) => {
          const status = getCheckpointStatus(index);
          const isMultipleChoice = checkpoint.type === "multiple-choice";
          const hintAvailable = checkpoint.hint.length > 0;
          const hintRevealed = hintsRevealed.includes(checkpoint.id);

          return (
            <Surface key={checkpoint.id}>
              <Flex padding={20} gap={16} alignItems="flex-start">
                {/* Step number / status indicator */}
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {status === "completed" ? (
                    <SuccessIcon />
                  ) : (
                    <Heading level={3}>
                      {String(index + 1).padStart(2, "0")}
                    </Heading>
                  )}
                </Flex>

                {/* Content */}
                <Flex flexDirection="column" gap={8} flexGrow={1}>
                  <Flex gap={8} alignItems="center">
                    <Strong>{checkpoint.title}</Strong>
                    {status === "completed" && (
                      <Chip color="success" variant="emphasized">
                        Complete
                      </Chip>
                    )}
                    {status === "active" && (
                      <Chip color="primary" variant="emphasized">
                        Active
                      </Chip>
                    )}
                    {status === "locked" && (
                      <Chip color="neutral">Locked</Chip>
                    )}
                  </Flex>

                  {status !== "locked" && (
                    <Paragraph>{checkpoint.instruction}</Paragraph>
                  )}

                  {/* Hint system */}
                  {status === "active" && hintAvailable && !hintRevealed && (
                    <Flex>
                      <Button
                        variant="default"
                        onClick={() => handleRequestHint(checkpoint.id)}
                      >
                        [ REQUEST INTEL ]
                      </Button>
                    </Flex>
                  )}

                  {status === "active" && hintRevealed && (
                    <Surface>
                      <Flex flexDirection="column" padding={16} gap={4}>
                        <Chip color="warning" variant="emphasized">
                          INTEL (-{HINT_PENALTY} pts)
                        </Chip>
                        <Text>{checkpoint.hint}</Text>
                      </Flex>
                    </Surface>
                  )}

                  {/* Multiple choice options */}
                  {status === "active" && isMultipleChoice && checkpoint.choices && (
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
                  {status === "active" && (
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
                          ? "CONFIRMING..."
                          : isMultipleChoice
                            ? "SUBMIT ANSWER"
                            : "CONFIRM CHECKPOINT"}
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
  );
};
