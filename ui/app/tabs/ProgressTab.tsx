import React, { useMemo, useCallback } from "react";
import { Heading } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  AnalyticsIcon,
  TracesIcon,
  AiIcon,
  BarChartIcon,
  LogsIcon,
  SmartscapeIcon,
  ContainerIcon,
  HttpIcon,
  ServiceLevelObjectivesIcon,
  AutomationEngineIcon,
  ApplicationSecurityIcon,
  EventIcon,
  HostsIcon,
  WarningIcon,
  GridIcon,
  ServicesIcon,
  DocumentIcon,
  SettingIcon,
  UserSessionsIcon,
  GroupIcon,
  type SvgIconProps,
} from "@dynatrace/strato-icons";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { MISSIONS } from "../data/missions";
import { ALL_BADGES } from "../data/badges";
import { useUserStateContext } from "../context/UserStateContext";
import type { Discipline } from "../types/UserState";
import type { TopicId } from "../types/UserState";
import { XP_THRESHOLDS, DISCIPLINE_META, TOPIC_META } from "../types/UserState";

// --- Icon lookup ---

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

// --- Skill Row ---

function SkillRow({
  icon,
  label,
  color,
  xp,
  thresholds,
  missionCount,
  onClickRow,
}: {
  icon?: React.ComponentType<SvgIconProps>;
  label: string;
  color: string;
  xp: number;
  thresholds: { xp: number; name: string }[];
  missionCount: number;
  onClickRow: () => void;
}) {
  const levelName =
    thresholds
      .slice()
      .reverse()
      .find((t) => xp >= t.xp)?.name ?? thresholds[0]?.name ?? "—";

  const currentThresholdXP =
    thresholds
      .slice()
      .reverse()
      .find((t) => xp >= t.xp)?.xp ?? 0;

  const next = thresholds.find((t) => xp < t.xp);
  const isMax = !next;
  const progressPercent = isMax
    ? 100
    : ((xp - currentThresholdXP) / (next.xp - currentThresholdXP)) * 100;

  const IconComponent = icon;

  return (
    <div
      onClick={onClickRow}
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr 160px",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid var(--dt-colors-border-neutral-disabled)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {IconComponent && (
          <span style={{ flexShrink: 0, display: "flex", opacity: 0.7 }}>
            <IconComponent size="small" />
          </span>
        )}
        {!IconComponent && (
          <div
            style={{
              width: "4px",
              height: "28px",
              borderRadius: "2px",
              background: color,
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ fontSize: "13px", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "12px", color, fontWeight: 500 }}>{levelName}</span>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            background: "var(--dt-colors-background-container-neutral-default)",
            borderRadius: "4px",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: color,
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: "var(--dt-colors-text-neutral-subdued)" }}>
          {xp} / {isMax ? "MAX" : `${next.xp} XP`}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "var(--dt-colors-charts-categorical-default-12, #1496ff)",
          }}
        >
          {missionCount} missions
        </span>
      </div>
    </div>
  );
}

// --- Badge emoji helper ---

function getBadgeEmoji(icon: string): string {
  const map: Record<string, string> = {
    "lights-out": "\u{1F6A6}",
    "in-the-window": "\u{1F50B}",
    "boost-mode": "\u26A1",
    "in-the-points": "\u{1F3C6}",
    "graduated-q2": "\u23F1\uFE0F",
    "race-winner": "\u{1F3C1}",
    "understeer-proof": "\u{1F3AF}",
    "grand-slam": "\u{1F4A5}",
    "overtake-mode": "\u{1F680}",
  };
  return map[icon] ?? "\u{1F3C6}";
}

// --- CSV Export ---

function buildCSV(
  userState: NonNullable<ReturnType<typeof useUserStateContext>["userState"]>
): string {
  const lines: string[] = [];
  lines.push("Type,Name,XP,Level");

  const disciplines: Discipline[] = ["sre", "developer", "incident-commander", "platform-engineer"];
  for (const disc of disciplines) {
    const meta = DISCIPLINE_META[disc];
    const progress = userState.disciplines[disc];
    const levelName =
      XP_THRESHOLDS.slice()
        .reverse()
        .find((t) => progress.xp >= t.xp)?.name ?? "—";
    lines.push(`Discipline,${meta.label},${progress.xp},${levelName}`);
  }

  const topicXP = userState.topicXP ?? {};
  for (const topicId of Object.keys(TOPIC_META) as TopicId[]) {
    const meta = TOPIC_META[topicId];
    const xp = topicXP[topicId] ?? 0;
    const levelName =
      XP_THRESHOLDS.slice()
        .reverse()
        .find((t) => xp >= t.xp)?.name ?? "—";
    lines.push(`Topic,${meta.label},${xp},${levelName}`);
  }

  return lines.join("\n");
}

// --- Topic domain groups ---

const TOPIC_DOMAIN_GROUPS: { label: string; topics: TopicId[] }[] = [
  { label: "SEE", topics: ["infrastructure", "kubernetes", "metrics"] },
  { label: "INVESTIGATE", topics: ["problems", "logs", "traces", "dql"] },
  { label: "UNDERSTAND", topics: ["services", "dashboards", "synthetics", "slo"] },
  { label: "ACT", topics: ["dt-intelligence", "automation", "settings"] },
  { label: "EXPLORE", topics: ["community", "bizevents", "dem", "security", "notebooks", "smartscape"] },
];

// --- Main ProgressTab ---

interface ProgressTabProps {
  onSwitchTab: (tab: "missions", params?: Record<string, string>) => void;
}

export const ProgressTab = ({ onSwitchTab }: ProgressTabProps) => {
  const { userState, resetUserState } = useUserStateContext();

  const missionCountByTopic = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MISSIONS) {
      for (const t of m.topics ?? []) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return counts;
  }, []);

  const handleExportCSV = useCallback(() => {
    if (!userState) return;
    const csv = buildCSV(userState);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intel-ops-progress.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [userState]);

  const handleNavigateToMissions = useCallback(
    (params: Record<string, string>) => {
      onSwitchTab("missions", params);
    },
    [onSwitchTab]
  );

  if (!userState) return null;

  const topicXP = userState.topicXP ?? {};
  const earnedBadges = new Set(userState.badges);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Heading level={4}>Progress</Heading>
        <Button variant="default" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Achievements */}
      <div>
        <Heading level={5}>Achievements</Heading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {ALL_BADGES.map((badge) => {
            const isEarned = earnedBadges.has(badge.id);
            return (
              <Tooltip
                key={badge.id}
                text={`${badge.name} — ${isEarned ? badge.description : badge.howToEarn}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "var(--dt-colors-background-container-neutral-subdued)",
                    opacity: isEarned ? 1 : 0.35,
                  }}
                >
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>
                    {getBadgeEmoji(badge.icon)}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: isEarned ? 600 : 400 }}>
                    {badge.name}
                  </span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Topic Tracks */}
      <div>
        <Heading level={5}>Topic Tracks</Heading>
        <div style={{ marginTop: "8px" }}>
          {TOPIC_DOMAIN_GROUPS.map((group) => {
            const activeTopics = group.topics.filter(
              (t) => TOPIC_META[t]?.active === true
            );
            const inactiveTopics = group.topics.filter(
              (t) => TOPIC_META[t]?.active === false
            );
            if (activeTopics.length === 0 && inactiveTopics.length === 0) return null;
            return (
              <div key={group.label}>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    opacity: 0.5,
                    marginTop: "16px",
                    marginBottom: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {group.label}
                </div>
                {activeTopics.map((topicId) => {
                  const meta = TOPIC_META[topicId];
                  return (
                    <SkillRow
                      key={topicId}
                      icon={TOPIC_ICON_MAP[topicId]}
                      label={meta.label}
                      color="var(--dt-colors-text-neutral-disabled)"
                      xp={topicXP[topicId] ?? 0}
                      thresholds={XP_THRESHOLDS}
                      missionCount={missionCountByTopic[topicId] ?? 0}
                      onClickRow={() => handleNavigateToMissions({ topic: topicId })}
                    />
                  );
                })}
                {inactiveTopics.map((topicId) => {
                  const meta = TOPIC_META[topicId];
                  const IconComponent = TOPIC_ICON_MAP[topicId];
                  return (
                    <div
                      key={topicId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr 160px",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid var(--dt-colors-border-neutral-disabled)",
                        opacity: 0.35,
                        cursor: "default",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {IconComponent && (
                          <span style={{ flexShrink: 0, display: "flex", opacity: 0.7 }}>
                            <IconComponent size="small" />
                          </span>
                        )}
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{meta.label}</span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "var(--dt-colors-text-neutral-subdued)",
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: "4px",
                            padding: "1px 5px",
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                      <div style={{ padding: "0 16px" }}>
                        <div
                          style={{
                            background: "var(--dt-colors-background-container-neutral-default)",
                            borderRadius: "4px",
                            height: "6px",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "12px", color: "var(--dt-colors-text-neutral-subdued)" }}>
                          —
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dev reset */}
      <div style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
        <Button
          variant="default"
          onClick={() => void resetUserState()}
          style={{ opacity: 0.4, fontSize: "11px" }}
        >
          Reset Onboarding (Dev)
        </Button>
      </div>
    </div>
  );
};
