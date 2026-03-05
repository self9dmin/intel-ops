import React, { useState, useEffect } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";
import { MISSIONS } from "../data/missions";
import type { Discipline, DisciplineProgress } from "../types/UserState";
import { XP_THRESHOLDS } from "../types/UserState";
import { useUserStateContext } from "../context/UserStateContext";

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

const DISCIPLINE_META: Record<Discipline, { label: string; icon: string; color: string }> = {
  sre: { label: "SRE", icon: "\u{1F6E1}\uFE0F", color: "#4b9cf5" },
  developer: { label: "Developer", icon: "\u{1F4BB}", color: "#7c5cbf" },
  "incident-commander": { label: "Incident Commander", icon: "\u{1F6A8}", color: "#e8734a" },
  "platform-engineer": { label: "Platform Engineer", icon: "\u2699\uFE0F", color: "#3dba7e" },
};

function getNextThreshold(xp: number): { nextXP: number; nextName: string } | null {
  for (const threshold of XP_THRESHOLDS) {
    if (xp < threshold.xp) {
      return { nextXP: threshold.xp, nextName: threshold.name };
    }
  }
  return null;
}

function DisciplineCard({ discipline, progress }: { discipline: Discipline; progress: DisciplineProgress }) {
  const meta = DISCIPLINE_META[discipline];
  const next = getNextThreshold(progress.xp);
  const isMax = next === null;

  const currentThresholdXP = XP_THRESHOLDS.find((t) => t.level === progress.level)?.xp ?? 0;
  const progressPercent = isMax
    ? 100
    : ((progress.xp - currentThresholdXP) / (next.nextXP - currentThresholdXP)) * 100;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "24px" }}>{meta.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{meta.label}</div>
          <div style={{ fontSize: "12px", color: meta.color, fontWeight: 500 }}>{progress.levelName}</div>
        </div>
      </div>

      {isMax ? (
        <div style={{
          background: meta.color,
          borderRadius: "4px",
          padding: "6px 0",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
        }}>
          MAX
        </div>
      ) : (
        <>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            height: "8px",
            overflow: "hidden",
            marginBottom: "6px",
          }}>
            <div style={{
              background: meta.color,
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            {progress.xp} / {next.nextXP} XP to {next.nextName}
          </div>
        </>
      )}
    </div>
  );
}

export const Profile = () => {
  const [scores, setScores] = useState<StoredScore[]>([]);
  const [loading, setLoading] = useState(true);
  const { userState, resetUserState } = useUserStateContext();

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

  const disciplines: Discipline[] = ["sre", "developer", "incident-commander", "platform-engineer"];

  return (
    <Flex flexDirection="column" gap={24} padding={24}>
      <Flex flexDirection="column" gap={4}>
        <Text textStyle="small" style={{ opacity: 0.6 }}>Player Profile</Text>
        <Heading level={1}>{displayName}</Heading>
      </Flex>

      {loading ? (
        <Flex justifyContent="center" padding={20}>
          <ProgressCircle />
        </Flex>
      ) : (
        <>
          <Flex flexDirection="column" gap={8}>
            <Heading level={3}>Skill Tree</Heading>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}>
              {disciplines.map((disc) => (
                <DisciplineCard
                  key={disc}
                  discipline={disc}
                  progress={userState?.disciplines?.[disc] ?? { xp: 0, level: 1, levelName: "Recruit" }}
                />
              ))}
            </div>
          </Flex>

          <Flex>
            <Button variant="default" color="critical" onClick={() => { void resetUserState(); }}>
              Reset Onboarding
            </Button>
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <Heading level={3}>Mission History</Heading>
            {historyData.length === 0 ? (
              <Surface>
                <Flex justifyContent="center" padding={16}>
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