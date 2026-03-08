import React from "react";

interface SkeletonRowsProps {
  rows?: number;
}

export const SkeletonRows = ({ rows = 5 }: SkeletonRowsProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "40px",
            borderRadius: "4px",
            background: "var(--dt-colors-background-container-neutral-subdued)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
