import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Paragraph, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { JOURNEYS } from "../data/journeys";

export const JourneysTab = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <Heading level={3}>Walk in the Customer&apos;s Shoes</Heading>
      <Paragraph style={{ maxWidth: 760, color: "var(--dt-colors-text-neutral-subdued)" }}>
        Evidence-backed practice for reading a customer&apos;s lifecycle, choosing a safe next action, and separating customer recovery from product feedback.
      </Paragraph>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: 24, marginTop: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {JOURNEYS.map((journey) => (
            <section key={journey.id} style={{ padding: 16, borderRadius: 8, border: "1px solid var(--dt-colors-border-neutral-disabled)", background: "var(--dt-colors-background-container-neutral-subdued)" }}>
              <Chip color={journey.contentStatus === "needs-rework" ? "warning" : "primary"}>{journey.contentStatus === "needs-rework" ? "Content review" : "Ready"}</Chip>
              <Text style={{ display: "block", marginTop: 12, color: "var(--dt-colors-text-neutral-subdued)" }}>{journey.lifecycleStage}</Text>
              <Heading level={5}>{journey.title}</Heading>
              <Paragraph>{journey.description}</Paragraph>
              <Text style={{ display: "block", color: "var(--dt-colors-text-neutral-subdued)" }}>{journey.teaches}</Text>
              {journey.contentNote && <Paragraph style={{ color: "var(--dt-colors-text-warning-default)" }}>{journey.contentNote}</Paragraph>}
              <Button variant="emphasized" onClick={() => navigate(`/journeys/${journey.id}`)}>{journey.contentStatus === "needs-rework" ? "Review walk" : "Start walk"}</Button>
            </section>
          ))}
        </div>
        <aside style={{ borderLeft: "2px solid var(--dt-colors-border-neutral-default)", paddingLeft: 16 }}>
          <Heading level={5}>Lifecycle stages</Heading>
          {["Intent & entry", "Account creation", "First access", "First useful action", "First verified signal", "Investigation & learning", "Support & recovery", "POC → production", "Adoption & renewal"].map((stage, index) => (
            <div key={stage} style={{ display: "flex", gap: 8, padding: "8px 0", color: index < 7 ? "var(--dt-colors-text-primary-default)" : "var(--dt-colors-text-neutral-disabled)" }}><strong>{index}</strong><span>{stage}</span></div>
          ))}
        </aside>
      </div>
    </div>
  );
};
