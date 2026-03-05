import { Page } from "@dynatrace/strato-components-preview/layouts";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { Button } from "@dynatrace/strato-components/buttons";
import { Paragraph } from "@dynatrace/strato-components/typography";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { MissionsPage } from "./pages/MissionsPage";
import { Mission } from "./pages/Mission";
import { Debrief } from "./pages/Debrief";
import { ProgressPage } from "./pages/ProgressPage";
import { OnboardingWizard } from "./pages/OnboardingWizard";
import { UserStateProvider, useUserStateContext } from "./context/UserStateContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";

const AppContent = () => {
  const { userState, loading, error, saveUserState, retry } = useUserStateContext();

  if (loading) {
    return (
      <Page>
        <Page.Main>
          <Flex
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
          >
            <ProgressCircle />
          </Flex>
        </Page.Main>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Page.Main>
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
        </Page.Main>
      </Page>
    );
  }

  if (!userState) {
    return <OnboardingWizard onComplete={saveUserState} />;
  }

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Navigate to="/missions" replace />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/missions/:id" element={<Mission />} />
          <Route path="/debrief/:id" element={<Debrief />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </Page.Main>
    </Page>
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
