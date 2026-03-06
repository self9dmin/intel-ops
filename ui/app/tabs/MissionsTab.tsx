import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { MISSIONS } from "../data/missions";
import { LEARNING_PATHS } from "../data/learningPaths";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext } from "../context/LeaderboardContext";
import { useUnlockedMissions } from "../hooks/useUnlockedMissions";
import { useRecommendedMissions } from "../hooks/useRecommendedMissions";
import { MissionCard } from "../components/MissionCard";
import { PlayerStatusStrip } from "../components/PlayerStatusStrip";
import { computeTotalXP } from "../types/UserState";
import { ALL_BADGES } from "../data/badges";
import type { SidebarFilters } from "../components/AppSidebar";
import type { Mission } from "../types/mission.types";

function getBadgeEmoji(icon: string): string {
  const map: Record<string, string> = {
    rocket: "\u{1F680}",
    flame: "\u{1F525}",
    lightning: "\u26A1",
    graduation: "\u{1F393}",
    star: "\u2B50",
    shield: "\u{1F6E1}\uFE0F",
  };
  return map[icon] ?? "\u{1F3C6}";
}

interface MissionsTabProps {
  filters: SidebarFilters;
  onSwitchTab?: (tab: "progress") => void;
}

function applyFilters(
  missions: Mission[],
  sidebarFilters: SidebarFilters,
  selectedPath: string | null,
  unlockedSet: Set<string>,
  completedSet: Set<string>
): Mission[] {
  let result = [...missions];

  if (selectedPath) {
    const path = LEARNING_PATHS.find((p) => p.id === selectedPath);
    const pathMissionIds = path?.missionIds ?? [];
    result = result.filter((m) => pathMissionIds.includes(m.id));
  }

  if (sidebarFilters.role) {
    const roleMap: Record<string, string> = {
      sre: "SRE",
      developer: "Developer",
      "incident-commander": "Incident Commander",
      "platform-engineer": "Platform Engineer",
    };
    const roleLabel = roleMap[sidebarFilters.role] ?? sidebarFilters.role;
    result = result.filter(
      (m) =>
        m.role === roleLabel ||
        m.disciplines.some((d) => d.track === sidebarFilters.role)
    );
  }

  if (sidebarFilters.difficulty) {
    result = result.filter((m) => m.difficulty === sidebarFilters.difficulty);
  }

  if (sidebarFilters.time) {
    result = result.filter((m) => {
      const mins = m.timerSeconds / 60;
      switch (sidebarFilters.time) {
        case "quick":
          return mins < 15;
        case "standard":
          return mins >= 15 && mins <= 30;
        case "deep":
          return mins > 30;
        default:
          return true;
      }
    });
  }

  if (sidebarFilters.category) {
    result = result.filter((m) => m.category === sidebarFilters.category);
  }

  // Sort: unlocked & incomplete first, then completed, then locked
  result.sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id);
    const bUnlocked = unlockedSet.has(b.id);
    const aCompleted = completedSet.has(a.id);
    const bCompleted = completedSet.has(b.id);

    if (aUnlocked && !aCompleted && !(bUnlocked && !bCompleted)) return -1;
    if (bUnlocked && !bCompleted && !(aUnlocked && !aCompleted)) return 1;
    if (aUnlocked && aCompleted && !bUnlocked) return -1;
    if (bUnlocked && bCompleted && !aUnlocked) return 1;
    return 0;
  });

  return result;
}

export const MissionsTab = ({ filters, onSwitchTab }: MissionsTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userState } = useUserStateContext();
  const { scores, loading: leaderboardLoading, fetchScores } = useLeaderboardContext();

  const currentUser = getCurrentUserDetails();
  const displayName =
    (currentUser.name && !currentUser.name.includes("dt.missing") && currentUser.name) ||
    (currentUser.email && !currentUser.email.includes("dt.missing") && currentUser.email) ||
    currentUser.id;

  const [selectedPath, setSelectedPath] = useState<string | null>(
    searchParams.get("path")
  );

  useEffect(() => {
    if (scores.length === 0 && !leaderboardLoading) {
      void fetchScores();
    }
  }, []);

  const completedMissions = userState?.completedMissions ?? [];
  const completedSet = useMemo(() => new Set(completedMissions), [completedMissions]);
  const earnedBadges = useMemo(() => new Set(userState?.badges ?? []), [userState?.badges]);
  const unlockedSet = useUnlockedMissions(completedMissions);
  const recommendations = useRecommendedMissions(
    unlockedSet,
    completedSet,
    selectedPath,
    userState!
  );

  const filteredMissions = useMemo(
    () => applyFilters(MISSIONS, filters, selectedPath, unlockedSet, completedSet),
    [filters, selectedPath, unlockedSet, completedSet]
  );

  const totalXP = userState ? computeTotalXP(userState.disciplines) : 0;
  const globalRank = useMemo(() => {
    if (scores.length === 0) return null;
    const userTotals = new Map<string, number>();
    for (const s of scores) {
      userTotals.set(s.userId, (userTotals.get(s.userId) ?? 0) + s.totalScore);
    }
    const sorted = [...userTotals.entries()].sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([uid]) => uid === currentUser.id);
    return idx >= 0 ? idx + 1 : null;
  }, [scores, currentUser.id]);

  const getPrerequisiteNames = (prereqs: string[]): string[] => {
    return prereqs
      .map((id) => MISSIONS.find((m) => m.id === id)?.title ?? id)
      .filter(Boolean);
  };

  const handlePathSelect = (pathId: string | null) => {
    setSelectedPath(pathId);
    const newParams = new URLSearchParams(searchParams);
    if (pathId) {
      newParams.set("path", pathId);
    } else {
      newParams.delete("path");
    }
    setSearchParams(newParams, { replace: true });
  };

  const nextMission = recommendations[0]?.mission;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Player Stats Strip */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <PlayerStatusStrip
            playerName={displayName}
            totalXP={totalXP}
            globalRank={globalRank}
            missionsCompleted={completedMissions.length}
            streakDays={userState?.streakDays ?? 0}
          />
          {nextMission && (
            <Button
              variant="emphasized"
              onClick={() => navigate(`/missions/${nextMission.id}`)}
            >
              Continue Next Mission →
            </Button>
          )}
        </div>

        {/* Achievements Strip */}
        <div
          onClick={() => onSwitchTab?.("progress")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0 0 0",
            marginTop: "8px",
            cursor: "pointer",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "rgba(255,255,255,0.4)",
              marginRight: "4px",
            }}
          >
            ACHIEVEMENTS
          </span>
          {ALL_BADGES.map((badge) => {
            const isEarned = earnedBadges.has(badge.id);
            return (
              <span
                key={badge.id}
                title={badge.name}
                style={{
                  fontSize: "18px",
                  opacity: isEarned ? 1 : 0.3,
                  filter: isEarned ? "none" : "grayscale(1)",
                  transition: "opacity 0.2s",
                }}
              >
                {getBadgeEmoji(badge.icon)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Recommended Missions */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <Heading level={5}>Recommended for you</Heading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            {recommendations[0] && (
              <MissionCard
                mission={recommendations[0].mission}
                isUnlocked={unlockedSet.has(recommendations[0].mission.id)}
                isCompleted={completedSet.has(recommendations[0].mission.id)}
                recommendReason={recommendations[0].reason}
              />
            )}
            {recommendations[1] && (
              <MissionCard
                mission={recommendations[1].mission}
                isUnlocked={unlockedSet.has(recommendations[1].mission.id)}
                isCompleted={completedSet.has(recommendations[1].mission.id)}
                recommendReason={recommendations[1].reason}
              />
            )}
          </div>
        </div>
      )}

      {/* Learning Paths */}
      <div style={{ marginBottom: "16px" }}>
        <Heading level={5}>Learning Paths</Heading>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
          <Chip
            color={selectedPath === null ? "primary" : "neutral"}
            variant={selectedPath === null ? "emphasized" : undefined}
            onClick={() => handlePathSelect(null)}
          >
            All
          </Chip>
          {LEARNING_PATHS.map((path) => (
            <Chip
              key={path.id}
              color={selectedPath === path.id ? "primary" : "neutral"}
              variant={selectedPath === path.id ? "emphasized" : undefined}
              onClick={() =>
                handlePathSelect(selectedPath === path.id ? null : path.id)
              }
            >
              {path.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* Mission Grid */}
      <div style={{ marginTop: "8px" }}>
        <Heading level={5}>
          All Missions{" "}
          <Text textStyle="small" style={{ opacity: 0.6 }}>
            ({filteredMissions.length})
          </Text>
        </Heading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              isUnlocked={unlockedSet.has(mission.id)}
              isCompleted={completedSet.has(mission.id)}
              prerequisiteNames={getPrerequisiteNames(mission.prerequisites)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
