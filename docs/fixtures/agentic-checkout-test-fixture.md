# Agentic Checkout Test Fixture

## Goal

Provide one vendor-neutral workload for the Dynatrace and Datadog validation runs. The fixture is deliberately small: one user-facing endpoint, one database dependency, one outbound dependency, and one agent/tool call.

## Normal path

`POST /checkout` should emit:

- request and response metadata
- trace and span identity
- service and dependency relationships
- checkout outcome
- synthetic order value
- structured logs
- latency and error metrics
- agent session ID and tool-call metadata when the checkout assistant is used

## Controlled fault modes

| Fault | Trigger | Expected signal |
|---|---|---|
| Dependency latency | `FAULT_MODE=slow-payment` | payment span latency increases; checkout duration rises |
| Dependency error | `FAULT_MODE=payment-500` | payment error, checkout failure, correlated log |
| Agent tool timeout | `FAULT_MODE=tool-timeout` | tool span timeout, retry/fallback, user-visible degraded outcome |
| Bad release | `FAULT_MODE=release-regression` | elevated error rate for one release/version |

## Agent event envelope

Use this logical shape for the agent telemetry comparison. Each platform may map fields differently; preserve the semantic field names in the evidence notes.

```json
{
  "session_id": "sandbox-session-001",
  "trace_id": "trace-from-platform",
  "agent_name": "checkout-assistant",
  "agent_version": "0.1.0",
  "model_provider": "test-provider",
  "model_name": "test-model",
  "prompt_version": "checkout-v1",
  "tool_name": "get_payment_status",
  "tool_call_id": "tool-call-001",
  "tool_latency_ms": 120,
  "tool_status": "ok",
  "input_tokens": 0,
  "output_tokens": 0,
  "estimated_cost": 0,
  "approval_required": false,
  "business_outcome": "checkout_completed"
}
```

Do not put prompts, customer data, authorization headers, or secrets into screenshots. Use synthetic IDs and redact payloads where needed.

## Investigation questions

The same questions must be answered in both platforms:

1. Which release introduced the regression?
2. Which service and dependency are on the critical path?
3. Is the failure infrastructure, application, dependency, or agent-tool related?
4. Which evidence supports the answer?
5. What is the safest next action?
6. What is the business impact on checkout success and revenue?

## Acceptance criteria

A platform passes the fixture test only when the investigator can correlate the fault across at least two relevant signal types, identify the affected dependency, show the evidence used, state uncertainty, and recommend a reversible next action. Agent observability additionally requires visibility into the agent/tool span and outcome; host or service telemetry alone is insufficient.
