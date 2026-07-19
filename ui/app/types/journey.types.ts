export type JourneyChoice = {
  id: string;
  label: string;
  best: boolean;
  xp: number;
  feedback: string;
  risk: string;
};

export type JourneyTouchpoint = {
  id: string;
  stage: string;
  type: "recognize" | "interpret" | "prioritize" | "guide" | "escalate" | "verify" | "reflect";
  evidence?: { src?: string; url: string; caption: string; badge?: string };
  visibleState: string;
  customerThought: string;
  question: string;
  hint: string;
  choices: JourneyChoice[];
  expectedOutcome: string;
  businessConsequence: string;
};

export type JourneyMission = {
  id: string;
  title: string;
  vendor: "Dynatrace";
  persona: string;
  personaRole: string;
  company: string;
  lifecycleStage: string;
  description: string;
  teaches: string;
  timerSeconds: number;
  briefing: { goal: string; alreadyDone: string[]; evidence: string[]; risk: string };
  touchpoints: JourneyTouchpoint[];
  contentStatus?: "ready" | "needs-rework";
  contentNote?: string;
};
