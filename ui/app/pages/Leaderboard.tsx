import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import {
  Heading,
  Paragraph,
  Text,
} from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { MISSIONS } from "../data/missions";

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

function formatMissionName(key: string): string {
  const mission = MISSIONS.find((m) => m.id === key);
  if (mission) return mission.title;
  return key;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const Leaderboard = () => {
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

  const sortedScores = [...scores].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const leaderboardData: LeaderboardRow[] = sortedScores.map((s, i) => ({
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
      <Text textStyle="base-emphasized">// GLOBAL LEADERBOARD</Text>
      <Heading level={1}>LEADERBOARD</Heading>

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

      <Flex>
        <Button variant="emphasized" onClick={() => navigate("/")}>
          RETURN TO MISSION BOARD
        </Button>
      </Flex>
    </Flex>
  );
};
