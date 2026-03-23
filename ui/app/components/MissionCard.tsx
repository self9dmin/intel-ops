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
  UserSessionsIcon,
  GroupIcon,
  type SvgIconProps,
} from "@dynatrace/strato-icons";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { TOPIC_META } from "../types/UserState";
import type { TopicId } from "../types/UserState";
import type { Mission } from "../types/mission.types";

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
  dem: UserSessionsIcon,
  community: GroupIcon,
};

function TopicIcons({ topics }: { topics: string[] }) {
  if (!topics || topics.length === 0) return null;
  const visible = topics.slice(0, 4);
  const overflow = topics.length - 4;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
      {visible.map((topicId) => {
        const IconComponent = TOPIC_ICON_MAP[topicId as TopicId];
        const label = TOPIC_META[topicId as TopicId]?.label ?? topicId;
        if (!IconComponent) return null;
        return (
          <Tooltip key={topicId} text={label}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                background: "var(--dt-colors-background-container-neutral-default)",
                color: "var(--dt-colors-text-neutral-subdued)",
                flexShrink: 0,
              }}
            >
              <IconComponent size="small" style={{ width: 12, height: 12 }} />
            </span>
          </Tooltip>
        );
      })}
      {overflow > 0 && (
        <span style={{ fontSize: "10px", opacity: 0.5, marginLeft: "2px" }}>
          +{overflow}
        </span>
      )}
    </div>
  );
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
        gap: 0,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: "8px" }}>
        <Text style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "8px" }}>{mission.title}</Text>
        <div style={{ flexShrink: 0 }}>
          <Chip
            color={getDifficultyColor(mission.difficulty)}
            variant="emphasized"
          >
            {mission.difficulty.toUpperCase()}
          </Chip>
        </div>
      </Flex>
      <Text textStyle="small" style={{ opacity: 0.7, flex: "1 1 auto", marginBottom: "12px" }}>
        {mission.description}
      </Text>
      <TopicIcons topics={mission.topics ?? []} />
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
