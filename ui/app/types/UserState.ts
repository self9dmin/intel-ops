export type UserRole = "sre" | "developer" | "incident-commander" | "platform-engineer";

export interface UserState {
  userId: string;
  userEmail: string;
  role: UserRole;
  onboardingComplete: boolean;
  createdAt: string;
}
