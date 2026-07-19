# Mission Control system design: race qualification and scoring

**Status:** Canonical implementation reference
**Last reviewed:** 2026-07-19

## 1. Core objects

| Object | Source of truth | Purpose |
| --- | --- | --- |
| Mission | `ui/app/data/missions.ts` + `ui/app/types/mission.types.ts` | A timed learning race with role, difficulty, checkpoints, prerequisites, topics, and discipline XP. |
| Checkpoint | `Checkpoint` in `mission.types.ts` | A single scored learner action. Current types are `multiple-choice` and `action`. |
| Circuit | `ui/app/data/circuits.ts` | An ordered collection of mission IDs with a track identity and driver-tier gate. |
| Discipline XP | `disciplines` on a mission | Role-oriented progress for SRE, Developer, Incident Commander, and Platform Engineer. |
| Topic XP | `topics` on a mission | Skill-area progress used by filters, recommendations, and progress views. |
| Score record | `intelops-score` Document Service document | Global leaderboard record containing score, difficulty, identity, and completion time. |

## 2. Mission qualification

A mission is publishable only when it has:

1. A unique stable ID and title/codename.
2. One supported role and one supported difficulty: `rookie`, `operator`, `elite`, or `legend`.
3. A concrete briefing and timer.
4. At least three checkpoints with instructions, hints, point values, and valid answer keys for multiple-choice checkpoints.
5. A prerequisite list containing existing mission IDs only.
6. At least one discipline XP grant and one topic.
7. An app or workflow reference when the task depends on a Dynatrace surface.
8. Evidence status: Playground-validated, tenant-validated, documentation-backed, or content-review. The status must not be inferred from the mission's difficulty.

For a circuit, every referenced mission ID must resolve through `getMissionById`. A circuit should contain a deliberate difficulty curve and should not hide a production dependency behind a mission marked `available`.

## 3. Difficulty model

Difficulty is a learner-facing skill tier, not a score multiplier.

| Difficulty | Intended learner state | Qualification expectation |
| --- | --- | --- |
| Rookie | Understand the product surface and vocabulary | One bounded workflow, low ambiguity, direct evidence. |
| Operator | Execute and correlate a workflow | Multiple surfaces or evidence types, meaningful tradeoffs, prerequisites. |
| Elite | Diagnose or tune a system under uncertainty | Cross-signal reasoning, bounded conclusions, configuration or optimization risk. |
| Legend | Reserved for future capstone work | Multi-step production-style scenario with explicit validation and recovery. |

The current implementation uses difficulty for display and filtering. It does not change points or XP. This is intentional until a separate calibration study proves that difficulty-weighted scoring improves fairness.

## 4. Score formula

The live race implementation in `ui/app/pages/Mission.tsx` is authoritative:

```text
checkpoint award = max(0, checkpoint.points - 100 if the learner previously answered that checkpoint incorrectly)
base score = sum of awarded checkpoint points
time bonus = remaining seconds at final checkpoint * 0.5
hint penalty = number of unique hints revealed * 50
total score = max(0, base score + time bonus - hint penalty)
```

The timer is initialized from `mission.timerSeconds`. A timeout produces zero time bonus and a non-negative score from points earned before expiry. Hints are charged once per checkpoint even if opened repeatedly.

`ui/app/data/scoring.ts` contains a pure helper for the base/time calculation, but the live page currently performs the calculation inline so the helper is not the runtime source of truth. This should be consolidated before adding more scoring mechanics.

## 5. XP and completion

- Completing a mission grants each configured discipline XP amount.
- Completing a mission grants 25 topic XP for each topic listed on the mission.
- Discipline levels use thresholds 0, 500, 1500, 3000, and 6000 XP.
- Topic levels use thresholds 0, 100, 300, 600, and 2000 XP.
- Total XP is the sum of discipline XP, not score points.
- A mission completion is recorded by mission ID and should occur only after a successful non-timeout debrief.

## 6. Circuit and driver tiers

Circuit tier thresholds are separate from discipline levels:

- Rookie: 0 XP
- Intermediate: 500 XP
- Advanced: 1500 XP
- Elite: 3000 XP

`CIRCUIT_TIER_MAP` assigns a tier to each circuit. Circuit completion badges require every mission ID in that circuit to appear in `completedMissions`.

## 7. Leaderboard contract

Scores are saved to Document Service as type `intelops-score`, then made public on a best-effort basis. The payload includes user, mission, role, difficulty, base score, time bonus, hints used, total score, and ISO completion time.

Leaderboard consumers must treat missing or malformed documents as skipped records, not as zero scores. Scores are comparable within the current formula; cross-version comparisons need an app-version field before any scoring changes ship.

## 8. Current gaps and guardrails

- Add a version field to score records before changing scoring mechanics.
- Consolidate `data/scoring.ts` and the inline `Mission.tsx` formula.
- Enforce prerequisites at route/runtime level, not only in mission listing UI.
- Add automated validation for duplicate mission IDs, dangling circuit/prerequisite IDs, empty checkpoints, invalid answer keys, and duplicate checkpoint IDs.
- Add a formal evidence-status field to missions before publishing Playground-dependent tracks.
- DQL-query checkpoints require a schema/runtime extension; the current checkpoint union does not support them yet.
