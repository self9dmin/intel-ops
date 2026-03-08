import { useMemo } from "react";
import type { Mission } from "../types/mission.types";
import type { UserState } from "../types/UserState";
import { MISSIONS } from "../data/missions";
import { CIRCUITS } from "../data/circuits";

export interface Recommendation {
  mission: Mission;
  reason: string;
}

const TOPIC_DISPLAY_NAMES: Record<string, string> = {
  databases: "Databases",
  kubernetes: "Kubernetes",
  tracing: "Tracing",
  metrics: "Metrics",
  logs: "Logs",
  alerting: "Alerting",
  dashboards: "Dashboards",
  slos: "SLOs",
  "cloud-automation": "Cloud Automation",
  security: "Security",
  rum: "Real User Monitoring",
  synthetics: "Synthetics",
};

const DISCIPLINE_DISPLAY_NAMES: Record<string, string> = {
  sre: "SRE",
  developer: "Developer",
  "incident-commander": "Incident Commander",
  "platform-engineer": "Platform Engineer",
};

function formatTopicName(topic: string): string {
  return TOPIC_DISPLAY_NAMES[topic] ?? topic;
}

function formatDisciplineName(discipline: string): string {
  return DISCIPLINE_DISPLAY_NAMES[discipline] ?? discipline;
}

export function useRecommendedMissions(
  unlockedSet: Set<string>,
  completedSet: Set<string>,
  selectedPath: string | null,
  userState: UserState
): Recommendation[] {
  return useMemo(() => {
    const candidates = MISSIONS.filter(
      (m) => unlockedSet.has(m.id) && !completedSet.has(m.id)
    );

    const recommendations: Recommendation[] = [];

    // Priority 1: Next mission in selected learning path
    if (selectedPath) {
      const path = CIRCUITS.find((p) => p.id === selectedPath);
      const pathIds = path?.missionIds ?? [];
      for (const id of pathIds) {
        if (unlockedSet.has(id) && !completedSet.has(id)) {
          const mission = MISSIONS.find((m) => m.id === id);
          if (mission) {
            recommendations.push({
              mission,
              reason: `Next in your "${path?.name ?? selectedPath}" path`,
            });
            break;
          }
        }
      }
    }

    // Priority 2: Weakest topic XP gap
    if (recommendations.length < 2) {
      const topicXP = userState.topicXP ?? {};
      const topicGaps = candidates
        .flatMap((m) => (m.topics ?? []).map((t) => ({ topic: t, mission: m })))
        .filter(
          ({ topic }) =>
            !recommendations.some((r) => r.mission.topics?.includes(topic))
        );

      topicGaps.sort(
        (a, b) => (topicXP[a.topic] ?? 0) - (topicXP[b.topic] ?? 0)
      );

      for (const { topic, mission } of topicGaps) {
        if (!recommendations.some((r) => r.mission.id === mission.id)) {
          recommendations.push({
            mission,
            reason: `Strengthen your weakest area: ${formatTopicName(topic)}`,
          });
          if (recommendations.length >= 2) break;
        }
      }
    }

    // Priority 3: Discipline match
    if (recommendations.length < 2) {
      const discipline = userState.startingDiscipline;
      for (const m of candidates) {
        if (
          m.disciplines.some((d) => d.track === discipline) &&
          !recommendations.some((r) => r.mission.id === m.id)
        ) {
          recommendations.push({
            mission: m,
            reason: `Matches your ${formatDisciplineName(discipline)} role`,
          });
          if (recommendations.length >= 2) break;
        }
      }
    }

    return recommendations.slice(0, 2);
  }, [unlockedSet, completedSet, selectedPath, userState]);
}
