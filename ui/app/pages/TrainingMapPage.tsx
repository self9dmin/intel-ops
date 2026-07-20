import React, { useMemo, useState } from "react";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { CIRCUITS } from "../data/circuits";
import { MISSIONS } from "../data/missions";
import { JOURNEYS } from "../data/journeys";
import type { Discipline, Department } from "../types/UserState";
import { TOPIC_META } from "../types/UserState";

type Lane = "all" | Discipline | "d1";
type EvidenceFilter = "all" | "gaps" | "validated";

interface Capability {
  id: string;
  area: string;
  label: string;
  topics: string[];
  missionIds: string[];
  journeyIds?: string[];
  gap?: string;
}

const LANES: { id: Lane; label: string }[] = [
  { id: "all", label: "All learners" },
  { id: "incident-commander", label: "Incident Commander" },
  { id: "developer", label: "Developer" },
  { id: "platform-engineer", label: "Platform Engineer" },
  { id: "sre", label: "SRE" },
  { id: "d1", label: "D1" },
];

const AREAS = [
  "Start and orient", "Ingest and instrument", "Understand environment", "Explore and query data",
  "Visualize and communicate", "Detect and investigate", "Notify and automate", "Build and extend platform",
  "AI and agentic observability", "Security, experience, business context", "Operate customer lifecycle",
];

const CAPABILITIES: Capability[] = [
  { id: "orient", area: AREAS[0], label: "Find the platform's first useful action", topics: ["infrastructure", "community"], missionIds: ["mission-the-dock", "mission-what-are-you"] },
  { id: "first-signal", area: AREAS[1], label: "Ingest and verify a first signal", topics: ["metrics", "logs", "traces"], missionIds: ["mission-ingest-first-signal", "mission-verify-the-data"] },
  { id: "otel-pipeline", area: AREAS[1], label: "Configure and troubleshoot OpenTelemetry", topics: ["traces", "metrics", "logs"], missionIds: ["mission-otel-collector-validation", "mission-otel-trace-investigation", "mission-otel-log-trace-correlation"] },
  { id: "topology", area: AREAS[2], label: "Read service topology and dependencies", topics: ["services", "smartscape", "kubernetes"], missionIds: ["mission-map-the-service", "mission-otel-inventory"] },
  { id: "dql", area: AREAS[3], label: "Query Grail with DQL", topics: ["dql", "logs", "metrics"], missionIds: ["mission-otel-query", "mission-log-volume"] },
  { id: "dashboards", area: AREAS[4], label: "Build a first operational view", topics: ["dashboards", "notebooks"], missionIds: ["mission-build-first-view"] },
  { id: "problems", area: AREAS[5], label: "Investigate a problem to causal evidence", topics: ["problems", "dt-intelligence"], missionIds: ["mission-follow-the-signal", "mission-causal-chain", "mission-ai-trace-investigation"] },
  { id: "slo", area: AREAS[5], label: "Connect SLO health to customer impact", topics: ["slo", "bizevents"], missionIds: ["mission-slo-burn", "mission-customer-impact"] },
  { id: "automation", area: AREAS[6], label: "Turn evidence into a safe response", topics: ["automation", "settings"], missionIds: ["mission-workflow-builder", "mission-approval-gate"] },
  { id: "ai-observe", area: AREAS[8], label: "Observe AI and agent workloads", topics: ["dt-intelligence", "traces", "dql"], missionIds: ["mission-ai-signal-map", "mission-ai-token-economics", "mission-ai-model-health"] },
  { id: "customer-journey", area: AREAS[10], label: "Walk the customer lifecycle with evidence", topics: ["community", "settings"], missionIds: [], journeyIds: JOURNEYS.map((journey) => journey.id), gap: "D1-only; two journeys need real captures or reframing before release." },
  { id: "cli-sdk-mcp", area: AREAS[7], label: "Choose the right CLI, SDK, API, or MCP path", topics: ["settings", "community"], missionIds: [], gap: "Opportunity: add hands-on developer-tool missions with validated examples." },
];

const PATHS = [
  ["Foundations", "Start and orient → Ingest and instrument → Verify the data"],
  ["Developer / OTel", "First signal → OTel pipeline → DQL → performance investigation"],
  ["SRE / response", "Topology → Problems → Causal evidence → SLO → safe response"],
  ["Platform operations", "Infrastructure → Kubernetes → DQL → Automation"],
  ["AI observability", "AI signal map → traces → token economics → model health"],
  ["D1 customer lifecycle", "Track Walk → support routing → product feedback"],
  ["Build and extend", "App Engine → workflows → APIs → SDKs → MCP"],
];

function evidenceForMission(id: string): "validated" | "backed" | "gap" {
  const mission = MISSIONS.find((candidate) => candidate.id === id);
  if (!mission?.evidence) return "gap";
  if (mission.evidence.status === "playground-validated" || mission.evidence.status === "tenant-validated") return "validated";
  return mission.evidence.status === "documentation-backed" ? "backed" : "gap";
}

export const TrainingMapPage = ({ department }: { department: Department }) => {
  const [lane, setLane] = useState<Lane>(department === "d1" ? "d1" : "all");
  const [area, setArea] = useState("all");
  const [query, setQuery] = useState("");
  const [evidence, setEvidence] = useState<EvidenceFilter>("all");
  const [selected, setSelected] = useState<Capability | null>(null);

  const visible = useMemo(() => CAPABILITIES.filter((capability) => {
    if (capability.id === "customer-journey" && department !== "d1") return false;
    if (area !== "all" && capability.area !== area) return false;
    if (query && !`${capability.label} ${capability.area} ${capability.topics.join(" ")}`.toLowerCase().includes(query.toLowerCase())) return false;
    const hasValidated = capability.missionIds.some((id) => evidenceForMission(id) === "validated");
    const hasGap = Boolean(capability.gap) || capability.missionIds.some((id) => evidenceForMission(id) === "gap");
    if (evidence === "validated" && !hasValidated) return false;
    if (evidence === "gaps" && !hasGap) return false;
    return true;
  }), [area, query, evidence, department]);

  const matrixMissionCount = (capability: Capability, difficulty: "rookie" | "operator" | "elite", role: Lane) => {
    if (role === "d1") return capability.journeyIds?.length ?? 0;
    return capability.missionIds.filter((id) => {
      const mission = MISSIONS.find((candidate) => candidate.id === id);
      if (!mission) return false;
      const roleMatch = role === "all" || mission.disciplines.some((entry) => entry.track === role);
      const difficultyMatch = difficulty === "rookie" ? mission.difficulty === "rookie" : difficulty === "operator" ? mission.difficulty === "operator" : mission.difficulty === "elite" || mission.difficulty === "legend";
      return roleMatch && difficultyMatch;
    }).length;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <Heading level={2}>Training Map</Heading>
        <Text style={{ opacity: 0.72 }}>A coverage matrix for the skills, evidence, and customer journeys Mission Control teaches. This is the in-app map; curriculum planning remains an internal authoring activity.</Text>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={lane} onChange={(event) => setLane(event.target.value as Lane)} aria-label="Learner lane" style={{ padding: 8, minWidth: 170 }}>
          {LANES.filter((item) => item.id !== "d1" || department === "d1").map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Capability area" style={{ padding: 8, minWidth: 190 }}>
          <option value="all">All areas</option>
          {AREAS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={evidence} onChange={(event) => setEvidence(event.target.value as EvidenceFilter)} aria-label="Evidence status" style={{ padding: 8 }}>
          <option value="all">All evidence</option><option value="gaps">Only gaps</option><option value="validated">Only validated</option>
        </select>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search capabilities" aria-label="Search capabilities" style={{ padding: 8, minWidth: 220, flex: 1 }} />
        <Button variant="default" onClick={() => window.print()}>Export view</Button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip color="primary" variant="emphasized">{CAPABILITIES.length} capabilities</Chip>
        <Chip color="neutral">{MISSIONS.filter((mission) => mission.status !== "retired").length} active missions</Chip>
        <Chip color="neutral">{JOURNEYS.length} Track Walks</Chip>
        <Chip color="neutral">{CIRCUITS.length} circuits</Chip>
      </div>
      <div style={{ overflowX: "auto", border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8 }}>
        <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "var(--dt-colors-background-container-neutral-subdued)" }}>
            <th style={{ textAlign: "left", padding: 12, minWidth: 290 }}>Capability</th>
            {(["rookie", "operator", "elite"] as const).flatMap((difficulty) => [
              <th key={`${difficulty}-developer`} style={{ padding: 8, borderLeft: "1px solid var(--dt-colors-border-neutral-default)" }}>{difficulty === "rookie" ? "Soft" : difficulty === "operator" ? "Medium" : "Hard"}<br /><span style={{ opacity: .55 }}>Engineering</span></th>,
              <th key={`${difficulty}-d1`} style={{ padding: 8 }}>D1</th>,
            ])}
          </tr></thead>
          <tbody>{visible.map((capability) => <tr key={capability.id} onClick={() => setSelected(capability)} style={{ cursor: "pointer", borderTop: "1px solid var(--dt-colors-border-neutral-default)" }}>
            <td style={{ padding: 12 }}><strong>{capability.label}</strong><br /><span style={{ opacity: .55 }}>{capability.area} · {capability.topics.map((topic) => TOPIC_META[topic as keyof typeof TOPIC_META]?.label ?? topic).join(" · ")}</span></td>
            {(["rookie", "operator", "elite"] as const).flatMap((difficulty) => [
              <td key={`${difficulty}-developer`} style={{ textAlign: "center", borderLeft: "1px solid var(--dt-colors-border-neutral-default)" }}>{matrixMissionCount(capability, difficulty, lane === "d1" ? "all" : lane) || "—"}</td>,
              <td key={`${difficulty}-d1`} style={{ textAlign: "center", color: capability.journeyIds?.length ? "#65e0d3" : "rgba(255,255,255,.28)" }}>{capability.journeyIds?.length ? (difficulty === "rookie" ? capability.journeyIds.length : "—") : "—"}</td>,
            ])}
          </tr>)}</tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0, 1fr) 330px" : "1fr", gap: 16 }}>
        <section style={{ borderTop: "1px solid var(--dt-colors-border-neutral-default)", paddingTop: 16 }}>
          <Heading level={4}>Learning paths</Heading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, marginTop: 10 }}>
            {PATHS.filter(([title]) => department === "d1" || title !== "D1 customer lifecycle").map(([title, path]) => <div key={title} style={{ padding: 14, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 6 }}><strong>{title}</strong><Text textStyle="small" style={{ display: "block", marginTop: 6, opacity: .7 }}>{path}</Text></div>)}
          </div>
        </section>
        {selected && <aside style={{ border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><Heading level={4}>{selected.label}</Heading><Button variant="default" onClick={() => setSelected(null)}>Close</Button></div>
          <Text textStyle="small" style={{ opacity: .7 }}>{selected.area}</Text>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0" }}>{selected.topics.map((topic) => <Chip key={topic}>{TOPIC_META[topic as keyof typeof TOPIC_META]?.label ?? topic}</Chip>)}</div>
          {selected.missionIds.length ? selected.missionIds.map((id) => { const mission = MISSIONS.find((candidate) => candidate.id === id); return <div key={id} style={{ padding: "8px 0", borderTop: "1px solid var(--dt-colors-border-neutral-default)" }}><strong>{mission?.title ?? id}</strong><br /><span style={{ fontSize: 11, opacity: .65 }}>{mission ? evidenceForMission(id) : "unresolved"}</span></div>; }) : <Text textStyle="small">{selected.gap ?? "No active content mapped yet."}</Text>}
        </aside>}
      </div>
    </div>
  );
};
