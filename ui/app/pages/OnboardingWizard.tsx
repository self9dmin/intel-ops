import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
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

const PRE_SEASON_IDS = ["ground-zero", "operator-readiness"];

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

const EXPERIENCE_TO_DEFAULT_CIRCUIT: Record<string, string> = {
  new: "ground-zero",
  learning: "ground-zero",
  experienced: "operator-readiness",
};

function getCircuitTier(circuitId: string): string {
  const preSeason = new Set(["terrain-recon", "ground-zero", "operator-readiness"]);
  const qualifying = new Set(["first-response", "reliability-run", "cluster-control", "insight"]);
  const raceDay = new Set(["signal-hunt", "root-cause-run"]);

  if (preSeason.has(circuitId)) return "Pre-Season Testing";
  if (qualifying.has(circuitId)) return "Qualifying";
  if (raceDay.has(circuitId)) return "Race Day";
  return "Qualifying";
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3, 4, 5];
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
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("sre");
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lightsOn, setLightsOn] = useState([false, false, false, false, false]);
  const [lightsExiting, setLightsExiting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Entry: illuminate lights left-to-right when arriving at step 5
  useEffect(() => {
    if (step !== 5) return;
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

  const startingCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === selectedCircuit),
    [selectedCircuit]
  );
  const operatorReadiness = useMemo(
    () => CIRCUITS.find((c) => c.id === "operator-readiness"),
    []
  );

  const preSeasonCircuits = useMemo(
    () => PRE_SEASON_IDS.map((id) => CIRCUITS.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => c !== undefined),
    []
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

  // Auto-select default circuit when arriving at step 3
  const goToStep3 = useCallback(() => {
    if (selectedExperience && !selectedCircuit) {
      setSelectedCircuit(EXPERIENCE_TO_DEFAULT_CIRCUIT[selectedExperience] ?? "ground-zero");
    }
    setStep(3);
  }, [selectedExperience, selectedCircuit]);

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
        startingCircuit: selectedCircuit ?? undefined,
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
      style={{ minHeight: "100vh", padding: "24px 24px" }}
    >
      <Flex
        flexDirection="column"
        gap={12}
        style={{ maxWidth: "640px", width: "100%" }}
      >
        {step >= 1 && step < 5 && <StepIndicator currentStep={step} />}

        {/* Screen 1 — Welcome (pre-step) */}
        {step === 0 && (
          <>
            <style>{`
              @keyframes ctaPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(20, 150, 255, 0.4); }
                50% { box-shadow: 0 0 16px 4px rgba(20, 150, 255, 0.15); }
              }
            `}</style>
            <div style={{
              borderTop: "3px solid var(--dt-colors-charts-blue-default, #1496ff)",
              borderRadius: "8px",
              background: "radial-gradient(ellipse at center, rgba(26, 154, 224, 0.05) 0%, transparent 70%)",
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}>
              <Heading level={1}>Mission Control</Heading>
              <Text textStyle="base" style={{ textAlign: "center", opacity: 0.6 }}>
                Train Here. Perform Everywhere.
              </Text>

              {/* Telemetry strip */}
              <div style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                maxWidth: "520px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "var(--dt-colors-background-container-neutral-subdued)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
                gap: "16px",
              }}>
                {([
                  { label: "SESSION", value: "PRE-SEASON" },
                  { label: "DRIVER", value: `#${firstName.toUpperCase()}` },
                  { label: "STATUS", value: "READY" },
                  { label: "CIRCUIT", value: "ASSIGNED" },
                ] as const).map((field) => (
                  <div key={field.label} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "monospace",
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                      opacity: 0.35,
                      textTransform: "uppercase",
                    }}>
                      {field.label}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      opacity: 0.5,
                      letterSpacing: "0.3px",
                    }}>
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>

              <img
                src="/ui/assets/ft-car.png"
                alt="Mission Control F1 Car"
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  marginTop: "0px",
                  marginBottom: "0px",
                  opacity: 0.92,
                }}
              />

              {/* Name treatment */}
              <div style={{ textAlign: "center" }}>
                <span style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "var(--dt-colors-text-neutral-default)",
                  lineHeight: 1.1,
                }}>
                  {fullName}
                </span>
              </div>

              {/* System confirmation */}
              <span style={{
                fontFamily: "monospace",
                fontSize: "13px",
                opacity: 0.6,
                textAlign: "center",
              }}>
                Your seat on the grid is ready.
              </span>

              {/* CTA with pulse */}
              <div style={{ animation: "ctaPulse 2.5s ease-in-out infinite", borderRadius: "8px" }}>
                <Button variant="emphasized" onClick={() => setStep(1)}>
                  Enter the Briefing Room &rarr;
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Screen 2 — Experience level selector (step 1 of 3) */}
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

        {/* Screen 3 — Driver picker (step 2 of 5) */}
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
                onClick={goToStep3}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Screen 4 — Pre-Season circuit picker (step 3 of 5) */}
        {step === 3 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Pick your starting circuit.</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                You can switch circuits at any time.
              </Text>
            </Flex>

            <Flex flexDirection="column" gap={12}>
              {preSeasonCircuits.map((circuit) => {
                const isSelected = selectedCircuit === circuit.id;
                const missionCount = circuit.missionIds.length;
                return (
                  <div
                    key={circuit.id}
                    onClick={() => setSelectedCircuit(circuit.id)}
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
                        {circuit.name}
                      </div>
                      <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>
                        {circuit.description}
                      </div>
                      <div style={{ fontSize: "11px", opacity: 0.45, marginTop: "4px" }}>
                        {missionCount} {missionCount === 1 ? "mission" : "missions"}
                      </div>
                    </div>
                    <img
                      src={circuit.f1TrackSvgUrl}
                      alt=""
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "contain",
                        opacity: isSelected ? 0.85 : 0.4,
                        filter: "invert(1) sepia(1) saturate(5) hue-rotate(190deg)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                );
              })}
            </Flex>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedCircuit === null}
                onClick={() => setStep(4)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Screen 5 — Country picker (step 4 of 5) */}
        {step === 4 && (
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
              <Button onClick={() => setStep(3)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedCountry === null}
                onClick={() => setStep(5)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Screen 6 — Starting path (step 5 of 5) */}
        {step === 5 && startingCircuit && (
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

            <Surface>
              <Flex flexDirection="column" padding={20} gap={12}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <Heading level={4}>{startingCircuit.name}</Heading>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    padding: "2px 10px",
                    borderRadius: "4px",
                    background: "var(--dt-colors-charts-categorical-default-12, #1496ff)",
                    color: "#fff",
                    letterSpacing: "0.5px",
                  }}>
                    {getCircuitTier(startingCircuit.id)}
                  </span>
                </div>
                <Text textStyle="small" style={{ opacity: 0.7 }}>
                  {startingCircuit.description}
                </Text>

                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
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
                          background: "var(--dt-colors-background-container-neutral-subdued)",
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
              </Flex>
            </Surface>

            <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
              You can change your path at any time from the Pace tab.
            </Text>

            {operatorReadiness && (
              <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
                All drivers complete <strong>{operatorReadiness.name}</strong> first &mdash; 3 short missions
                that build your foundation.
              </Text>
            )}

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(4)}>Back</Button>
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
    </Flex>
  );
};
