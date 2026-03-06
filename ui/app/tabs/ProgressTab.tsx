import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Heading } from "@dynatrace/strato-components/typography";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
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
  type SvgIconProps,
} from "@dynatrace/strato-icons";
import { MISSIONS } from "../data/missions";
import { ALL_BADGES } from "../data/badges";
import { useUserStateContext } from "../context/UserStateContext";
import type { StoredScore } from "../context/LeaderboardContext";
import { SkeletonRows } from "../components/SkeletonRows";
import { ErrorRetry } from "../components/ErrorRetry";
import { EmptyState } from "../components/EmptyState";
import type { Discipline } from "../types/UserState";
import type { TopicId } from "../types/UserState";
import { XP_THRESHOLDS, DISCIPLINE_META, TOPIC_META } from "../types/UserState";

// --- Icon lookup ---

const TOPIC_ICON_MAP: Record<TopicId, React.ComponentType<SvgIconProps>> = {
  dql: AnalyticsIcon,
  traces: TracesIcon,
  davis: AiIcon,
  metrics: BarChartIcon,
  logs: LogsIcon,
  smartscape: SmartscapeIcon,
  kubernetes: ContainerIcon,
  synthetics: HttpIcon,
  slo: ServiceLevelObjectivesIcon,
  automation: AutomationEngineIcon,
  security: ApplicationSecurityIcon,
  bizevents: EventIcon,
};

// --- Skills Tab ---

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
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
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
            background: "rgba(255,255,255,0.1)",
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
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
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

function SkillsTab({ onNavigateToMissions }: { onNavigateToMissions: (params: Record<string, string>) => void }) {
  const { userState } = useUserStateContext();

  const missionCountByTopic = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MISSIONS) {
      for (const t of m.topics ?? []) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return counts;
  }, []);

  const missionCountByDiscipline = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MISSIONS) {
      for (const d of m.disciplines) {
        counts[d.track] = (counts[d.track] ?? 0) + 1;
      }
    }
    return counts;
  }, []);

  if (!userState) return null;

  const disciplines: Discipline[] = [
    "sre",
    "developer",
    "incident-commander",
    "platform-engineer",
  ];
  const topicXP = userState.topicXP ?? {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Heading level={5}>Discipline Tracks</Heading>
      <div>
        {disciplines.map((disc) => {
          const meta = DISCIPLINE_META[disc];
          const progress = userState.disciplines[disc];
          return (
            <SkillRow
              key={disc}
              label={meta.label}
              color={meta.color}
              xp={progress.xp}
              thresholds={XP_THRESHOLDS}
              missionCount={missionCountByDiscipline[disc] ?? 0}
              onClickRow={() => onNavigateToMissions({ discipline: disc })}
            />
          );
        })}
      </div>

      <Heading level={5}>Topic Tracks</Heading>
      <div>
        {(Object.keys(TOPIC_META) as TopicId[]).map((topicId) => {
          const meta = TOPIC_META[topicId];
          return (
            <SkillRow
              key={topicId}
              icon={TOPIC_ICON_MAP[topicId]}
              label={meta.label}
              color="#888"
              xp={topicXP[topicId] ?? 0}
              thresholds={XP_THRESHOLDS}
              missionCount={missionCountByTopic[topicId] ?? 0}
              onClickRow={() => onNavigateToMissions({ topic: topicId })}
            />
          );
        })}
      </div>
    </div>
  );
}

// --- History Tab ---

interface HistoryRow {
  mission: string;
  difficulty: string;
  score: number;
  hintsUsed: number;
  date: string;
}

const historyColumns: DataTableColumnDef<HistoryRow>[] = [
  { id: "mission", accessor: "mission", header: "Mission" },
  { id: "difficulty", accessor: "difficulty", header: "Difficulty" },
  { id: "score", accessor: "score", header: "Score" },
  { id: "hintsUsed", accessor: "hintsUsed", header: "Hints Used" },
  { id: "date", accessor: "date", header: "Date" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMissionName(key: string): string {
  const mission = MISSIONS.find((m) => m.id === key);
  if (mission) return mission.title;
  return key;
}

function HistoryTab() {
  const [history, setHistory] = useState<StoredScore[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const currentUser = getCurrentUserDetails();

  useEffect(() => {
    if (historyLoaded) return;
    setHistoryLoading(true);
    setHistoryError(null);

    let cancelled = false;

    async function fetchHistory() {
      try {
        const list = await documentsClient.listDocuments({
          filter: "type == 'intelops-score'",
          pageSize: 100,
        });

        const results: StoredScore[] = [];
        for (const doc of list.documents) {
          try {
            const content = await documentsClient.downloadDocumentContent({
              id: doc.id,
            });
            const text: string = await content.get("text");
            const parsed = JSON.parse(text) as StoredScore;
            if (parsed.userId === currentUser.id) {
              results.push(parsed);
            }
          } catch (docError: unknown) {
            console.error(`Failed to fetch document ${doc.id}:`, docError);
          }
        }

        if (!cancelled) {
          setHistory(results);
          setHistoryLoaded(true);
        }
      } catch (fetchError: unknown) {
        console.error("Failed to fetch history:", fetchError);
        if (!cancelled) {
          setHistoryError("Failed to load history");
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    void fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [historyLoaded, currentUser.id]);

  const retryHistory = () => {
    setHistoryLoaded(false);
  };

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const historyData: HistoryRow[] = sortedHistory.map((s) => ({
    mission: formatMissionName(s.missionId ?? s.mission),
    difficulty: s.difficulty,
    score: Math.round(s.totalScore),
    hintsUsed: s.hintsUsed ?? 0,
    date: formatDate(s.completedAt),
  }));

  if (historyLoading) return <SkeletonRows rows={5} />;
  if (historyError) return <ErrorRetry message={historyError} onRetry={retryHistory} />;
  if (historyData.length === 0) {
    return <EmptyState message="You haven't completed any missions yet" />;
  }

  return <DataTable columns={historyColumns} data={historyData} />;
}

// --- Achievements Tab ---

function AchievementsTab() {
  const { userState } = useUserStateContext();
  if (!userState) return null;

  const earnedBadges = new Set(userState.badges);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "8px",
      }}
    >
      {ALL_BADGES.map((badge) => {
        const isEarned = earnedBadges.has(badge.id);
        return (
          <div
            key={badge.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.04)",
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
        );
      })}
    </div>
  );
}

function getBadgeEmoji(icon: string): string {
  const map: Record<string, string> = {
    rocket: "\u{1F680}",
    flame: "\u{1F525}",
    lightning: "\u26A1",
    graduation: "\u{1F393}",
    star: "\u2B50",
    shield: "\u{1F6E1}\uFE0F",
  };
  return map[icon] ?? "\u{1F3C6}";
}

// --- Main ProgressTab ---

const TAB_IDS = ["skills", "history", "achievements"] as const;
type SubTabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<SubTabId, string> = {
  skills: "Skills",
  history: "History",
  achievements: "Achievements",
};

interface ProgressTabProps {
  onSwitchTab: (tab: "missions", params?: Record<string, string>) => void;
}

export const ProgressTab = ({ onSwitchTab }: ProgressTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initSubTab = (searchParams.get("subtab") as SubTabId) || "skills";
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>(
    TAB_IDS.includes(initSubTab) ? initSubTab : "skills"
  );

  const handleSubTabChange = (tab: SubTabId) => {
    setActiveSubTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("subtab", tab);
    setSearchParams(newParams, { replace: true });
  };

  const handleNavigateToMissions = (params: Record<string, string>) => {
    onSwitchTab("missions", params);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Heading level={4}>Progress</Heading>

      {/* Sub-tab bar */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {TAB_IDS.map((tabId) => (
          <button
            key={tabId}
            onClick={() => handleSubTabChange(tabId)}
            style={{
              padding: "8px 16px",
              border: "none",
              background: activeSubTab === tabId ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeSubTab === tabId ? "var(--dt-colors-text-primary-default, #fff)" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeSubTab === tabId ? 600 : 400,
              borderBottom: activeSubTab === tabId ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)" : "2px solid transparent",
              borderRadius: "4px 4px 0 0",
            }}
          >
            {TAB_LABELS[tabId]}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div>
        {activeSubTab === "skills" && <SkillsTab onNavigateToMissions={handleNavigateToMissions} />}
        {activeSubTab === "history" && <HistoryTab />}
        {activeSubTab === "achievements" && <AchievementsTab />}
      </div>
    </div>
  );
};
