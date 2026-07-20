import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { JOURNEYS } from "../data/journeys";
import { useUserStateContext } from "../context/UserStateContext";

const lifecycleLabels = ["Trial", "First useful action", "Adoption", "Support & recovery"];

export const TrackWalkBoard = () => {
  const navigate = useNavigate();
  const { userState } = useUserStateContext();
  const completed = new Set(userState?.completedMissions ?? []);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        border: "1px solid rgba(58, 209, 195, 0.38)",
        background: "linear-gradient(120deg, rgba(19, 109, 109, 0.28), rgba(20, 31, 52, 0.86))",
        borderRadius: 10,
        padding: "22px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 760 }}>
            <Chip color="primary" variant="emphasized">D1 · MONACO</Chip>
            <Heading level={2} style={{ marginTop: 10 }}>Track Walk</Heading>
            <Text style={{ opacity: 0.8, lineHeight: 1.5 }}>
              Walk the customer lifecycle before you ask a customer to race through the platform. Every stop separates what the user experienced, what the evidence proves, and what the CSM should do next.
            </Text>
          </div>
          <div style={{ minWidth: 190, textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#65e0d3" }}>{JOURNEYS.length}</div>
            <Text textStyle="small" style={{ opacity: 0.7 }}>journeys in the circuit</Text>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 22 }}>
          {lifecycleLabels.map((label, index) => (
            <React.Fragment key={label}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, color: "rgba(255,255,255,.76)" }}>
                <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: "50%", border: "1px solid rgba(101,224,211,.65)", color: "#65e0d3", fontWeight: 700 }}>{index + 1}</span>
                {label}
              </span>
              {index < lifecycleLabels.length - 1 && <span style={{ opacity: 0.35, padding: "0 4px" }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {JOURNEYS.map((journey, index) => {
          const isComplete = completed.has(journey.id);
          const needsRework = journey.contentStatus === "needs-rework";
          return (
            <article key={journey.id} style={{
              display: "flex", flexDirection: "column", gap: 12, minHeight: 270,
              padding: 18, borderRadius: 8,
              border: `1px solid ${needsRework ? "rgba(242, 176, 67, .45)" : "var(--dt-colors-border-neutral-default)"}`,
              background: "var(--dt-colors-background-container-neutral-subdued)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "#65e0d3" }}>STOP {String(index + 1).padStart(2, "0")}</span>
                <Chip color={isComplete ? "success" : needsRework ? "warning" : "neutral"}>
                  {isComplete ? "Completed" : needsRework ? "Needs rework" : "Ready"}
                </Chip>
              </div>
              <Heading level={4}>{journey.title}</Heading>
              <Text textStyle="small" style={{ opacity: 0.72, minHeight: 54 }}>{journey.description}</Text>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <Text textStyle="small" style={{ color: "#65e0d3" }}>{journey.lifecycleStage}</Text>
                <Text textStyle="small" style={{ opacity: 0.62 }}>{journey.teaches}</Text>
                {needsRework && <Text textStyle="small" style={{ color: "#f2b043" }}>{journey.contentNote}</Text>}
                <Button variant={isComplete ? "default" : "emphasized"} onClick={() => navigate(`/journeys/${journey.id}`)}>
                  {isComplete ? "Review journey" : "Start walk"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
