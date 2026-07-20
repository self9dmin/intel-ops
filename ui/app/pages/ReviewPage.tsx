import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@dynatrace/strato-components/buttons";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Chip } from "@dynatrace/strato-components-preview/content";
import { Heading, Paragraph, Text } from "@dynatrace/strato-components/typography";
import { MISSIONS } from "../data/missions";
import {
  REVIEW_DIMENSIONS,
  REVIEW_ISSUE_TAGS,
  evaluateMissionQuality,
} from "../data/reviewRubric";
import { loadMissionReviews, saveMissionReview } from "../data/reviewStorage";
import type {
  MissionReview,
  MissionReviewDecision,
  MissionReviewDimension,
  MissionReviewRatings,
} from "../types/mission.types";

type ReviewMode = "internal" | "community";

const decisionColor: Record<MissionReviewDecision, "success" | "warning" | "critical"> = {
  ready: "success",
  revise: "warning",
  blocked: "critical",
};

function ratingLabel(value: number): string {
  return value === 1 ? "Critical" : value === 2 ? "Weak" : value === 3 ? "Usable" : value === 4 ? "Strong" : "Excellent";
}

function average(values: number[]): number | null {
  return values.length ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : null;
}

export const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedMissionId, setSelectedMissionId] = useState(searchParams.get("mission") ?? MISSIONS[0]?.id ?? "");
  const [mode, setMode] = useState<ReviewMode>("internal");
  const [ratings, setRatings] = useState<MissionReviewRatings>({});
  const [overallRating, setOverallRating] = useState(0);
  const [issueTags, setIssueTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [reviews, setReviews] = useState<MissionReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  const mission = useMemo(
    () => MISSIONS.find((candidate) => candidate.id === selectedMissionId) ?? MISSIONS[0],
    [selectedMissionId]
  );
  const quality = useMemo(
    () => (mission ? evaluateMissionQuality(mission, ratings) : null),
    [mission, ratings]
  );
  const communityReviews = reviews.filter((review) => review.kind === "community");
  const communityAverage = average(
    communityReviews.flatMap((review) => typeof review.overallRating === "number" ? [review.overallRating] : [])
  );

  useEffect(() => {
    if (!mission) return;
    setLoadingReviews(true);
    setSaveState("idle");
    void loadMissionReviews(mission.id, "community")
      .then(setReviews)
      .catch((error) => {
        console.warn("Could not load community reviews", error);
        setReviews([]);
      })
      .finally(() => setLoadingReviews(false));
  }, [mission]);

  const updateRating = (dimension: MissionReviewDimension, value: number) => {
    setRatings((current) => ({ ...current, [dimension]: value }));
  };

  const toggleIssueTag = (tag: string) => {
    setIssueTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  const submit = async () => {
    if (!mission) return;
    setSaveState("saving");
    try {
      if (mode === "internal") {
        if (!quality || quality.decision === "blocked" && quality.score === 0) {
          setSaveState("failed");
          return;
        }
        await saveMissionReview(mission, {
          kind: "internal",
          ratings,
          decision: quality.decision,
          notes,
          issueTags,
        });
      } else {
        if (!overallRating) {
          setSaveState("failed");
          return;
        }
        const communityRatings: MissionReviewRatings = {};
        for (const dimension of ["accuracy", "clarity", "difficulty"] as MissionReviewDimension[]) {
          if (ratings[dimension]) communityRatings[dimension] = ratings[dimension];
        }
        await saveMissionReview(mission, {
          kind: "community",
          ratings: communityRatings,
          overallRating,
          notes,
          issueTags,
        });
        const latest = await loadMissionReviews(mission.id, "community");
        setReviews(latest);
      }
      setNotes("");
      setIssueTags([]);
      setSaveState("saved");
    } catch (error) {
      console.error("Could not save mission review", error);
      setSaveState("failed");
    }
  };

  if (!mission) return null;

  return (
    <Flex flexDirection="column" gap={20} style={{ maxWidth: 1050, margin: "0 auto" }}>
      <div>
        <Heading level={2}>Scrutineering</Heading>
        <Paragraph style={{ opacity: 0.72, maxWidth: 780 }}>
          Internal reviews decide whether content is ready to merge. Community reviews capture learner experience and reported friction; they never silently change the official score or publish content.
        </Paragraph>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 310 }}>
          <Text textStyle="small">Mission</Text>
          <select value={mission.id} onChange={(event) => { setSelectedMissionId(event.target.value); setRatings({}); setOverallRating(0); }} style={{ padding: 9, borderRadius: 4, border: "1px solid var(--dt-colors-border-neutral-default)", background: "var(--dt-colors-background-container-neutral-default)", color: "inherit" }}>
            {MISSIONS.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.title} · {candidate.difficulty}</option>)}
          </select>
        </label>
        <div style={{ display: "flex", gap: 6, alignSelf: "flex-end" }}>
          {(["internal", "community"] as ReviewMode[]).map((reviewMode) => (
            <Button key={reviewMode} variant={mode === reviewMode ? "emphasized" : "default"} onClick={() => setMode(reviewMode)}>
              {reviewMode === "internal" ? "Quality gate" : "Community feedback"}
            </Button>
          ))}
        </div>
      </div>

      {mode === "internal" ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, .8fr)", gap: 20 }}>
          <section style={{ border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, padding: 18 }}>
            <Heading level={4}>Merge review rubric</Heading>
            <Text textStyle="small" style={{ opacity: 0.7 }}>Rate each dimension from 1 to 5. A score of 80+ with no blocking checks is Ready; 60-79 is Revise; missing evidence or a score below 60 is Blocked.</Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
              {REVIEW_DIMENSIONS.map((dimension) => (
                <label key={dimension.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr 90px", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>{dimension.label}</span>
                  <span style={{ fontSize: 12, opacity: 0.72 }}>{dimension.prompt}</span>
                  <select value={ratings[dimension.id] ?? ""} onChange={(event) => updateRating(dimension.id, Number(event.target.value))} style={{ padding: 7, borderRadius: 4, background: "var(--dt-colors-background-container-neutral-default)", color: "inherit" }}>
                    <option value="">Rate</option>
                    {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} · {ratingLabel(value)}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </section>
          <section style={{ border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, padding: 18 }}>
            <Heading level={4}>Gate result</Heading>
            {quality && <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
                <Chip color={decisionColor[quality.decision]} variant="emphasized">{quality.decision.toUpperCase()}</Chip>
                <Text>{quality.score}/100</Text>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {quality.checks.map((check) => <div key={check.label} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 6, fontSize: 12 }}><span style={{ color: check.passed ? "#1dbb7e" : "#e74c3c" }}>{check.passed ? "OK" : "!"}</span><span><strong>{check.label}</strong><br /><span style={{ opacity: 0.7 }}>{check.detail}</span></span></div>)}
              </div>
            </>}
          </section>
        </div>
      ) : (
        <section style={{ border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, padding: 18 }}>
          <Heading level={4}>Tell the next learner</Heading>
          <Text textStyle="small" style={{ opacity: 0.7 }}>Rate the experience you actually had. Report friction separately from whether the mission content is accurate.</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
            {(["accuracy", "clarity", "difficulty"] as MissionReviewDimension[]).map((dimension) => (
              <label key={dimension} style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={{ fontWeight: 600 }}>{dimension[0].toUpperCase() + dimension.slice(1)}</span><select value={ratings[dimension] ?? ""} onChange={(event) => updateRating(dimension, Number(event.target.value))} style={{ padding: 8, borderRadius: 4, background: "var(--dt-colors-background-container-neutral-default)", color: "inherit" }}><option value="">Rate</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} · {ratingLabel(value)}</option>)}</select></label>
            ))}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={{ fontWeight: 600 }}>Overall</span><select value={overallRating || ""} onChange={(event) => setOverallRating(Number(event.target.value))} style={{ padding: 8, borderRadius: 4, background: "var(--dt-colors-background-container-neutral-default)", color: "inherit" }}><option value="">Rate</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} · {ratingLabel(value)}</option>)}</select></label>
          </div>
          {communityAverage !== null && <Text style={{ display: "block", marginTop: 14 }}>Community average: <strong>{communityAverage}/5</strong> from {communityReviews.length} review{communityReviews.length === 1 ? "" : "s"}{loadingReviews ? " · refreshing" : ""}</Text>}
        </section>
      )}

      <section style={{ border: "1px solid var(--dt-colors-border-neutral-default)", borderRadius: 8, padding: 18 }}>
        <Text style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Issue tags</Text>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {REVIEW_ISSUE_TAGS.map((tag) => <button key={tag} type="button" onClick={() => toggleIssueTag(tag)} style={{ padding: "6px 9px", borderRadius: 4, border: "1px solid var(--dt-colors-border-neutral-default)", background: issueTags.includes(tag) ? "rgba(20,150,255,.16)" : "transparent", color: "inherit", cursor: "pointer" }}>{tag}</button>)}
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}><Text textStyle="small">Notes</Text><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder={mode === "internal" ? "Record evidence, blockers, and required changes before merge." : "What should the next learner know?"} style={{ padding: 10, borderRadius: 4, border: "1px solid var(--dt-colors-border-neutral-default)", background: "transparent", color: "inherit", resize: "vertical" }} /></label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}><Button variant="emphasized" onClick={() => void submit()} disabled={saveState === "saving"}>{saveState === "saving" ? "Saving..." : mode === "internal" ? "Save quality review" : "Publish feedback"}</Button>{saveState === "saved" && <Chip color="success">Saved</Chip>}{saveState === "failed" && <Chip color="critical">Complete the required ratings before saving</Chip>}</div>
      </section>

      {mode === "community" && communityReviews.length > 0 && <section><Heading level={4}>Recent learner feedback</Heading><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{communityReviews.slice(0, 5).map((review) => <div key={review.id ?? review.createdAt} style={{ padding: 12, borderBottom: "1px solid var(--dt-colors-border-neutral-disabled)" }}><Text><strong>{review.overallRating}/5</strong> · {review.notes || "No written note"}</Text><Text textStyle="small" style={{ display: "block", opacity: 0.6, marginTop: 4 }}>{new Date(review.createdAt).toLocaleDateString()} · {review.issueTags?.join(", ") || "No issue tags"}</Text></div>)}</div></section>}
    </Flex>
  );
};
