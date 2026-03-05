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

interface ScoreRecord {
  userName: string;
  userId: string;
  mission: string;
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

const leaderboardColumns: DataTableColumnDef[] = [
  { accessor: "rank", header: "Rank" },
  { accessor: "player", header: "Player" },
  { accessor: "mission", header: "Mission" },
  { accessor: "difficulty", header: "Difficulty" },
  { accessor: "score", header: "Score" },
  { accessor: "date", header: "Date" },
];

const MISSION_LABELS: Record<string, string> = {
  "operation-3am-database-spike": "3am Database Spike",
};

function formatMissionName(key: string): string {
  return MISSION_LABELS[key] ?? key;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const Home = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoreRecord[]>([]);
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

        const results: ScoreRecord[] = [];
        for (const doc of list.documents) {
          try {
            const content = await documentsClient.downloadDocumentContent({
              id: doc.id,
            });
            const text: string = await content.get("text");
            const parsed = JSON.parse(text) as ScoreRecord;
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
    .slice(0, 10)
    .map((s, i) => ({
      rank: i + 1,
      player: !s.userName || s.userName === "Unknown"
        ? "Anonymous"
        : s.userName.includes("dt.missing")
          ? `${s.userId.slice(0, 8)}...`
          : s.userName,
      mission: formatMissionName(s.mission),
      difficulty: s.difficulty,
      score: s.totalScore,
      date: formatDate(s.completedAt),
    }));

  return (
    <Flex flexDirection="column" gap={32} padding={32}>
      {/* Title Section */}
      <Flex flexDirection="column" alignItems="center" gap={8}>
        <Heading level={1}>INTEL OPS</Heading>
        <Paragraph>
          Gamified Observability Training — Learn by Doing. Compete to Win.
        </Paragraph>
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
            <Text>Rank</Text>
          </Flex>
        </Surface>
      </Flex>

      {/* Available Missions */}
      <Flex flexDirection="column" gap={16}>
        <Heading level={2}>Available Missions</Heading>
        <Surface>
          <Flex flexDirection="column" padding={24} gap={16}>
            <Heading level={3}>Operation: 3am Database Spike</Heading>
            <Flex gap={8}>
              <Chip color="primary" variant="emphasized">
                Incident Commander
              </Chip>
              <Chip color="success" variant="emphasized">
                Rookie
              </Chip>
            </Flex>
            <Paragraph>
              Production database is spiking. Find the root cause before the
              business wakes up.
            </Paragraph>
            <Flex>
              <Button
                variant="emphasized"
                onClick={() => navigate("/mission")}
              >
                Start Mission
              </Button>
            </Flex>
          </Flex>
        </Surface>
      </Flex>

      {/* Leaderboard */}
      <Flex flexDirection="column" gap={16}>
        <Heading level={2}>Leaderboard</Heading>
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

      {/* Footer */}
      <Flex justifyContent="center" padding={16}>
        <Text>More missions coming soon</Text>
      </Flex>
    </Flex>
  );
};
