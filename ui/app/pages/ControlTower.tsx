import React, { useMemo } from "react";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Surface } from "@dynatrace/strato-components/layouts";

import { MISSIONS } from "../data/missions";
import { CIRCUITS } from "../data/circuits";
import { useUserStateContext } from "../context/UserStateContext";
import { MissionCard } from "../components/MissionCard";
import { TOPIC_META } from "../types/UserState";
import type { TopicId } from "../types/UserState";
import type { Mission } from "../types/mission.types";

function prereqsMet(mission: Mission, completedSet: Set<string>): boolean {
  return mission.prerequisites.every((id) => completedSet.has(id));
}

export const ControlTower = () => {
  const { userState } = useUserStateContext();
  const completedMissions = userState?.completedMissions ?? [];
  const completedSet = useMemo(() => new Set(completedMissions), [completedMissions]);

  // Section 1: Next Mission
  const nextMission = useMemo(() => {
    return MISSIONS.find(
      (m) => !completedSet.has(m.id) && prereqsMet(m, completedSet)
    ) ?? null;
  }, [completedSet]);

  // Section 2: Active Circuit
  const activeCircuit = useMemo(() => {
    let best = CIRCUITS[0];
    let bestCount = 0;
    for (const circuit of CIRCUITS) {
      const count = circuit.missionIds.filter((id) => completedSet.has(id)).length;
      if (count > bestCount) {
        best = circuit;
        bestCount = count;
      }
    }
    return best;
  }, [completedSet]);

  const circuitMissionRows = useMemo(() => {
    return activeCircuit.missionIds.map((id) => {
      const mission = MISSIONS.find((m) => m.id === id);
      const title = mission?.title ?? id;
      if (completedSet.has(id)) {
        return { icon: "\u2714", title, status: "completed" as const };
      }
      if (mission && prereqsMet(mission, completedSet)) {
        return { icon: "\u23F3", title, status: "unlocked" as const };
      }
      return { icon: "\uD83D\uDD12", title, status: "locked" as const };
    });
  }, [activeCircuit, completedSet]);

  // Section 3: Your Pace
  const topTopics = useMemo(() => {
    const topicXP = userState?.topicXP ?? {};
    const entries = Object.entries(topicXP)
      .filter(([, xp]) => xp > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    if (entries.length === 0) return [];
    const maxXP = entries[0][1];
    return entries.map(([topic, xp]) => ({
      topic,
      label: TOPIC_META[topic as TopicId]?.label ?? topic,
      xp,
      widthPercent: maxXP > 0 ? (xp / maxXP) * 100 : 0,
    }));
  }, [userState?.topicXP]);

  // Section 4: Quick Missions
  const quickMissions = useMemo(() => {
    return MISSIONS.filter(
      (m) =>
        !completedSet.has(m.id) &&
        prereqsMet(m, completedSet) &&
        m.id !== nextMission?.id
    ).slice(0, 4);
  }, [completedSet, nextMission]);

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <Heading level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Control Tower
      </Heading>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Top Left: Next Mission */}
        <Surface>
          <div style={{ padding: "16px" }}>
            <Heading level={4}>Next Mission</Heading>
            <div style={{ marginTop: "12px" }}>
              {nextMission ? (
                <MissionCard
                  mission={nextMission}
                  isUnlocked={true}
                  isCompleted={false}
                />
              ) : (
                <Text>All available missions complete.</Text>
              )}
            </div>
          </div>
        </Surface>

        {/* Top Right: Active Circuit */}
        <Surface>
          <div style={{ padding: "16px" }}>
            <Heading level={4}>{activeCircuit.name}</Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              {circuitMissionRows.map((row) => (
                <div
                  key={row.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                  }}
                >
                  <span>{row.icon}</span>
                  <span
                    style={{
                      opacity: row.status === "locked" ? 0.5 : 1,
                      color: "var(--dt-colors-text-primary-default, #fff)",
                    }}
                  >
                    {row.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        {/* Bottom Left: Your Pace */}
        <Surface>
          <div style={{ padding: "16px" }}>
            <Heading level={4}>Your Pace</Heading>
            <div style={{ marginTop: "12px" }}>
              {topTopics.length === 0 ? (
                <Text>Complete missions to track your pace.</Text>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {topTopics.map((t) => (
                    <div key={t.topic}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--dt-colors-text-primary-default, #fff)" }}>{t.label}</span>
                        <span style={{ color: "var(--dt-colors-text-neutral-subdued)" }}>{t.xp} XP</span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          background: "var(--dt-colors-background-container-neutral-subdued)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${t.widthPercent}%`,
                            background: "var(--dt-colors-charts-categorical-default-12, #1496ff)",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Surface>

        {/* Bottom Right: Quick Missions */}
        <Surface>
          <div style={{ padding: "16px" }}>
            <Heading level={4}>Quick Missions</Heading>
            <div style={{ marginTop: "12px" }}>
              {quickMissions.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {quickMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      isUnlocked={true}
                      isCompleted={false}
                    />
                  ))}
                </div>
              ) : (
                <Text>No quick missions available.</Text>
              )}
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
};
