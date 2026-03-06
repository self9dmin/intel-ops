import React, { useState, useMemo } from "react";
import { MISSIONS } from "../data/missions";
import type { MissionCategory } from "../types/mission.types";

export interface SidebarFilters {
  role: string | null;
  difficulty: string | null;
  time: "quick" | "standard" | "deep" | null;
  category: string | null;
}

interface FilterOption {
  value: string | null;
  label: string;
}

const ROLE_OPTIONS: FilterOption[] = [
  { value: null, label: "All" },
  { value: "sre", label: "SRE" },
  { value: "developer", label: "Developer" },
  { value: "incident-commander", label: "Incident Cmdr" },
  { value: "platform-engineer", label: "Platform Eng" },
];

const DIFFICULTY_OPTIONS: FilterOption[] = [
  { value: null, label: "All" },
  { value: "rookie", label: "Recruit" },
  { value: "operator", label: "Operator" },
  { value: "elite", label: "Elite" },
  { value: "legend", label: "Legend" },
];

const TIME_OPTIONS: FilterOption[] = [
  { value: null, label: "All" },
  { value: "quick", label: "Quick (<15min)" },
  { value: "standard", label: "Std (15-30)" },
  { value: "deep", label: "Deep (>30min)" },
];

const CATEGORY_OPTIONS: { value: MissionCategory | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "incident-response", label: "Incident Response" },
  { value: "performance", label: "Performance" },
  { value: "root-cause-analysis", label: "Root Cause" },
  { value: "configuration", label: "Configuration" },
  { value: "cost-optimization", label: "Cost Optimization" },
];

interface AppSidebarProps {
  activeTab: "missions" | "progress" | "leaderboard";
  onFilterChange: (filters: SidebarFilters) => void;
  onSwitchToMissions: () => void;
}

function FilterSection({
  label,
  options,
  selected,
  onSelect,
  categoryMissionCounts,
}: {
  label: string;
  options: FilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  categoryMissionCounts?: Map<string | null, number>;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        const count = categoryMissionCounts?.get(opt.value);
        const dimmed = count !== undefined && count <= 1;
        return (
          <div
            key={opt.value ?? "__all__"}
            onClick={() => onSelect(opt.value)}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              borderRadius: "4px",
              background: isActive
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              color: isActive
                ? "var(--dt-colors-text-primary-default, #fff)"
                : "rgba(255,255,255,0.6)",
              fontWeight: isActive ? 600 : 400,
              opacity: dimmed && !isActive ? 0.4 : 1,
              transition: "background 0.15s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}

export const AppSidebar = ({ activeTab, onFilterChange, onSwitchToMissions }: AppSidebarProps) => {
  const [filters, setFilters] = useState<SidebarFilters>({
    role: null,
    difficulty: null,
    time: null,
    category: null,
  });

  const isMissions = activeTab === "missions";

  const categoryMissionCounts = useMemo(() => {
    const counts = new Map<string | null, number>();
    counts.set(null, MISSIONS.length);
    for (const m of MISSIONS) {
      counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
    }
    return counts;
  }, []);

  const update = (key: keyof SidebarFilters, value: string | null) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  return (
    <div
      style={{
        width: "180px",
        minWidth: "180px",
        maxWidth: "180px",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 12px",
        overflowY: "auto",
        overflow: "hidden",
        fontSize: "12px",
      }}
    >
      {isMissions ? (
        <>
          <FilterSection
            label="Role"
            options={ROLE_OPTIONS}
            selected={filters.role}
            onSelect={(v) => update("role", v)}
          />
          <FilterSection
            label="Difficulty"
            options={DIFFICULTY_OPTIONS}
            selected={filters.difficulty}
            onSelect={(v) => update("difficulty", v)}
          />
          <FilterSection
            label="Time"
            options={TIME_OPTIONS}
            selected={filters.time}
            onSelect={(v) => update("time", v as SidebarFilters["time"])}
          />
          <FilterSection
            label="Category"
            options={CATEGORY_OPTIONS}
            selected={filters.category}
            onSelect={(v) => update("category", v)}
            categoryMissionCounts={categoryMissionCounts}
          />
        </>
      ) : (
        <button
          onClick={onSwitchToMissions}
          style={{
            margin: "16px 0",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
            color: "rgba(255,255,255,0.7)",
            width: "100%",
          }}
        >
          ← Back to Missions
        </button>
      )}
    </div>
  );
};
