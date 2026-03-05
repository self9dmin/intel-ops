import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
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

export const Home = () => {
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
  const totalPoints = currentUserScores.reduce(
    (sum, s) => sum + s.totalScore,
    0
  );

  const currentUserRankIndex = sortedScores.findIndex(
    (s) => s.userId === currentUser.id
  );
  const rankDisplay =
    currentUserRankIndex >= 0 ? `#${currentUserRankIndex + 1}` : "Unranked";

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
    <Flex flexDirection="column" gap={32} padding={32}>
      {/* Header */}
      <Flex flexDirection="column" alignItems="center" gap={4}>
        <Heading level={1}>INTEL OPS</Heading>
        <Text textStyle="base-emphasized">CLASSIFIED TRAINING PROGRAM</Text>
      </Flex>

      {/* Stats Bar */}
      <Flex justifyContent="center" gap={48}>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>{missionsCompleted}</Heading>
            <Text>Missions Completed</Text>
          </Flex>
        </Surface>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>{totalPoints}</Heading>
            <Text>Points Earned</Text>
          </Flex>
        </Surface>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>{rankDisplay}</Heading>
            <Text>Global Rank</Text>
          </Flex>
        </Surface>
      </Flex>

      {/* Available Missions */}
      <Flex flexDirection="column" gap={16}>
        <Text textStyle="base-emphasized">// AVAILABLE MISSIONS</Text>

        {MISSIONS.map((mission) => {
          const isLocked = mission.status === "locked";
          return (
            <Surface key={mission.id}>
              <Flex flexDirection="column" padding={24} gap={12}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text textStyle="small">// {mission.codename}</Text>
                  <Chip
                    color={getDifficultyColor(mission.difficulty)}
                    variant="emphasized"
                  >
                    {mission.difficulty.toUpperCase()}
                  </Chip>
                </Flex>

                <Heading level={3}>{mission.title}</Heading>

                <Flex gap={8}>
                  <Chip color="neutral">{mission.role}</Chip>
                </Flex>

                <Paragraph>{mission.description}</Paragraph>

                <Flex justifyContent="space-between" alignItems="center">
                  <Button
                    variant="emphasized"
                    disabled={isLocked}
                    onClick={() => navigate(`/mission/${mission.id}`)}
                  >
                    {isLocked ? "LOCKED" : "INITIATE MISSION"}
                  </Button>
                  <Text textStyle="small">
                    {formatMinutes(mission.timerSeconds)}
                  </Text>
                </Flex>
              </Flex>
            </Surface>
          );
        })}
      </Flex>

      {/* Global Leaderboard (mini) */}
      <Flex flexDirection="column" gap={16}>
        <Text textStyle="base-emphasized">// GLOBAL LEADERBOARD</Text>
        {loading ? (
          <Surface>
            <Flex justifyContent="center" padding={32}>
              <ProgressCircle />
            </Flex>
          </Surface>
        ) : error ? (
          <Surface>
            <Flex justifyContent="center" padding={32}>
              <Paragraph>{error}</Paragraph>
            </Flex>
          </Surface>
        ) : leaderboardData.length === 0 ? (
          <Surface>
            <Flex justifyContent="center" padding={32}>
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
