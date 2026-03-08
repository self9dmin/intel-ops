import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import type { Discipline, DisciplineProgress, TopicId, ExperienceLevel } from "../types/UserState";
import { RESPONSIBILITY_AREAS, deriveTopicPriority, createDefaultDisciplines, TOPIC_META } from "../types/UserState";
import { MISSIONS } from "../data/missions";

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
}

interface OnboardingWizardProps {
  onComplete: (partial: OnboardingPartial) => Promise<void>;
}

const EXPERIENCE_OPTIONS: { id: ExperienceLevel; label: string; description: string }[] = [
  { id: "new", label: "Brand new", description: "I've heard of Dynatrace but haven't used it much" },
  { id: "learning", label: "Getting started", description: "I use it occasionally but want to go deeper" },
  { id: "experienced", label: "Already using it", description: "I work in Dynatrace regularly and want to sharpen skills" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3];
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
              background: active
                ? "var(--dt-colors-charts-categorical-default-12, #1496ff)"
                : completed
                  ? "var(--dt-colors-charts-categorical-default-12, #1496ff)"
                  : "var(--dt-colors-background-container-neutral-subdued)",
              color: active || completed ? "#fff" : "var(--dt-colors-text-neutral-subdued)",
              opacity: active || completed ? 1 : 0.5,
              transition: "all 0.2s",
            }}
          >
            {completed ? "✓" : s}
          </div>
        );
      })}
    </div>
  );
}

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const displayEmail = currentUser.email ?? "";

  const topicPriority = useMemo(() => deriveTopicPriority(selectedAreas), [selectedAreas]);

  const recommendedMission = useMemo(() => {
    if (topicPriority.length === 0) return MISSIONS.find((m) => m.prerequisites.length === 0);
    const topTopic = topicPriority[0];
    const match = MISSIONS.find(
      (m) => m.prerequisites.length === 0 && m.topics.includes(topTopic)
    );
    return match ?? MISSIONS.find((m) => m.prerequisites.length === 0);
  }, [topicPriority]);

  function toggleArea(areaId: string) {
    setSelectedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]
    );
  }

  async function handleFinish() {
    const mission = recommendedMission;
    const startingDiscipline: Discipline = (mission?.disciplines[0]?.track as Discipline) ?? "sre";

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
        selectedAreas,
        topicTrackPriority: topicPriority,
        experienceLevel: experienceLevel ?? "new",
      });
      navigate("/");
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
        {/* Step indicator for steps 1-3 */}
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
              Let&apos;s get started →
            </Button>
          </Flex>
        )}

        {/* Step 1 — Responsibility areas */}
        {step === 1 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>What does your Dynatrace world look like?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7, textAlign: "center" }}>
                Select everything you work with — this shapes your recommended missions. You can change focus anytime.
              </Text>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {RESPONSIBILITY_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area.id);
                return (
                  <div
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
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
                    <span style={{ fontSize: "20px" }}>{area.icon}</span>
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 400 }}>{area.label}</span>
                  </div>
                );
              })}
            </div>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(0)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={selectedAreas.length === 0}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 2 — Experience level */}
        {step === 2 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>How familiar are you with Dynatrace?</Heading>
            </Flex>

            <Flex flexDirection="column" gap={12}>
              {EXPERIENCE_OPTIONS.map((opt) => {
                const isSelected = experienceLevel === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExperienceLevel(opt.id)}
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
                    <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>{opt.label}</div>
                    <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>{opt.description}</div>
                  </div>
                );
              })}
            </Flex>

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                variant="emphasized"
                disabled={experienceLevel === null}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Step 3 — First mission */}
        {step === 3 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Here&apos;s where you start, {firstName}</Heading>
            </Flex>

            {recommendedMission ? (
              <Surface>
                <Flex flexDirection="column" padding={20} gap={12}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading level={4}>{recommendedMission.title}</Heading>
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
                      {recommendedMission.difficulty}
                    </span>
                  </Flex>
                  <Text textStyle="small" style={{ opacity: 0.7 }}>
                    {recommendedMission.description}
                  </Text>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                    {recommendedMission.topics.map((topic) => (
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

            <Flex justifyContent="center" gap={12}>
              <Button onClick={() => setStep(2)}>Back</Button>
              {saving ? (
                <ProgressCircle />
              ) : (
                <Button variant="emphasized" onClick={() => void handleFinish()}>
                  {recommendedMission ? "Start this mission →" : "Go to missions →"}
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
