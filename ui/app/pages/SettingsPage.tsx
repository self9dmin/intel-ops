import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { ReviewPage } from "./ReviewPage";
import { TrainingMapPage } from "./TrainingMapPage";
import { MissionBuilderPage } from "./MissionBuilderPage";
import { TenantCapabilitiesPage } from "./TenantCapabilitiesPage";
import { ChangeDriverModal } from "../components/ChangeDriverModal";
import { useUserStateContext } from "../context/UserStateContext";
import type { Discipline, ExperienceLevel, UserState } from "../types/UserState";

const links = [
  ["profile", "Driver profile"], ["data-mode", "Data mode"], ["tenant-capabilities", "Tenant capabilities"],
  ["training-map", "Training Map"], ["mission-builder", "Mission Builder"], ["scrutineering", "Scrutineering"], ["restart-onboarding", "Restart onboarding"],
] as const;

export const SettingsPage = () => {
  const { page = "profile" } = useParams();
  const navigate = useNavigate();
  const { userState, updateUserState, resetUserState } = useUserStateContext();
  if (!userState) return null;

  const updateDiscipline = (discipline: Discipline, experienceLevel: ExperienceLevel) => void updateUserState({ startingDiscipline: discipline, experienceLevel });
  const currentName = userState.displayName || userState.userEmail.split("@")[0];

  const content = page === "training-map" ? <TrainingMapPage department={userState.department} />
    : page === "mission-builder" ? <MissionBuilderPage />
      : page === "tenant-capabilities" ? <TenantCapabilitiesPage />
        : page === "scrutineering" ? <ReviewPage />
          : page === "data-mode" ? <section><Heading level={2}>Data mode</Heading><Text style={{ opacity: .72 }}>Live tenant mode is controlled by a capability scan. The explicit switch is intentionally disabled here until the tenant capability workflow is complete.</Text><div style={{ marginTop: 18 }}><Chip color="neutral">COMING SOON</Chip></div></section>
            : page === "restart-onboarding" ? <RestartOnboarding resetUserState={resetUserState} />
            : <ProfilePage userState={userState} updateUserState={updateUserState} updateDiscipline={updateDiscipline} currentName={currentName} resetUserState={resetUserState} />;

  return <div style={{ display: "flex", minHeight: "calc(100vh - 48px)" }}>
    <aside style={{ width: 220, minWidth: 220, borderRight: "1px solid var(--dt-colors-border-neutral-default)", padding: "18px 12px" }}>
      <Button variant="default" onClick={() => navigate("/?tab=missions")}>← Race Control</Button>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map(([id, label]) => <NavLink key={id} to={`/settings/${id}`} style={({ isActive }) => ({ display: "block", padding: "9px 10px", borderRadius: 5, color: "inherit", textDecoration: "none", background: isActive ? "var(--dt-colors-background-container-neutral-default)" : "transparent", fontWeight: isActive ? 600 : 400 })}>{label}</NavLink>)}
      </div>
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--dt-colors-border-neutral-default)" }}><Text textStyle="small" style={{ opacity: .52 }}>Settings are personal to this driver. Mission content and review records remain shared.</Text></div>
    </aside>
    <main style={{ flex: 1, overflowY: "auto", padding: "28px clamp(20px, 4vw, 56px)" }}>{content}</main>
  </div>;
};

function ProfilePage({ userState, updateUserState, updateDiscipline, currentName, resetUserState }: { userState: UserState; updateUserState: (partial: Partial<UserState>) => Promise<void>; updateDiscipline: (discipline: Discipline, experienceLevel: ExperienceLevel) => void; currentName: string; resetUserState: () => Promise<void> }) {
  const [driverModalOpen, setDriverModalOpen] = React.useState(false);
  return <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 850 }}>
    <div><Heading level={2}>Driver profile</Heading><Text style={{ opacity: .72 }}>The profile controls your starting discipline, department, and the circuit recommendations shown in Race Control.</Text></div>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, padding: 18, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8 }}>
      <label>Display name<input defaultValue={currentName} onBlur={(event) => void updateUserState({ displayName: event.target.value })} /></label>
      <label>Team<input value="Intel Ops" disabled /></label>
      <label>Discipline<select value={userState.startingDiscipline} onChange={(event) => updateDiscipline(event.target.value as Discipline, userState.experienceLevel)}><option value="incident-commander">Incident Commander</option><option value="developer">Developer</option><option value="platform-engineer">Platform Engineer</option><option value="sre">SRE</option></select></label>
      <div><Text textStyle="small" style={{ display: "block", marginBottom: 8 }}>Department</Text><div style={{ display: "flex", gap: 8 }}><Button variant={userState.department === "engineering" ? "emphasized" : "default"} onClick={() => void updateUserState({ department: "engineering" })}>Engineering</Button><Button variant={userState.department === "d1" ? "emphasized" : "default"} onClick={() => void updateUserState({ department: "d1" })}>D1 · Insights / CS</Button></div><Text textStyle="small" style={{ display: "block", marginTop: 8, opacity: .65 }}>{userState.department === "d1" ? "Track Walk is visible in Race Control." : "Track Walk is hidden; platform circuits remain available."}</Text></div>
    </section>
    <Button variant="default" onClick={() => setDriverModalOpen(true)}>Change driver presentation</Button>
    <section style={{ marginTop: 10, paddingTop: 18, borderTop: "1px solid var(--dt-colors-border-neutral-default)" }}><Heading level={4}>Restart onboarding</Heading><Text textStyle="small" style={{ display: "block", opacity: .65, margin: "6px 0 12px" }}>This deletes only your personal driver state and returns you to the setup flow.</Text><Button variant="default" onClick={() => { if (window.confirm("Restart onboarding and delete this driver state?")) void resetUserState(); }}>Restart onboarding</Button></section>
    <ChangeDriverModal isOpen={driverModalOpen} onClose={() => setDriverModalOpen(false)} currentDiscipline={userState.startingDiscipline} currentDepartment={userState.department} onDepartmentChange={(department) => void updateUserState({ department })} onSelect={(discipline, experienceLevel) => { updateDiscipline(discipline, experienceLevel); setDriverModalOpen(false); }} />
  </div>;
}

function RestartOnboarding({ resetUserState }: { resetUserState: () => Promise<void> }) {
  return <section style={{ maxWidth: 650 }}><Heading level={2}>Restart onboarding</Heading><Text style={{ opacity: .72 }}>This deletes only your personal driver state and returns you to the setup flow. Mission definitions, scores, and shared review records are not removed.</Text><div style={{ marginTop: 18 }}><Button variant="default" onClick={() => { if (window.confirm("Restart onboarding and delete this driver state?")) void resetUserState(); }}>Restart onboarding</Button></div></section>;
}
