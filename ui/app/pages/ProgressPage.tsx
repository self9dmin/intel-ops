import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import {
  Heading,
  Text,
} from "@dynatrace/strato-components/typography";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { Select, SelectOption } from "@dynatrace/strato-components-preview/forms";
import { MISSIONS } from "../data/missions";
import { ALL_BADGES } from "../data/badges";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext, type StoredScore } from "../context/LeaderboardContext";
import { SkeletonRows } from "../components/SkeletonRows";
import { ErrorRetry } from "../components/ErrorRetry";
import { EmptyState } from "../components/EmptyState";
import type { Discipline, DisciplineProgress } from "../types/UserState";
import { XP_THRESHOLDS, DISCIPLINE_META, TOPIC_META } from "../types/UserState";

// --- Skills Tab ---

function getNextThreshold(xp: number): { nextXP: number; nextName: string } | null {
  for (const threshold of XP_THRESHOLDS) {
    if (xp < threshold.xp) {
      return { nextXP: threshold.xp, nextName: threshold.name };
    }
  }
  return null;
}

function SkillRow({
  label,
  color,
  xp,
  thresholds,
  missionCount,
  filterUrl,
}: {
  label: string;
  color: string;
  xp: number;
  thresholds: { xp: number; name: string }[];
  missionCount: number;
  filterUrl: string;
}) {
  const navigate = useNavigate();

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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "28px",
          borderRadius: "2px",
          background: color,
          flexShrink: 0,
        }}
      />
      <div style={{ width: "160px", flexShrink: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 600 }}>{label}</div>
      </div>
      <div
        style={{
          width: "80px",
          flexShrink: 0,
          fontSize: "12px",
          color,
          fontWeight: 500,
        }}
      >
        {levelName}
      </div>
      <div style={{ flex: 1, minWidth: "100px" }}>
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
      <div
        style={{
          width: "100px",
          flexShrink: 0,
          fontSize: "12px",
          color: "rgba(255,255,255,0.6)",
          textAlign: "right",
        }}
      >
        {xp} / {isMax ? "MAX" : `${next.xp} XP`}
      </div>
      <div
        style={{
          width: "90px",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--dt-colors-charts-categorical-default-12, #1496ff)",
            cursor: "pointer",
          }}
          onClick={() => navigate(filterUrl)}
        >
          {missionCount} missions
        </span>
      </div>
    </div>
  );
}

function SkillsTab() {
  const { userState } = useUserStateContext();

  if (!userState) return null;

  const disciplines: Discipline[] = [
    "sre",
    "developer",
    "incident-commander",
    "platform-engineer",
  ];
  const topicXP = userState.topicXP ?? {};

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

  return (
    <Flex flexDirection="column" gap={20}>
      <Heading level={4}>Discipline Tracks</Heading>
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
              filterUrl={`/missions?discipline=${disc}`}
            />
          );
        })}
      </div>

      <Heading level={4}>Topic Tracks</Heading>
      <div>
        {Object.entries(TOPIC_META).map(([topicId, meta]) => (
          <SkillRow
            key={topicId}
            label={meta.label}
            color="#888"
            xp={topicXP[topicId] ?? 0}
            thresholds={XP_THRESHOLDS}
            missionCount={missionCountByTopic[topicId] ?? 0}
            filterUrl={`/missions?topic=${topicId}`}
          />
        ))}
      </div>
    </Flex>
  );
}

// --- Leaderboard Tab ---

interface LeaderboardRow {
  rank: number;
  player: string;
  mission: string;
  difficulty: string;
  score: number;
  date: string;
  userId: string;
}

const leaderboardColumns: DataTableColumnDef<LeaderboardRow>[] = [
  { id: "rank", accessor: "rank", header: "Rank" },
  { id: "player", accessor: "player", header: "Player" },
  { id: "mission", accessor: "mission", header: "Mission" },
  { id: "difficulty", accessor: "difficulty", header: "Difficulty" },
  { id: "score", accessor: "score", header: "Score" },
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

function formatPlayerName(s: StoredScore): string {
  if (!s.userName || s.userName === "Unknown") return "Anonymous";
  if (s.userName.includes("dt.missing")) return `${s.userId.slice(0, 8)}...`;
  return s.userName;
}

function aggregateLeaderboard(
  scores: StoredScore[],
  missionFilter: string | null,
  difficultyFilter: string | null
): LeaderboardRow[] {
  let filtered = scores;
  if (missionFilter) {
    filtered = filtered.filter(
      (s) => (s.missionId ?? s.mission) === missionFilter
    );
  }
  if (difficultyFilter) {
    filtered = filtered.filter((s) => s.difficulty === difficultyFilter);
  }

  const bestMap = new Map<string, StoredScore>();
  for (const score of filtered) {
    const key = `${score.userId}-${score.missionId ?? score.mission}`;
    const existing = bestMap.get(key);
    if (!existing || score.totalScore > existing.totalScore) {
      bestMap.set(key, score);
    }
  }

  const sorted = [...bestMap.values()].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return sorted.map((s, i) => ({
    rank: i + 1,
    player: formatPlayerName(s),
    mission: formatMissionName(s.missionId ?? s.mission),
    difficulty: s.difficulty,
    score: Math.round(s.totalScore),
    date: formatDate(s.completedAt),
    userId: s.userId,
  }));
}

function LeaderboardTab() {
  const { scores, loading, error, stale, fetchScores, retry } =
    useLeaderboardContext();
  const [missionFilter, setMissionFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    if (stale || scores.length === 0) {
      void fetchScores();
    }
  }, []);

  const rows = useMemo(
    () => aggregateLeaderboard(scores, missionFilter, difficultyFilter),
    [scores, missionFilter, difficultyFilter]
  );

  return (
    <Flex flexDirection="column" gap={16}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ minWidth: "200px" }}>
          <Select
            name="lb-mission-filter"
            value={missionFilter ?? ""}
            onChange={(value: string | null) =>
              setMissionFilter(value || null)
            }
          >
            <SelectOption value="" id="lb-mission-all">All Missions</SelectOption>
            {MISSIONS.map((m) => (
              <SelectOption key={m.id} value={m.id} id={`lb-mission-${m.id}`}>
                {m.title}
              </SelectOption>
            ))}
          </Select>
        </div>
        <div style={{ minWidth: "140px" }}>
          <Select
            name="lb-difficulty-filter"
            value={difficultyFilter ?? ""}
            onChange={(value: string | null) =>
              setDifficultyFilter(value || null)
            }
          >
            <SelectOption value="" id="lb-diff-all">All Difficulties</SelectOption>
            <SelectOption value="rookie" id="lb-diff-rookie">Rookie</SelectOption>
            <SelectOption value="operator" id="lb-diff-operator">Operator</SelectOption>
            <SelectOption value="elite" id="lb-diff-elite">Elite</SelectOption>
            <SelectOption value="legend" id="lb-diff-legend">Legend</SelectOption>
          </Select>
        </div>
      </div>
      <Text textStyle="small" style={{ opacity: 0.5 }}>
        Scores may not reflect real-time data
      </Text>
      {loading ? (
        <SkeletonRows rows={5} />
      ) : error ? (
        <ErrorRetry message={error} onRetry={retry} />
      ) : rows.length === 0 ? (
        <EmptyState message="No scores yet" />
      ) : (
        <DataTable columns={leaderboardColumns} data={rows} />
      )}
    </Flex>
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
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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

// --- Main ProgressPage ---

const TAB_IDS = ["skills", "leaderboard", "history", "achievements"] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  skills: "Skills",
  leaderboard: "Leaderboard",
  history: "History",
  achievements: "Achievements",
};

export const ProgressPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initTab = (searchParams.get("tab") as TabId) || "skills";
  const [activeTab, setActiveTab] = useState<TabId>(
    TAB_IDS.includes(initTab as TabId) ? initTab : "skills"
  );

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <Flex flexDirection="column" gap={24} padding={24}>
      <Heading level={2}>Progress</Heading>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {TAB_IDS.map((tabId) => (
          <button
            key={tabId}
            onClick={() => handleTabChange(tabId)}
            style={{
              padding: "8px 16px",
              border: "none",
              background: activeTab === tabId ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === tabId ? "var(--dt-colors-text-primary-default, #fff)" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === tabId ? 600 : 400,
              borderBottom: activeTab === tabId ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)" : "2px solid transparent",
              borderRadius: "4px 4px 0 0",
            }}
          >
            {TAB_LABELS[tabId]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "achievements" && <AchievementsTab />}
      </div>
    </Flex>
  );
};
