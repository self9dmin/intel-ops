import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

type CheckpointStatus = "locked" | "active" | "completed";

interface CheckpointDefinition {
  title: string;
  instruction: string;
}

const CHECKPOINTS: CheckpointDefinition[] = [
  {
    title: "Open the Problems Feed",
    instruction:
      "Navigate to the Problems app in Dynatrace and locate the active anomaly.",
  },
  {
    title: "Identify the Affected Service",
    instruction:
      "Use the topology map to find which service is impacted.",
  },
  {
    title: "Read the Root Cause Chain",
    instruction:
      "Open the problem detail and review what DT Intelligence identified as the root cause.",
  },
  {
    title: "Find the Preceding Log Event",
    instruction:
      "Query the Logs app to find the log entry that appeared before the spike.",
  },
  {
    title: "Identify the Origin Host",
    instruction:
      "Drill into infrastructure to find which host or container is the source.",
  },
  {
    title: "Submit Root Cause",
    instruction: "Select the correct root cause from the options below.",
  },
];

const ROOT_CAUSE_OPTIONS = [
  "Memory leak in database process",
  "Network latency spike from upstream service",
  "Disk I/O saturation on the database host",
] as const;

const CORRECT_ANSWER = ROOT_CAUSE_OPTIONS[2];
const INITIAL_SECONDS = 900;
const POINTS_PER_CHECKPOINT = 150;
const CHECKPOINT_6_BONUS = 200;
const CHECKPOINT_6_WRONG = 100;
const TIME_BONUS_PER_SECOND = 2;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export const Mission = () => {
  const navigate = useNavigate();
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>(
    []
  );
  const [timerSeconds, setTimerSeconds] = useState(INITIAL_SECONDS);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [missionComplete, setMissionComplete] = useState(false);
  const [baseScore, setBaseScore] = useState(0);
  const [checkpoint6Wrong, setCheckpoint6Wrong] = useState(false);
  const [checkpoint6Error, setCheckpoint6Error] = useState("");

  // Timer
  useEffect(() => {
    if (missionComplete) return;
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
  }, [missionComplete, timerSeconds]);

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
      setCompletedCheckpoints((prev) => [...prev, index]);
      setBaseScore((prev) => prev + points);

      if (index === 5) {
        // All checkpoints done
        setMissionComplete(true);
      } else {
        setCurrentCheckpoint(index + 1);
      }
    },
    []
  );

  const handleValidate = useCallback(
    (index: number) => {
      if (isValidating) return;

      // Checkpoint 6 — answer validation
      if (index === 5) {
        if (!selectedAnswer) return;
        setIsValidating(true);
        setCheckpoint6Error("");

        setTimeout(() => {
          setIsValidating(false);
          if (selectedAnswer === CORRECT_ANSWER) {
            const points = checkpoint6Wrong
              ? CHECKPOINT_6_WRONG
              : CHECKPOINT_6_BONUS;
            completeCheckpoint(index, points);
          } else {
            setCheckpoint6Wrong(true);
            setCheckpoint6Error(
              "Incorrect — review the logs and try again"
            );
          }
        }, 1000);
        return;
      }

      // Checkpoints 1–5 — simulated validation
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        completeCheckpoint(index, POINTS_PER_CHECKPOINT);
      }, 1000);
    },
    [isValidating, selectedAnswer, checkpoint6Wrong, completeCheckpoint]
  );

  const timeBonus = timerSeconds * TIME_BONUS_PER_SECOND;
  const totalScore = baseScore + timeBonus;

  if (missionComplete) {
    return (
      <Flex flexDirection="column" gap={32} padding={32} alignItems="center">
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={48}
            gap={24}
          >
            <SuccessIcon size="large" />
            <Heading level={1}>MISSION COMPLETE</Heading>
            <Flex flexDirection="column" gap={8} alignItems="center">
              <Text>
                Base Score: <Strong>{baseScore}</Strong>
              </Text>
              <Text>
                Time Remaining: <Strong>{formatTime(timerSeconds)}</Strong> (+
                {timeBonus} pts)
              </Text>
              <Heading level={2}>Total Score: {totalScore}</Heading>
            </Flex>
            <Button variant="emphasized" onClick={() => navigate("/")}>
              Return to Mission Board
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
        <Heading level={1}>Operation: 3am Database Spike</Heading>
        <Chip
          color={timerSeconds < 120 ? "critical" : "neutral"}
          variant="emphasized"
        >
          {formatTime(timerSeconds)}
        </Chip>
      </Flex>

      {/* Briefing */}
      <Surface>
        <Flex flexDirection="column" padding={24} gap={8}>
          <Strong>SITUATION REPORT</Strong>
          <Paragraph>
            03:17 local time. Your database response times just spiked 400%.
            Davis Intelligence has flagged an anomaly. The on-call engineer is
            unavailable. You are the Incident Commander. Find the root cause
            before business hours.
          </Paragraph>
        </Flex>
      </Surface>

      {/* Checkpoints */}
      <Flex flexDirection="column" gap={12}>
        {CHECKPOINTS.map((checkpoint, index) => {
          const status = getCheckpointStatus(index);
          return (
            <Surface key={index}>
              <Flex padding={20} gap={16} alignItems="flex-start">
                {/* Step number / status indicator */}
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  style={{ minWidth: 40 }}
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

                  {/* Checkpoint 6 — radio options */}
                  {status === "active" && index === 5 && (
                    <Flex flexDirection="column" gap={8}>
                      <RadioGroup
                        value={selectedAnswer}
                        onChange={(value: string) => setSelectedAnswer(value)}
                      >
                        {ROOT_CAUSE_OPTIONS.map((option) => (
                          <Radio key={option} value={option}>
                            {option}
                          </Radio>
                        ))}
                      </RadioGroup>
                      {checkpoint6Error && (
                        <Chip color="critical" variant="emphasized">
                          {checkpoint6Error}
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
                          isValidating || (index === 5 && !selectedAnswer)
                        }
                        onClick={() => handleValidate(index)}
                      >
                        {isValidating ? "Validating..." : "Validate"}
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
