# Track Walk Discovery Curriculum: 2026

This is a content expansion for the CSM learning exercise. It is intentionally separate from the customer lifecycle audit: the audit records what customers experience; these missions test whether a CSM can find, interpret, and responsibly use the resources that help a customer.

## Learning objective

A CSM should be able to move from a customer question to the right first-party resource without guessing, overpromising, or sending a generic homepage link.

## Required discovery missions

### 1. Find the right documentation

**Prompt:** A customer asks, “What is the safest supported path to ingest my Kubernetes telemetry, and what permissions do I need?”

**Pass criteria:**

- starts at the current Dynatrace documentation/search surface;
- identifies an authoritative ingestion or Kubernetes page;
- records the page date/version context;
- distinguishes setup prerequisites from optional enhancements;
- returns a task-specific link and expected verification signal.

**Do not pass:** sending only the documentation homepage or quoting an undated community answer as product policy.

### 2. Find Dynatrace University

**Prompt:** A new platform engineer needs a foundation course, while an administrator needs a role-specific learning plan.

**Pass criteria:**

- finds the University catalog;
- identifies a relevant course and learning plan;
- records duration, prerequisites, sign-in/enrollment state, and whether progress continuity is verified;
- explains why each recommendation fits the role.

The current public catalog and Dynatrace Essentials capture are evidence assets. The learner must still treat account continuity as unverified until tested.

### 3. Use Dynatrace Search as a working tool

**Starting point:** https://search.dynatrace.com/#t=All&sort=relevancy

**Prompt:** Find the best current resource for `dtctl`, AI agent skills, and DQL query assistance.

**Pass criteria:**

- uses the search filters and result context rather than a general web search;
- compares documentation, community, developer, and release-note results;
- records the result type and update date;
- follows the result to the authoritative source;
- explains when the result is a how-to, reference, community tip, or release announcement.

The exercise must capture the actual search result page and the selected result page when the browser evidence pass is run.

### 4. Join the community through a useful answer

**Prompt:** A customer needs a practical DQL or workflow shortcut. Find one recent community tip, explain it, and state the limits of using it in a customer environment.

**2026 examples to seed the mission:**

- [DQL query snippets collection](https://community.dynatrace.com/t5/Dynatrace-tips/bd-p/Tips)
- [dtctl tip](https://community.dynatrace.com/t5/Dynatrace-tips/bd-p/Tips)
- [AI-powered DPL helper CLI tip](https://community.dynatrace.com/t5/Dynatrace-tips/Pro-Tip-Simplify-your-DPL-patterns-with-this-experimental-AI/m-p/294441)
- [Custom pivoting in Investigations](https://community.dynatrace.com/t5/Dynatrace-tips/Pro-Tip-Using-Custom-Pivoting-in-Investigations/m-p/294142)
- [Lookup tables with Investigations](https://community.dynatrace.com/t5/Dynatrace-tips/Pro-Tip-Creating-Lookup-Tables-using-Investigations-app/m-p/296874)

**Pass criteria:**

- creates or joins the Community experience rather than silently consuming it;
- identifies author, date, labels, replies, and whether the tip is official guidance or user-contributed practice;
- checks current documentation before recommending a workaround;
- explains permissions, preview/experimental status, or operational risk;
- saves the link and a concise customer-safe summary.

### 5. Follow the official video channel

**Prompt:** Find a current video that helps a customer understand a release, DQL, AI Observability, or app development.

Use the [Dynatrace YouTube channel](https://www.youtube.com/dynatrace) and the [Dynatrace developer resources](https://www.dynatrace.com/developer-relations/).

**Pass criteria:**

- identifies the video date and target audience;
- explains whether it is a demo, release update, tutorial, or opinion piece;
- checks the corresponding written documentation;
- gives the customer a reason to watch it, not just a link.

### 6. Listen to the right podcast or event content

**Prompt:** A customer executive wants strategic context on AI Observability or agentic operations, while an engineer wants implementation detail. Find one suitable audio or on-demand session for each.

Use the [Dynatrace resource center](https://www.dynatrace.com/resource-center), [developer resources](https://www.dynatrace.com/developer-relations/), and [Perform 2026 on-demand](https://www.dynatrace.com/perform/on-demand/perform-2026/).

**Pass criteria:**

- matches content to the listener’s role;
- records date and format;
- explains what the content can and cannot answer;
- pairs strategic content with an actionable technical resource.

Current 2026 examples include AI Observability with Dynatrace and AWS, “AI Is a Gift: Rethinking Software Engineering Education and Hiring,” Perform 2026 on-demand sessions, and the “What’s New in Dynatrace” video series.

### 7. Read releases like a CSM

**Prompt:** A customer asks what changed recently and whether a new feature affects their environment.

Use [What's new in Dynatrace](https://docs.dynatrace.com/docs/whats-new).

**Pass criteria:**

- identifies the relevant SaaS/OneAgent/ActiveGate release;
- distinguishes feature update, breaking change, fix, and documentation update;
- records rollout timing and support lifecycle;
- translates the change into customer impact and an action.

The current release surface documents bi-weekly SaaS rollouts and separate OneAgent/ActiveGate cadence. Do not present a release headline as a customer action without checking compatibility and rollout context.

### 8. Find end-of-support and end-of-life impact

**Prompt:** A customer is running an older OneAgent, Operator, runtime, or API integration. Identify whether the issue is End of Support or End of Life and give a migration-oriented next step.

Use:

- [End-of-support announcements](https://docs.dynatrace.com/docs/whats-new/technology/end-of-support-news)
- [End-of-life announcements](https://docs.dynatrace.com/docs/whats-new/technology/end-of-life-announcements)
- [Deprecated APIs](https://docs.dynatrace.com/docs/whats-new/dynatrace-api/deprecated-apis)

**2026 examples to test:** OneAgent 1.299 and earlier scheduled for EOL on September 1, 2026; native mobile apps sunset June 30, 2026; selected platform/API and runtime support changes; Dynatrace Operator support tables.

**Pass criteria:**

- names the exact component/version;
- distinguishes EoS from EoL;
- states the date and evidence source;
- identifies migration or upgrade guidance;
- avoids telling the customer that a component is already disabled when the source only says support ended.

## Community participation requirement

The CSM does not graduate by finding links. They must participate:

- bookmark or follow the relevant Community area;
- write a customer-safe summary of one tip;
- ask one precise follow-up question;
- identify what evidence would make the answer safe to recommend;
- record the author/date/status and return link;
- propose a product feedback item when the community workaround reveals product friction.

## Product-feedback mechanic

Every mission may end with one of three outcomes:

- **Guide customer:** an existing supported path is clear.
- **Escalate/support:** the customer needs an entitlement, support, or specialist.
- **Flag to product:** the observed friction is a product or content problem, not a CSM knowledge gap.

The learner must explain why. This keeps Track Walk from teaching CSMs to permanently compensate for avoidable product gaps.

## Screenshot capture backlog

The next browser evidence pass should capture, with timestamp and URL:

1. Dynatrace Search results for `dtctl`, DQL, and AI agent skills.
2. Selected documentation result and its update/version context.
3. Dynatrace University catalog and course detail.
4. Community tips landing page and two selected 2026 tip pages.
5. Official Dynatrace developer resources page.
6. Official YouTube channel or a current 2026 video page.
7. What's New landing page and one current release page.
8. End-of-support and end-of-life pages.

These captures should be added to `C:\temp\DTapp\projects\intel-ops\ui\assets\journeys\` and linked to the discovery missions rather than embedded as generic decoration.
