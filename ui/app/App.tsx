import { Page } from "@dynatrace/strato-components-preview/layouts";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Mission } from "./pages/Mission";
import { Debrief } from "./pages/Debrief";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Data } from "./pages/Data";
import { OnboardingWizard } from "./pages/OnboardingWizard";
import { UserStateProvider, useUserStateContext } from "./context/UserStateContext";

const AppContent = () => {
  const { userState, loading, saveUserState } = useUserStateContext();

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
          <Route path="/" element={<Home startingDiscipline={userState.startingDiscipline} />} />
          <Route path="/mission/:id" element={<Mission />} />
          <Route path="/debrief/:id" element={<Debrief />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/data" element={<Data />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};

export const App = () => {
  return (
    <UserStateProvider>
      <AppContent />
    </UserStateProvider>
  );
};
