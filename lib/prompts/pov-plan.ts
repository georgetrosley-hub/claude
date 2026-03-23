import type { PriorityAccount } from "@/data/territory-data";
import type { PovPlan } from "@/data/pov-plans";

/**
 * Prompt for Deal Desk: refined POV plan output aligned to account progression.
 */
export function buildPovPlanGenerationPrompt(priorityAccount: PriorityAccount, plan: PovPlan): string {
  const stakeholdersLine = plan.stakeholders.map((s) => s.kind + "=" + s.title).join("; ");
  const timelineLine = plan.timeline.map((t) => t.period + ": " + t.milestone).join(" | ");
  const name = priorityAccount.name;

  return [
    "You are a Snowflake Enterprise AE working with a Solutions Engineer. Produce a polished, concise POV plan for " +
      name +
      ".",
    "",
    "Use this internal plan as ground truth—refine wording, tighten bullets, and align to a 2-week execution window. Do not invent unrelated products.",
    "",
    "**Account context**",
    "- Industry: " + priorityAccount.industry,
    "- POV hypothesis: " + priorityAccount.povHypothesis,
    "- Recommended next action: " + priorityAccount.nextAction,
    "",
    "**Structured plan (source)**",
    "- Objective: " + plan.objective,
    "- Business problem: " + plan.businessProblem,
    "- Snowflake workload: " + plan.snowflakeWorkload,
    "- Stakeholders: " + stakeholdersLine,
    "- Data required: " + plan.dataRequired.join(" | "),
    "- Timeline: " + timelineLine,
    "- Success criteria: " + plan.successCriteria.join(" | "),
    "- Follow-on expansion: " + plan.followOnExpansion,
    "",
    "**Output format (Markdown):**",
    "## POV Plan — " + name,
    "",
    "### Objective",
    "One sentence.",
    "",
    "### Business problem",
    "2–3 bullets max.",
    "",
    "### Snowflake workload",
    "One tight paragraph.",
    "",
    "### Stakeholders",
    "- Business: (list)",
    "- Technical: (list)",
    "",
    "### Data required",
    "Compact bullet list.",
    "",
    "### Timeline (2 weeks)",
    "Table or short bullets with week/day ranges and milestones.",
    "",
    "### Success criteria",
    "Exactly 3 measurable outcomes.",
    "",
    "### Expected follow-on expansion",
    "One short paragraph.",
    "",
    "### AE / SE next steps",
    "3 bullets for the next 48 hours.",
  ].join("\n");
}
