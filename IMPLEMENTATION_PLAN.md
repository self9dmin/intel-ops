# Intel Ops — UX Consolidation Implementation Plan

## 1. Route Map

```
Path                    Component           Default?  Query Params
──────────────────────  ──────────────────  ────────  ─────────────────────────────
/missions               MissionsPage        YES (/)   ?topic=<id>&discipline=<id>
                                                      &difficulty=<id>&path=<id>
/missions/:id           MissionPage         —         (existing, unchanged)
/debrief/:id            DebriefPage         —         (existing, unchanged)
/progress               ProgressPage        —         ?tab=skills|leaderboard|history|achievements
/onboarding             OnboardingWizard    —         (shown when !userState)
```

**Removed routes:** `/` (Home), `/leaderboard`, `/profile`, `/data`

**Default route:** `/missions` — redirect `/` → `/missions`

**Query param patterns:**
- `/missions?topic=kubernetes` — pre-filter mission grid by topic
- `/missions?path=sre-fundamentals` — select learning path, filter grid
- `/missions?discipline=sre&difficulty=rookie` — compound filter
- `/progress?tab=leaderboard` — open Progress on Leaderboard tab

---

## 2. Component Architecture

### 2.1 App Shell

```
<UserStateProvider>
  <LeaderboardProvider>
    <Page>
      <Page.Header>
        <AppHeader>                        ← 2 nav items: Missions, Progress
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route "/" → Navigate to="/missions" />
          <Route "/missions" → <MissionsPage /> />
          <Route "/missions/:id" → <MissionPage /> />    ← existing Mission.tsx renamed
          <Route "/debrief/:id" → <DebriefPage /> />     ← existing Debrief.tsx renamed
          <Route "/progress" → <ProgressPage /> />
        </Routes>
      </Page.Main>
    </Page>
  </LeaderboardProvider>
</UserStateProvider>
```

### 2.2 MissionsPage Component Tree

```
MissionsPage
├── PlayerStatusStrip                    ← plain div (no Surface)
│   ├── stat: Player Name
│   ├── stat: Total XP
│   ├── stat: Global Rank
│   ├── stat: Missions Completed
│   └── stat: Current Streak
├── RecommendedMissions                  ← section with Heading
│   ├── MissionCard (recommended #1)     ← Surface per card
│   │   └── "Recommended because …" label
│   └── MissionCard (recommended #2)     ← Surface per card
│       └── "Recommended because …" label
├── LearningPathsRow                     ← div with Chip/Button per path
│   └── Chip × N (one per learning path)
├── MissionFiltersRow                    ← div with filter controls
│   ├── Select: Discipline
│   ├── Select: Topic
│   ├── Select: Difficulty
│   ├── Select: Max Time
│   └── Toggle: Show Locked
└── MissionGrid                          ← CSS grid (display: grid)
    └── MissionCard × N                  ← Surface per card
        ├── state: Start / Completed ✓ + Replay / Locked (disabled)
        └── locked tooltip: prerequisite mission title(s)
```

**Surface usage on MissionsPage:**
- Each `MissionCard` is wrapped in `<Surface>` — these are siblings, never nested
- `PlayerStatusStrip` is a plain `<div>` with inline styles
- Filter/path rows are plain `<div>`s
- Section headings use `<Heading>` directly

### 2.3 ProgressPage Component Tree

```
ProgressPage
└── Tabs                                  ← Strato Tabs component
    ├── Tab: "Skills"
    │   └── SkillsTab
    │       ├── Heading "Discipline Tracks"
    │       ├── DisciplineTrackGrid        ← CSS grid, 4 cards
    │       │   └── DisciplineCard × 4     ← Surface per card
    │       │       ├── XP bar
    │       │       ├── Level name
    │       │       └── "Related missions (n)" link → /missions?discipline=X
    │       ├── Heading "Topic Tracks"
    │       └── TopicTrackGrid             ← CSS grid, 12 cards
    │           └── TopicCard × 12         ← Surface per card
    │               ├── XP bar
    │               ├── Level name
    │               └── "Related missions (n)" link → /missions?topic=X
    ├── Tab: "Leaderboard"
    │   └── LeaderboardTab
    │       ├── FilterRow (mission dropdown, difficulty dropdown)
    │       ├── Text "Scores may not reflect real-time data"
    │       └── DataTable / SkeletonRows / ErrorRetry
    ├── Tab: "History"
    │   └── HistoryTab
    │       ├── FilterRow (optional)
    │       └── DataTable (current user attempts) / EmptyState
    └── Tab: "Achievements"
        └── AchievementsTab
            └── BadgeGrid                  ← CSS grid
                └── BadgeCard × N          ← Surface per card
                    ├── earned: icon + name + date
                    └── locked: greyed icon + name + how-to-earn
```

**Surface usage on ProgressPage:**
- Each card (DisciplineCard, TopicCard, BadgeCard) is a `<Surface>`
- Tabs container: no Surface wrapper (Strato Tabs handles its own styling)
- DataTable sections: no Surface wrapper

### 2.4 Shared Components

```
components/
├── Header.tsx              ← MODIFY: 2 nav items (Missions, Progress)
├── MissionCard.tsx         ← NEW: reusable card for mission grid
├── PlayerStatusStrip.tsx   ← NEW: top stats bar
├── SkeletonRows.tsx        ← NEW: loading skeleton for tables
├── ErrorRetry.tsx          ← NEW: error message + retry button
├── EmptyState.tsx          ← NEW: empty state message
└── Card.tsx                ← KEEP (unused but harmless)
```

---

## 3. Context / State Design

### 3.1 UserStateContext (MODIFY existing)

```typescript
interface UserStateValue {
  // Existing
  userState: UserState | null;
  loading: boolean;
  error: string | null;            // ← ADD: surface errors
  saveUserState: (discipline: Discipline) => Promise<void>;
  awardXP: (xpGrants: XPGrant[]) => Promise<void>;

  // New fields on UserState document
  // completedMissions: string[]
  // streakDays: number
  // lastActiveDate: string
  // badges: string[]

  // New methods
  completeMission: (missionId: string) => void;  // append to completedMissions
  updateStreak: () => void;                        // called on app mount
  awardBadge: (badgeId: string) => void;
  retry: () => void;                               // ← ADD: retry load
}
```

**When to memoize:**
- `userState` object reference changes only on writes → no extra memo needed
- Derived data (unlockedMissions, recommendations) memoized in consuming components via `useMemo`

### 3.2 LeaderboardContext (NEW)

```typescript
interface LeaderboardContextValue {
  scores: StoredScore[];
  loading: boolean;
  error: string | null;
  stale: boolean;
  fetchScores: () => Promise<void>;
  markStale: () => void;
  retry: () => void;
}
```

**Behavior:**
- Does NOT fetch on mount — lazy load when leaderboard tab opens or MissionsPage needs rank
- After mission completion, call `markStale()` — does not refetch immediately
- On next leaderboard tab open, if `stale === true`, refetch
- Cache lives for the session; no TTL expiration

### 3.3 Local UI State (per page)

**MissionsPage local state:**
```typescript
const [selectedPath, setSelectedPath] = useState<string | null>(initFromQueryParam('path'));
const [filters, setFilters] = useState<MissionFilters>(initFromQueryParams());
const [showLocked, setShowLocked] = useState(false);
```

**ProgressPage local state:**
```typescript
const [activeTab, setActiveTab] = useState(initFromQueryParam('tab') || 'skills');
// History tab
const [historyLoading, setHistoryLoading] = useState(false);
const [history, setHistory] = useState<ScoreRecord[]>([]);
const [historyLoaded, setHistoryLoaded] = useState(false);
```

---

## 4. Data Fetching + Caching Strategy

| Data                  | When Loaded               | Cache Location        | Invalidation              |
|----------------------|---------------------------|-----------------------|---------------------------|
| UserState            | App mount (eager)         | UserStateContext       | On write (replace in ctx) |
| Scores (leaderboard) | Lazy (tab open / rank)    | LeaderboardContext     | markStale → lazy refetch  |
| History (user scores)| Lazy (History tab open)   | ProgressPage local    | None (reload on tab)      |
| Missions (static)    | Import (compile time)     | missions.ts           | Never (static)            |
| Learning Paths       | Import (compile time)     | learningPaths.ts      | Never (static)            |
| Badges               | Import (compile time)     | badges.ts             | Never (static)            |

**Exact triggers:**
- `UserState`: `useEffect([], ...)` in `UserStateProvider` — fetches on mount, sets loading/error
- `Scores`: `fetchScores()` called by:
  1. `MissionsPage` on mount (needs rank for PlayerStatusStrip) — but ONLY if not already cached
  2. `LeaderboardTab` on mount if `stale || scores.length === 0`
- `History`: `useEffect` inside `HistoryTab` when tab becomes active AND `!historyLoaded`

---

## 5. Pseudo-Code for Critical Logic

### 5.1 Unlock Evaluation with Memoization

```typescript
// data/missions.ts — each mission gets:
// prerequisites: string[]  (mission IDs that must be completed first)

// hook: useUnlockedMissions.ts
function useUnlockedMissions(completedMissions: string[]): Set<string> {
  return useMemo(() => {
    const unlocked = new Set<string>();
    for (const mission of MISSIONS) {
      if (mission.prerequisites.length === 0) {
        unlocked.add(mission.id);
      } else if (mission.prerequisites.every(id => completedMissions.includes(id))) {
        unlocked.add(mission.id);
      }
    }
    return unlocked;
  }, [completedMissions]);  // recalc only when completedMissions changes
}
```

### 5.2 Mission Filtering with useMemo

```typescript
function useFilteredMissions(
  missions: Mission[],
  unlockedSet: Set<string>,
  completedSet: Set<string>,
  filters: MissionFilters,
  showLocked: boolean,
  selectedPath: string | null
): Mission[] {
  return useMemo(() => {
    let result = [...missions];

    // Apply learning path filter
    if (selectedPath) {
      const pathMissionIds = LEARNING_PATHS[selectedPath]?.missionIds ?? [];
      result = result.filter(m => pathMissionIds.includes(m.id));
    }

    // Apply discipline filter
    if (filters.discipline) {
      result = result.filter(m =>
        m.disciplines.some(d => d.discipline === filters.discipline)
      );
    }

    // Apply topic filter
    if (filters.topic) {
      result = result.filter(m => m.topics?.includes(filters.topic));
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      result = result.filter(m => m.difficulty === filters.difficulty);
    }

    // Apply max time filter
    if (filters.maxTime) {
      result = result.filter(m => m.timerSeconds <= filters.maxTime * 60);
    }

    // Hide locked unless showLocked is on
    if (!showLocked) {
      result = result.filter(m => unlockedSet.has(m.id));
    }

    // Sort: unlocked+incomplete → unlocked+completed → locked
    result.sort((a, b) => {
      const aUnlocked = unlockedSet.has(a.id);
      const bUnlocked = unlockedSet.has(b.id);
      const aCompleted = completedSet.has(a.id);
      const bCompleted = completedSet.has(b.id);

      // unlocked+incomplete first
      if (aUnlocked && !aCompleted && !(bUnlocked && !bCompleted)) return -1;
      if (bUnlocked && !bCompleted && !(aUnlocked && !aCompleted)) return 1;
      // unlocked+completed next
      if (aUnlocked && aCompleted && !bUnlocked) return -1;
      if (bUnlocked && bCompleted && !aUnlocked) return 1;
      // locked last (both same tier → preserve original order)
      return 0;
    });

    return result;
  }, [missions, unlockedSet, completedSet, filters, showLocked, selectedPath]);
}
```

### 5.3 Recommendation Selection + "Why"

```typescript
interface Recommendation {
  mission: Mission;
  reason: string;
}

function useRecommendedMissions(
  unlockedSet: Set<string>,
  completedSet: Set<string>,
  selectedPath: string | null,
  userState: UserState
): Recommendation[] {
  return useMemo(() => {
    const candidates = MISSIONS.filter(
      m => unlockedSet.has(m.id) && !completedSet.has(m.id)
    );

    const recommendations: Recommendation[] = [];

    // Priority 1: Next mission in selected learning path
    if (selectedPath) {
      const pathIds = LEARNING_PATHS[selectedPath]?.missionIds ?? [];
      for (const id of pathIds) {
        if (unlockedSet.has(id) && !completedSet.has(id)) {
          const mission = MISSIONS.find(m => m.id === id);
          if (mission) {
            recommendations.push({
              mission,
              reason: `Next in your "${LEARNING_PATHS[selectedPath].name}" path`
            });
            break;
          }
        }
      }
    }

    // Priority 2: Weakest topic XP gap
    if (recommendations.length < 2) {
      const topicXP = userState.topicXP ?? {};
      // Find topic with lowest XP that has available missions
      const topicGaps = candidates
        .flatMap(m => (m.topics ?? []).map(t => ({ topic: t, mission: m })))
        .filter(({ topic }) => !recommendations.some(r => r.mission.topics?.includes(topic)));

      // Sort by topic XP ascending (weakest first)
      topicGaps.sort((a, b) => (topicXP[a.topic] ?? 0) - (topicXP[b.topic] ?? 0));

      for (const { topic, mission } of topicGaps) {
        if (!recommendations.some(r => r.mission.id === mission.id)) {
          recommendations.push({
            mission,
            reason: `Strengthen your weakest area: ${formatTopicName(topic)}`
          });
          if (recommendations.length >= 2) break;
        }
      }
    }

    // Priority 3: Discipline match
    if (recommendations.length < 2) {
      const discipline = userState.startingDiscipline;
      for (const m of candidates) {
        if (m.disciplines.some(d => d.discipline === discipline) &&
            !recommendations.some(r => r.mission.id === m.id)) {
          recommendations.push({
            mission: m,
            reason: `Matches your ${formatDisciplineName(discipline)} role`
          });
          if (recommendations.length >= 2) break;
        }
      }
    }

    return recommendations.slice(0, 2);
  }, [unlockedSet, completedSet, selectedPath, userState]);
}
```

### 5.4 awardXP() Including Streak, completedMissions, Badge Evaluation

```typescript
async function onMissionComplete(
  missionId: string,
  scoreRecord: ScoreRecord,
  xpGrants: XPGrant[]
): Promise<void> {
  // --- Step 1: Update UserState ---
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

  // Streak calculation
  let newStreak = userState.streakDays;
  const lastActive = userState.lastActiveDate;
  if (lastActive) {
    const lastDate = new Date(lastActive);
    const diffDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      newStreak += 1;        // consecutive day
    } else if (diffDays > 1) {
      newStreak = 1;          // streak broken
    }
    // diffDays === 0 → same day, keep streak
  } else {
    newStreak = 1;            // first activity
  }

  // Update completedMissions
  const newCompleted = userState.completedMissions.includes(missionId)
    ? userState.completedMissions
    : [...userState.completedMissions, missionId];

  // Apply XP grants
  const newDisciplines = { ...userState.disciplines };
  const newTopicXP = { ...userState.topicXP };
  for (const grant of xpGrants) {
    if (grant.discipline) {
      const disc = newDisciplines[grant.discipline];
      disc.xp += grant.amount;
      disc.level = calculateLevel(disc.xp);
      disc.levelName = getLevelName(disc.level);
    }
    if (grant.topic) {
      newTopicXP[grant.topic] = (newTopicXP[grant.topic] ?? 0) + grant.amount;
    }
  }

  // Evaluate badges
  const newBadges = [...userState.badges];
  for (const badgeDef of ALL_BADGES) {
    if (!newBadges.includes(badgeDef.id)) {
      if (badgeDef.predicate({
        completedMissions: newCompleted,
        streakDays: newStreak,
        disciplines: newDisciplines,
        topicXP: newTopicXP,
        totalXP: computeTotalXP(newDisciplines),
      })) {
        newBadges.push(badgeDef.id);
      }
    }
  }

  const updatedUserState: UserState = {
    ...userState,
    disciplines: newDisciplines,
    topicXP: newTopicXP,
    completedMissions: newCompleted,
    streakDays: newStreak,
    lastActiveDate: today,
    badges: newBadges,
  };

  // --- Step 2: Sequential writes ---
  // Write UserState FIRST
  try {
    await writeUserState(updatedUserState);  // delete old doc + create new
  } catch (err) {
    throw new Error('Failed to save progress. Score not recorded.');
    // DO NOT write score if UserState fails
  }

  // Write Score document SECOND (only if UserState succeeded)
  try {
    await documentsClient.createDocument({
      body: {
        name: `score-${userState.userId}-${missionId}-${Date.now()}`,
        type: 'intelops-score',
        content: JSON.stringify(scoreRecord),
        isPrivate: false,
      }
    });
  } catch (err) {
    console.error('Score write failed (UserState was saved):', err);
    // UserState is saved — score loss is non-fatal but log it
  }

  // Mark leaderboard stale
  leaderboardCtx.markStale();

  // Update local context
  setUserState(updatedUserState);
}
```

### 5.5 Sequential Document Service Writes

Already shown above in 5.4. Key rules:
```
1. await writeUserState(...)    // if throws → STOP, do not write score
2. await createScoreDocument(...)  // if throws → log warning, continue
3. markStale()                     // local only, never fails
```

Never use `Promise.all`. Always sequential, always check first write before second.

### 5.6 Leaderboard Aggregation (Best Score per Player per Mission)

```typescript
function aggregateLeaderboard(
  scores: StoredScore[],
  missionFilter?: string,
  difficultyFilter?: string
): LeaderboardRow[] {
  // Step 1: Filter
  let filtered = scores;
  if (missionFilter) {
    filtered = filtered.filter(s => (s.missionId ?? s.mission) === missionFilter);
  }
  if (difficultyFilter) {
    filtered = filtered.filter(s => s.difficulty === difficultyFilter);
  }

  // Step 2: Best score per player per mission
  const bestMap = new Map<string, StoredScore>(); // key: `${userId}-${missionId}`
  for (const score of filtered) {
    const key = `${score.userId}-${score.missionId ?? score.mission}`;
    const existing = bestMap.get(key);
    if (!existing || score.totalScore > existing.totalScore) {
      bestMap.set(key, score);
    }
  }

  // Step 3: Sort by total score descending
  const sorted = [...bestMap.values()].sort((a, b) => b.totalScore - a.totalScore);

  // Step 4: Map to rows with rank
  return sorted.map((s, i) => ({
    rank: i + 1,
    player: formatPlayerName(s),
    mission: formatMissionName(s.missionId ?? s.mission),
    difficulty: s.difficulty,
    score: Math.round(s.totalScore),
    date: formatDate(s.completedAt),
    userId: s.userId,
  }));
}
```

### 5.7 Leaderboard Stale Invalidation + Lazy Refresh

```typescript
// In LeaderboardContext:
const [stale, setStale] = useState(false);
const [scores, setScores] = useState<StoredScore[]>([]);
const [loading, setLoading] = useState(false);

function markStale() {
  setStale(true);
}

async function fetchScores() {
  if (loading) return; // prevent double fetch
  setLoading(true);
  setError(null);
  try {
    const allScores = await loadAllScoreDocuments();
    setScores(allScores);
    setStale(false);
  } catch (err) {
    setError('Failed to load leaderboard');
  } finally {
    setLoading(false);
  }
}

// Consumer (LeaderboardTab):
useEffect(() => {
  if (stale || scores.length === 0) {
    fetchScores();
  }
}, []); // only on tab mount

// Consumer (PlayerStatusStrip — needs rank):
useEffect(() => {
  if (scores.length === 0 && !loading) {
    fetchScores(); // initial load for rank display
  }
}, []);
```

---

## 6. UI States Table

| Section                  | Loading                        | Error                                    | Empty                                      |
|-------------------------|--------------------------------|------------------------------------------|--------------------------------------------|
| App (UserState)         | Full-page ProgressCircle       | Full-page error + Retry button           | → OnboardingWizard                         |
| PlayerStatusStrip       | Skeleton text placeholders     | Show "—" for rank; rest from UserState   | N/A (always has userState)                 |
| Recommended Missions    | N/A (computed from static)     | N/A                                      | "Complete a mission to unlock recommendations" |
| Mission Grid            | N/A (static data)              | N/A                                      | "No missions match your filters" + clear   |
| Leaderboard Tab         | 5 skeleton rows (animated)     | "Failed to load" + Retry button          | "No scores yet"                            |
| History Tab             | 5 skeleton rows                | "Failed to load" + Retry button          | "You haven't completed any missions yet"   |
| Skills Tab              | N/A (from UserState)           | N/A (from UserState)                     | Shows 0 XP bars for all tracks             |
| Achievements Tab        | N/A (computed from UserState)  | N/A                                      | All badges shown as locked                 |

---

## 7. Performance Notes

### Document Service Risks
- `listDocuments` returns all matching docs — no server-side pagination
- With ~500+ score documents, the leaderboard fetch will slow down
- **Mitigation:** Cache in LeaderboardContext, lazy-load only when tab opens, mark stale instead of refetching immediately
- **Phase 4 flag:** Implement server-side aggregation via App Function when doc count exceeds ~500

### Where to Memoize
- `useUnlockedMissions(completedMissions)` — useMemo, dep: `[completedMissions]`
- `useFilteredMissions(...)` — useMemo, dep: `[missions, unlockedSet, completedSet, filters, showLocked, selectedPath]`
- `useRecommendedMissions(...)` — useMemo, dep: `[unlockedSet, completedSet, selectedPath, userState]`
- `aggregateLeaderboard(scores, filters)` — useMemo, dep: `[scores, missionFilter, difficultyFilter]`
- Do NOT memoize simple renders; React is fast enough for this data volume

### CSS Grid Performance
- Mission grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;`
- Badge grid: same pattern with `minmax(200px, 1fr)`
- Topic grid: `repeat(auto-fill, minmax(240px, 1fr))`
- No virtualization needed — mission count is small (~20-50 max)

### Lazy Tab Loading
- History and Leaderboard tabs: data fetched only when tab becomes active
- Skills and Achievements: derived from UserState (already loaded), no fetch needed
- Tab content unmounts when switching? → Keep mounted with `display: none` to preserve scroll position and avoid refetching

---

## 8. New Static Data Files

### 8.1 data/learningPaths.ts

```typescript
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  missionIds: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'incident-response',
    name: 'Incident Response',
    description: 'Master the art of incident triage and resolution',
    missionIds: ['operation-3am-database-spike', 'operation-flatline'],
  },
  {
    id: 'sre-fundamentals',
    name: 'SRE Fundamentals',
    description: 'Build reliability engineering skills from the ground up',
    missionIds: ['operation-silent-rollout', 'operation-3am-database-spike'],
  },
  {
    id: 'platform-mastery',
    name: 'Platform Mastery',
    description: 'Deep dive into Kubernetes and infrastructure observability',
    missionIds: ['operation-k8s-meltdown', 'operation-silent-rollout'],
  },
  {
    id: 'developer-debugging',
    name: 'Developer Debugging',
    description: 'Trace and resolve application-level issues',
    missionIds: ['operation-ghost-in-the-trace', 'operation-silent-rollout'],
  },
];
```

### 8.2 data/badges.ts

```typescript
export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;           // Strato icon name
  description: string;    // shown when earned
  howToEarn: string;      // shown when locked
  predicate: (ctx: BadgeContext) => boolean;
}

interface BadgeContext {
  completedMissions: string[];
  streakDays: number;
  disciplines: Record<string, DisciplineProgress>;
  topicXP: Record<string, number>;
  totalXP: number;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'first-mission',
    name: 'First Contact',
    icon: 'rocket',
    description: 'Completed your first mission',
    howToEarn: 'Complete any mission',
    predicate: (ctx) => ctx.completedMissions.length >= 1,
  },
  {
    id: 'streak-3',
    name: 'On Fire',
    icon: 'flame',
    description: '3-day activity streak',
    howToEarn: 'Complete missions on 3 consecutive days',
    predicate: (ctx) => ctx.streakDays >= 3,
  },
  {
    id: 'streak-7',
    name: 'Unstoppable',
    icon: 'lightning',
    description: '7-day activity streak',
    howToEarn: 'Complete missions on 7 consecutive days',
    predicate: (ctx) => ctx.streakDays >= 7,
  },
  {
    id: 'all-rookie',
    name: 'Graduated',
    icon: 'graduation',
    description: 'Completed all Rookie missions',
    howToEarn: 'Complete every Rookie-difficulty mission',
    predicate: (ctx) => {
      const rookieMissions = MISSIONS.filter(m => m.difficulty === 'rookie');
      return rookieMissions.every(m => ctx.completedMissions.includes(m.id));
    },
  },
  {
    id: 'multi-discipline',
    name: 'Renaissance Operator',
    icon: 'star',
    description: 'Reached Analyst in 3+ disciplines',
    howToEarn: 'Reach Analyst level (100 XP) in 3 or more disciplines',
    predicate: (ctx) => {
      const analysts = Object.values(ctx.disciplines).filter(d => d.xp >= 100);
      return analysts.length >= 3;
    },
  },
  {
    id: 'five-missions',
    name: 'Veteran',
    icon: 'shield',
    description: 'Completed 5 missions',
    howToEarn: 'Complete 5 different missions',
    predicate: (ctx) => ctx.completedMissions.length >= 5,
  },
];
```

### 8.3 Mission data additions (modify missions.ts)

Add to each mission:
```typescript
prerequisites: string[];   // e.g., [] for starter missions
topics: string[];           // e.g., ['databases', 'kubernetes', 'traces']
```

---

## 9. UserState Schema Changes

### Current UserState:
```typescript
{
  userId: string;
  userEmail: string;
  startingDiscipline: Discipline;
  disciplines: Record<Discipline, DisciplineProgress>;
  onboardingComplete: boolean;
  createdAt: string;
}
```

### New UserState (additive, backward-compatible):
```typescript
{
  // ... all existing fields ...
  completedMissions: string[];     // default: []
  streakDays: number;              // default: 0
  lastActiveDate: string;          // default: '' (YYYY-MM-DD)
  badges: string[];                // default: []
  topicXP: Record<string, number>; // default: {}
}
```

**Migration:** On load, if fields are missing, default them:
```typescript
const loaded = JSON.parse(raw);
const userState: UserState = {
  ...loaded,
  completedMissions: loaded.completedMissions ?? [],
  streakDays: loaded.streakDays ?? 0,
  lastActiveDate: loaded.lastActiveDate ?? '',
  badges: loaded.badges ?? [],
  topicXP: loaded.topicXP ?? {},
};
```

---

## 10. Acceptance Checklist

### Navigation & Routing
- [ ] Remove Home, Leaderboard, Profile, Data routes
- [ ] Add `/missions` as default route (redirect `/` → `/missions`)
- [ ] Add `/progress` route with tab query param support
- [ ] Update Header to show 2 nav items: Missions, Progress
- [ ] Verify query param routing works: `?topic=X`, `?discipline=X`, `?path=X`, `?tab=X`

### Static Data
- [ ] Create `data/learningPaths.ts` with path definitions
- [ ] Create `data/badges.ts` with badge definitions and predicate functions
- [ ] Add `prerequisites: string[]` and `topics: string[]` to each mission in `missions.ts`

### UserState Changes
- [ ] Add `completedMissions`, `streakDays`, `lastActiveDate`, `badges`, `topicXP` to UserState type
- [ ] Add backward-compatible defaults on load
- [ ] Implement `completeMission()` method in context
- [ ] Implement `updateStreak()` on app mount
- [ ] Implement `awardBadge()` evaluation after mission complete
- [ ] Add `error` state and `retry()` method to UserStateContext
- [ ] Show error + retry on UserState load failure

### LeaderboardContext
- [ ] Create `LeaderboardContext` with scores, loading, error, stale, fetchScores, markStale
- [ ] Implement lazy loading (fetch only when needed)
- [ ] Implement stale marking on mission complete
- [ ] Implement lazy refresh on next leaderboard tab open

### MissionsPage
- [ ] Build `PlayerStatusStrip` (name, XP, rank, missions completed, streak)
- [ ] Build `RecommendedMissions` section (2 cards with "why" label)
- [ ] Build `LearningPathsRow` (chips that apply filter)
- [ ] Build `MissionFiltersRow` (discipline, topic, difficulty, maxTime, showLocked)
- [ ] Build `MissionGrid` with CSS grid layout
- [ ] Build `MissionCard` with 3 states: Start / Completed+Replay / Locked+Prerequisites
- [ ] Implement unlock logic with `useMemo([completedMissions])`
- [ ] Implement sort order: unlocked+incomplete → unlocked+completed → locked
- [ ] Implement recommendation logic (path → weakest topic → discipline match)
- [ ] Query param initialization for filters on mount

### ProgressPage
- [ ] Build tabbed layout with 4 tabs: Skills, Leaderboard, History, Achievements
- [ ] Tab state synced with `?tab=` query param
- [ ] **Skills tab:** 4 discipline cards + 12 topic cards with XP bars
- [ ] **Skills tab:** "Related missions (n)" link navigates to `/missions?topic=X`
- [ ] **Leaderboard tab:** DataTable with best-score-per-player aggregation
- [ ] **Leaderboard tab:** Mission + difficulty filter dropdowns
- [ ] **Leaderboard tab:** Skeleton loading state
- [ ] **Leaderboard tab:** "Scores may not reflect real-time data" note
- [ ] **History tab:** DataTable of current user's attempts
- [ ] **History tab:** Empty state for no history
- [ ] **Achievements tab:** Badge grid (earned vs locked)
- [ ] **Achievements tab:** Locked badges show how-to-earn description

### Sequential Writes
- [ ] Mission completion writes UserState first, then Score document
- [ ] If UserState write fails, Score is NOT written
- [ ] Leaderboard marked stale after successful writes

### Error Handling
- [ ] App-level: UserState loading → ProgressCircle; error → Retry button
- [ ] Leaderboard: loading skeleton, error + retry
- [ ] History: loading skeleton, error + retry, empty state

### Cleanup
- [ ] Delete `pages/Home.tsx`
- [ ] Delete `pages/Leaderboard.tsx`
- [ ] Delete `pages/Profile.tsx`
- [ ] Delete `pages/Data.tsx` (or keep if explicitly desired)
- [ ] Remove unused `Card.tsx` if no longer referenced
- [ ] Remove `DISCIPLINE_RECOMMENDED_MISSIONS` from Home.tsx (logic moves to recommendation hook)

---

## 11. Assumptions

1. **Topics per mission:** The current mission data doesn't have `topics`. I will define reasonable topic tags for each mission based on their content (e.g., `databases`, `kubernetes`, `tracing`, `metrics`, `logs`).

2. **Topic tracks (12):** The prompt mentions 12 topic tracks. I will define these based on the Dynatrace observability domain: `databases`, `kubernetes`, `tracing`, `metrics`, `logs`, `alerting`, `dashboards`, `slos`, `cloud-automation`, `security`, `rum`, `synthetics`. Exact list TBD based on mission coverage.

3. **topicXP:** Currently not tracked. XP grants from missions will include topic-level grants. The mission's `disciplines` array will be extended or paralleled with topic grants.

4. **Badge icons:** Will use closest available icons from `@dynatrace/strato-icons`. Exact icon names will be confirmed during implementation.

5. **Strato Tabs component:** Assuming `@dynatrace/strato-components-preview/layouts` or similar exports a `Tabs` / `Tab` component. Will verify during implementation; fallback is a custom tab bar with buttons.

6. **ProgressBar for XP:** Assuming Strato provides a `ProgressBar` or similar component. If not, will use a styled `<div>` with inline width.

7. **Keep existing Mission and Debrief pages:** These are functionally complete and only need minor integration updates (calling `completeMission()` and `markStale()` at the right time).

8. **Data page removal:** The `/data` route (DQL editor) is removed from nav. If it should be kept as a hidden route, that's a minor addition.

9. **Current user only for History tab:** The History tab shows only the current user's attempts, not all users' attempts.

10. **No animation libraries:** All transitions will be CSS-only (opacity, background-color) if any are used at all.
