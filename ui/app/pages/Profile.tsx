import React, { useState, useEffect } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph, Text } from "@dynatrace/strato-components/typography";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { MISSIONS } from "../data/missions";

interface StoredScore {
  userId: string;
  missionId?: string;
  mission: string;
  missionTitle?: string;
  difficulty: string;
  baseScore: number;
  timeBonus: number;
  hintsUsed?: number;
  totalScore: number;
  completedAt: string;
}

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

export const Profile = () => {
  const [scores, setScores] = useState<StoredScore[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUserDetails();
  const displayName =
    (currentUser.name && !currentUser.name.includes("dt.missing") && currentUser.name) ||
    (currentUser.email && !currentUser.email.includes("dt.missing") && currentUser.email) ||
    currentUser.id;

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
            if (parsed.userId === currentUser.id) {
              results.push(parsed);
            }
          } catch (docError: unknown) {
            console.error(`Failed to fetch document ${doc.id}:`, docError);
          }
        }

        if (!cancelled) {
          setScores(results);
        }
      } catch (fetchError: unknown) {
        console.error("Failed to fetch scores:", fetchError);
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
  }, [currentUser.id]);

  const missionsCompleted = scores.length;
  const totalPoints = scores.reduce((sum, s) => sum + s.totalScore, 0);
  const bestScore = scores.length > 0
    ? Math.max(...scores.map((s) => s.totalScore))
    : 0;

  const sortedScores = [...scores].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const historyData: HistoryRow[] = sortedScores.map((s) => ({
    mission: formatMissionName(s.missionId ?? s.mission),
    difficulty: s.difficulty,
    score: s.totalScore,
    hintsUsed: s.hintsUsed ?? 0,
    date: formatDate(s.completedAt),
  }));

  return (
    <Flex flexDirection="column" gap={32} padding={32}>
      {/* Header */}
      <Flex flexDirection="column" gap={4}>
        <Text textStyle="base-emphasized">// PLAYER PROFILE</Text>
        <Heading level={1}>{displayName}</Heading>
      </Flex>

      {/* Stats Row */}
      {loading ? (
        <Flex justifyContent="center" padding={32}>
          <ProgressCircle />
        </Flex>
      ) : (
        <>
          <Flex gap={24}>
            <Surface>
              <Flex flexDirection="column" alignItems="center" padding={24} gap={4} flexGrow={1}>
                <Heading level={2}>{missionsCompleted}</Heading>
                <Text>Total Missions Completed</Text>
              </Flex>
            </Surface>
            <Surface>
              <Flex flexDirection="column" alignItems="center" padding={24} gap={4} flexGrow={1}>
                <Heading level={2}>{totalPoints}</Heading>
                <Text>Total Points Earned</Text>
              </Flex>
            </Surface>
            <Surface>
              <Flex flexDirection="column" alignItems="center" padding={24} gap={4} flexGrow={1}>
                <Heading level={2}>{bestScore}</Heading>
                <Text>Best Single Score</Text>
              </Flex>
            </Surface>
          </Flex>

          {/* Mission History */}
          <Flex flexDirection="column" gap={16}>
            <Text textStyle="base-emphasized">// MISSION HISTORY</Text>
            {historyData.length === 0 ? (
              <Surface>
                <Flex justifyContent="center" padding={32}>
                  <Paragraph>
                    No missions completed yet. Return to the mission board to begin.
                  </Paragraph>
                </Flex>
              </Surface>
            ) : (
              <DataTable columns={historyColumns} data={historyData} />
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
};
