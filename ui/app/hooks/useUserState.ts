import { useState, useEffect, useCallback } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import type { UserState, Discipline } from "../types/UserState";
import { createDefaultDisciplines, calculateLevel } from "../types/UserState";
import { getMissionById } from "../data/missions";

interface UseUserStateResult {
  userState: UserState | null;
  loading: boolean;
  error: string;
  saveUserState: (startingDiscipline: Discipline) => Promise<void>;
  awardXP: (missionId: string) => Promise<void>;
  resetUserState: () => Promise<void>;
}

const DOCUMENT_TYPE = "intelops-user-state";

function getDocumentName(userId: string): string {
  return `user-state-${userId}`;
}

export function useUserState(): UseUserStateResult {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentVersion, setDocumentVersion] = useState<string>("0");

  const currentUser = getCurrentUserDetails();

  useEffect(() => {
    let cancelled = false;

    async function loadUserState() {
      try {
        const list = await documentsClient.listDocuments({
          filter: `type == '${DOCUMENT_TYPE}' and name == '${getDocumentName(currentUser.id)}'`,
          pageSize: 1,
        });

        if (cancelled) return;

        if (list.documents && list.documents.length > 0) {
          const doc = list.documents[0];
          setDocumentId(doc.id ?? null);
          setDocumentVersion(String(doc.version ?? "0"));
          const content = await documentsClient.downloadDocumentContent({
            id: doc.id!,
          });
          const text: string = await content.get("text");
          const parsed = JSON.parse(text) as UserState;
          // Migrate old user states that pre-date the topicXP field
          if (!parsed.topicXP) {
            parsed.topicXP = {};
          }
          if (!cancelled) {
            setUserState(parsed);
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load user state:", err);
        if (!cancelled) {
          setError("Failed to load user state");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUserState();
    return () => {
      cancelled = true;
    };
  }, [currentUser.id]);

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
    async (missionId: string) => {
      if (!userState || !documentId) return;

      const mission = getMissionById(missionId);
      if (!mission) return;

      const updatedDisciplines = { ...userState.disciplines };

      for (const disc of mission.disciplines) {
        const current = updatedDisciplines[disc.track];
        const newXP = current.xp + disc.xp;
        const { level, levelName } = calculateLevel(newXP);
        updatedDisciplines[disc.track] = { xp: newXP, level, levelName };
      }

      const updatedTopicXP: Partial<Record<string, number>> = { ...(userState.topicXP ?? {}) };
      for (const topic of mission.topics ?? []) {
        updatedTopicXP[topic] = (updatedTopicXP[topic] ?? 0) + 50;
      }

      const updatedState: UserState = {
        ...userState,
        disciplines: updatedDisciplines,
        topicXP: updatedTopicXP,
      };

      try {
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
      } catch (err: unknown) {
        console.error("awardXP failed for mission", missionId, "docId", documentId, "version", documentVersion, err);
        throw err;
      }
    },
    [userState, documentId, documentVersion, currentUser.id]
  );

  const resetUserState = useCallback(async () => {
    if (!documentId) return;

    await documentsClient.deleteDocument({
      id: documentId,
      optimisticLockingVersion: documentVersion,
    });

    window.location.reload();
  }, [documentId, documentVersion]);

  return { userState, loading, error, saveUserState, awardXP, resetUserState };
}