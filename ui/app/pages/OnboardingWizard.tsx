import React, { useState } from "react";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Container } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import type { Discipline } from "../types/UserState";

interface OnboardingWizardProps {
  onComplete: (startingDiscipline: Discipline) => Promise<void>;
}

interface DisciplineOption {
  id: Discipline;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
}

const DISCIPLINES: DisciplineOption[] = [
  {
    id: "sre",
    icon: "\u{1F6E1}\uFE0F",
    title: "SRE",
    description: "You keep systems reliable and respond to incidents",
    bullets: [
      "Track SLOs and error budgets",
      "Investigate silent regressions",
      "Validate deployment safety",
    ],
  },
  {
    id: "developer",
    icon: "\u{1F4BB}",
    title: "Developer",
    description: "You build and deploy services on the platform",
    bullets: [
      "Trace distributed requests end-to-end",
      "Debug latency in service flows",
      "Identify slow queries and bottlenecks",
    ],
  },
  {
    id: "incident-commander",
    icon: "\u{1F6A8}",
    title: "Incident Commander",
    description: "You coordinate response during outages",
    bullets: [
      "Assess blast radius under pressure",
      "Read root cause chains from Davis AI",
      "Make remediation calls in real time",
    ],
  },
  {
    id: "platform-engineer",
    icon: "\u2699\uFE0F",
    title: "Platform Engineer",
    description: "You manage the observability platform itself",
    bullets: [
      "Investigate Kubernetes cluster health",
      "Diagnose pod crash loops and node pressure",
      "Manage infrastructure-level incidents",
    ],
  },
];

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const displayEmail = currentUser.email ?? "";

  const selectedOption = DISCIPLINES.find((d) => d.id === selectedDiscipline);

  async function handleFinish() {
    if (!selectedDiscipline) return;
    setSaving(true);
    try {
      await onComplete(selectedDiscipline);
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
        {step === 0 && (
          <Flex flexDirection="column" alignItems="center" gap={24}>
            <Heading level={1}>Welcome to Intel Ops</Heading>
            <Text textStyle="base" style={{ textAlign: "center", opacity: 0.7 }}>
              Dynatrace observability training, mission by mission.
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
              Get Started
            </Button>
          </Flex>
        )}

        {step === 1 && (
          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" alignItems="center" gap={8}>
              <Heading level={2}>Where do you want to start?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7 }}>
                You&apos;ll earn XP across all disciplines — this just sets your starting focus
              </Text>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {DISCIPLINES.map((discipline) => {
                const isSelected = selectedDiscipline === discipline.id;
                return isSelected ? (
                  <Container
                    key={discipline.id}
                    color="warning"
                    onClick={() => setSelectedDiscipline(discipline.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex flexDirection="column" gap={8} padding={16}>
                      <Text style={{ fontSize: "28px" }}>{discipline.icon}</Text>
                      <Heading level={5}>{discipline.title}</Heading>
                      <Text textStyle="small" style={{ opacity: 0.7 }}>
                        {discipline.description}
                      </Text>
                    </Flex>
                  </Container>
                ) : (
                  <Surface
                    key={discipline.id}
                    onClick={() => setSelectedDiscipline(discipline.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex flexDirection="column" gap={8} padding={16}>
                      <Text style={{ fontSize: "28px" }}>{discipline.icon}</Text>
                      <Heading level={5}>{discipline.title}</Heading>
                      <Text textStyle="small" style={{ opacity: 0.7 }}>
                        {discipline.description}
                      </Text>
                    </Flex>
                  </Surface>
                );
              })}
            </div>

            <Flex justifyContent="center">
              <Button
                variant="emphasized"
                disabled={!selectedDiscipline}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {step === 2 && selectedOption && (
          <Flex flexDirection="column" alignItems="center" gap={24}>
            <Heading level={2}>You&apos;re all set, {firstName}</Heading>
            <Text textStyle="base" style={{ textAlign: "center", opacity: 0.7 }}>
              Starting with <strong>{selectedOption.title}</strong> — here&apos;s what
              you&apos;ll focus on first:
            </Text>

            <Surface>
              <Flex flexDirection="column" padding={20} gap={12}>
                {selectedOption.bullets.map((bullet) => (
                  <Flex key={bullet} gap={8} alignItems="flex-start">
                    <Text style={{ opacity: 0.5 }}>{"\u2022"}</Text>
                    <Text textStyle="base">{bullet}</Text>
                  </Flex>
                ))}
              </Flex>
            </Surface>

            {saving ? (
              <ProgressCircle />
            ) : (
              <Button variant="emphasized" onClick={() => void handleFinish()}>
                Start Training
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
