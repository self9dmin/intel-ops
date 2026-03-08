import React from "react";

interface PlayerStatusStripProps {
  playerName: string;
  totalXP: number;
  globalRank: number | null;
  missionsCompleted: number;
  streakDays: number;
  rightContent?: React.ReactNode;
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", minWidth: "80px" }}>
      <div style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "var(--dt-colors-text-neutral-subdued)",
          marginTop: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export const PlayerStatusStrip = ({
  playerName,
  totalXP,
  globalRank,
  missionsCompleted,
  streakDays,
  rightContent,
}: PlayerStatusStripProps) => {
  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>
        {playerName}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
          }}
        >
          <StatCell value={String(totalXP)} label="XP" />
          <StatCell
            value={globalRank !== null ? `#${globalRank}` : "\u2014"}
            label="Rank"
          />
          <StatCell value={String(missionsCompleted)} label="Missions" />
          <StatCell value={String(streakDays)} label="Streak" />
        </div>
        {rightContent && (
          <div style={{ marginLeft: "auto", alignSelf: "flex-start", paddingTop: "3px" }}>
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};
