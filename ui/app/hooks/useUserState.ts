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

  const writeUserState = useCallback(
    async (updatedState: UserState): Promise<void> => {
      if (!documentId) return;

      await documentsClient.deleteDocument({
        id: documentId,
        optimisticLockingVersion: documentVersion,
      });

      const result = await documentsClient.createDocument({
        body: {
          name: getDocumentName(currentUser.id),
          type: DOCUMENT_TYPE,
          content: new Blob([JSON.stringify(updatedState)], { type: "application/json" }),
        },
      });

      setDocumentId(result.id ?? null);
      setDocumentVersion(String(result.version ?? "0"));
      setUserState(updatedState);
    },
    [documentId, documentVersion, currentUser.id]
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
        topicXP: {},
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

      await writeUserState(updatedState);
    },
    [userState, documentId, writeUserState]
  );

  const completeMission = useCallback(
    (missionId: string) => {
      if (!userState) return;
      if (userState.completedMissions.includes(missionId)) return;

      const newCompleted = [...userState.completedMissions, missionId];

      // Evaluate badges with new completed missions
      const newBadges = [...userState.badges];
      for (const badgeDef of ALL_BADGES) {
        if (!newBadges.includes(badgeDef.id)) {
          if (
            badgeDef.predicate({
              completedMissions: newCompleted,
              streakDays: userState.streakDays,
              disciplines: userState.disciplines,
              topicXP: userState.topicXP,
              totalXP: computeTotalXP(userState.disciplines),
            })
          ) {
            newBadges.push(badgeDef.id);
          }
        }
      }

      const updatedState: UserState = {
        ...userState,
        completedMissions: newCompleted,
        badges: newBadges,
      };

      setUserState(updatedState);
      void writeUserState(updatedState);
    },
    [userState, writeUserState]
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
