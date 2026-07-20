import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUserDetails } from "@dynatrace-sdk/app-environment";
import { Heading, Text } from "@dynatrace/strato-components/typography";

import { Chip } from "@dynatrace/strato-components-preview/content";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { MISSIONS } from "../data/missions";
import { CIRCUITS, CIRCUIT_TIER_MAP } from "../data/circuits";
import type { DriverTier } from "../data/circuits";
import { TOPIC_META, XP_THRESHOLDS } from "../types/UserState";
import type { Discipline } from "../types/UserState";
import { getUnlockedTier, isTierUnlocked } from "../utils/xp";
import { useUserStateContext } from "../context/UserStateContext";
import { useLeaderboardContext } from "../context/LeaderboardContext";
import { useUnlockedMissions } from "../hooks/useUnlockedMissions";

import { MissionCard } from "../components/MissionCard";
import { CircuitPanel } from "../components/CircuitPanel";
import { PlayerStatusStrip } from "../components/PlayerStatusStrip";
import { ChangeDriverModal } from "../components/ChangeDriverModal";
import { TrackWalkBoard } from "../components/TrackWalkBoard";
import { getBadgeMonogram } from "../data/badgeMonograms";
import { computeTotalXP } from "../types/UserState";
import { ALL_BADGES } from "../data/badges";
import type { SidebarFilters } from "../components/AppSidebar";
import type { Mission } from "../types/mission.types";

const TIER_ORDER: DriverTier[] = ["rookie", "intermediate", "advanced", "elite"];

const DRIVER_INFO: Record<Discipline, { lastName: string; tier: string; helmet: string }> = {
  "incident-commander": { lastName: "Lindblad", tier: "Rookie", helmet: "/ui/assets/helmets/lindblad.png" },
  developer: { lastName: "Lawson", tier: "Intermediate", helmet: "/ui/assets/helmets/lawson.png" },
  "platform-engineer": { lastName: "Hadjar", tier: "Advanced", helmet: "/ui/assets/helmets/hadjar.png" },
  sre: { lastName: "Verstappen", tier: "Elite", helmet: "/ui/assets/helmets/verstappen.png" },
};

const DRIVER_CIRCUIT_MAP: Record<Discipline, string | null> = {
  "incident-commander": "ground-zero",
  developer: "operator-readiness",
  "platform-engineer": "reliability-driver",
  sre: null, // Race Day circuit not yet created
};

function getFormulaLevel(xp: number): string {
  const index = XP_THRESHOLDS.reduce((current, threshold, thresholdIndex) => xp >= threshold.xp ? thresholdIndex : current, 0);
  return ["F4", "F3", "F2", "F1", "F1"][Math.min(index, 4)];
}

interface MissionsTabProps {
  filters: SidebarFilters;
  onFilterChange?: (filters: SidebarFilters) => void;
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

  // Retired missions remain addressable for historical scores, but are not part of active discovery.
  result = result.filter((mission) => mission.status !== "retired");

  if (selectedPath) {
    const path = CIRCUITS.find((p) => p.id === selectedPath);
    const pathMissionIds = path?.missionIds ?? [];
    result = result.filter((m) => pathMissionIds.includes(m.id));
  }

  if (sidebarFilters.status === "not_started") {
    result = result.filter((m) => !completedSet.has(m.id));
  } else if (sidebarFilters.status === "completed") {
    result = result.filter((m) => completedSet.has(m.id));
  }

  if (sidebarFilters.difficulty) {
    result = result.filter((m) => m.difficulty === sidebarFilters.difficulty);
  }

  if (sidebarFilters.topic) {
    result = result.filter((m) => m.topics.includes(sidebarFilters.topic!));
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

export const MissionsTab = ({ filters, onFilterChange, onSwitchTab }: MissionsTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userState, updateUserState } = useUserStateContext();
  const { scores, loading: leaderboardLoading, fetchScores } = useLeaderboardContext();
  const [driverModalOpen, setDriverModalOpen] = useState(false);

  const currentUser = getCurrentUserDetails();
  const displayName =
    (currentUser.name && !currentUser.name.includes("dt.missing") && currentUser.name) ||
    (currentUser.email && !currentUser.email.includes("dt.missing") && currentUser.email) ||
    currentUser.id;

  const initPath = searchParams.get("path") ?? userState?.startingCircuit ?? null;
  const [selectedPath, setSelectedPath] = useState<string | null>(userState?.department === "engineering" && initPath === "track-walk" ? null : initPath);

  useEffect(() => {
    if (scores.length === 0 && !leaderboardLoading) {
      void fetchScores();
    }
  }, []);

  const completedMissions = userState?.completedMissions ?? [];
  const completedSet = useMemo(() => new Set(completedMissions), [completedMissions]);
  const earnedBadges = useMemo(() => new Set(userState?.badges ?? []), [userState?.badges]);
  const unlockedSet = useUnlockedMissions(completedMissions);
  const selectedCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === selectedPath) ?? null,
    [selectedPath]
  );
  const filteredMissions = useMemo(
    () => applyFilters(MISSIONS, filters, selectedPath, unlockedSet, completedSet),
    [filters, selectedPath, unlockedSet, completedSet]
  );

  const totalXP = userState ? computeTotalXP(userState.disciplines) : 0;
  const unlockedTier = getUnlockedTier(totalXP);

  const missionTierMap = useMemo(() => {
    const map = new Map<string, DriverTier>();
    for (const circuit of CIRCUITS) {
      const tier = CIRCUIT_TIER_MAP[circuit.id];
      if (!tier) continue;
      for (const missionId of circuit.missionIds) {
        const existing = map.get(missionId);
        if (!existing || TIER_ORDER.indexOf(tier) < TIER_ORDER.indexOf(existing)) {
          map.set(missionId, tier);
        }
      }
    }
    return map;
  }, []);

  const getTierLockTooltip = (missionId: string): string | null => {
    const tier = missionTierMap.get(missionId);
    if (!tier) return null;
    if (isTierUnlocked(tier, unlockedTier)) return null;
    const labelMap: Record<DriverTier, string> = {
      rookie: "Reach F4 · Rookie (0 XP) to unlock",
      intermediate: "Reach F3 · Intermediate (500 XP) to unlock",
      advanced: "Reach F2 · Advanced (1500 XP) to unlock",
      elite: "Reach F1 · Elite (3000 XP) to unlock",
    };
    return labelMap[tier];
  };

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
    if (pathId === "track-walk" && userState?.department !== "d1") return;
    setSelectedPath(pathId);
    const newParams = new URLSearchParams(searchParams);
    if (pathId) {
      newParams.set("path", pathId);
    } else {
      newParams.delete("path");
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    if (userState?.department !== "d1" && selectedPath === "track-walk") {
      setSelectedPath(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("path");
      setSearchParams(nextParams, { replace: true });
    }
  }, [userState?.department, selectedPath, searchParams, setSearchParams]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Player Stats Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "12px 0",
          borderBottom: "1px solid var(--dt-colors-border-neutral-disabled)",
          marginBottom: "32px",
        }}
      >
        {/* Driver helmet section */}
        {(() => {
          const disc = userState?.startingDiscipline ?? "incident-commander";
          const driver = DRIVER_INFO[disc];
          const progress = userState?.disciplines[disc];
          const xp = progress?.xp ?? 0;
          const currentThresholdXP =
            XP_THRESHOLDS.slice().reverse().find((t) => xp >= t.xp)?.xp ?? 0;
          const levelName = getFormulaLevel(xp);
          const next = XP_THRESHOLDS.find((t) => xp < t.xp);
          const isMax = !next;
          const progressPercent = isMax
            ? 100
            : ((xp - currentThresholdXP) / (next.xp - currentThresholdXP)) * 100;
          return (
            <div
              onClick={() => setDriverModalOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flexShrink: 0,
                minWidth: "72px",
              }}
            >
              <img
                src={driver.helmet}
                alt=""
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontSize: "11px", color: "var(--dt-colors-text-neutral-subdued)", marginTop: "4px", fontWeight: 600 }}>
                {driver.lastName}
              </span>
              <span style={{ fontSize: "10px", color: "var(--dt-colors-text-neutral-disabled)" }}>
                {driver.tier}
              </span>
              <div
                style={{
                  width: "48px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--dt-colors-background-container-neutral-default)",
                  overflow: "hidden",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    borderRadius: "2px",
                    background: "var(--dt-colors-charts-categorical-default-12, #1496ff)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: "9px", color: "var(--dt-colors-text-neutral-disabled)", marginTop: "2px" }}>
                {levelName} &middot; {xp} / {isMax ? "MAX" : `${next.xp} XP`}
              </span>
            </div>
          );
        })()}
        <div style={{ flex: 1 }}>
        <PlayerStatusStrip
          playerName={displayName}
          totalXP={totalXP}
          globalRank={globalRank}
          missionsCompleted={completedMissions.length}
          streakDays={userState?.streakDays ?? 0}
          department={userState?.department}
          rightContent={
            <div
              onClick={() => onSwitchTab?.("progress")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--dt-colors-text-neutral-disabled)",
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
                    <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: "50%", border: "1px solid currentColor", fontSize: 9, fontWeight: 700 }}>{getBadgeMonogram(badge.icon)}</span>
                  </span>
                );
              })}
            </div>
          }
        />
        </div>
      </div>

      <ChangeDriverModal
        isOpen={driverModalOpen}
        onClose={() => setDriverModalOpen(false)}
        currentDiscipline={userState?.startingDiscipline ?? "incident-commander"}
        currentDepartment={userState?.department}
        onDepartmentChange={(department) => void updateUserState({ department })}
        onSelect={(discipline, experienceLevel) => {
          void updateUserState({ startingDiscipline: discipline, experienceLevel });
          if (onFilterChange) {
            const difficultyFilter: SidebarFilters["difficulty"] =
              discipline === "incident-commander" ? "rookie" : null;
            onFilterChange({ ...filters, difficulty: difficultyFilter });
          }
          handlePathSelect(DRIVER_CIRCUIT_MAP[discipline]);
          setDriverModalOpen(false);
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {selectedPath !== null && selectedCircuit && selectedPath !== "track-walk" && <CircuitPanel circuit={selectedCircuit} completedMissionIds={completedSet} />}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Circuits */}
          <div style={{ marginBottom: "16px" }}>
            <Heading level={5}>Circuits</Heading>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {CIRCUITS.filter((path) => path.id !== "track-walk" || userState?.department === "d1").map((path) => (
                <Tooltip key={path.id} text={path.description}>
                  <Chip
                    color={selectedPath === path.id ? "primary" : "neutral"}
                    variant={selectedPath === path.id ? "emphasized" : undefined}
                    onClick={() =>
                      handlePathSelect(selectedPath === path.id ? null : path.id)
                    }
                  >
                    {path.name}
                  </Chip>
                </Tooltip>
              ))}
              <Chip
                color={selectedPath === null ? "primary" : "neutral"}
                variant={selectedPath === null ? "emphasized" : undefined}
                onClick={() => handlePathSelect(null)}
              >
                All
              </Chip>
            </div>
          </div>

          {selectedPath === "track-walk" ? <TrackWalkBoard /> : (
          /* Mission Grid */
          <div style={{ marginTop: "8px" }}>
            <Heading level={5}>
              All Missions{" "}
              <Text textStyle="small" style={{ opacity: 0.6 }}>
                ({filteredMissions.length})
              </Text>
            </Heading>
            {filteredMissions.length === 0 && selectedPath && filters.topic ? (
              <div
                style={{
                  marginTop: "24px",
                  padding: "24px",
                  textAlign: "center",
                  borderRadius: "8px",
                  background: "var(--dt-colors-background-container-neutral-subdued)",
                  border: "1px solid var(--dt-colors-border-neutral-disabled)",
                }}
              >
                <Text style={{ opacity: 0.7 }}>
                  No missions in{" "}
                  <strong>{CIRCUITS.find((c) => c.id === selectedPath)?.name ?? selectedPath}</strong>
                  {" "}match the{" "}
                  <strong>{TOPIC_META[filters.topic]?.label ?? filters.topic}</strong>
                  {" "}skill track.
                </Text>
                <div style={{ marginTop: "12px" }}>
                  <Chip
                    color="primary"
                    variant="emphasized"
                    onClick={() => handlePathSelect(null)}
                  >
                    View All Missions
                  </Chip>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
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
                    tierLocked={getTierLockTooltip(mission.id)}
                    stageLine={selectedCircuit ? `${selectedCircuit.name} · step ${selectedCircuit.missionIds.indexOf(mission.id) + 1} of ${selectedCircuit.missionIds.length}` : `${CIRCUITS.find((c) => c.missionIds.includes(mission.id))?.name ?? "Mission"} · ${mission.role}`}
                  />
                ))}
              </div>
            )}
          </div>
          )}
        </div>

      </div>
    </div>
  );
};
