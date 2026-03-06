import { useState, useEffect, useCallback } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import type { UserState, Discipline } from "../types/UserState";
import { createDefaultDisciplines, calculateLevel, migrateUserState, computeTotalXP } from "../types/UserState";
import type { XPGrant } from "../types/mission.types";
import { ALL_BADGES } from "../data/badges";

interface UseUserStateResult {
  userState: UserState | null;
  loading: boolean;
  error: string | null;
  saveUserState: (startingDiscipline: Discipline) => Promise<void>;
  awardXP: (xpGrants: XPGrant[]) => Promise<void>;
  resetUserState: () => Promise<void>;
  completeMission: (missionId: string) => void;
  updateStreak: () => void;
  awardBadge: (badgeId: string) => void;
  retry: () => void;
}

const DOCUMENT_TYPE = "intelops-user-state";

function getDocumentName(userId: string): string {
  return `user-state-${userId}`;
}

export function useUserState(): UseUserStateResult {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentVersion, setDocumentVersion] = useState<string>("0");

  const currentUser = getCurrentUserDetails();

  const loadUserState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await documentsClient.listDocuments({
        filter: `type == '${DOCUMENT_TYPE}' and name == '${getDocumentName(currentUser.id)}'`,
        pageSize: 1,
      });

      if (list.documents && list.documents.length > 0) {
        const doc = list.documents[0];
        setDocumentId(doc.id ?? null);
        setDocumentVersion(String(doc.version ?? "0"));
        const content = await documentsClient.downloadDocumentContent({
          id: doc.id!,
        });
        const text: string = await content.get("text");
        const parsed = JSON.parse(text) as Record<string, unknown>;
        const migrated = migrateUserState(parsed);
        setUserState(migrated);
      }
    } catch (err: unknown) {
      console.error("Failed to load user state:", err);
      setError("Failed to load user state");
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    void loadUserState();
  }, [loadUserState]);

  const retry = useCallback(() => {
    void loadUserState();
  }, [loadUserState]);

  const refreshDocument = useCallback(async (): Promise<{ id: string; version: string; state: UserState }> => {
    const list = await documentsClient.listDocuments({
      filter: `type == '${DOCUMENT_TYPE}' and name == '${getDocumentName(currentUser.id)}'`,
      pageSize: 1,
    });

    if (!list.documents || list.documents.length === 0) {
      throw new Error("User state document not found during refresh");
    }

    const doc = list.documents[0];
    const content = await documentsClient.downloadDocumentContent({ id: doc.id! });
    const text: string = await content.get("text");
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const migrated = migrateUserState(parsed);

    return { id: doc.id!, version: String(doc.version ?? "0"), state: migrated };
  }, [currentUser.id]);

  const writeUserState = useCallback(
    async (updatedState: UserState): Promise<void> => {
      if (!documentId) return;

      let currentDocId = documentId;
      let currentVersion = documentVersion;
      const maxRetries = 3;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          await documentsClient.updateDocument({
            id: currentDocId,
            optimisticLockingVersion: currentVersion,
            body: {
              content: new Blob([JSON.stringify(updatedState)], { type: "application/json" }),
            },
          });

          const nextVersion = String(parseInt(currentVersion) + 1);
          setDocumentId(currentDocId);
          setDocumentVersion(nextVersion);
          setUserState(updatedState);
          return;
        } catch (err: unknown) {
          const isConflict =
            err instanceof Error && (err.message.includes("409") || err.message.includes("Conflict"));
          if (!isConflict || attempt === maxRetries) throw err;

          const fresh = await refreshDocument();
          currentDocId = fresh.id;
          currentVersion = fresh.version;
        }
      }
    },
    [documentId, documentVersion, refreshDocument]
  );

  const saveUserState = useCallback(
    async (startingDiscipline: Discipline) => {
      const state: UserState = {
        userId: currentUser.id,
        userEmail: currentUser.email ?? "",
        startingDiscipline,
        disciplines: createDefaultDisciplines(),
        topicXP: {},
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        completedMissions: [],
        streakDays: 0,
        lastActiveDate: "",
        badges: [],
      };

      const result = await documentsClient.createDocument({
        body: {
          name: getDocumentName(currentUser.id),
          type: DOCUMENT_TYPE,
          content: new Blob([JSON.stringify(state)], { type: "application/json" }),
        },
      });

      setDocumentId(result.id ?? null);
      setDocumentVersion(String(result.version ?? "0"));
      setUserState(state);
    },
    [currentUser.id, currentUser.email]
  );

  const awardXP = useCallback(
    async (xpGrants: XPGrant[]) => {
      if (!userState || !documentId) return;

      const updatedDisciplines = { ...userState.disciplines };
      const updatedTopicXP = { ...userState.topicXP };

      for (const grant of xpGrants) {
        if (grant.discipline) {
          const disc = grant.discipline;
          const current = updatedDisciplines[disc];
          const newXP = current.xp + grant.amount;
          const { level, levelName } = calculateLevel(newXP);
          updatedDisciplines[disc] = { xp: newXP, level, levelName };
        }
        if (grant.topic) {
          updatedTopicXP[grant.topic] = (updatedTopicXP[grant.topic] ?? 0) + grant.amount;
        }
      }

      // Evaluate badges
      const newBadges = [...userState.badges];
      for (const badgeDef of ALL_BADGES) {
        if (!newBadges.includes(badgeDef.id)) {
          if (
            badgeDef.predicate({
              completedMissions: userState.completedMissions,
              streakDays: userState.streakDays,
              disciplines: updatedDisciplines,
              topicXP: updatedTopicXP,
              totalXP: computeTotalXP(updatedDisciplines),
            })
          ) {
            newBadges.push(badgeDef.id);
          }
        }
      }

      const updatedState: UserState = {
        ...userState,
        disciplines: updatedDisciplines,
        topicXP: updatedTopicXP,
        badges: newBadges,
      };

      try {
        await writeUserState(updatedState);
      } catch (err: unknown) {
        const isConflict =
          err instanceof Error && (err.message.includes("409") || err.message.includes("Conflict"));
        if (!isConflict) throw err;

        // Re-fetch fresh state and re-apply XP grants on top of it
        const fresh = await refreshDocument();
        const retryDisciplines = { ...fresh.state.disciplines };
        const retryTopicXP = { ...fresh.state.topicXP };

        for (const grant of xpGrants) {
          if (grant.discipline) {
            const disc = grant.discipline;
            const current = retryDisciplines[disc];
            const newXP = current.xp + grant.amount;
            const { level, levelName } = calculateLevel(newXP);
            retryDisciplines[disc] = { xp: newXP, level, levelName };
          }
          if (grant.topic) {
            retryTopicXP[grant.topic] = (retryTopicXP[grant.topic] ?? 0) + grant.amount;
          }
        }

        const retryBadges = [...fresh.state.badges];
        for (const badgeDef of ALL_BADGES) {
          if (!retryBadges.includes(badgeDef.id)) {
            if (
              badgeDef.predicate({
                completedMissions: fresh.state.completedMissions,
                streakDays: fresh.state.streakDays,
                disciplines: retryDisciplines,
                topicXP: retryTopicXP,
                totalXP: computeTotalXP(retryDisciplines),
              })
            ) {
              retryBadges.push(badgeDef.id);
            }
          }
        }

        const retryState: UserState = {
          ...fresh.state,
          disciplines: retryDisciplines,
          topicXP: retryTopicXP,
          badges: retryBadges,
        };

        await writeUserState(retryState);
      }
    },
    [userState, documentId, writeUserState, refreshDocument]
  );

  const completeMission = useCallback(
    (missionId: string) => {
      if (!userState) return;
      if (userState.completedMissions.includes(missionId)) return;

      const buildCompletionState = (base: UserState): UserState => {
        if (base.completedMissions.includes(missionId)) return base;

        const newCompleted = [...base.completedMissions, missionId];

        const newBadges = [...base.badges];
        for (const badgeDef of ALL_BADGES) {
          if (!newBadges.includes(badgeDef.id)) {
            if (
              badgeDef.predicate({
                completedMissions: newCompleted,
                streakDays: base.streakDays,
                disciplines: base.disciplines,
                topicXP: base.topicXP,
                totalXP: computeTotalXP(base.disciplines),
              })
            ) {
              newBadges.push(badgeDef.id);
            }
          }
        }

        return { ...base, completedMissions: newCompleted, badges: newBadges };
      };

      const updatedState = buildCompletionState(userState);
      setUserState(updatedState);

      void (async () => {
        try {
          await writeUserState(updatedState);
        } catch (err: unknown) {
          const isConflict =
            err instanceof Error && (err.message.includes("409") || err.message.includes("Conflict"));
          if (!isConflict) {
            console.error("Failed to save mission completion:", err);
            return;
          }

          const fresh = await refreshDocument();
          const retryState = buildCompletionState(fresh.state);
          await writeUserState(retryState);
        }
      })();
    },
    [userState, writeUserState, refreshDocument]
  );

  const updateStreak = useCallback(() => {
    if (!userState) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const lastActive = userState.lastActiveDate;

    let newStreak = userState.streakDays;

    if (lastActive) {
      const lastDate = new Date(lastActive);
      const diffDays = Math.floor(
        (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    if (newStreak !== userState.streakDays || today !== userState.lastActiveDate) {
      const updatedState: UserState = {
        ...userState,
        streakDays: newStreak,
        lastActiveDate: today,
      };
      setUserState(updatedState);
      void writeUserState(updatedState);
    }
  }, [userState, writeUserState]);

  const awardBadge = useCallback(
    (badgeId: string) => {
      if (!userState) return;
      if (userState.badges.includes(badgeId)) return;

      const updatedState: UserState = {
        ...userState,
        badges: [...userState.badges, badgeId],
      };
      setUserState(updatedState);
      void writeUserState(updatedState);
    },
    [userState, writeUserState]
  );

  const resetUserState = useCallback(async () => {
    if (!documentId) return;

    await documentsClient.deleteDocument({
      id: documentId,
      optimisticLockingVersion: documentVersion,
    });

    window.location.reload();
  }, [documentId, documentVersion]);

  return {
    userState,
    loading,
    error,
    saveUserState,
    awardXP,
    resetUserState,
    completeMission,
    updateStreak,
    awardBadge,
    retry,
  };
}
