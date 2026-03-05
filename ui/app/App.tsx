import { Page } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Mission } from "./pages/Mission";
import { Debrief } from "./pages/Debrief";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Data } from "./pages/Data";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Home />} />
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
