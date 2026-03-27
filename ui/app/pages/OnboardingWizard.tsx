import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import type { Discipline, DisciplineProgress, TopicId, ExperienceLevel } from "../types/UserState";
import { createDefaultDisciplines } from "../types/UserState";
import { MISSIONS } from "../data/missions";
import { CIRCUITS } from "../data/circuits";

export interface OnboardingPartial {
  startingDiscipline: Discipline;
  disciplines: Record<Discipline, DisciplineProgress>;
  topicXP: Partial<Record<TopicId, number>>;
  completedMissions: string[];
  streakDays: number;
  lastActiveDate: string;
  badges: string[];
  selectedAreas: string[];
  topicTrackPriority: TopicId[];
  experienceLevel: ExperienceLevel;
  country?: string;
  selectedRole?: string;
  selectedSubNeed?: string;
  startingCircuit?: string;
}

interface OnboardingWizardProps {
  onComplete: (partial: OnboardingPartial) => Promise<void>;
}

interface ExperienceOption {
  id: string;
  label: string;
  subtext: string;
}

interface DriverOption {
  id: Discipline;
  name: string;
  tier: string;
  description: string;
  helmet: string;
}

const DRIVER_OPTIONS: DriverOption[] = [
  { id: "incident-commander", name: "Arvid Lindblad", tier: "Rookie", description: "Just arrived. Learn the platform and find your feet.", helmet: "/ui/assets/helmets/lindblad.png" },
  { id: "developer", name: "Liam Lawson", tier: "Intermediate", description: "You know the basics. Now push harder.", helmet: "/ui/assets/helmets/lawson.png" },
  { id: "platform-engineer", name: "Isack Hadjar", tier: "Advanced", description: "Comfortable under pressure. Build on solid foundations.", helmet: "/ui/assets/helmets/hadjar.png" },
  { id: "sre", name: "Max Verstappen", tier: "Elite", description: "No hand-holding. Full stack, full pressure.", helmet: "/ui/assets/helmets/verstappen.png" },
];

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { id: "new", label: "New to Dynatrace", subtext: "I'm just getting started" },
  { id: "learning", label: "Some Experience", subtext: "I've used it but want to go deeper" },
  { id: "experienced", label: "Daily User", subtext: "I use Dynatrace regularly at work" },
];

const DRIVER_TO_CIRCUIT: Record<Discipline, string | null> = {
  "incident-commander": "ground-zero",
  developer: "operator-readiness",
  "platform-engineer": "reliability-driver",
  sre: null,
};

const COUNTRY_OPTIONS: { id: string; label: string; code: string | null }[] = [
  { id: "gb", label: "United Kingdom", code: "gb" },
  { id: "us", label: "United States", code: "us" },
  { id: "de", label: "Germany", code: "de" },
  { id: "br", label: "Brazil", code: "br" },
  { id: "nl", label: "Netherlands", code: "nl" },
  { id: "it", label: "Italy", code: "it" },
  { id: "au", label: "Australia", code: "au" },
  { id: "in", label: "India", code: "in" },
  { id: "ca", label: "Canada", code: "ca" },
  { id: "fr", label: "France", code: "fr" },
  { id: "es", label: "Spain", code: "es" },
  { id: "mx", label: "Mexico", code: "mx" },
  { id: "cn", label: "China", code: "cn" },
  { id: "be", label: "Belgium", code: "be" },
  { id: "at", label: "Austria", code: "at" },
  { id: "jp", label: "Japan", code: "jp" },
  { id: "ae", label: "UAE", code: "ae" },
  { id: "sa", label: "Saudi Arabia", code: "sa" },
  { id: "za", label: "South Africa", code: "za" },
  { id: "ar", label: "Argentina", code: "ar" },
  { id: "co", label: "Colombia", code: "co" },
  { id: "sg", label: "Singapore", code: "sg" },
  { id: "mc", label: "Monaco", code: "mc" },
  { id: "pt", label: "Portugal", code: "pt" },
  { id: "pl", label: "Poland", code: "pl" },
  { id: "other", label: "Other", code: null },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3, 4];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
      {steps.map((s) => {
        const completed = currentStep > s;
        const active = currentStep === s;
        return (
          <div
            key={s}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              background: active || completed
                ? "var(--dt-colors-charts-categorical-default-12, #1496ff)"
                : "var(--dt-colors-background-container-neutral-subdued)",
              color: active || completed ? "#fff" : "var(--dt-colors-text-neutral-subdued)",
              opacity: active || completed ? 1 : 0.5,
              transition: "all 0.2s",
            }}
          >
            {completed ? "\u2713" : s}
          </div>
        );
      })}
    </div>
  );
}

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("incident-commander");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lightsOn, setLightsOn] = useState([false, false, false, false, false]);
  const [lightsExiting, setLightsExiting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Entry: illuminate lights left-to-right when arriving at confirm step (4)
  useEffect(() => {
    if (step !== 4) return;
    setLightsOn([false, false, false, false, false]);
    setLightsExiting(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 5; i++) {
      const t = setTimeout(() => {
        setLightsOn((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 150 + i * 150);
      timers.push(t);
    }
    timersRef.current = timers;
    return () => { timers.forEach(clearTimeout); };
  }, [step]);

  const handleFinishRef = useRef<() => Promise<void>>();

  // Exit: darken lights right-to-left then call handleFinish
  const startLightsExit = useCallback(() => {
    if (lightsExiting) return;
    setLightsExiting(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 5; i++) {
      const t = setTimeout(() => {
        setLightsOn((prev) => {
          const next = [...prev];
          next[4 - i] = false;
          return next;
        });
      }, i * 100);
      timers.push(t);
    }
    const proceed = setTimeout(() => {
      void handleFinishRef.current?.();
    }, 5 * 100);
    timers.push(proceed);
    timersRef.current = timers;
  }, [lightsExiting]);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const fullName = currentUser.name ?? currentUser.email ?? "Operator";

  const startingCircuitId = DRIVER_TO_CIRCUIT[selectedDiscipline] ?? undefined;
  const startingCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === startingCircuitId) ?? null,
    [startingCircuitId]
  );

  const circuitMissions = useMemo(() => {
    if (!startingCircuit) return [];
    return startingCircuit.missionIds
      .map((id) => MISSIONS.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined);
  }, [startingCircuit]);

  const topicPriority = useMemo((): TopicId[] => {
    const counts = new Map<TopicId, number>();
    for (const m of circuitMissions) {
      for (const t of m.topics) {
        const topic = t as TopicId;
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic);
  }, [circuitMissions]);

  // Keep ref in sync so the lights-exit callback always calls the latest version
  async function handleFinish() {
    setSaving(true);
    try {
      await onComplete({
        startingDiscipline: selectedDiscipline,
        disciplines: createDefaultDisciplines(),
        topicXP: {},
        completedMissions: [],
        streakDays: 0,
        lastActiveDate: "",
        badges: [],
        selectedAreas: [],
        topicTrackPriority: topicPriority,
        experienceLevel: (selectedExperience as ExperienceLevel) ?? "new",
        country: selectedCountry ?? undefined,
        selectedRole: undefined,
        selectedSubNeed: undefined,
        startingCircuit: startingCircuitId,
      });
      navigate("/");
    } catch (err: unknown) {
      console.error("Failed to save user state:", err);
      setSaving(false);
    }
  }
  handleFinishRef.current = handleFinish;

  function cardStyle(isSelected: boolean): React.CSSProperties {
    return {
      padding: "16px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      border: isSelected
        ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
        : "1px solid var(--dt-colors-border-neutral-default)",
      background: isSelected
        ? "var(--dt-colors-background-container-neutral-default)"
        : "transparent",
      transition: "all 0.15s",
    };
  }

  function handleHover(e: React.MouseEvent<HTMLDivElement>, isSelected: boolean, enter: boolean) {
    if (!isSelected) {
      e.currentTarget.style.background = enter
        ? "var(--dt-colors-background-container-neutral-subdued)"
        : "transparent";
    }
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", padding: step === 0 ? "0" : "24px 24px" }}
    >
      {step === 0 ? (
        /* Full-bleed hero welcome */
        <div
          style={{
            width: "100%",
            height: "420px",
            position: "relative",
            backgroundImage: "url(/ui/assets/ft-car.png)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            overflow: "hidden",
          }}
        >
          {/* Top gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: "linear-gradient(to bottom, rgba(10,10,20,0.7), transparent)",
              pointerEvents: "none",
            }}
          />
          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(to top, rgba(10,10,20,0.95), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Top overlay content */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontVariant: "small-caps",
                letterSpacing: "4px",
                opacity: 0.7,
                color: "#fff",
              }}
            >
              MISSION CONTROL
            </span>
            <span
              style={{
                fontSize: "13px",
                opacity: 0.5,
                color: "#fff",
                marginTop: "4px",
              }}
            >
              Train Here. Perform Everywhere.
            </span>
          </div>

          {/* Bottom overlay content */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {firstName}
            </span>
            <span
              style={{
                fontSize: "14px",
                opacity: 0.6,
                color: "#fff",
                marginTop: "4px",
              }}
            >
              Your seat on the grid is ready.
            </span>
            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                padding: "12px 32px",
                borderRadius: "4px",
                fontSize: "14px",
                letterSpacing: "1px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
            >
              Enter the Briefing Room &rarr;
            </button>
          </div>
        </div>
      ) : (
      <Flex
        flexDirection="column"
        gap={12}
        style={{ maxWidth: "640px", width: "100%" }}
      >
        {step >= 1 && step < 4 && <StepIndicator currentStep={step} />}

        {/* Step 1 — Experience level */}
        {step === 1 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What&apos;s your experience with Dynatrace?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                We&apos;ll set your starting position on the grid.
              </Text>
            </Flex>

            <Flex flexDirection="column" gap={12}>
              {EXPERIENCE_OPTIONS.map((opt) => {
                const isSelected = selectedExperience === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedExperience(opt.id)}
                    style={cardStyle(isSelected)}
                    onMouseEnter={(e) => handleHover(e, isSelected, true)}
                    onMouseLeave={(e) => handleHover(e, isSelected, false)}
                  >
                    <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>
                      {opt.subtext}
                    </div>
                  </div>
                );
              })}
            </Flex>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(0)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedExperience === null}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 2 — Driver picker */}
        {step === 2 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Pick your driver.</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                You can change your driver anytime from the Progress tab.
              </Text>
            </Flex>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}>
              {DRIVER_OPTIONS.map((driver) => {
                const isSelected = selectedDiscipline === driver.id;
                return (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDiscipline(driver.id)}
                    style={{
                      ...cardStyle(isSelected),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => handleHover(e, isSelected, true)}
                    onMouseLeave={(e) => handleHover(e, isSelected, false)}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>
                        {driver.name}
                      </div>
                      <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "2px" }}>
                        {driver.tier}
                      </div>
                      <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "6px" }}>
                        {driver.description}
                      </div>
                    </div>
                    <img
                      src={driver.helmet}
                      alt=""
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        flexShrink: 0,
                        opacity: isSelected ? 0.9 : 0.5,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                variant="emphasized"
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 3 — Country picker */}
        {step === 3 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Which country are you representing?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                Your flag will appear on the leaderboard.
              </Text>
            </Flex>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}>
              {COUNTRY_OPTIONS.map((opt) => {
                const isSelected = selectedCountry === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedCountry(opt.id)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: "11px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      border: isSelected
                        ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                        : "1px solid var(--dt-colors-border-neutral-default)",
                      background: isSelected
                        ? "var(--dt-colors-background-container-neutral-default)"
                        : "transparent",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => handleHover(e, isSelected, true)}
                    onMouseLeave={(e) => handleHover(e, isSelected, false)}
                  >
                    {opt.code ? (
                      <img
                        src={`/ui/assets/flags/${opt.code}.png`}
                        alt=""
                        style={{ width: "32px", height: "24px", borderRadius: "2px", display: "block", margin: "0 auto 6px" }}
                      />
                    ) : (
                      <span style={{ fontSize: "20px", display: "block", textAlign: "center", marginBottom: "6px" }}>🌍</span>
                    )}
                    {opt.label}
                  </div>
                );
              })}
            </div>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedCountry === null}
                onClick={() => setStep(4)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <Flex flexDirection="column" gap={24}>
            {/* Formation lights replace step indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
              {lightsOn.map((on, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 18 18">
                  <circle
                    cx="9"
                    cy="9"
                    r="9"
                    fill={on ? "#e8001e" : "#1c1c2e"}
                    filter={on ? "drop-shadow(0 0 6px #e8001e)" : "none"}
                  />
                </svg>
              ))}
            </div>

            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Your Grid Position, {firstName}</Heading>
            </Flex>

            {startingCircuit && (
              <div style={{
                padding: "20px",
                borderRadius: "8px",
                background: "var(--dt-colors-background-container-neutral-subdued)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
              }}>
                <Heading level={4}>{startingCircuit.name}</Heading>
                <Text textStyle="small" style={{ opacity: 0.7, marginTop: "4px" }}>
                  {startingCircuit.description}
                </Text>

                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {startingCircuit.missionIds.map((mId) => {
                    const mission = MISSIONS.find((m) => m.id === mId);
                    if (!mission) return null;
                    const isLocked = mission.prerequisites.length > 0;
                    return (
                      <div
                        key={mId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "var(--dt-colors-background-container-neutral-default)",
                          opacity: isLocked ? 0.45 : 1,
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>
                          {isLocked ? "\uD83D\uDD12 " : ""}{mission.title}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)" }}>
                          {Math.ceil(mission.timerSeconds / 60)} min
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!startingCircuit && (
              <div style={{
                padding: "20px",
                borderRadius: "8px",
                background: "var(--dt-colors-background-container-neutral-subdued)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
                textAlign: "center",
              }}>
                <Text textStyle="small" style={{ opacity: 0.7 }}>
                  All circuits unlocked. Choose your first mission from the grid.
                </Text>
              </div>
            )}

            <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
              You can change your driver and circuit at any time.
            </Text>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(3)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={lightsExiting || saving}
                onClick={startLightsExit}
              >
                {saving ? "" : "Take Your Position \u2192"}
                {saving && <ProgressCircle />}
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
      )}
    </Flex>
  );
};
