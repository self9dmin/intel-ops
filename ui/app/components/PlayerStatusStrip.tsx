import React from "react";

interface PlayerStatusStripProps {
  playerName: string;
  totalXP: number;
  globalRank: number | null;
  missionsCompleted: number;
  streakDays: number;
}

export const PlayerStatusStrip = ({
  playerName,
  totalXP,
  globalRank,
  missionsCompleted,
  streakDays,
}: PlayerStatusStripProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "48px",
        padding: "16px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1 }}>
          {playerName}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "4px",
          }}
        >
          Player
        </div>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
          {totalXP}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "4px",
          }}
        >
          Total XP
        </div>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
          {globalRank !== null ? `#${globalRank}` : "\u2014"}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "4px",
          }}
        >
          Global Rank
        </div>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
          {missionsCompleted}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "4px",
          }}
        >
          Missions Completed
        </div>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
          {streakDays}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "4px",
          }}
        >
          Current Streak
        </div>
      </div>
    </div>
  );
};
