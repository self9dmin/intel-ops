import React from "react";
import { Heading } from "@dynatrace/strato-components/typography";
import type { Department, Discipline, ExperienceLevel } from "../types/UserState";

interface DriverPickerOption {
  discipline: Discipline;
  experienceLevel: ExperienceLevel;
  name: string;
  tier: string;
  description: string;
  helmet: string;
}

const DRIVER_PICKER_OPTIONS: DriverPickerOption[] = [
  { discipline: "incident-commander", experienceLevel: "new", name: "Arvid Lindblad", tier: "Rookie", description: "Just arrived. Learn the platform and find your feet.", helmet: "/ui/assets/helmets/lindblad.png" },
  { discipline: "developer", experienceLevel: "learning", name: "Liam Lawson", tier: "Intermediate", description: "You know the basics. Now push harder.", helmet: "/ui/assets/helmets/lawson.png" },
  { discipline: "platform-engineer", experienceLevel: "experienced", name: "Isack Hadjar", tier: "Advanced", description: "Comfortable under pressure. Build on solid foundations.", helmet: "/ui/assets/helmets/hadjar.png" },
  { discipline: "sre", experienceLevel: "experienced", name: "Max Verstappen", tier: "Elite", description: "No hand-holding. Full stack, full pressure.", helmet: "/ui/assets/helmets/verstappen.png" },
];

interface ChangeDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDiscipline: Discipline;
  onSelect: (discipline: Discipline, experienceLevel: ExperienceLevel) => void;
  currentDepartment?: Department;
  onDepartmentChange?: (department: Department) => void;
}

export const ChangeDriverModal = ({
  isOpen,
  onClose,
  currentDiscipline,
  onSelect,
  currentDepartment = "engineering",
  onDepartmentChange,
}: ChangeDriverModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--dt-colors-background-container-neutral-default, #1a1a2e)",
          border: "1px solid var(--dt-colors-border-neutral-default)",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "560px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <Heading level={4}>Pick your driver.</Heading>
        </div>
        <div style={{ textAlign: "center", opacity: 0.6, fontSize: "13px", marginBottom: "20px" }}>
          This changes your starting discipline and experience level.
        </div>
        {onDepartmentChange && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Department</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["engineering", "d1"] as Department[]).map((department) => (
                <button
                  key={department}
                  type="button"
                  onClick={() => onDepartmentChange(department)}
                  style={{
                    flex: 1,
                    padding: "9px 10px",
                    borderRadius: 5,
                    border: currentDepartment === department ? "1px solid #65e0d3" : "1px solid var(--dt-colors-border-neutral-default)",
                    background: currentDepartment === department ? "rgba(101,224,211,.12)" : "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {department === "d1" ? "D1 · Insights / CS" : "Engineering"}
                </button>
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {DRIVER_PICKER_OPTIONS.map((driver) => {
            const isSelected = currentDiscipline === driver.discipline;
            return (
              <div
                key={driver.discipline}
                onClick={() => onSelect(driver.discipline, driver.experienceLevel)}
                style={{
                  padding: "16px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: isSelected
                    ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                    : "1px solid var(--dt-colors-border-neutral-default)",
                  background: isSelected
                    ? "var(--dt-colors-background-container-neutral-default)"
                    : "transparent",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "var(--dt-colors-background-container-neutral-subdued)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: isSelected ? 600 : 500 }}>
                    {driver.name}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "2px" }}>
                    {driver.tier}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "6px" }}>
                    {driver.description}
                  </div>
                </div>
                <img
                  src={driver.helmet}
                  alt=""
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "contain",
                    flexShrink: 0,
                    opacity: isSelected ? 0.9 : 0.5,
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
