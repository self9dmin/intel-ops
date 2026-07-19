# Mission Use-Case Scorecard

**Review date:** 2026-07-19  
**Scope:** 43 missions in `ui/app/data/missions.ts` before decommissioning  
**Score meaning:** Curriculum fitness, not merge approval. A mission can score well here and still fail the evidence gate until it is reproduced in the target Playground or tenant.

## Rubric

- **90-100:** Strong learning outcome and good level fit; keep and validate.
- **75-89:** Good use case; keep with evidence or small content improvements.
- **60-74:** Useful foundation, but revise the outcome, difficulty, or evidence path.
- **Below 60:** Weak, duplicative, unstable, or too generic; retire or redesign before returning.

## Scorecard

| Mission | Score | Action | Reason |
| --- | ---: | --- | --- |
| Welcome to the Playground | 58 | Revise | Useful entry point, but too navigation-heavy and dependent on exact page labels/counts. |
| Ask the Machine | 42 | Retire | Duplicates newer AI/Davis tracks and assumes entitlement-sensitive Assist behavior. |
| Find Your Footing | 74 | Keep | Good orientation value; support and developer-resource claims still need refresh checks. |
| Know Your Wheel | 68 | Revise | Valuable breadth, but shortcuts, workflows, investigations, and log ingestion are too much for one rookie mission. |
| Your First Alert | 73 | Keep | Strong alerting foundation; needs current Settings labels and a real notification outcome. |
| First Briefing | 45 | Retire | Prompt-writing exercise overlaps with stronger incident and AI tracks. |
| Blast Radius | 66 | Revise | Sound reasoning, but Smartscape/Assist investigation belongs at operator level, not rookie. |
| The Causal Chain | 78 | Keep | Good causal reasoning; add visible evidence and a verification step. |
| SLO Burn Rate | 72 | Revise | Useful SRE concept, but current mission is too prompt-dependent and query-light. |
| Predict the Failure | 55 | Retire | Forecasting behavior and fixture availability are too unstable for a foundation path. |
| The Postmortem | 58 | Retire | Overlaps with Command Postmortem without a distinct artifact or role outcome. |
| The War Room Brief | 50 | Retire | Generic Assist briefing with little reproducible evidence. |
| The Timeline | 68 | Keep | Important incident-commander skill; require a timeline artifact. |
| Customer Impact | 64 | Revise | Valuable business translation, but the current platform claim needs a verified data path. |
| Escalation Decision | 62 | Retire | Generic judgement exercise lacks a measurable impact threshold and decision record. |
| The All-Clear | 70 | Revise | Good closure behavior; add recovery evidence and a no-new-problem check. |
| Command Postmortem | 71 | Revise | Stronger than the retired postmortem, but must produce a structured action record. |
| Why Is It Slow? | 82 | Keep | Clear developer investigation outcome with good performance relevance. |
| The OTel Query | 74 | Revise | Good OTel direction; needs executable DQL rather than query recognition. |
| Deploy with Confidence | 76 | Keep | Strong deployment correlation use case; add a reproducible before/after check. |
| The Log Story | 75 | Revise | Good signal correlation; require actual log-to-trace evidence. |
| Your Error Budget | 68 | Revise | Relevant, but the concept and thresholds need stronger service-level evidence. |
| The Code Fix Brief | 58 | Retire | Generic AI-generated code guidance is not a reproducible Dynatrace workflow. |
| The Fleet Report | 65 | Revise | Useful inventory concept, but needs ownership and action output. |
| Disk Forecast | 55 | Retire | Duplicates predictive-failure content and depends on a narrow forecast fixture. |
| OTel Inventory | 66 | Revise | Useful platform question, but Assist-only inventory is not enough proof of instrumentation. |
| Log Volume Intelligence | 67 | Revise | Good cost direction, but needs current consumption evidence and DQL. |
| Build the Workflow | 72 | Revise | Good automation intent; add preview, permissions, failure, and recovery evidence. |
| The Approval Gate | 82 | Keep | Strong safety and human-in-the-loop outcome. |
| Read the Room | 48 | Retire | Operator-level label memorization rather than actual problem investigation. |
| Follow the Signal | 72 | Revise | Useful log foundation; replace approximate counts with reproducible queries. |
| Map the Service | 76 | Keep | Strong service foundation; validate current service facets and entity names. |
| Validate the Collector | 75 | Revise | Good rookie OTel concept, but exact Collector fixture and validation path remain open. |
| Follow the OTel Trace | 84 | Keep | Clear trace-level investigation outcome; trace data path has been observed in Playground. |
| Join the OTel Log Story | 86 | Keep | Strong signal-correlation reasoning; still needs target-fixture validation. |
| Read OTel Metrics | 78 | Keep | Good advanced semantics; requires a stable metric fixture and DQL checkpoint. |
| Map the AI Signal | 82 | Keep | Correctly separates AI assistance from AI observability; validate tenant availability. |
| Trace the Agent Run | 84 | Keep | Strong agentic execution-path outcome; requires an instrumented AI fixture. |
| Measure Token Economics | 86 | Keep | Good cost/quality trade-off framing; validate available token and cost dimensions. |
| Follow the Agent Topology | 83 | Keep | Strong topology and MCP investigation concept; validate framework-specific data. |
| Prove the Instrumentation | 88 | Keep | Excellent troubleshooting outcome; requires a reproducible OTLP/semantic-convention fixture. |
| Guard the Model Experience | 85 | Keep | Strong operational-health framing and explicit measurement limits. |
| Bridge the AI Incident | 89 | Keep | Best end-to-end AI use case; needs a verified incident fixture and structured debrief. |

## Decommissioned now

Nine missions are marked `retired` in the mission data and removed from active circuits. Their IDs remain resolvable so historical scores and links do not break:

- Ask the Machine
- First Briefing
- Predict the Failure
- The Postmortem
- The War Room Brief
- Escalation Decision
- The Code Fix Brief
- Disk Forecast
- Read the Room

`Blast Radius` was retained but its current rookie classification should be changed to operator when its evidence pass is completed. The active library is now 34 missions, with the remaining content split between Keep and Revise rather than pretending all active missions are equally strong.

## Next strengthening pass

1. Add evidence metadata to every active mission.
2. Move `Blast Radius` to operator difficulty and verify its Smartscape path.
3. Replace retired problem triage with an evidence-based Problems mission.
4. Add DQL/evidence checkpoints to logs, traces, OTel, and SLO missions.
5. Re-run the review rubric after validation and require `Ready` before merge.
