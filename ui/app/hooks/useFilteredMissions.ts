import { useMemo } from "react";
import type { Mission } from "../types/mission.types";
import type { Discipline } from "../types/UserState";
import { LEARNING_PATHS } from "../data/learningPaths";

export interface MissionFilters {
  discipline: Discipline | null;
  topic: string | null;
  difficulty: Mission["difficulty"] | null;
  maxTime: number | null;
}

export function useFilteredMissions(
  missions: Mission[],
  unlockedSet: Set<string>,
  completedSet: Set<string>,
  filters: MissionFilters,
  showLocked: boolean,
  selectedPath: string | null
): Mission[] {
  return useMemo(() => {
    let result = [...missions];

    if (selectedPath) {
      const path = LEARNING_PATHS.find((p) => p.id === selectedPath);
      const pathMissionIds = path?.missionIds ?? [];
      result = result.filter((m) => pathMissionIds.includes(m.id));
    }

    if (filters.discipline) {
      result = result.filter((m) =>
        m.disciplines.some((d) => d.track === filters.discipline)
      );
    }

    if (filters.topic) {
      result = result.filter((m) => m.topics?.includes(filters.topic!));
    }

    if (filters.difficulty) {
      result = result.filter((m) => m.difficulty === filters.difficulty);
    }

    if (filters.maxTime) {
      result = result.filter((m) => m.timerSeconds <= filters.maxTime! * 60);
    }

    if (!showLocked) {
      result = result.filter((m) => unlockedSet.has(m.id));
    }

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
  }, [missions, unlockedSet, completedSet, filters, showLocked, selectedPath]);
}
