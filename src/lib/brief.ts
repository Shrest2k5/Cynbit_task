import { BUDGETS, FEATURES, INDUSTRIES, PROJECT_TYPES, TIMELINES, CASE_STUDY_BASE_URL } from "./catalog";
import { formatInr, type Blueprint, type Intake, type ScoredCase } from "./blueprint";

export function toMarkdown(intake: Intake, bp: Blueprint, cases: ScoredCase[]): string {
  const type = PROJECT_TYPES.find((t) => t.id === intake.projectType)?.label;
  const industry = INDUSTRIES.find((i) => i.id === intake.industry)?.label;
  const budget = BUDGETS.find((b) => b.id === intake.budgetId)?.label;
  const timeline = TIMELINES.find((t) => t.id === intake.timelineId)?.label;
  const features = FEATURES.filter((f) => intake.features.includes(f.id)).map((f) => f.label);

  return [
    "# Project blueprint",
    "",
    `- Project: ${type}`,
    `- Industry: ${industry}`,
    `- Features: ${features.length ? features.join(", ") : "none selected"}`,
    `- Target timeline: ${timeline}`,
    `- Budget band: ${budget}`,
    "",
    "## Indicative estimate",
    `- Duration: ${bp.weeks} weeks`,
    `- Cost: ${formatInr(bp.costLow)} to ${formatInr(bp.costHigh)}`,
    "",
    "## Phases",
    ...bp.phases.map((p) => `- ${p.name}: ${p.weeks} weeks`),
    "",
    "## Suggested stack",
    bp.stack.join(", "),
    "",
    "## Similar work",
    ...cases.map((c) => `- ${c.client}: ${c.title} (${CASE_STUDY_BASE_URL}${c.slug})`),
    "",
    "_Indicative only. Assumed rates, not Cynbit pricing._",
    "",
  ].join("\n");
}
