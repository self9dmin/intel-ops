import React, { useEffect, useMemo } from "react";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { MISSIONS } from "../data/missions";
import { useLeaderboardContext, type StoredScore } from "../context/LeaderboardContext";
import { SkeletonRows } from "../components/SkeletonRows";
import { ErrorRetry } from "../components/ErrorRetry";
import { EmptyState } from "../components/EmptyState";

interface LeaderboardRow {
  rank: number;
  player: string;
  bestMission: string;
  score: number;
  date: string;
  userId: string;
  isCurrentUser: boolean;
}

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

function resolveDisplayName(s: StoredScore): string {
  const name = s.userName;
  if (name && name !== "Unknown" && !name.includes("dt.missing")) return name;
  return `${s.userId.slice(0, 8)}...`;
}

function aggregateBestPerPlayer(
  scores: StoredScore[],
  currentUserId: string
): LeaderboardRow[] {
  // For each player, find their single highest score across all missions
  const bestByPlayer = new Map<string, StoredScore>();
  for (const score of scores) {
    const existing = bestByPlayer.get(score.userId);
    if (!existing || score.totalScore > existing.totalScore) {
      bestByPlayer.set(score.userId, score);
    }
  }

  const sorted = [...bestByPlayer.values()].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return sorted.map((s, i) => ({
    rank: i + 1,
    player: resolveDisplayName(s),
    bestMission: formatMissionName(s.missionId ?? s.mission),
    score: Math.round(s.totalScore),
    date: formatDate(s.completedAt),
    userId: s.userId,
    isCurrentUser: s.userId === currentUserId,
  }));
}

export const LeaderboardTab = () => {
  const { scores, loading, error, stale, fetchScores, retry } =
    useLeaderboardContext();
  const currentUser = getCurrentUserDetails();

  useEffect(() => {
    if (stale || scores.length === 0) {
      void fetchScores();
    }
  }, []);

  const rows = useMemo(
    () => aggregateBestPerPlayer(scores, currentUser.id),
    [scores, currentUser.id]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Heading level={4}>Leaderboard</Heading>
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
        <div>
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 1fr 100px 120px",
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>Rank</span>
            <span>Player</span>
            <span>Best Mission</span>
            <span>Score</span>
            <span>Date</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.userId}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr 100px 120px",
                padding: "8px 12px",
                fontSize: "13px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: row.isCurrentUser
                  ? "rgba(114,203,255,0.08)"
                  : "transparent",
              }}
            >
              <span style={{ fontWeight: 600 }}>#{row.rank}</span>
              <span style={{ fontWeight: row.isCurrentUser ? 600 : 400 }}>
                {row.player}
                {row.isCurrentUser && (
                  <span style={{ opacity: 0.5, marginLeft: "6px", fontSize: "11px" }}>
                    (you)
                  </span>
                )}
              </span>
              <span style={{ opacity: 0.8 }}>{row.bestMission}</span>
              <span style={{ fontWeight: 600 }}>{row.score}</span>
              <span style={{ opacity: 0.6 }}>{row.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
