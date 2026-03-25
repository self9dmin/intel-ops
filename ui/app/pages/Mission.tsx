import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMissionById } from "../data/missions";
import { MatrixBackground } from "../components/MatrixBackground";
const roomBg = "/ui/assets/room-bg.jpg";

type CheckpointStatus = "locked" | "active" | "completed";

const TIME_BONUS_PER_SECOND = 0.5;
const HINT_PENALTY = 50;
const WRONG_ANSWER_PENALTY = 100;

const CHOICE_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Renders checkpoint instruction text, styling backtick-wrapped DQL as inline code */
function renderInstruction(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            color: "#1dbb7e",
            fontFamily: "monospace",
            background: "rgba(29,187,126,0.08)",
            padding: "1px 4px",
            borderRadius: 3,
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const DIFFICULTY_COLORS: Record<string, string> = {
  rookie: "rgba(29,187,126,0.7)",
  operator: "rgba(255,191,0,0.7)",
  elite: "rgba(231,76,60,0.7)",
  legend: "rgba(231,76,60,0.7)",
};

const DIFFICULTY_BG: Record<string, string> = {
  rookie: "rgba(29,187,126,0.1)",
  operator: "rgba(255,191,0,0.1)",
  elite: "rgba(231,76,60,0.1)",
  legend: "rgba(231,76,60,0.1)",
};

const scanLineStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)",
  pointerEvents: "none",
  zIndex: 10,
};

const screenBase: React.CSSProperties = {
  borderRadius: 5,
  border: "1px solid rgba(255,255,255,0.07)",
  overflow: "hidden",
  position: "relative",
  background: "rgba(4,6,14,0.88)",
};

export const Mission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mission = id ? getMissionById(id) : undefined;

  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([]);
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

  // Inject keyframes
  useEffect(() => {
    const styleId = "mission-war-room-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `@keyframes missionLiveDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }`;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

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

  // ── Room wrapper (shared by all states) ──
  const roomWrapper = (children: React.ReactNode) => (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#060810" }}>
      {/* Room photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${roomBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 15%",
          filter: "brightness(0.38) saturate(0.75)",
          zIndex: 0,
        }}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(8,4,2,0.9) 0%, transparent 55%), linear-gradient(to bottom, rgba(4,6,14,0.25) 0%, transparent 30%, transparent 55%, rgba(4,6,14,0.7) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Desk foreground */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          background:
            "linear-gradient(to top, rgba(10,5,2,0.96) 0%, rgba(10,5,2,0.55) 60%, transparent 100%)",
          zIndex: 3,
        }}
      />
      {/* UI layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          padding: "16px 18px 12px",
        }}
      >
        {children}
      </div>
    </div>
  );

  // ── Mission not found ──
  if (!mission) {
    return roomWrapper(
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#d8e4f0" }}>Mission Not Found</div>
        <div style={{ fontSize: 11, color: "rgba(150,170,200,0.5)" }}>
          The requested mission does not exist or has been decommissioned.
        </div>
        <button
          onClick={() => navigate("/missions")}
          style={{
            fontSize: 10,
            padding: "5px 14px",
            borderRadius: 3,
            background: "rgba(20,150,255,0.1)",
            border: "1px solid rgba(20,150,255,0.28)",
            color: "#1496ff",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to Missions
        </button>
      </div>
    );
  }

  const displaySeconds = timerSeconds ?? mission.timerSeconds;
  const timerIsLow = displaySeconds < 60;
  const checkpoint = mission.checkpoints[currentCheckpoint];
  const cpStatus = getCheckpointStatus(currentCheckpoint);
  const isMultipleChoice = checkpoint?.type === "multiple-choice";
  const hintAvailable = checkpoint ? checkpoint.hint.length > 0 : false;
  const hintRevealed = checkpoint ? hintsRevealed.includes(checkpoint.id) : false;

  return roomWrapper(
    <>
      {/* ── Status bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(180,200,220,0.4)",
        }}
      >
        {/* Pulsing red dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#e74c3c",
            animation: "missionLiveDot 2s infinite",
          }}
        />
        <span>Mission Control</span>
        {/* Separator */}
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <span style={{ color: "rgba(20,150,255,0.65)" }}>
          {mission.codename} / {mission.title}
        </span>
        <div style={{ flex: 0, width: 1, height: 8, background: "rgba(255,255,255,0.06)" }} />
        <span style={{ color: "rgba(29,187,126,0.6)" }}>Operator Active</span>
        <div style={{ flex: 0, width: 1, height: 8, background: "rgba(255,255,255,0.06)" }} />
        <span>Playground Env</span>
      </div>

      {/* ── Screen wall ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.75fr 1fr",
          gap: 8,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* ═══ LEFT screen — Tenant Signal / MatrixBackground ═══ */}
        <div style={{ ...screenBase, display: "flex", flexDirection: "column" }}>
          <div style={scanLineStyle} />
          {/* Header strip */}
          <div
            style={{
              padding: "6px 10px",
              borderBottom: "1px solid rgba(0,200,50,0.1)",
              background: "rgba(0,200,50,0.04)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0,200,50,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,200,50,0.6)" }} />
            Tenant Signal
          </div>
          {/* Matrix canvas wrapper */}
          <div style={{ flex: 1, position: "relative" }}>
            <MatrixBackground colorTier={colorTier} />
          </div>
        </div>

        {/* ═══ CENTER screen — Checkpoint ═══ */}
        <div style={{ ...screenBase, display: "flex", flexDirection: "column" }}>
          <div style={scanLineStyle} />
          {/* Top bar */}
          <div
            style={{
              padding: "7px 14px",
              borderBottom: "1px solid rgba(20,150,255,0.1)",
              background: "rgba(20,150,255,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "rgba(20,150,255,0.6)",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.13em",
              }}
            >
              {mission.title} — CP {currentCheckpoint + 1} of {mission.checkpoints.length}
            </span>
            <div style={{ flex: 1 }} />
            <span
              style={{
                color: timerIsLow ? "#e74c3c" : "#1496ff",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {formatTime(displaySeconds)}
            </span>
          </div>

          {/* Checkpoint body */}
          <div
            style={{
              flex: 1,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflow: "hidden",
            }}
          >
            {/* Progress pips */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {mission.checkpoints.map((_, i) => {
                const st = getCheckpointStatus(i);
                let bg = "rgba(255,255,255,0.08)";
                if (st === "completed") bg = "#1dbb7e";
                if (st === "active") bg = "#1496ff";
                return (
                  <div
                    key={i}
                    style={{ height: 3, width: 22, borderRadius: 2, background: bg }}
                  />
                );
              })}
              <span
                style={{
                  fontSize: 9,
                  color: "rgba(150,170,200,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginLeft: 6,
                }}
              >
                Checkpoint {currentCheckpoint + 1}
              </span>
            </div>

            {cpStatus === "completed" || completedCheckpoints.includes(currentCheckpoint) ? (
              /* ── Completed state ── */
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 24, color: "#1dbb7e" }}>✓</span>
                <span style={{ fontSize: 12, color: "#1dbb7e", fontWeight: 600 }}>
                  Checkpoint Complete
                </span>
                <span style={{ fontSize: 10, color: "rgba(150,170,200,0.4)", fontFamily: "monospace" }}>
                  +{checkpoint?.points ?? 0} pts
                </span>
              </div>
            ) : checkpoint ? (
              <>
                {/* Section label */}
                <div
                  style={{
                    fontSize: 9,
                    textTransform: "uppercase",
                    color: "rgba(150,170,200,0.4)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {checkpoint.title}
                </div>

                {/* Question text */}
                <div style={{ fontSize: 12, color: "#c0cce0", lineHeight: 1.55 }}>
                  {renderInstruction(checkpoint.instruction)}
                </div>

                {/* Hint revealed */}
                {hintRevealed && (
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid rgba(255,191,0,0.15)",
                      background: "rgba(255,191,0,0.05)",
                      fontSize: 11,
                      color: "rgba(255,191,0,0.7)",
                    }}
                  >
                    {checkpoint.hint}
                  </div>
                )}

                {/* Multiple choice options */}
                {isMultipleChoice && checkpoint.choices && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {checkpoint.choices.map((option, i) => {
                      const isSelected = selectedAnswer === option;
                      return (
                        <div
                          key={option}
                          onClick={() => setSelectedAnswer(option)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 4,
                            border: isSelected
                              ? "1px solid rgba(20,150,255,0.45)"
                              : "1px solid rgba(255,255,255,0.07)",
                            fontSize: 11,
                            color: isSelected ? "#c8d4e8" : "rgba(180,200,220,0.6)",
                            background: isSelected
                              ? "rgba(20,150,255,0.1)"
                              : "rgba(255,255,255,0.025)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              fontFamily: "monospace",
                              color: "rgba(150,170,200,0.3)",
                            }}
                          >
                            {CHOICE_KEYS[i] ?? String(i + 1)}
                          </span>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answer error */}
                {answerError && (
                  <div style={{ fontSize: 11, color: "rgba(231,76,60,0.8)" }}>{answerError}</div>
                )}

                {/* Action row */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: 8,
                  }}
                >
                  {/* Hint button */}
                  <div>
                    {hintAvailable && !hintRevealed && (
                      <span
                        onClick={() => handleRequestHint(checkpoint.id)}
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          color: "rgba(150,170,200,0.32)",
                          cursor: "pointer",
                          letterSpacing: "0.08em",
                        }}
                      >
                        ⊹ Request intel (−{HINT_PENALTY} pts)
                      </span>
                    )}
                  </div>
                  {/* Validate button */}
                  <button
                    onClick={() => handleValidate(currentCheckpoint)}
                    disabled={isValidating || (isMultipleChoice && !selectedAnswer)}
                    style={{
                      fontSize: 10,
                      padding: "5px 14px",
                      borderRadius: 3,
                      background: "rgba(20,150,255,0.1)",
                      border: "1px solid rgba(20,150,255,0.28)",
                      color: "#1496ff",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor:
                        isValidating || (isMultipleChoice && !selectedAnswer)
                          ? "default"
                          : "pointer",
                      opacity:
                        isValidating || (isMultipleChoice && !selectedAnswer) ? 0.4 : 1,
                    }}
                  >
                    {isValidating ? "Confirming..." : "Validate →"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* ═══ RIGHT screen — Mission Briefing ═══ */}
        <div style={{ ...screenBase, display: "flex", flexDirection: "column" }}>
          <div style={scanLineStyle} />
          <div
            style={{
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 9,
              flex: 1,
              overflow: "hidden",
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                color: "rgba(150,170,200,0.28)",
                letterSpacing: "0.14em",
              }}
            >
              Mission Briefing
            </div>

            {/* Mission title */}
            <div style={{ fontSize: 14, fontWeight: 600, color: "#d8e4f0" }}>{mission.title}</div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 6 }}>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: 3,
                  color: "rgba(200,215,230,0.5)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {mission.role}
              </span>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: 3,
                  color: DIFFICULTY_COLORS[mission.difficulty] ?? "rgba(200,215,230,0.5)",
                  background: DIFFICULTY_BG[mission.difficulty] ?? "rgba(255,255,255,0.05)",
                }}
              >
                {mission.difficulty}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Briefing text */}
            <div
              style={{
                fontSize: 10,
                color: "rgba(140,160,185,0.5)",
                lineHeight: 1.65,
                flex: 1,
                overflow: "hidden",
              }}
            >
              {mission.briefing}
            </div>

            {/* Timer widget */}
            <div
              style={{
                border: "1px solid rgba(20,150,255,0.12)",
                borderRadius: 4,
                background: "rgba(20,150,255,0.035)",
                padding: 9,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(150,170,200,0.28)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Time Remaining
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: timerIsLow ? "#e74c3c" : "#1496ff",
                  fontFamily: "monospace",
                }}
              >
                {formatTime(displaySeconds)}
              </div>
            </div>

            {/* Abandon section */}
            <div style={{ textAlign: "center" }}>
              {!abandonConfirm ? (
                <span
                  onClick={() => setAbandonConfirm(true)}
                  style={{
                    fontSize: 9,
                    textTransform: "uppercase",
                    color: "rgba(200,80,80,0.35)",
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                  }}
                >
                  Abandon Mission
                </span>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "rgba(150,170,200,0.4)" }}>
                    This will end your mission.
                  </span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span
                      onClick={() => navigate("/missions")}
                      style={{
                        fontSize: 9,
                        textTransform: "uppercase",
                        color: "rgba(231,76,60,0.7)",
                        cursor: "pointer",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Confirm
                    </span>
                    <span
                      onClick={() => setAbandonConfirm(false)}
                      style={{
                        fontSize: 9,
                        textTransform: "uppercase",
                        color: "rgba(150,170,200,0.4)",
                        cursor: "pointer",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Cancel
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
