import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import {
  HostsIcon,
  WarningIcon,
  AiIcon,
  AnalyticsIcon,
  TracesIcon,
  BarChartIcon,
  LogsIcon,
  ContainerIcon,
  HttpIcon,
  GridIcon,
  ServicesIcon,
  SmartscapeIcon,
  DocumentIcon,
  ServiceLevelObjectivesIcon,
  SettingIcon,
  AutomationEngineIcon,
  ApplicationSecurityIcon,
  EventIcon,
  type SvgIconProps,
} from "@dynatrace/strato-icons";
import type { Mission } from "../types/mission.types";
import type { TopicId } from "../types/UserState";

const TOPIC_ICON_MAP: Record<TopicId, React.ComponentType<SvgIconProps>> = {
  infrastructure: HostsIcon,
  problems: WarningIcon,
  "dt-intelligence": AiIcon,
  dql: AnalyticsIcon,
  traces: TracesIcon,
  metrics: BarChartIcon,
  logs: LogsIcon,
  kubernetes: ContainerIcon,
  synthetics: HttpIcon,
  dashboards: GridIcon,
  services: ServicesIcon,
  smartscape: SmartscapeIcon,
  notebooks: DocumentIcon,
  slo: ServiceLevelObjectivesIcon,
  settings: SettingIcon,
  automation: AutomationEngineIcon,
  security: ApplicationSecurityIcon,
  bizevents: EventIcon,
};

function getDifficultyColor(
  difficulty: Mission["difficulty"]
): "success" | "warning" | "critical" {
  switch (difficulty) {
    case "rookie":
      return "success";
    case "operator":
      return "warning";
    case "elite":
    case "legend":
      return "critical";
  }
}

function formatMinutes(seconds: number): string {
  return `~${Math.round(seconds / 60)} min`;
}

interface MissionCardProps {
  mission: Mission;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisiteNames?: string[];
}

export const MissionCard = ({
  mission,
  isUnlocked,
  isCompleted,
  prerequisiteNames,
}: MissionCardProps) => {
  const navigate = useNavigate();
  const hasUnmetPrereqs = !isUnlocked && prerequisiteNames && prerequisiteNames.length > 0;

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        background: "var(--dt-colors-background-container-neutral-subdued)",
        border: "1px solid var(--dt-colors-border-neutral-disabled)",
        opacity: hasUnmetPrereqs ? 0.85 : 1,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text style={{ fontWeight: 600 }}>{mission.title}</Text>
        <Chip
          color={getDifficultyColor(mission.difficulty)}
          variant="emphasized"
        >
          {mission.difficulty.toUpperCase()}
        </Chip>
      </Flex>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {mission.topics.map((topic) => {
          const IconComponent = TOPIC_ICON_MAP[topic as TopicId];
          if (!IconComponent) return null;
          return (
            <span
              key={topic}
              style={{
                display: "flex",
                color: "var(--dt-colors-text-neutral-subdued)",
              }}
            >
              <IconComponent size="small" />
            </span>
          );
        })}
      </div>
      <Text textStyle="small" style={{ opacity: 0.7 }}>
        {mission.description}
      </Text>
      <Flex justifyContent="space-between" alignItems="center">
        {isCompleted ? (
          <Flex gap={8} alignItems="center">
            <Chip color="success" variant="emphasized">
              Completed
            </Chip>
            <Button
              variant="default"
              onClick={() => navigate(`/missions/${mission.id}`)}
            >
              Replay
            </Button>
          </Flex>
        ) : (
          <Button
            variant="emphasized"
            onClick={() => navigate(`/missions/${mission.id}`)}
          >
            Start Mission
          </Button>
        )}
        <Text textStyle="small" style={{ opacity: 0.6 }}>
          {formatMinutes(mission.timerSeconds)}
        </Text>
      </Flex>
    </div>
  );
};
