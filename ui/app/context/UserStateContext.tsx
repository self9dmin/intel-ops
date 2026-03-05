import React, { createContext, useContext } from "react";
import { useUserState } from "../hooks/useUserState";
import type { UserState, Discipline } from "../types/UserState";

interface UserStateContextValue {
  userState: UserState | null;
  loading: boolean;
  error: string;
  saveUserState: (startingDiscipline: Discipline) => Promise<void>;
  awardXP: (missionId: string) => Promise<void>;
  resetUserState: () => Promise<void>;
}

const UserStateContext = createContext<UserStateContextValue | null>(null);

export const UserStateProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useUserState();
  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

export function useUserStateContext(): UserStateContextValue {
  const ctx = useContext(UserStateContext);
  if (!ctx) {
    throw new Error("useUserStateContext must be used within a UserStateProvider");
  }
  return ctx;
}
