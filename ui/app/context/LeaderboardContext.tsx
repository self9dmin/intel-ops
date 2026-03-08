import React, { createContext, useContext, useState, useCallback } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";

export interface StoredScore {
  userName: string;
  userId: string;
  mission: string;
  missionId?: string;
  missionTitle?: string;
  role: string;
  difficulty: string;
  baseScore: number;
  timeBonus: number;
  hintsUsed?: number;
  totalScore: number;
  completedAt: string;
}

interface LeaderboardContextValue {
  scores: StoredScore[];
  loading: boolean;
  error: string | null;
  stale: boolean;
  fetchScores: () => Promise<void>;
  markStale: () => void;
  retry: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextValue | null>(null);

export const LeaderboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [scores, setScores] = useState<StoredScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  const fetchScores = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
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
          console.error(`Failed to fetch content for document ${doc.id}:`, docError);
        }
      }

      setScores(results);
      setStale(false);
    } catch (fetchError: unknown) {
      console.error("Failed to fetch leaderboard:", fetchError);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const markStale = useCallback(() => {
    setStale(true);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    void fetchScores();
  }, [fetchScores]);

  return (
    <LeaderboardContext.Provider
      value={{ scores, loading, error, stale, fetchScores, markStale, retry }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export function useLeaderboardContext(): LeaderboardContextValue {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) {
    throw new Error("useLeaderboardContext must be used within a LeaderboardProvider");
  }
  return ctx;
}
