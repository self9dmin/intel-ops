import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Divider } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import {
  Heading,
  Paragraph,
  Text,
} from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { MISSIONS } from "../data/missions";
import type { Mission } from "../types/mission.types";
import type { Discipline, DisciplineProgress } from "../types/UserState";
import { XP_THRESHOLDS, TOPIC_META } from "../types/UserState";
import { useUserStateContext } from "../context/UserStateContext";

const DISCIPLINE_RECOMMENDED_MISSIONS: Record<Discipline, string[]> = {
  sre: ["operation-silent-rollout", "operation-3am-database-spike"],
  developer: ["operation-ghost-in-the-trace", "operation-silent-rollout"],
  "incident-commander": ["operation-3am-database-spike", "operation-flatline"],
  "platform-engineer": ["operation-k8s-meltdown", "operation-3am-database-spike"],
};

interface StoredScore {
  userName: string;
  userId: string;
  mission: string;
  missionId?: string;
  role: string;
  difficulty: string;
  baseScore: number;
  timeBonus: number;
  totalScore: number;
  completedAt: string;
}

interface LeaderboardRow {
  rank: number;
  player: string;
  mission: string;
  difficulty: string;
  score: number;
  date: string;
}

const leaderboardColumns: DataTableColumnDef<LeaderboardRow>[] = [
  { id: "rank", accessor: "rank", header: "Rank" },
  { id: "player", accessor: "player", header: "Player" },
  { id: "mission", accessor: "mission", header: "Mission" },
  { id: "difficulty", accessor: "difficulty", header: "Difficulty" },
  { id: "score", accessor: "score", header: "Score" },
  { id: "date", accessor: "date", header: "Date" },
];

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

const DISCIPLINE_META: Record<Discipline, { label: string; icon: string; color: string }> = {
  sre: { label: "SRE", icon: "\u{1F6E1}\uFE0F", color: "#4b9cf5" },
  developer: { label: "Developer", icon: "\u{1F4BB}", color: "#7c5cbf" },
  "incident-commander": { label: "Incident Commander", icon: "\u{1F6A8}", color: "#e8734a" },
  "platform-engineer": { label: "Platform Engineer", icon: "\u2699\uFE0F", color: "#3dba7e" },
};

const ALL_DISCIPLINES: Discipline[] = ["sre", "developer", "incident-commander", "platform-engineer"];

function getNextThreshold(xp: number): { nextXP: number; nextName: string } | null {
  for (const threshold of XP_THRESHOLDS) {
    if (xp < threshold.xp) {
      return { nextXP: threshold.xp, nextName: threshold.name };
    }
  }
  return null;
}

function MiniDisciplineCard({ discipline, progress }: { discipline: Discipline; progress: DisciplineProgress }) {
  const meta = DISCIPLINE_META[discipline];
  const next = getNextThreshold(progress.xp);
  const isMax = next === null;

  const currentThresholdXP = XP_THRESHOLDS.find((t) => t.level === progress.level)?.xp ?? 0;
  const progressPercent = isMax
    ? 100
    : ((progress.xp - currentThresholdXP) / (next.nextXP - currentThresholdXP)) * 100;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
        <span style={{ fontSize: "16px" }}>{meta.icon}</span>
        <span style={{ fontWeight: 600, fontSize: "12px" }}>{meta.label}</span>
        <span style={{ fontSize: "11px", color: meta.color, fontWeight: 500, marginLeft: "auto" }}>{progress.levelName}</span>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.1)",
        borderRadius: "3px",
        height: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          background: meta.color,
          height: "100%",
          width: `${progressPercent}%`,
          borderRadius: "3px",
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

interface HomeProps {
  startingDiscipline: Discipline;
}

export const Home = ({ startingDiscipline }: HomeProps) => {
  const navigate = useNavigate();
  const { userState } = useUserStateContext();
  const [scores, setScores] = useState<StoredScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchScores() {
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
            results.push(parsed);
          } catch (docError: unknown) {
            console.error(
              `Failed to fetch content for document ${doc.id}:`,
              docError
            );
          }
        }

        if (!cancelled) {
          setScores(results);
        }
      } catch (fetchError: unknown) {
        console.error("Failed to fetch leaderboard:", fetchError);
        if (!cancelled) {
          setError("Failed to load leaderboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchScores();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentUser = getCurrentUserDetails();
  const sortedScores = [...scores].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const currentUserScores = scores.filter(
    (s) => s.userId === currentUser.id
  );
  const missionsCompleted = currentUserScores.length;
  const totalPoints = Math.round(
    currentUserScores.reduce((sum, s) => sum + s.totalScore, 0)
  );

  const currentUserRankIndex = sortedScores.findIndex(
    (s) => s.userId === currentUser.id
  );

  const leaderboardData: LeaderboardRow[] = sortedScores
    .slice(0, 5)
    .map((s, i) => ({
      rank: i + 1,
      player:
        !s.userName || s.userName === "Unknown"
          ? "Anonymous"
          : s.userName.includes("dt.missing")
            ? `${s.userId.slice(0, 8)}...`
            : s.userName,
      mission: formatMissionName(s.missionId ?? s.mission),
      difficulty: s.difficulty,
      score: s.totalScore,
      date: formatDate(s.completedAt),
    }));

  return (
    <Flex flexDirection="column" gap={24} padding={24}>
      {/* Header */}
      <Flex flexDirection="column" gap={4}>
        <Heading level={2}>Intel Ops</Heading>
        <Text textStyle="small">
          Gamified observability training for Dynatrace
        </Text>
      </Flex>

      <Divider />

      {/* Stats Bar — compact stat strip */}
      <div style={{ display: "flex", gap: "48px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "600", lineHeight: 1 }}>{missionsCompleted}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>Missions Completed</div>
        </div>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "600", lineHeight: 1 }}>{totalPoints}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>Points Earned</div>
        </div>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "600", lineHeight: 1 }}>{currentUserRankIndex >= 0 ? `#${currentUserRankIndex + 1}` : "—"}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>Global Rank</div>
        </div>
      </div>

      {/* Mini Skill Tree */}
      <Flex flexDirection="column" gap={8}>
        <Heading level={5}>Skill Tracks</Heading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {ALL_DISCIPLINES.map((disc) => (
            <MiniDisciplineCard
              key={disc}
              discipline={disc}
              progress={userState?.disciplines?.[disc] ?? { xp: 0, level: 1, levelName: "Recruit" }}
            />
          ))}
        </div>
      </Flex>

      {/* Recommended for Role */}
      <Flex flexDirection="column" gap={12}>
        <Heading level={4}>Recommended for you</Heading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {MISSIONS.filter((m) =>
            DISCIPLINE_RECOMMENDED_MISSIONS[startingDiscipline]?.includes(m.id)
          ).map((mission) => {
            const isLocked = mission.status === "locked";
            return (
              <div
                key={mission.id}
                style={{ flex: "1 1 calc(50% - 12px)", maxWidth: "calc(50% - 12px)", minWidth: "300px", boxSizing: "border-box" }}
              >
                <Surface>
                  <Flex
                    flexDirection="column"
                    padding={12}
                    gap={8}
                    style={{ opacity: isLocked ? 0.5 : 1 }}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text textStyle="small">
                        <span style={{ fontFamily: "monospace", opacity: 0.7 }}>
                          {mission.codename}
                        </span>
                      </Text>
                      <Chip
                        color={getDifficultyColor(mission.difficulty)}
                        variant="emphasized"
                      >
                        {mission.difficulty.toUpperCase()}
                      </Chip>
                    </Flex>
                    <Heading level={5}>{mission.title}</Heading>
                    <Text textStyle="small" style={{ opacity: 0.7 }}>
                      {mission.description}
                    </Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {mission.disciplines.map((d) => {
                        const meta = DISCIPLINE_META[d.track];
                        return (
                          <span
                            key={d.track}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "11px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: `${meta.color}22`,
                              color: meta.color,
                              fontWeight: 500,
                            }}
                          >
                            {meta.icon} {meta.label} +{d.xp} XP
                          </span>
                        );
                      })}
                    </div>
                    {mission.topics && mission.topics.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {mission.topics.map((topicId) => (
                          <span
                            key={topicId}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "10px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.7)",
                              fontWeight: 500,
                            }}
                          >
                            {TOPIC_META[topicId].label}
                          </span>
                        ))}
                      </div>
                    )}
                    <Flex justifyContent="space-between" alignItems="center">
                      <Button
                        variant="emphasized"
                        disabled={isLocked}
                        onClick={() => navigate(`/mission/${mission.id}`)}
                      >
                        {isLocked ? "Locked" : "Start Mission"}
                      </Button>
                      <Text textStyle="small" style={{ opacity: 0.6 }}>
                        {isLocked ? "Locked" : formatMinutes(mission.timerSeconds)}
                      </Text>
                    </Flex>
                  </Flex>
                </Surface>
              </div>
            );
          })}
        </div>
      </Flex>

      {/* Mission Grid */}
      <Flex flexDirection="column" gap={12}>
        <Heading level={4}>All Missions</Heading>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {MISSIONS.map((mission) => {
            const isLocked = mission.status === "locked";
            return (
              <div
                key={mission.id}
                style={{ flex: "1 1 calc(33.333% - 12px)", maxWidth: "calc(33.333% - 12px)", minWidth: "300px", boxSizing: "border-box" }}
              >
                <Surface>
                  <Flex
                    flexDirection="column"
                    padding={12}
                    gap={8}
                    style={{
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    {/* Top row: codename + difficulty */}
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text textStyle="small">
                        <span style={{ fontFamily: "monospace", opacity: 0.7 }}>
                          {mission.codename}
                        </span>
                      </Text>
                      <Chip
                        color={getDifficultyColor(mission.difficulty)}
                        variant="emphasized"
                      >
                        {mission.difficulty.toUpperCase()}
                      </Chip>
                    </Flex>

                    {/* Title */}
                    <Heading level={5}>{mission.title}</Heading>

                    {/* Role chip */}
                    <Flex>
                      <Chip color="neutral">{mission.role}</Chip>
                    </Flex>

                    {/* Description */}
                    <Text textStyle="small" style={{ opacity: 0.7 }}>
                      {mission.description}
                    </Text>

                    {/* Discipline XP chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {mission.disciplines.map((d) => {
                        const meta = DISCIPLINE_META[d.track];
                        return (
                          <span
                            key={d.track}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "11px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: `${meta.color}22`,
                              color: meta.color,
                              fontWeight: 500,
                            }}
                          >
                            {meta.icon} {meta.label} +{d.xp} XP
                          </span>
                        );
                      })}
                    </div>

                    {/* Topic chips */}
                    {mission.topics && mission.topics.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {mission.topics.map((topicId) => (
                          <span
                            key={topicId}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "10px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.7)",
                              fontWeight: 500,
                            }}
                          >
                            {TOPIC_META[topicId].label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom row: button + time */}
                    <Flex justifyContent="space-between" alignItems="center">
                      <Button
                        variant="emphasized"
                        disabled={isLocked}
                        onClick={() => navigate(`/mission/${mission.id}`)}
                      >
                        {isLocked ? "Locked" : "Start Mission"}
                      </Button>
                      <Text textStyle="small" style={{ opacity: 0.6 }}>
                        {isLocked ? "Locked" : formatMinutes(mission.timerSeconds)}
                      </Text>
                    </Flex>
                  </Flex>
                </Surface>
              </div>
            );
          })}
          {/* Empty placeholders to align orphan row */}
          {MISSIONS.length % 3 !== 0 &&
            Array.from({ length: 3 - (MISSIONS.length % 3) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                style={{ flex: "1 1 calc(33.333% - 12px)", maxWidth: "calc(33.333% - 12px)", minWidth: "300px", boxSizing: "border-box" }}
                aria-hidden="true"
              />
            ))}
        </div>
      </Flex>

      {/* Leaderboard */}
      <Flex flexDirection="column" gap={8}>
        <Heading level={4}>Leaderboard</Heading>
        {loading ? (
          <Surface>
            <Flex justifyContent="center" padding={20}>
              <ProgressCircle />
            </Flex>
          </Surface>
        ) : error ? (
          <Surface>
            <Flex justifyContent="center" padding={16}>
              <Paragraph>{error}</Paragraph>
            </Flex>
          </Surface>
        ) : leaderboardData.length === 0 ? (
          <Surface>
            <Flex justifyContent="center" padding={16}>
              <Paragraph>
                No scores yet — complete a mission to appear here
              </Paragraph>
            </Flex>
          </Surface>
        ) : (
          <DataTable columns={leaderboardColumns} data={leaderboardData} />
        )}
      </Flex>
    </Flex>
  );
};
