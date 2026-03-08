import React, { useState, useCallback } from "react";
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
    time: null,
    category: null,
  });

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
    missions: "Missions",
    progress: "Progress",
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
        <span style={{ fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap" }}>
          Practice in Silence. Respond in Chaos.
        </span>
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
