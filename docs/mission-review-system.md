# Mission Review System

**Status:** First implementation shipped 2026-07-19

Mission Control now separates content governance from learner feedback. Both live in the app's **Content Review** surface and persist to Document Service as `intelops-review` documents.

## Internal merge gate

An internal reviewer rates every mission on six dimensions:

| Dimension | Weight |
| --- | ---: |
| Accuracy | 25% |
| Evidence and reproducibility | 25% |
| Clarity | 15% |
| Difficulty calibration | 10% |
| Learner outcome | 15% |
| Operability, permissions, and fallback | 10% |

Each dimension is scored from 1 to 5 and converted to a 100-point weighted score.

- **Ready:** 80 or higher and no blocking quality check fails.
- **Revise:** 60-79 with no blocking quality check failure.
- **Blocked:** below 60 or missing required evidence, answer integrity, core fields, or ratings.

Blocking checks currently cover core fields, at least three checkpoints, valid multiple-choice answers, an evidence record with source URLs, and complete rubric ratings. A mission can be saved as a blocked review so the failure is visible; it must not be treated as merge-ready.

## Evidence contract

New or materially changed missions should add `Mission.evidence` with:

- Validation status: Playground-validated, tenant-validated, documentation-backed, or content-review
- Source URLs
- Capture date
- Data mode: Playground, tenant, fixture, or documentation
- Required capabilities and permission-sensitive behavior
- Notes about known limitations or fallback paths

The review gate deliberately fails missions without this record. This prevents a plausible answer from being mistaken for a tested product behavior.

## Community feedback

Learners can submit a separate review after a mission. Community feedback captures:

- Accuracy, clarity, and difficulty ratings
- Overall experience rating
- Issue tags such as stale UI, missing data, permission blocked, too easy, or too hard
- Optional written notes

Community feedback is public and aggregated for the selected mission. It does not alter official mission scores, XP, leaderboard rank, or merge status. A maintainer must interpret the signal and create a content change or validation task.

## Governance boundary

This is an in-app quality gate, not a GitHub branch protection rule yet. The required operating process is:

1. Author adds or changes the mission and evidence metadata.
2. Reviewer completes the internal rubric.
3. Any `blocked` or `revise` result is addressed and reviewed again.
4. Maintainer confirms target-tenant or fixture validation before merge.
5. Learner feedback is monitored after release and converted into follow-up work.

The next hardening step is a CI check that rejects malformed mission data and a reviewer approval check that requires a `ready` review for new content.
