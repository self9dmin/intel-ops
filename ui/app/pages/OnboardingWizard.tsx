import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
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
}

const ROLE_OPTIONS: RoleOption[] = [
  { id: "incident-responder", label: "I respond to incidents and outages" },
  { id: "platform-engineer", label: "I manage infrastructure and platforms" },
  { id: "developer", label: "I build and ship software" },
  { id: "secops", label: "I work in security" },
  { id: "it-ops", label: "I manage or configure Dynatrace" },
  { id: "business-analyst", label: "I analyze data and report on it" },
  { id: "ai-engineer", label: "I work with AI systems" },
  { id: "new-to-dt", label: "I'm new to Dynatrace" },
];

const SUB_NEEDS: Record<string, string[]> = {
  "incident-responder": [
    "I need to quickly identify root cause during an outage",
    "I want to monitor SLOs and ensure we hit reliability targets",
    "I need to set up alerts before incidents impact users",
    "I want to analyze past incidents to reduce MTTR",
  ],
  "platform-engineer": [
    "I need to monitor Kubernetes clusters and cloud resources",
    "I want to optimize resource usage and reduce cloud costs",
    "I need to handle traffic spikes and scaling issues",
    "I want to troubleshoot pod failures and network issues",
  ],
  developer: [
    "I need to trace distributed transactions and find latency",
    "I want to debug code-level issues causing errors or slowdowns",
    "I need to understand how my deployments affect performance",
    "I want to monitor third-party API dependencies",
  ],
  secops: [
    "I need to identify and prioritize application vulnerabilities",
    "I want to monitor for real-time threats and attacks",
    "I need to ensure compliance and reduce attack surface",
    "I want to integrate security insights into my workflows",
  ],
  "it-ops": [
    "I need to configure monitoring for new apps and services",
    "I want to manage user roles and access control",
    "I need to set up management zones for different teams",
    "I want to integrate Dynatrace with other tools",
  ],
  "business-analyst": [
    "I need to track how performance impacts business KPIs",
    "I want to analyze user sessions and customer journeys",
    "I need to measure the impact of new feature releases",
    "I want to monitor conversion rates and digital experience",
  ],
  "ai-engineer": [
    "I need to use Davis AI to detect anomalies and predict issues",
    "I want to integrate Dynatrace data into custom AI/ML models",
    "I need to automate responses to detected problems",
    "I want to experiment with custom metrics and the Dynatrace API",
  ],
  "new-to-dt": [
    "I need to understand how Dynatrace maps my environment",
    "I want to set up basic monitoring and learn the platform",
    "I need to explore dashboards and key metrics",
    "I want to learn Dynatrace for my specific role",
  ],
};

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

const FALLBACK_ROLES = new Set(["secops", "ai-engineer"]);

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
  const [selectedSubNeed, setSelectedSubNeed] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const displayEmail = currentUser.email ?? "";

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

  const firstMission = circuitMissions[0] ?? null;

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

  const isFallbackRole = selectedRole !== null && FALLBACK_ROLES.has(selectedRole);

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
        selectedSubNeed: selectedSubNeed ?? undefined,
        startingCircuit: startingCircuitId,
      });
      if (firstMission) {
        navigate(`/mission/${firstMission.id}`);
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      console.error("Failed to save user state:", err);
      setSaving(false);
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

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <Flex flexDirection="column" alignItems="center" gap={24}>
            <Heading level={1}>Intel Ops</Heading>
            <Text textStyle="base" style={{ textAlign: "center", opacity: 0.7, maxWidth: "480px" }}>
              Structured Dynatrace training, mission by mission. Work through real scenarios against
              a live environment and build skills that matter on the job.
            </Text>
            {displayEmail && (
              <Surface>
                <Flex padding={16} justifyContent="center">
                  <Text textStyle="small">
                    Signed in as <strong>{currentUser.name ?? displayEmail}</strong>
                    {currentUser.name && displayEmail ? ` (${displayEmail})` : ""}
                  </Text>
                </Flex>
              </Surface>
            )}
            <Button variant="emphasized" onClick={() => setStep(1)}>
              Let&apos;s get started &rarr;
            </Button>
          </Flex>
        )}

        {/* Step 1 — Role selection */}
        {step === 1 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What best describes you?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                Pick the one that fits best — this shapes your starting missions.
              </Text>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {ROLE_OPTIONS.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedSubNeed(null);
                    }}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: isSelected
                        ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                        : "1px solid var(--dt-colors-border-neutral-default)",
                      background: isSelected
                        ? "var(--dt-colors-background-container-neutral-default)"
                        : "transparent",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 400 }}>
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

        {/* Step 2 — Sub-need selection */}
        {step === 2 && selectedRole && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What do you need most?</Heading>
            </Flex>

            <Flex flexDirection="column" gap={12}>
              {(SUB_NEEDS[selectedRole] ?? []).map((need) => {
                const isSelected = selectedSubNeed === need;
                return (
                  <div
                    key={need}
                    onClick={() => setSelectedSubNeed(need)}
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
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>
                      {need}
                    </div>
                  </div>
                );
              })}
            </Flex>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedSubNeed === null}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 3 — Starting circuit */}
        {step === 3 && startingCircuit && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Your starting path, {firstName}</Heading>
            </Flex>

            <Surface>
              <Flex flexDirection="column" padding={20} gap={12}>
                <Heading level={4}>{startingCircuit.name}</Heading>
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

                {isFallbackRole && (
                  <Text textStyle="small" style={{ opacity: 0.6, fontStyle: "italic", marginTop: "4px" }}>
                    Your dedicated circuit is coming soon. We&apos;ve started you on the best available path in the meantime.
                  </Text>
                )}
              </Flex>
            </Surface>

            <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
              You can explore all missions freely &mdash; this is just your starting point.
            </Text>

            {operatorReadiness && (
              <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
                Everyone starts with <strong>{operatorReadiness.name}</strong> &mdash; 3 short missions
                that give you the foundation every Dynatrace user needs.
              </Text>
            )}

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button variant="emphasized" onClick={() => setStep(4)}>
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 4 — First mission */}
        {step === 4 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Your first mission</Heading>
            </Flex>

            {firstMission ? (
              <Surface>
                <Flex flexDirection="column" padding={20} gap={12}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading level={4}>{firstMission.title}</Heading>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "var(--dt-colors-background-container-neutral-subdued)",
                        color: "var(--dt-colors-text-neutral-subdued)",
                      }}
                    >
                      {firstMission.difficulty}
                    </span>
                  </Flex>
                  <Text textStyle="small" style={{ opacity: 0.7 }}>
                    {firstMission.description}
                  </Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                    <span style={{ fontSize: "12px", color: "var(--dt-colors-text-neutral-subdued)" }}>
                      {Math.ceil(firstMission.timerSeconds / 60)} min
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                    {firstMission.topics.map((topic) => (
                      <span
                        key={topic}
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "var(--dt-colors-background-container-neutral-subdued)",
                          color: "var(--dt-colors-text-neutral-subdued)",
                        }}
                      >
                        {TOPIC_META[topic as TopicId]?.label ?? topic}
                      </span>
                    ))}
                  </div>
                </Flex>
              </Surface>
            ) : (
              <Text textStyle="base" style={{ textAlign: "center", opacity: 0.7 }}>
                No missions available yet. Head to the missions board to explore.
              </Text>
            )}

            <Text textStyle="small" style={{ textAlign: "center", opacity: 0.6 }}>
              You&apos;ll need the Dynatrace Playground &mdash; open it at{" "}
              <a
                href="https://playground.apps.dynatrace.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--dt-colors-charts-categorical-default-12, #1496ff)" }}
              >
                playground.apps.dynatrace.com
              </a>
            </Text>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(3)}>Back</Button>
              {saving ? (
                <ProgressCircle />
              ) : (
                <Button variant="emphasized" onClick={() => void handleFinish()}>
                  {firstMission ? "Launch Mission \u2192" : "Go to missions \u2192"}
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
