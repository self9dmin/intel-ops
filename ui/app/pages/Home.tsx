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
import type { UserRole } from "../types/UserState";

const ROLE_RECOMMENDED_MISSIONS: Record<UserRole, string[]> = {
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

interface HomeProps {
  userRole: UserRole;
}

export const Home = ({ userRole }: HomeProps) => {
  const navigate = useNavigate();
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

      {/* Recommended for Role */}
      <Flex flexDirection="column" gap={12}>
        <Heading level={4}>Recommended for your role</Heading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {MISSIONS.filter((m) =>
            ROLE_RECOMMENDED_MISSIONS[userRole]?.includes(m.id)
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
