import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Paragraph, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { JOURNEYS } from "../data/journeys";
import { useUserStateContext } from "../context/UserStateContext";

export const Journey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const journey = useMemo(() => JOURNEYS.find((item) => item.id === id), [id]);
  const { userState } = useUserStateContext();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  if (!journey) return <Paragraph>Journey not found.</Paragraph>;
  if (userState?.department !== "d1") return <div style={{ maxWidth: 700, margin: "0 auto" }}><Heading level={3}>Track Walk is a D1 circuit</Heading><Paragraph>This customer-lifecycle exercise is available to D1, Insights, ACE, and Customer Success learners.</Paragraph><Button onClick={() => navigate("/?tab=missions")}>Back to Race Control</Button></div>;
  if (step === -1) return null;
  if (step === 0) {
    return <div style={{ maxWidth: 900, margin: "0 auto" }}><Button onClick={() => navigate("/?tab=missions&path=track-walk")}>← Track Walk</Button><Heading level={3}>{journey.title}</Heading><Chip color="primary">{journey.personaRole}</Chip><Paragraph>{journey.briefing.goal}</Paragraph><Heading level={5}>What the customer has done</Heading>{journey.briefing.alreadyDone.map((item) => <Text key={item} style={{ display: "block", margin: "8px 0" }}>✓ {item}</Text>)}<Paragraph style={{ color: "var(--dt-colors-text-warning-default)" }}>{journey.briefing.risk}</Paragraph><Button variant="emphasized" onClick={() => setStep(1)}>Begin the walk</Button></div>;
  }
  const touchpoint = journey.touchpoints[step - 1];
  if (!touchpoint) return <div><Heading level={3}>Walk complete</Heading><Paragraph>Review the evidence and content notes before shipping this journey.</Paragraph><Button onClick={() => navigate("/?tab=missions&path=track-walk")}>Back to Track Walk</Button></div>;
  const choice = touchpoint.choices.find((item) => item.id === selected);
  return <div style={{ maxWidth: 1120, margin: "0 auto" }}><Button onClick={() => navigate("/?tab=missions&path=track-walk")}>← Abandon</Button><div style={{ display: "flex", justifyContent: "space-between", gap: 16, margin: "16px 0" }}><div><Heading level={3}>{journey.title}</Heading><Text>{touchpoint.stage} · Checkpoint {step} of {journey.touchpoints.length}</Text></div><Chip color="primary">{touchpoint.type}</Chip></div><div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(320px, .75fr)", gap: 20 }}><section style={{ padding: 16, borderRadius: 8, border: "1px solid var(--dt-colors-border-neutral-disabled)" }}>{touchpoint.evidence?.src && <img src={touchpoint.evidence.src} alt={touchpoint.evidence.caption} style={{ width: "100%", borderRadius: 6 }} />}<Text style={{ display: "block", marginTop: 12 }}>{touchpoint.visibleState}</Text><Paragraph style={{ fontStyle: "italic" }}>“{touchpoint.customerThought}”</Paragraph></section><section><Heading level={5}>{touchpoint.question}</Heading>{!committed && <Paragraph style={{ color: "var(--dt-colors-text-neutral-subdued)" }}>Hint: {touchpoint.hint}</Paragraph>}{touchpoint.choices.map((item) => <button key={item.id} onClick={() => !committed && setSelected(item.id)} style={{ display: "block", width: "100%", textAlign: "left", margin: "8px 0", padding: 12, borderRadius: 6, border: `1px solid ${selected === item.id ? "var(--dt-colors-border-primary-default)" : "var(--dt-colors-border-neutral-disabled)"}`, background: selected === item.id ? "rgba(153,155,237,.12)" : "transparent", color: "inherit" }}>{item.id.toUpperCase()}. {item.label}</button>)}{!committed ? <Button variant="emphasized" disabled={!selected} onClick={() => setCommitted(true)}>Lock in decision</Button> : choice && <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: choice.best ? "rgba(111,195,186,.12)" : "rgba(238,167,70,.12)" }}><Heading level={5}>{choice.best ? "Strong call" : "Review the risk"} · +{choice.xp} pts</Heading><Paragraph>{choice.feedback}</Paragraph><Text>{choice.best ? touchpoint.businessConsequence : `Risk created: ${choice.risk}`}</Text><div style={{ marginTop: 12 }}><Button variant="emphasized" onClick={() => { setStep((current) => current + 1); setSelected(null); setCommitted(false); }}>{step === journey.touchpoints.length ? "Finish walk" : "Next touchpoint"}</Button></div></div>}</section></div></div>;
};
