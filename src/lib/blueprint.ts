import {
  BUDGETS,
  CASE_STUDIES,
  FEATURES,
  PROJECT_TYPES,
  TIMELINES,
  type CaseStudy,
  type FeatureId,
  type Industry,
  type ProjectType,
} from "./catalog";

export interface Intake {
  projectType: ProjectType;
  industry: Industry;
  features: FeatureId[];
  budgetId: string;
  timelineId: string;
}

// Illustrative assumptions, NOT Cynbit pricing: a blended small-squad rate per
// delivery week, and a fixed share of effort for design, QA and launch.
export const RATE_PER_WEEK_INR = 150_000;
export const OVERHEAD_FACTOR = 1.25;
export const RANGE_SPREAD = 0.2;

export type Fit = "comfortable" | "tight" | "unrealistic";

export interface Blueprint {
  weeks: number;
  costLow: number;
  costHigh: number;
  budgetFit: Fit;
  timelineFit: Fit;
  phases: { name: string; weeks: number }[];
  stack: string[];
  notes: string[];
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function estimate(intake: Intake): Blueprint {
  const type = PROJECT_TYPES.find((t) => t.id === intake.projectType);
  const budget = BUDGETS.find((b) => b.id === intake.budgetId);
  const timeline = TIMELINES.find((t) => t.id === intake.timelineId);
  if (!type || !budget || !timeline) throw new Error("Invalid intake");

  const chosen = FEATURES.filter((f) => intake.features.includes(f.id));
  const featureWeeks = chosen.reduce((sum, f) => sum + f.weeks, 0);
  const weeks = Math.max(2, Math.ceil((type.baseWeeks + featureWeeks) * OVERHEAD_FACTOR));

  const mid = weeks * RATE_PER_WEEK_INR;
  const costLow = roundTo(mid * (1 - RANGE_SPREAD), 10_000);
  const costHigh = roundTo(mid * (1 + RANGE_SPREAD), 10_000);

  const budgetFit: Fit =
    costLow > budget.max ? "unrealistic" : costHigh > budget.max ? "tight" : "comfortable";

  const timelineFit: Fit =
    weeks > timeline.weeks * 1.25 ? "unrealistic" : weeks > timeline.weeks ? "tight" : "comfortable";

  const split: [string, number][] = [
    ["Discovery & blueprint", 0.12],
    ["Design", 0.18],
    ["Build", 0.5],
    ["QA & security review", 0.12],
    ["Launch & handover", 0.08],
  ];
  let remaining = weeks;
  const phases = split.map(([name, share], i) => {
    const w = i === split.length - 1 ? remaining : Math.max(1, Math.round(weeks * share));
    remaining -= w;
    return { name, weeks: w };
  });

  const stack = Array.from(new Set([...type.stack, ...chosen.flatMap((f) => f.stack)]));

  const notes: string[] = [];
  if (budgetFit !== "comfortable")
    notes.push("Your budget band is below this scope. Trim features or phase the build to fit.");
  if (timelineFit !== "comfortable")
    notes.push("This scope needs more calendar time than you asked for. A phased launch can ship a core version first.");
  if (chosen.length >= 6)
    notes.push("Six or more features usually calls for an MVP-first release.");

  return { weeks, costLow, costHigh, budgetFit, timelineFit, phases, stack, notes };
}

export interface ScoredCase extends CaseStudy {
  score: number;
}

export function matchCaseStudies(intake: Intake, limit = 3): ScoredCase[] {
  return CASE_STUDIES.map((c) => {
    let score = 0;
    if (c.types.includes(intake.projectType)) score += 3;
    if (c.industry === intake.industry && intake.industry !== "other") score += 2;
    score += c.features.filter((f) => intake.features.includes(f)).length;
    return { ...c, score };
  })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || a.client.localeCompare(b.client))
    .slice(0, limit);
}

export const formatInr = (n: number) =>
  n >= 100_000 ? `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)} lakh` : `₹${n.toLocaleString("en-IN")}`;
