import React from "react";

interface PlayerStatusStripProps {
  playerName: string;
  totalXP: number;
  globalRank: number | null;
  missionsCompleted: number;
  streakDays: number;
  rightContent?: React.ReactNode;
  department?: "d1" | "engineering";
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
  department,
}: PlayerStatusStripProps) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "12px" }}>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{playerName}</div>
        {department && <span style={{ fontSize: 10, padding: "3px 7px", borderRadius: 12, background: department === "d1" ? "rgba(101,224,211,.16)" : "rgba(255,255,255,.08)", color: department === "d1" ? "#65e0d3" : "var(--dt-colors-text-neutral-subdued)", textTransform: "uppercase", letterSpacing: ".08em" }}>{department === "d1" ? "D1" : "Engineering"}</span>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", rowGap: "12px" }}>
        <div style={{ display: "flex", gap: "32px" }}>
          <StatCell value={String(totalXP)} label="XP" />
          <StatCell value={globalRank !== null ? `#${globalRank}` : "\u2014"} label="Rank" />
          <StatCell value={String(missionsCompleted)} label="Missions" />
          <StatCell value={String(streakDays)} label="Streak" />
        </div>
        {rightContent && (
          <div style={{ marginLeft: "auto" }}>
            {rightContent}
          </div>
        )}
        <div style={{ marginLeft: rightContent ? "0" : "auto" }}>
          <button
            onClick={() => window.open("https://playground.apps.dynatrace.com/", "_blank")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid var(--dt-colors-border-neutral-default)",
              background: "transparent",
              color: "var(--dt-colors-text-neutral-subdued)",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {"Open Playground \u2197"}
          </button>
        </div>
      </div>
    </div>
  );
};
