import React, { useState, useEffect, useMemo } from "react";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Select, SelectOption } from "@dynatrace/strato-components-preview/forms";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { MISSIONS } from "../data/missions";
import { useLeaderboardContext, type StoredScore } from "../context/LeaderboardContext";
import { SkeletonRows } from "../components/SkeletonRows";
import { ErrorRetry } from "../components/ErrorRetry";
import { EmptyState } from "../components/EmptyState";

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

export const LeaderboardTab = () => {
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Heading level={4}>Leaderboard</Heading>
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
            <SelectOption value="" id="lb-diff-all">All</SelectOption>
            <SelectOption value="rookie" id="lb-diff-rookie">Rookie</SelectOption>
            <SelectOption value="operator" id="lb-diff-operator">Operator</SelectOption>
            <SelectOption value="elite" id="lb-diff-elite">Elite</SelectOption>
            <SelectOption value="legend" id="lb-diff-legend">Legend</SelectOption>
          </Select>
        </div>
      </div>
      <Text textStyle="small" style={{ opacity: 0.5 }}>
        Showing best score per player
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
    </div>
  );
};
