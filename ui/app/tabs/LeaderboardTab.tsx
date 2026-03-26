import React, { useEffect, useMemo } from "react";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { useLeaderboardContext, type StoredScore } from "../context/LeaderboardContext";
import { useUserStateContext } from "../context/UserStateContext";
import { SkeletonRows } from "../components/SkeletonRows";
import { ErrorRetry } from "../components/ErrorRetry";
import { EmptyState } from "../components/EmptyState";
import { XP_THRESHOLDS } from "../types/UserState";
import type { Discipline } from "../types/UserState";

// --- Helmet & color mapping ---

const DISCIPLINE_HELMET: Record<Discipline, string> = {
  sre: "/ui/assets/helmets/verstappen.png",
  developer: "/ui/assets/helmets/lawson.png",
  "incident-commander": "/ui/assets/helmets/lindblad.png",
  "platform-engineer": "/ui/assets/helmets/hadjar.png",
};

const DISCIPLINE_BAR_COLOR: Record<Discipline, string> = {
  sre: "#3B82F6",
  developer: "#10B981",
  "incident-commander": "#F59E0B",
  "platform-engineer": "#8B5CF6",
};

const POSITION_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

// --- Country flag emoji helper ---

function countryToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

// --- Helpers ---

function resolveDisplayName(s: StoredScore): string {
  const name = s.userName;
  if (name && name !== "Unknown" && !name.includes("dt.missing")) return name;
  return `${s.userId.slice(0, 8)}...`;
}

function getLevelName(totalXP: number): string {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_THRESHOLDS[i].xp) return XP_THRESHOLDS[i].name;
  }
  return "Recruit";
}

function guessDisciplineFromRole(role: string): Discipline | null {
  const lower = role.toLowerCase();
  if (lower.includes("sre")) return "sre";
  if (lower.includes("incident") || lower.includes("commander")) return "incident-commander";
  if (lower.includes("developer") || lower.includes("dev")) return "developer";
  if (lower.includes("platform") || lower.includes("engineer")) return "platform-engineer";
  return null;
}

interface StandingsRow {
  position: number;
  name: string;
  userId: string;
  totalPts: number;
  isCurrentUser: boolean;
  discipline: Discipline | null;
  country: string | null;
}

function aggregateStandings(
  scores: StoredScore[],
  currentUserId: string,
  currentUserDiscipline: Discipline | null,
  currentUserCountry: string | null,
): StandingsRow[] {
  const playerData = new Map<string, { name: string; totalPts: number; roles: string[] }>();

  for (const s of scores) {
    const existing = playerData.get(s.userId);
    if (existing) {
      existing.totalPts += s.totalScore;
      if (s.role && !existing.roles.includes(s.role)) existing.roles.push(s.role);
    } else {
      playerData.set(s.userId, {
        name: resolveDisplayName(s),
        totalPts: s.totalScore,
        roles: s.role ? [s.role] : [],
      });
    }
  }

  const sorted = [...playerData.entries()]
    .sort((a, b) => b[1].totalPts - a[1].totalPts);

  return sorted.map(([userId, data], i) => {
    const isCurrentUser = userId === currentUserId;
    let discipline: Discipline | null = null;
    let country: string | null = null;

    if (isCurrentUser) {
      discipline = currentUserDiscipline;
      country = currentUserCountry ?? null;
    } else {
      for (const role of data.roles) {
        discipline = guessDisciplineFromRole(role);
        if (discipline) break;
      }
    }

    return {
      position: i + 1,
      name: data.name,
      userId,
      totalPts: Math.round(data.totalPts),
      isCurrentUser,
      discipline,
      country,
    };
  });
}

// --- Component ---

export const LeaderboardTab = () => {
  const { scores, loading, error, stale, fetchScores, retry } =
    useLeaderboardContext();
  const { userState } = useUserStateContext();
  const currentUser = getCurrentUserDetails();

  useEffect(() => {
    if (stale || scores.length === 0) {
      void fetchScores();
    }
  }, []);

  const rows = useMemo(
    () =>
      aggregateStandings(
        scores,
        currentUser.id,
        userState?.startingDiscipline ?? null,
        userState?.country ?? null,
      ),
    [scores, currentUser.id, userState?.startingDiscipline, userState?.country]
  );

  const currentUserPosition = rows.find((r) => r.isCurrentUser)?.position ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            Standings
          </div>
          <div style={{ fontSize: "13px", opacity: 0.5, marginTop: "4px" }}>
            Season 1 · Mission Control
          </div>
        </div>
        {currentUserPosition !== null && (
          <div style={{
            fontSize: "24px",
            fontWeight: 700,
            color: POSITION_COLORS[currentUserPosition] ?? "var(--dt-colors-text-neutral-default)",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            padding: "8px 16px",
            letterSpacing: "0.05em",
          }}>
            P{currentUserPosition}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonRows rows={5} />
      ) : error ? (
        <ErrorRetry message={error} onRetry={retry} />
      ) : rows.length === 0 ? (
        <EmptyState message="No scores yet" />
      ) : (
        <div>
          {rows.map((row) => {
            const posColor = POSITION_COLORS[row.position] ?? undefined;
            const barColor = row.discipline
              ? DISCIPLINE_BAR_COLOR[row.discipline]
              : "var(--dt-colors-border-neutral-default)";
            const helmetSrc = row.discipline ? DISCIPLINE_HELMET[row.discipline] : null;
            const levelName = getLevelName(row.totalPts);
            const initial = row.name.charAt(0).toUpperCase();

            return (
              <div
                key={row.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--dt-colors-border-neutral-disabled)",
                  background: row.isCurrentUser
                    ? "rgba(20, 150, 255, 0.08)"
                    : row.position % 2 === 0
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                }}
              >
                {/* Position */}
                <div style={{
                  width: "48px",
                  flexShrink: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: posColor ?? "var(--dt-colors-text-neutral-subdued)",
                }}>
                  P{row.position}
                </div>

                {/* Discipline color bar */}
                <div style={{
                  width: "4px",
                  height: "36px",
                  borderRadius: "2px",
                  background: barColor,
                  flexShrink: 0,
                  marginRight: "12px",
                }} />

                {/* Helmet / initial */}
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginRight: "10px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: helmetSrc ? "transparent" : "rgba(255,255,255,0.1)",
                }}>
                  {helmetSrc ? (
                    <img
                      src={helmetSrc}
                      alt=""
                      style={{ width: "32px", height: "32px", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: "14px", fontWeight: 600, opacity: 0.6 }}>
                      {initial}
                    </span>
                  )}
                </div>

                {/* Name + country */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: row.isCurrentUser ? 600 : 400,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    <span style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {row.name}
                    </span>
                    {row.country && (
                      <span style={{ fontSize: "14px", flexShrink: 0 }}>
                        {countryToFlag(row.country)}
                      </span>
                    )}
                    {row.isCurrentUser && (
                      <span style={{ fontSize: "11px", opacity: 0.4 }}>(you)</span>
                    )}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.45, marginTop: "1px" }}>
                    {levelName}
                  </div>
                </div>

                {/* PTS */}
                <div style={{
                  flexShrink: 0,
                  textAlign: "right",
                  minWidth: "80px",
                }}>
                  <span style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: posColor ?? "var(--dt-colors-text-neutral-default)",
                  }}>
                    {row.totalPts}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    opacity: 0.45,
                    marginLeft: "4px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}>
                    PTS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
