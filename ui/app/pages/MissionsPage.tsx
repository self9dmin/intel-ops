import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { Select, SelectOption } from "@dynatrace/strato-components-preview/forms";
import { Switch } from "@dynatrace/strato-components-preview/forms";
import { MISSIONS } from "../data/missions";
import { LEARNING_PATHS } from "../data/learningPaths";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext } from "../context/LeaderboardContext";
import { useUnlockedMissions } from "../hooks/useUnlockedMissions";
import { useFilteredMissions } from "../hooks/useFilteredMissions";
import type { MissionFilters } from "../hooks/useFilteredMissions";
import { useRecommendedMissions } from "../hooks/useRecommendedMissions";
import { MissionCard } from "../components/MissionCard";
import { PlayerStatusStrip } from "../components/PlayerStatusStrip";
import { computeTotalXP, DISCIPLINE_META, TOPIC_META } from "../types/UserState";
import type { Discipline } from "../types/UserState";

const ALL_DISCIPLINES: { value: Discipline; label: string }[] = (
  Object.keys(DISCIPLINE_META) as Discipline[]
).map((key) => ({ value: key, label: DISCIPLINE_META[key].label }));

const ALL_TOPICS: { value: string; label: string }[] = Object.entries(TOPIC_META).map(
  ([key, meta]) => ({ value: key, label: meta.label })
);

const ALL_DIFFICULTIES: { value: string; label: string }[] = [
  { value: "rookie", label: "Rookie" },
  { value: "operator", label: "Operator" },
  { value: "elite", label: "Elite" },
  { value: "legend", label: "Legend" },
];

const MAX_TIME_OPTIONS: { value: string; label: string }[] = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
];

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
  const [filters, setFilters] = useState<MissionFilters>({
    discipline: (searchParams.get("discipline") as Discipline | null),
    topic: searchParams.get("topic"),
    difficulty: searchParams.get("difficulty") as MissionFilters["difficulty"],
    maxTime: searchParams.get("maxTime") ? Number(searchParams.get("maxTime")) : null,
  });
  const [showLocked, setShowLocked] = useState(false);

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
  const recommendations = useRecommendedMissions(
    unlockedSet,
    completedSet,
    selectedPath,
    userState!
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

  const updateFilter = (key: keyof MissionFilters, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
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

  const clearAllFilters = () => {
    setFilters({ discipline: null, topic: null, difficulty: null, maxTime: null });
    setSelectedPath(null);
    setShowLocked(false);
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    filters.discipline || filters.topic || filters.difficulty || filters.maxTime || selectedPath;

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

      {/* Recommended Missions */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
        <Flex flexDirection="column" gap={12}>
          <Heading level={4}>Recommended for you</Heading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {recommendations.map((rec) => (
              <MissionCard
                key={rec.mission.id}
                mission={rec.mission}
                isUnlocked={unlockedSet.has(rec.mission.id)}
                isCompleted={completedSet.has(rec.mission.id)}
                recommendReason={rec.reason}
              />
            ))}
          </div>
        </Flex>
        </div>
      )}
      {completedMissions.length === 0 && recommendations.length === 0 && (
        <div style={{ marginBottom: "24px" }}>
          <Text textStyle="small" style={{ opacity: 0.6 }}>
            Complete a mission to unlock recommendations
          </Text>
        </div>
      )}

      {/* Learning Paths Row */}
      <div style={{ marginBottom: "16px" }}>
      <Flex flexDirection="column" gap={8}>
        <Heading level={4}>Learning Paths</Heading>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
      </Flex>
      </div>

      {/* Mission Filters Row */}
      <div style={{ marginBottom: "12px" }}>
      <Flex flexDirection="column" gap={8}>
        <Text textStyle="small" style={{ fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "11px" }}>
          Filters
        </Text>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ minWidth: "160px" }}>
            <div style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)", marginBottom: "4px" }}>Discipline</div>
            <Select
              name="discipline-filter"
              value={filters.discipline ?? ""}
              onChange={(value: string | null) =>
                updateFilter("discipline", value || null)
              }
            >
              <SelectOption value="" id="disc-none">All Disciplines</SelectOption>
              {ALL_DISCIPLINES.map((d) => (
                <SelectOption key={d.value} value={d.value} id={`disc-${d.value}`}>
                  {d.label}
                </SelectOption>
              ))}
            </Select>
          </div>
          <div style={{ minWidth: "140px" }}>
            <div style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)", marginBottom: "4px" }}>Topic</div>
            <Select
              name="topic-filter"
              value={filters.topic ?? ""}
              onChange={(value: string | null) =>
                updateFilter("topic", value || null)
              }
            >
              <SelectOption value="" id="topic-none">All Topics</SelectOption>
              {ALL_TOPICS.map((t) => (
                <SelectOption key={t.value} value={t.value} id={`topic-${t.value}`}>
                  {t.label}
                </SelectOption>
              ))}
            </Select>
          </div>
          <div style={{ minWidth: "140px" }}>
            <div style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)", marginBottom: "4px" }}>Difficulty</div>
            <Select
              name="difficulty-filter"
              value={filters.difficulty ?? ""}
              onChange={(value: string | null) =>
                updateFilter("difficulty", value || null)
              }
            >
              <SelectOption value="" id="diff-none">All Difficulties</SelectOption>
              {ALL_DIFFICULTIES.map((d) => (
                <SelectOption key={d.value} value={d.value} id={`diff-${d.value}`}>
                  {d.label}
                </SelectOption>
              ))}
            </Select>
          </div>
          <div style={{ minWidth: "120px" }}>
            <div style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)", marginBottom: "4px" }}>Max Time</div>
            <Select
              name="maxtime-filter"
              value={filters.maxTime ? String(filters.maxTime) : ""}
              onChange={(value: string | null) =>
                updateFilter("maxTime", value || null)
              }
            >
              <SelectOption value="" id="time-none">Any Time</SelectOption>
              {MAX_TIME_OPTIONS.map((t) => (
                <SelectOption key={t.value} value={t.value} id={`time-${t.value}`}>
                  {t.label}
                </SelectOption>
              ))}
            </Select>
          </div>
          <Switch value={showLocked} onChange={setShowLocked}>
            Show Locked
          </Switch>
          {hasActiveFilters && (
            <Button variant="default" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          )}
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
            <Button variant="default" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
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
