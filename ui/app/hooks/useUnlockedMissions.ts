import { useMemo } from "react";
import { MISSIONS } from "../data/missions";

export function useUnlockedMissions(completedMissions: string[]): Set<string> {
  return useMemo(() => {
    const unlocked = new Set<string>();
    for (const mission of MISSIONS) {
      if (mission.prerequisites.length === 0) {
        unlocked.add(mission.id);
      } else if (mission.prerequisites.every((id) => completedMissions.includes(id))) {
        unlocked.add(mission.id);
      }
    }
    return unlocked;
  }, [completedMissions]);
}
