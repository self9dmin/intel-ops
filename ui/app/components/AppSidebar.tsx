import React, { useState } from "react";
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
  RealUserMonitoringIcon,
  GroupIcon,
  type SvgIconProps,
} from "@dynatrace/strato-icons";
import { TOPIC_META_ORDERED } from "../types/UserState";
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
  dem: RealUserMonitoringIcon,
  community: GroupIcon,
};

export interface SidebarFilters {
  status: "not_started" | "completed" | null;
  topic: TopicId | null;
}

interface AppSidebarProps {
  activeTab: "missions" | "progress" | "leaderboard";
  onFilterChange: (filters: SidebarFilters) => void;
  onSwitchToMissions: () => void;
}

export const AppSidebar = ({ activeTab, onFilterChange, onSwitchToMissions }: AppSidebarProps) => {
  const [filters, setFilters] = useState<SidebarFilters>({
    status: null,
    topic: null,
  });

  const isMissions = activeTab === "missions";

  const update = (key: keyof SidebarFilters, value: string | null) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const activeTopics = TOPIC_META_ORDERED.filter((t) => t.active);
  const comingSoonTopics = TOPIC_META_ORDERED.filter((t) => !t.active);

  const statusOptions: { value: "not_started" | "completed" | null; label: string }[] = [
    { value: null, label: "All" },
    { value: "not_started", label: "Not Started" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div
      style={{
        width: "180px",
        minWidth: "180px",
        maxWidth: "180px",
        flexShrink: 0,
        borderRight: "1px solid var(--dt-colors-border-neutral-default)",
        padding: "16px 12px",
        overflowY: "auto",
        overflow: "hidden",
        fontSize: "12px",
      }}
    >
      {isMissions ? (
        <>
          {/* Status section */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--dt-colors-text-neutral-subdued)",
                marginBottom: "6px",
              }}
            >
              Status
            </div>
            {statusOptions.map((opt) => {
              const isActive = filters.status === opt.value;
              return (
                <div
                  key={opt.value ?? "__all__"}
                  onClick={() => update("status", opt.value)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    background: isActive
                      ? "var(--dt-colors-background-container-neutral-default)"
                      : "transparent",
                    color: isActive
                      ? "var(--dt-colors-text-primary-default, #fff)"
                      : "var(--dt-colors-text-neutral-subdued)",
                    fontWeight: isActive ? 600 : 400,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "var(--dt-colors-border-neutral-default)",
              margin: "8px 0 16px 0",
            }}
          />

          {/* Topic Track section */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--dt-colors-text-neutral-subdued)",
                marginBottom: "6px",
              }}
            >
              Topic Track
            </div>

            {/* All Topics */}
            <div
              onClick={() => update("topic", null)}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "4px",
                background: filters.topic === null
                  ? "var(--dt-colors-background-container-neutral-default)"
                  : "transparent",
                color: filters.topic === null
                  ? "var(--dt-colors-text-primary-default, #fff)"
                  : "var(--dt-colors-text-neutral-subdued)",
                fontWeight: filters.topic === null ? 600 : 400,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (filters.topic !== null) {
                  e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                }
              }}
              onMouseLeave={(e) => {
                if (filters.topic !== null) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              All Topics
            </div>

            {/* Active topics */}
            {activeTopics.map((topic) => {
              const isActive = filters.topic === topic.id;
              const IconComponent = TOPIC_ICON_MAP[topic.id as TopicId];
              return (
                <div
                  key={topic.id}
                  onClick={() => update("topic", isActive ? null : topic.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    background: isActive
                      ? "var(--dt-colors-background-container-neutral-default)"
                      : "transparent",
                    color: isActive
                      ? "var(--dt-colors-text-primary-default, #fff)"
                      : "var(--dt-colors-text-neutral-subdued)",
                    fontWeight: isActive ? 600 : 400,
                    transition: "background 0.15s",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {IconComponent && (
                    <span style={{ display: "flex", flexShrink: 0, color: "var(--dt-colors-text-neutral-subdued)" }}>
                      <IconComponent size="small" style={{ width: 14, height: 14 }} />
                    </span>
                  )}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{topic.label}</span>
                </div>
              );
            })}

            {/* Coming Soon sublabel */}
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--dt-colors-text-neutral-subdued)",
                opacity: 0.5,
                margin: "10px 0 4px 8px",
              }}
            >
              Coming Soon
            </div>

            {/* Inactive topics */}
            {comingSoonTopics.map((topic) => {
              const IconComponent = TOPIC_ICON_MAP[topic.id as TopicId];
              return (
                <div
                  key={topic.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    color: "var(--dt-colors-text-neutral-subdued)",
                    opacity: 0.38,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {IconComponent && (
                    <span style={{ display: "flex", flexShrink: 0, color: "var(--dt-colors-text-neutral-subdued)" }}>
                      <IconComponent size="small" style={{ width: 14, height: 14 }} />
                    </span>
                  )}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{topic.label}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <button
          onClick={onSwitchToMissions}
          style={{
            margin: "16px 0",
            padding: "8px 12px",
            background: "var(--dt-colors-background-container-neutral-subdued)",
            border: "1px solid var(--dt-colors-border-neutral-default)",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
            color: "var(--dt-colors-text-neutral-subdued)",
            width: "100%",
          }}
        >
          ← Back to Missions
        </button>
      )}
    </div>
  );
};
