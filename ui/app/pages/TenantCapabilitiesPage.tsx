import React, { useMemo } from "react";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { MISSIONS } from "../data/missions";
import { TenantCoveragePanel } from "../components/TenantCoveragePanel";
import { useTenantScan } from "../hooks/useTenantScan";
import { useUserStateContext } from "../context/UserStateContext";

const CAPABILITY_BY_APP: Record<string, string> = {
  "Dynatrace Assist": "Assist entitlement and access",
  "OpenTelemetry": "OTel signal coverage",
  "Problems": "Davis problem records",
  "Services": "Service topology",
  "Smartscape": "Dependency graph",
  "Workflows": "Automation surface",
  "Settings": "Configuration access",
  "Notebooks": "Notebook authoring",
};

export const TenantCapabilitiesPage = () => {
  const { userState, saveTenantCapabilities, setDataMode } = useUserStateContext();
  const { scan, scanning } = useTenantScan();
  const apps = useMemo(() => [...new Set(MISSIONS.flatMap((mission) => mission.apps ?? []))].sort(), []);

  const runScan = async () => {
    const capabilities = await scan();
    await saveTenantCapabilities(capabilities);
    await setDataMode("live");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div><Heading level={2}>Tenant capabilities</Heading><Text style={{ opacity: .72 }}>Scan the tenant before recommending a live-data mission. A missing signal is a setup fact, not a hidden failure state.</Text></div>
        <Button variant="emphasized" onClick={() => void runScan()} disabled={scanning}>{scanning ? "Scanning tenant…" : "Scan tenant"}</Button>
      </div>
      {userState?.tenantCapabilities ? <>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><Chip color="success" variant="emphasized">Scan recorded</Chip><Text textStyle="small" style={{ opacity: .6 }}>{new Date(userState.tenantCapabilities.scannedAt).toLocaleString()}</Text></div>
        <TenantCoveragePanel capabilities={userState.tenantCapabilities} />
      </> : <div style={{ padding: 18, border: "1px dashed var(--dt-colors-border-neutral-default)", borderRadius: 8 }}><Text>No tenant scan recorded yet. Playground missions remain available; live-data missions should wait for this check.</Text></div>}
      <section>
        <Heading level={4}>What the mission library uses</Heading>
        <Text textStyle="small" style={{ display: "block", opacity: .68, margin: "6px 0 12px" }}>These are the app surfaces referenced by active mission metadata. The scan below is live signal detection; it does not claim entitlements that cannot be tested.</Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8 }}>{apps.map((app) => <div key={app} style={{ padding: 12, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 6 }}><strong>{app}</strong><br /><span style={{ fontSize: 11, opacity: .62 }}>{CAPABILITY_BY_APP[app] ?? "Referenced by mission content"}</span></div>)}</div>
      </section>
    </div>
  );
};
