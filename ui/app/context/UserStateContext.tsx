import React, { createContext, useContext } from "react";
import { useUserState } from "../hooks/useUserState";
import type { UserState, DataMode, TenantCapabilities } from "../types/UserState";
import type { XPGrant } from "../types/mission.types";
import type { OnboardingPartial } from "../pages/OnboardingWizard";

export interface UserStateContextValue {
  userState: UserState | null;
  loading: boolean;
  error: string | null;
  saveUserState: (partial: OnboardingPartial) => Promise<void>;
  awardXP: (xpGrants: XPGrant[]) => Promise<void>;
  completeMissionWithXP: (missionId: string, xpGrants: XPGrant[]) => Promise<void>;
  resetUserState: () => Promise<void>;
  completeMission: (missionId: string) => void;
  updateStreak: () => void;
  awardBadge: (badgeId: string) => void;
  retry: () => void;
  setDataMode: (mode: DataMode) => Promise<void>;
  saveTenantCapabilities: (caps: TenantCapabilities) => Promise<void>;
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
