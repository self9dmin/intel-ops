import React, { useState } from "react";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Container } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import type { UserRole } from "../types/UserState";

interface OnboardingWizardProps {
  onComplete: (role: UserRole) => Promise<void>;
}

interface RoleOption {
  id: UserRole;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
}

const ROLES: RoleOption[] = [
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
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserDetails();
  const firstName =
    currentUser.name?.split(" ")[0] ?? currentUser.email?.split("@")[0] ?? "Operator";
  const displayEmail = currentUser.email ?? "";

  const selectedRoleOption = ROLES.find((r) => r.id === selectedRole);

  async function handleFinish() {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await onComplete(selectedRole);
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
              <Heading level={2}>What&apos;s your primary role?</Heading>
              <Text textStyle="small" style={{ opacity: 0.7 }}>
                This helps us recommend the right missions for you.
              </Text>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return isSelected ? (
                  <Container
                    key={role.id}
                    color="warning"
                    onClick={() => setSelectedRole(role.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex flexDirection="column" gap={8} padding={16}>
                      <Text style={{ fontSize: "28px" }}>{role.icon}</Text>
                      <Heading level={5}>{role.title}</Heading>
                      <Text textStyle="small" style={{ opacity: 0.7 }}>
                        {role.description}
                      </Text>
                    </Flex>
                  </Container>
                ) : (
                  <Surface
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex flexDirection="column" gap={8} padding={16}>
                      <Text style={{ fontSize: "28px" }}>{role.icon}</Text>
                      <Heading level={5}>{role.title}</Heading>
                      <Text textStyle="small" style={{ opacity: 0.7 }}>
                        {role.description}
                      </Text>
                    </Flex>
                  </Surface>
                );
              })}
            </div>

            <Flex justifyContent="center">
              <Button
                variant="emphasized"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </Flex>
          </Flex>
        )}

        {step === 2 && selectedRoleOption && (
          <Flex flexDirection="column" alignItems="center" gap={24}>
            <Heading level={2}>You&apos;re all set, {firstName}</Heading>
            <Text textStyle="base" style={{ textAlign: "center", opacity: 0.7 }}>
              As a <strong>{selectedRoleOption.title}</strong>, here&apos;s what
              you&apos;ll do:
            </Text>

            <Surface>
              <Flex flexDirection="column" padding={20} gap={12}>
                {selectedRoleOption.bullets.map((bullet) => (
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
