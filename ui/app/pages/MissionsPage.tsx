import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";

import { Chip } from "@dynatrace/strato-components-preview/content";

import { MISSIONS } from "../data/missions";
import { CIRCUITS } from "../data/circuits";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext } from "../context/LeaderboardContext";
import { useUnlockedMissions } from "../hooks/useUnlockedMissions";
import { useFilteredMissions } from "../hooks/useFilteredMissions";
import type { MissionFilters } from "../hooks/useFilteredMissions";

import { MissionCard } from "../components/MissionCard";
import { PlayerStatusStrip } from "../components/PlayerStatusStrip";
import { computeTotalXP } from "../types/UserState";
import type { Discipline } from "../types/UserState";

export const MissionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userState } = useUserStateContext();
  const { scores, loading: leaderboardLoading, fetchScores } = useLeaderboardContext();

  const currentUser = getCurrentUserDetails();
  const displayName =
    (currentUser.name && !currentUser.name.includes("dt.missing") && currentUser.name) ||
    (currentUser.email && !currentUser.email.includes("dt.missing") && currentUser.email) ||
    currentUser.id;

  // Init from query params
  const [selectedPath, setSelectedPath] = useState<string | null>(
    searchParams.get("path")
  );
  const [filters] = useState<MissionFilters>({
    discipline: (searchParams.get("discipline") as Discipline | null),
    topic: searchParams.get("topic"),
    difficulty: searchParams.get("difficulty") as MissionFilters["difficulty"],
    maxTime: searchParams.get("maxTime") ? Number(searchParams.get("maxTime")) : null,
  });
  const showLocked = false;

  // Fetch scores for rank on mount if not cached
  useEffect(() => {
    if (scores.length === 0 && !leaderboardLoading) {
      void fetchScores();
    }
  }, []);

  const completedMissions = userState?.completedMissions ?? [];
  const completedSet = useMemo(
    () => new Set(completedMissions),
    [completedMissions]
  );
  const unlockedSet = useUnlockedMissions(completedMissions);
  const filteredMissions = useFilteredMissions(
    MISSIONS,
    unlockedSet,
    completedSet,
    filters,
    showLocked,
    selectedPath
  );
  // Compute rank
  const totalXP = userState ? computeTotalXP(userState.disciplines) : 0;
  const globalRank = useMemo(() => {
    if (scores.length === 0) return null;
    // Aggregate total score per user
    const userTotals = new Map<string, number>();
    for (const s of scores) {
      userTotals.set(s.userId, (userTotals.get(s.userId) ?? 0) + s.totalScore);
    }
    const sorted = [...userTotals.entries()].sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([uid]) => uid === currentUser.id);
    return idx >= 0 ? idx + 1 : null;
  }, [scores, currentUser.id]);

  // Prerequisite names for locked missions
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

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "24px" }}>
      {/* Player Status Strip */}
      <div style={{ marginBottom: "32px" }}>
        <PlayerStatusStrip
          playerName={displayName}
          totalXP={totalXP}
          globalRank={globalRank}
          missionsCompleted={completedMissions.length}
          streakDays={userState?.streakDays ?? 0}
        />
      </div>

      {/* Circuits Row */}
      <div style={{ marginBottom: "16px" }}>
      <Flex flexDirection="column" gap={8}>
        <Heading level={4}>Circuits</Heading>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Chip
            color={selectedPath === null ? "primary" : "neutral"}
            variant={selectedPath === null ? "emphasized" : undefined}
            onClick={() => handlePathSelect(null)}
          >
            All
          </Chip>
          {CIRCUITS.map((path) => (
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
      </Flex>
      </div>

      {/* Mission Grid */}
      <div style={{ marginTop: "8px" }}>
      <Flex flexDirection="column" gap={12}>
        <Heading level={4}>
          All Missions{" "}
          <Text textStyle="small" style={{ opacity: 0.6 }}>
            ({filteredMissions.length})
          </Text>
        </Heading>
        {filteredMissions.length === 0 ? (
          <Flex flexDirection="column" gap={8} alignItems="center" padding={24}>
            <Text>No missions match your filters</Text>
          </Flex>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
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
        )}
      </Flex>
      </div>
    </div>
  );
};
