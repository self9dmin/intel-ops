import React, { useState, useEffect, useMemo } from "react";
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
import { TOPIC_META } from "../types/UserState";
import type { TopicId } from "../types/UserState";
import { MISSIONS } from "../data/missions";
import { useUserStateContext } from "../context/UserStateContext";

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

export interface SidebarFilters {
  status: "not_started" | "completed" | null;
  difficulty: "rookie" | "operator" | "elite" | null;

  topic: TopicId | null;
}

interface AppSidebarProps {
  activeTab: "missions" | "progress" | "leaderboard";
  onFilterChange: (filters: SidebarFilters) => void;
  onSwitchToMissions: () => void;
}

export const AppSidebar = ({ activeTab, onFilterChange, onSwitchToMissions }: AppSidebarProps) => {
  const { userState } = useUserStateContext();
  const initialDifficulty = userState?.experienceLevel === "new" ? "rookie" as const : null;
  const [filters, setFilters] = useState<SidebarFilters>({
    status: null,
    difficulty: initialDifficulty,
    topic: null,
  });

  // Push initial filter to parent on mount (handles experience-based default)
  useEffect(() => {
    if (initialDifficulty) {
      onFilterChange(filters);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [statusOpen, setStatusOpen] = useState(true);

  const [topicOpen, setTopicOpen] = useState(true);

  const isMissions = activeTab === "missions";

  const update = (key: keyof SidebarFilters, value: string | null) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const SIDEBAR_DOMAIN_GROUPS: { label: string; topics: TopicId[] }[] = [
    { label: "SEE", topics: ["infrastructure", "kubernetes", "metrics"] },
    { label: "INVESTIGATE", topics: ["problems", "logs", "traces", "dql"] },
    { label: "UNDERSTAND", topics: ["services", "dashboards", "synthetics", "slo"] },
    { label: "ACT", topics: ["dt-intelligence", "automation", "settings"] },
    { label: "EXPLORE", topics: ["community", "bizevents", "dem", "security", "notebooks", "smartscape"] },
  ];

  const statusCounts = useMemo(() => {
    const activeMissions = MISSIONS.filter((mission) => mission.status !== "retired");
    const total = activeMissions.length;
    const completedMissions = userState?.completedMissions ?? [];
    const completedSet = new Set(completedMissions);
    const completed = activeMissions.filter((m) => completedSet.has(m.id)).length;
    return { total, completed, notStarted: total - completed };
  }, [userState?.completedMissions]);

  const statusOptions: { value: "not_started" | "completed" | null; label: string; count: number }[] = [
    { value: null, label: "All", count: statusCounts.total },
    { value: "not_started", label: "Not Started", count: statusCounts.notStarted },
    { value: "completed", label: "Completed", count: statusCounts.completed },
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
              onClick={() => setStatusOpen((v) => !v)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--dt-colors-text-neutral-subdued)",
                marginBottom: "6px",
              }}
            >
              Status
              <span
                style={{
                  display: "inline-block",
                  transition: "none",
                  transform: statusOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  fontSize: "10px",
                  lineHeight: 1,
                }}
              >
                ▾
              </span>
            </div>
            {statusOpen && statusOptions.map((opt) => {
              const isActive = filters.status === opt.value;
              return (
                <div
                  key={opt.value ?? "__all__"}
                  onClick={() => update("status", opt.value)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  <span
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      padding: "1px 7px",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "inherit",
                    }}
                  >
                    {opt.count}
                  </span>
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
              onClick={() => setTopicOpen((v) => !v)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--dt-colors-text-neutral-subdued)",
                marginBottom: "6px",
              }}
            >
              Topic Track
              <span
                style={{
                  display: "inline-block",
                  transition: "none",
                  transform: topicOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  fontSize: "10px",
                  lineHeight: 1,
                }}
              >
                ▾
              </span>
            </div>

            {topicOpen && <>
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

            {/* Grouped active topics */}
            {SIDEBAR_DOMAIN_GROUPS.map((group) => {
              const groupActiveTopics = group.topics.filter(
                (t) => TOPIC_META[t]?.active === true
              );
              const groupInactiveTopics = group.topics.filter(
                (t) => TOPIC_META[t]?.active === false
              );
              if (groupActiveTopics.length === 0 && groupInactiveTopics.length === 0) return null;
              return (
                <React.Fragment key={group.label}>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.4,
                      marginTop: "12px",
                      marginBottom: "4px",
                      paddingLeft: "8px",
                    }}
                  >
                    {group.label}
                  </div>
                  {groupActiveTopics.map((topicId) => {
                    const topic = TOPIC_META[topicId];
                    const isActive = filters.topic === topicId;
                    const IconComponent = TOPIC_ICON_MAP[topicId];
                    return (
                      <div
                        key={topicId}
                        onClick={() => update("topic", isActive ? null : topicId)}
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
                  {groupInactiveTopics.map((topicId) => {
                    const topic = TOPIC_META[topicId];
                    const IconComponent = TOPIC_ICON_MAP[topicId];
                    return (
                      <div
                        key={topicId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          color: "var(--dt-colors-text-neutral-subdued)",
                          opacity: 0.4,
                          cursor: "default",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {IconComponent && (
                          <span style={{ display: "flex", flexShrink: 0 }}>
                            <IconComponent size="small" style={{ width: 14, height: 14 }} />
                          </span>
                        )}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{topic.label}</span>
                        <span style={{ fontSize: "9px", opacity: 0.7, flexShrink: 0 }}>Soon</span>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
            </>}
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
