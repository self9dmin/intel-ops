import React, { useMemo, useState } from "react";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { evaluateMissionQuality } from "../data/reviewRubric";
import type { Checkpoint, Mission, MissionCategory } from "../types/mission.types";

const DRAFT_KEY = "intelops-mission-builder-draft";

const initialDraft: Mission = {
  id: "community-draft",
  title: "",
  codename: "COMMUNITY DRAFT",
  role: "Developer",
  difficulty: "rookie",
  description: "",
  briefing: "",
  timerSeconds: 600,
  status: "available",
  prerequisites: [],
  disciplines: [{ track: "developer", xp: 100 }],
  topics: ["dql"],
  category: "configuration",
  checkpoints: [
    { id: "cp1", title: "Observe", instruction: "", hint: "", type: "action", points: 30 },
    { id: "cp2", title: "Interpret", instruction: "", hint: "", type: "action", points: 30 },
    { id: "cp3", title: "Decide", instruction: "", hint: "", type: "action", points: 40 },
  ],
  evidence: { status: "documentation-backed", sourceUrls: [] },
};

function loadDraft(): Mission {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return initialDraft;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== "object" || parsed === null) return initialDraft;
    return { ...initialDraft, ...(parsed as Partial<Mission>) };
  } catch { return initialDraft; }
}

export const MissionBuilderPage = () => {
  const [draft, setDraft] = useState<Mission>(loadDraft);
  const [saved, setSaved] = useState(false);
  const quality = useMemo(() => evaluateMissionQuality(draft, {}), [draft]);
  const builderChecks = quality.checks.filter((check) => check.label !== "Review ratings complete");
  const canPublish = builderChecks.every((check) => check.passed) && Boolean(draft.evidence?.sourceUrls.length);
  const update = (partial: Partial<Mission>) => setDraft((current) => ({ ...current, ...partial }));
  const updateCheckpoint = (index: number, partial: Partial<Checkpoint>) => update({ checkpoints: draft.checkpoints.map((checkpoint, checkpointIndex) => checkpointIndex === index ? { ...checkpoint, ...partial } : checkpoint) });
  const save = () => { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); setSaved(true); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div><Heading level={2}>Mission Builder</Heading><Text style={{ opacity: .72 }}>Author a draft without changing built-in missions. Evidence and scrutineering remain mandatory before anything can be published.</Text></div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, .75fr)", gap: 18 }}>
        <section style={{ display: "flex", flexDirection: "column", gap: 12, padding: 18, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8 }}>
          <label>Title<input value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder="A useful mission title" /></label>
          <label>Role<input value={draft.role} onChange={(event) => update({ role: event.target.value })} /></label>
          <label>Difficulty<select value={draft.difficulty} onChange={(event) => update({ difficulty: event.target.value as Mission["difficulty"] })}><option value="rookie">Soft (rookie)</option><option value="operator">Medium (operator)</option><option value="elite">Hard (elite)</option><option value="legend">Hard (legend)</option></select></label>
          <label>Category<select value={draft.category} onChange={(event) => update({ category: event.target.value as MissionCategory })}><option value="incident-response">Incident response</option><option value="performance">Performance</option><option value="root-cause-analysis">Root cause analysis</option><option value="configuration">Configuration</option><option value="cost-optimization">Cost optimization</option></select></label>
          <label>Description<textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} rows={3} /></label>
          <label>Briefing<textarea value={draft.briefing} onChange={(event) => update({ briefing: event.target.value })} rows={4} /></label>
          <label>Evidence source URLs (one per line)<textarea value={draft.evidence?.sourceUrls.join("\n") ?? ""} onChange={(event) => update({ evidence: { ...draft.evidence!, sourceUrls: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) } })} rows={3} /></label>
          <div><Heading level={4}>Checkpoints</Heading>{draft.checkpoints.map((checkpoint, index) => <div key={checkpoint.id} style={{ padding: 12, marginTop: 8, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 6 }}><strong>{index + 1}. {checkpoint.title}</strong><input value={checkpoint.title} onChange={(event) => updateCheckpoint(index, { title: event.target.value })} /><textarea value={checkpoint.instruction} onChange={(event) => updateCheckpoint(index, { instruction: event.target.value })} placeholder="What the learner must do" rows={2} /></div>)}</div>
          <div style={{ display: "flex", gap: 8 }}><Button variant="emphasized" onClick={save}>Save draft</Button><Button variant="default" disabled={!canPublish} onClick={() => setSaved(true)}>Publish when reviewed</Button>{saved && <Chip color="success">Draft saved locally</Chip>}</div>
        </section>
        <aside style={{ padding: 18, border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, alignSelf: "start" }}>
          <Heading level={4}>Scrutineering gate</Heading><Text textStyle="small" style={{ display: "block", opacity: .65, margin: "6px 0 14px" }}>The final rating check lives in Scrutineering. Builder checks are structural and evidence-based.</Text>
          {builderChecks.map((check) => <div key={check.label} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 6, padding: "9px 0", borderTop: "1px solid var(--dt-colors-border-neutral-default)", fontSize: 12 }}><span style={{ width: 16, height: 16, borderRadius: "50%", display: "grid", placeItems: "center", color: check.passed ? "#1dbb7e" : "#e74c3c", fontWeight: 700 }}>{check.passed ? "✓" : "!"}</span><span><strong>{check.label}</strong><br /><span style={{ opacity: .65 }}>{check.detail}</span></span></div>)}
          <div style={{ marginTop: 14 }}><Chip color={canPublish ? "success" : "warning"}>{canPublish ? "Ready for the inspection bay" : "Not cleared - resolve the checks above"}</Chip></div>
        </aside>
      </div>
    </div>
  );
};
