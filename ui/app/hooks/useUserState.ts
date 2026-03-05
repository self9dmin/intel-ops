import { useState, useEffect, useCallback } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import type { UserState, UserRole } from "../types/UserState";

interface UseUserStateResult {
  userState: UserState | null;
  loading: boolean;
  error: string;
  saveUserState: (role: UserRole) => Promise<void>;
}

const DOCUMENT_TYPE = "intelops-user-state";

function getDocumentName(userId: string): string {
  return `user-state-${userId}`;
}

export function useUserState(): UseUserStateResult {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        if (list.documents.length > 0) {
          const doc = list.documents[0];
          const content = await documentsClient.downloadDocumentContent({
            id: doc.id,
          });
          const text: string = await content.get("text");
          const parsed = JSON.parse(text) as UserState;
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
    async (role: UserRole) => {
      const state: UserState = {
        userId: currentUser.id,
        userEmail: currentUser.email ?? "",
        role,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      };

      await documentsClient.createDocument({
        body: {
          name: getDocumentName(currentUser.id),
          type: DOCUMENT_TYPE,
          content: new Blob([JSON.stringify(state)], { type: "application/json" }),

        },
      });

      setUserState(state);
    },
    [currentUser.id, currentUser.email]
  );

  return { userState, loading, error, saveUserState };
}
