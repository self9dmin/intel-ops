import React, { useState, useCallback, useEffect, useRef } from "react";
import { Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { Button } from "@dynatrace/strato-components/buttons";
import { Paragraph } from "@dynatrace/strato-components/typography";

import { Mission } from "./pages/Mission";
import { Debrief } from "./pages/Debrief";
import { OnboardingWizard } from "./pages/OnboardingWizard";
import { UserStateProvider, useUserStateContext } from "./context/UserStateContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";
import { AppSidebar, type SidebarFilters } from "./components/AppSidebar";
import { MissionsTab } from "./tabs/MissionsTab";
import { ProgressTab } from "./tabs/ProgressTab";
import { LeaderboardTab } from "./tabs/LeaderboardTab";
import { InformationIcon, BugReportIcon } from "@dynatrace/strato-icons";
import appIcon from "../assets/app-icon.svg";

type TopTab = "missions" | "progress" | "leaderboard";
const TAB_ORDER: TopTab[] = ["missions", "progress", "leaderboard"];

const ShellLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initTab = (searchParams.get("tab") as TopTab) || "missions";
  const [activeTab, setActiveTab] = useState<TopTab>(
    TAB_ORDER.includes(initTab) ? initTab : "missions"
  );
  const [filters, setFilters] = useState<SidebarFilters>({
    status: null,
    difficulty: null,
    app: null,
    topic: null,
  });
  const [infoOpen, setInfoOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [infoOpen]);

  const handleTabChange = useCallback(
    (index: number) => {
      const tab = TAB_ORDER[index];
      setActiveTab(tab);
      const newParams = new URLSearchParams();
      newParams.set("tab", tab);
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams]
  );

  const handleSwitchToMissions = useCallback(
    (tab?: "missions", params?: Record<string, string>) => {
      setActiveTab("missions");
      const newParams = new URLSearchParams();
      newParams.set("tab", "missions");
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          newParams.set(k, v);
        }
      }
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams]
  );

  const contentPanel = (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <AppSidebar
        activeTab={activeTab}
        onFilterChange={setFilters}
        onSwitchToMissions={() => handleSwitchToMissions()}
      />
      <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {activeTab === "missions" && (
          <MissionsTab
            filters={filters}
            onSwitchTab={() => handleTabChange(TAB_ORDER.indexOf("progress"))}
          />
        )}
        {activeTab === "progress" && <ProgressTab onSwitchTab={handleSwitchToMissions} />}
        {activeTab === "leaderboard" && <LeaderboardTab />}
      </main>
    </div>
  );

  const TAB_LABELS: Record<TopTab, string> = {
    missions: "Control Tower",
    progress: "Pace",
    leaderboard: "Leaderboard",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Inline header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 16px",
          height: "48px",
          borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={appIcon}
            width={20}
            height={20}
            style={{ marginRight: "8px", borderRadius: "4px", verticalAlign: "middle" }}
            alt="Mission Control"
          />
          <span style={{ fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap" }}>
            Mission Control
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px", marginLeft: "16px" }}>
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(TAB_ORDER.indexOf(tab))}
              style={{
                padding: "6px 14px",
                border: "none",
                background: activeTab === tab ? "var(--dt-colors-background-container-neutral-default)" : "transparent",
                color:
                  activeTab === tab
                    ? "var(--dt-colors-text-primary-default, #fff)"
                    : "var(--dt-colors-text-neutral-subdued)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activeTab === tab ? 600 : 400,
                fontFamily: "inherit",
                borderRadius: "4px",
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                    : "2px solid transparent",
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <div ref={infoRef} style={{ position: "relative" }}>
            <button
              onClick={() => setInfoOpen((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--dt-colors-text-neutral-subdued)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Info"
            >
              <InformationIcon size="small" />
            </button>
            {infoOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  background: "#16192a",
                  backdropFilter: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "280px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 1000,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
                  Mission Control
                </div>
                <div style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--dt-colors-text-neutral-subdued)" }}>
                  Dynatrace sponsors some of the fastest cars on the grid because performance under pressure is what we're built for. Mission Control brings that same standard to learning — real scenarios, live data, no shortcuts.
                </div>
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.1)",
                    margin: "12px 0",
                  }}
                />
                <div style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.5 }}>
                  Train here. Perform everywhere.
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "var(--dt-colors-text-neutral-subdued)",
                    marginTop: "12px",
                    opacity: 0.7,
                  }}
                >
                  Built by Dan Quintero · v0.1.45
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              window.location.href =
                "mailto:daniel.quintero@dynatrace.com?subject=Mission%20Control%20%E2%80%94%20Bug%20Report&body=Describe%20the%20issue%3A%0A%0A%0ASteps%20to%20reproduce%3A%0A%0A%0AExpected%20behavior%3A%0A%0A";
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--dt-colors-text-neutral-subdued)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            aria-label="Report a bug"
          >
            <BugReportIcon size="small" />
          </button>
        </div>
      </div>
      {contentPanel}
    </div>
  );
};

const AppContent = () => {
  const { userState, loading, error, saveUserState, retry } = useUserStateContext();

  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <ProgressCircle />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={16}
        style={{ minHeight: "100vh" }}
      >
        <Paragraph>{error}</Paragraph>
        <Button variant="emphasized" onClick={retry}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (!userState) {
    return <OnboardingWizard onComplete={saveUserState} />;
  }

  return (
    <Routes>
      <Route path="/" element={<ShellLayout />} />
      <Route path="/missions" element={<Navigate to="/?tab=missions" replace />} />
      <Route path="/missions/:id" element={<Mission />} />
      <Route path="/debrief/:id" element={<Debrief />} />
      <Route path="/progress" element={<Navigate to="/?tab=progress" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <UserStateProvider>
      <LeaderboardProvider>
        <AppContent />
      </LeaderboardProvider>
    </UserStateProvider>
  );
};
