import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import {
  WarningIcon,
  HostsIcon,
  CodeIcon,
  ApplicationSecurityIcon,
  SettingIcon,
  AnalyticsIcon,
  AiIcon,
  GuideIcon,
} from "@dynatrace/strato-icons";
import type { SvgIconProps } from "@dynatrace/strato-icons";
import type { Discipline, DisciplineProgress, TopicId, ExperienceLevel } from "../types/UserState";
import { createDefaultDisciplines, TOPIC_META } from "../types/UserState";
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
  selectedRole?: string;
  selectedSubNeed?: string;
  startingCircuit?: string;
}

interface OnboardingWizardProps {
  onComplete: (partial: OnboardingPartial) => Promise<void>;
}

interface RoleOption {
  id: string;
  label: string;
  icon: React.ComponentType<SvgIconProps>;
}

const ROLE_OPTIONS: RoleOption[] = [
  { id: "incident-responder", label: "Incident Response & Triage", icon: WarningIcon },
  { id: "platform-engineer", label: "Infrastructure & Platform Engineering", icon: HostsIcon },
  { id: "developer", label: "Software Development & Delivery", icon: CodeIcon },
  { id: "secops", label: "Security Operations", icon: ApplicationSecurityIcon },
  { id: "it-ops", label: "Platform Administration", icon: SettingIcon },
  { id: "business-analyst", label: "Observability & Analytics", icon: AnalyticsIcon },
  { id: "ai-engineer", label: "AI & Automation Engineering", icon: AiIcon },
  { id: "new-to-dt", label: "New to Dynatrace", icon: GuideIcon },
];

interface GapOption {
  id: string;
  label: string;
  subtext: string;
}

const GAP_OPTIONS: GapOption[] = [
  { id: "investigation", label: "Investigation & Root Cause", subtext: "Finding what broke and why" },
  { id: "monitoring", label: "Monitoring & Alerting Setup", subtext: "Getting signal from the noise" },
  { id: "dql", label: "Querying & DQL", subtext: "Getting answers from Grail" },
  { id: "ai-copilot", label: "AI & Davis CoPilot", subtext: "Using Dynatrace AI effectively" },
];

const ROLE_TO_CIRCUIT: Record<string, string> = {
  "incident-responder": "first-response",
  "platform-engineer": "cluster-control",
  developer: "signal-hunt",
  secops: "first-response",
  "it-ops": "ground-zero",
  "business-analyst": "insight",
  "ai-engineer": "signal-hunt",
  "new-to-dt": "terrain-recon",
};

const ROLE_TO_DISCIPLINE: Record<string, Discipline> = {
  "incident-responder": "incident-commander",
  "platform-engineer": "platform-engineer",
  developer: "developer",
  secops: "sre",
  "it-ops": "platform-engineer",
  "business-analyst": "sre",
  "ai-engineer": "developer",
  "new-to-dt": "sre",
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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const fullName = currentUser.name ?? currentUser.email ?? "Operator";

  const startingCircuitId = selectedRole ? ROLE_TO_CIRCUIT[selectedRole] : undefined;
  const startingCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === startingCircuitId),
    [startingCircuitId]
  );
  const operatorReadiness = useMemo(
    () => CIRCUITS.find((c) => c.id === "operator-readiness"),
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

  async function handleFinish() {
    const startingDiscipline: Discipline = selectedRole
      ? ROLE_TO_DISCIPLINE[selectedRole]
      : "sre";
    const experienceLevel: ExperienceLevel = selectedRole === "new-to-dt" ? "new" : "experienced";

    setSaving(true);
    try {
      await onComplete({
        startingDiscipline,
        disciplines: createDefaultDisciplines(),
        topicXP: {},
        completedMissions: [],
        streakDays: 0,
        lastActiveDate: "",
        badges: [],
        selectedAreas: [],
        topicTrackPriority: topicPriority,
        experienceLevel,
        selectedRole: selectedRole ?? undefined,
        selectedSubNeed: selectedGap ?? undefined,
        startingCircuit: startingCircuitId,
      });
      navigate("/");
    } catch (err: unknown) {
      console.error("Failed to save user state:", err);
      setSaving(false);
    }
  }

  const cardBase: React.CSSProperties = {
    padding: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    textAlign: "center",
  };

  function cardStyle(isSelected: boolean): React.CSSProperties {
    return {
      ...cardBase,
      border: isSelected
        ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
        : "1px solid var(--dt-colors-border-neutral-default)",
      background: isSelected
        ? "var(--dt-colors-background-container-neutral-default)"
        : "transparent",
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
      style={{ minHeight: "100vh", padding: "48px 24px" }}
    >
      <Flex
        flexDirection="column"
        gap={32}
        style={{ maxWidth: "640px", width: "100%" }}
      >
        {step >= 1 && <StepIndicator currentStep={step} />}

        {/* Screen 1 — Welcome (pre-step) */}
        {step === 0 && (
          <Flex flexDirection="column" alignItems="center" gap={24}>
            <Heading level={1}>Mission Control</Heading>
            <Text textStyle="base" style={{ textAlign: "center", opacity: 0.6 }}>
              Train Here. Perform Everywhere.
            </Text>
            <div style={{
              marginTop: "8px",
              padding: "20px 32px",
              borderRadius: "8px",
              background: "var(--dt-colors-background-container-neutral-subdued)",
              textAlign: "center",
            }}>
              <Text textStyle="base" style={{ fontSize: "20px", fontWeight: 600 }}>
                {fullName}
              </Text>
            </div>
            <Text textStyle="small" style={{ opacity: 0.6, textAlign: "center" }}>
              Your seat on the grid is ready.
            </Text>
            <Button variant="emphasized" onClick={() => setStep(1)}>
              Enter the Briefing Room &rarr;
            </Button>
          </Flex>
        )}

        {/* Screen 2 — Role picker (step 1 of 4) */}
        {step === 1 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What best describes your role?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                This shapes your starting missions and recommended path.
              </Text>
            </Flex>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {ROLE_OPTIONS.map((role) => {
                const isSelected = selectedRole === role.id;
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedGap(null);
                    }}
                    style={cardStyle(isSelected)}
                    onMouseEnter={(e) => handleHover(e, isSelected, true)}
                    onMouseLeave={(e) => handleHover(e, isSelected, false)}
                  >
                    <IconComponent size="small" />
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 400, lineHeight: "1.3" }}>
                      {role.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(0)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedRole === null}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Screen 3 — Biggest gap (step 2 of 4) */}
        {step === 2 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What&apos;s your biggest gap right now?</Heading>
            </Flex>

            <Flex flexDirection="column" gap={12}>
              {GAP_OPTIONS.map((gap) => {
                const isSelected = selectedGap === gap.id;
                return (
                  <div
                    key={gap.id}
                    onClick={() => setSelectedGap(gap.id)}
                    style={{
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
                    }}
                    onMouseEnter={(e) => handleHover(e, isSelected, true)}
                    onMouseLeave={(e) => handleHover(e, isSelected, false)}
                  >
                    <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>
                      {gap.label}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>
                      {gap.subtext}
                    </div>
                  </div>
                );
              })}
            </Flex>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedGap === null}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Screen 4 — Starting path (step 3 of 4) */}
        {step === 3 && startingCircuit && (
          <Flex flexDirection="column" gap={24}>
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
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button variant="emphasized" onClick={() => {
                void handleFinish();
              }}>
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
