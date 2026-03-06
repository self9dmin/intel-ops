import React, { useState, useCallback } from "react";
import { Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { Button } from "@dynatrace/strato-components/buttons";
import { Paragraph } from "@dynatrace/strato-components/typography";
import { TitleBar } from "@dynatrace/strato-components-preview/layouts";
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

const TAB_LABELS: Record<TopTab, string> = {
  missions: "Missions",
  progress: "Progress",
  leaderboard: "Leaderboard",
};

const ShellLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initTab = (searchParams.get("tab") as TopTab) || "missions";
  const [activeTab, setActiveTab] = useState<TopTab>(
    ["missions", "progress", "leaderboard"].includes(initTab) ? initTab : "missions"
  );
  const [filters, setFilters] = useState<SidebarFilters>({
    role: null,
    difficulty: null,
    time: null,
    category: null,
  });

  const handleTabChange = useCallback(
    (tab: TopTab) => {
      setActiveTab(tab);
      const newParams = new URLSearchParams();
      newParams.set("tab", tab);
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams]
  );

  const handleSwitchToMissions = useCallback(
    (tab: "missions", params?: Record<string, string>) => {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TitleBar>
        <TitleBar.Title>Intel Ops</TitleBar.Title>
        <TitleBar.Navigation>
          {(Object.keys(TAB_LABELS) as TopTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: "8px 16px",
                border: "none",
                background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                color:
                  activeTab === tab
                    ? "var(--dt-colors-text-primary-default, #fff)"
                    : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab ? 600 : 400,
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--dt-colors-charts-categorical-default-12, #1496ff)"
                    : "2px solid transparent",
                borderRadius: "4px 4px 0 0",
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </TitleBar.Navigation>
      </TitleBar>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AppSidebar activeTab={activeTab} onFilterChange={setFilters} />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {activeTab === "missions" && <MissionsTab filters={filters} />}
          {activeTab === "progress" && <ProgressTab onSwitchTab={handleSwitchToMissions} />}
          {activeTab === "leaderboard" && <LeaderboardTab />}
        </main>
      </div>
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
