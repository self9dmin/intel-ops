import React from "react";
import { Flex, Container } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import type { TenantCapabilities } from "../types/UserState";

interface CapabilityDisplay {
  key: keyof Omit<TenantCapabilities, "scannedAt">;
  label: string;
}

const CAPABILITIES: CapabilityDisplay[] = [
  { key: "hasProblems", label: "Problems" },
  { key: "hasLogs", label: "Logs" },
  { key: "hasMetrics", label: "Metrics" },
  { key: "hasTraces", label: "Traces" },
  { key: "hasSLOs", label: "SLOs" },
  { key: "hasKubernetes", label: "Kubernetes" },
  { key: "hasBizevents", label: "Biz Events" },
];

interface TenantCoveragePanelProps {
  capabilities: TenantCapabilities;
}

export const TenantCoveragePanel = ({ capabilities }: TenantCoveragePanelProps) => {
  const hasMissing = CAPABILITIES.some((cap) => !capabilities[cap.key]);

  return (
    <Flex flexDirection="column" gap={12}>
      <Flex gap={8} style={{ flexWrap: "wrap" }}>
        {CAPABILITIES.map((cap) => {
          const available = capabilities[cap.key];
          return (
            <Chip
              key={cap.key}
              color={available ? "success" : "neutral"}
            >
              {available
                ? `${cap.label} \u2713`
                : `${cap.label} \u2014 not detected`}
            </Chip>
          );
        })}
      </Flex>
      {hasMissing && (
        <Container variant="default">
          <Text textStyle="small">
            Missing signals mean some missions won&apos;t be available.
            Configure monitoring to unlock them.
          </Text>
        </Container>
      )}
    </Flex>
  );
};
