"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { PriorityAccount } from "@/data/territory-data";
import { buildPovPlanFromPriorityAccount, type PovPlan } from "@/data/pov-plans";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  Briefcase,
  Clipboard,
  ClipboardCheck,
  Cpu,
  Flag,
  Target,
  Timer,
  Users,
} from "lucide-react";

interface PovPlanModuleProps {
  priorityAccount: PriorityAccount;
  onGeneratePovPlan?: (prompt: string) => void;
}

export function PovPlanModule({ priorityAccount, onGeneratePovPlan }: PovPlanModuleProps) {
  const plan: PovPlan = buildPovPlanFromPriorityAccount(priorityAccount);
  const [podcastBrief, setPodcastBrief] = useState<string>("");
  const [notebookPrompt, setNotebookPrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const groupedStakeholders = useMemo(
    () => ({
      business: plan.stakeholders.filter((s) => s.kind === "business").map((s) => s.title),
      technical: plan.stakeholders.filter((s) => s.kind === "technical").map((s) => s.title),
    }),
    [plan.stakeholders]
  );

  const objectiveText = useMemo(() => {
    const merged = `${plan.objective} ${plan.businessProblem}`.replace(/\s+/g, " ").trim();
    const sentences = merged
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => `${s}.`);
    return sentences.join(" ");
  }, [plan.objective, plan.businessProblem]);

  const recommendedWorkload = useMemo(
    () => [
      plan.snowflakeWorkload,
      `Primary data focus: ${plan.dataRequired[0] ?? "scoped workload source systems"}.`,
      "Deliver decision-grade outputs with governance, lineage, and clear owner accountability.",
    ].slice(0, 3),
    [plan.snowflakeWorkload, plan.dataRequired]
  );

  const compactTimeline = [
    { phase: "Week 1", milestone: "Setup + baseline" },
    { phase: "Week 2", milestone: "Proof" },
    { phase: "Final", milestone: "Executive readout" },
  ];

  const successMetrics = plan.successCriteria.slice(0, 3);

  const recommendedNextStep = `${priorityAccount.nextAction}`;

  const buildNotebookPrompt = () =>
    [
      `Create a 6-minute executive briefing script for ${priorityAccount.name}.`,
      "",
      "Use this POV content exactly:",
      `Objective: ${objectiveText}`,
      `Recommended workload: ${recommendedWorkload.join(" | ")}`,
      `Business stakeholders: ${groupedStakeholders.business.join(", ") || "N/A"}`,
      `Technical stakeholders: ${groupedStakeholders.technical.join(", ") || "N/A"}`,
      `Timeline: ${compactTimeline.map((t) => `${t.phase}: ${t.milestone}`).join(" | ")}`,
      `Success metrics: ${successMetrics.join(" | ")}`,
      `Recommended next step: ${recommendedNextStep}`,
      "",
      "Output format:",
      "- 5 section outline",
      "- 8 talk-track bullets",
      "- 3 likely executive questions with concise answers",
    ].join("\n");

  const handleExportPdf = () => {
    window.print();
  };

  const handleGeneratePodcastBrief = () => {
    const brief = [
      `Podcast Brief - ${priorityAccount.name}`,
      "",
      `Objective: ${objectiveText}`,
      `Workload: ${recommendedWorkload[0]}`,
      `Business: ${groupedStakeholders.business.join(", ") || "TBD"}`,
      `Technical: ${groupedStakeholders.technical.join(", ") || "TBD"}`,
      `Timeline: ${compactTimeline.map((t) => `${t.phase} ${t.milestone}`).join(" -> ")}`,
      `Success: ${successMetrics.join(" | ")}`,
      `Next step: ${recommendedNextStep}`,
    ].join("\n");
    setPodcastBrief(brief);
    onGeneratePovPlan?.(
      `Draft a 2-minute podcast-style executive brief for ${priorityAccount.name} using:\n${brief}`
    );
  };

  const handleGenerateNotebookPrompt = () => {
    setNotebookPrompt(buildNotebookPrompt());
    setCopied(false);
  };

  const handleCopyNotebookPrompt = async () => {
    if (!notebookPrompt) return;
    await navigator.clipboard.writeText(notebookPrompt);
    setCopied(true);
  };

  return (
    <section
      id="pov-plan"
      className="scroll-mt-24 rounded-xl border border-accent/15 bg-gradient-to-b from-accent/[0.06] to-transparent"
    >
      <div className="border-b border-surface-border/35 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-accent" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/90">
                POV Plan
              </p>
            </div>
            <h2 className="mt-2 text-[16px] font-semibold tracking-tight text-text-primary">
              {priorityAccount.name}
            </h2>
            <p className="mt-1 text-[11px] text-text-faint">Executive-friendly proof of value artifact</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              <Clipboard className="h-3.5 w-3.5" strokeWidth={2} />
              Export POV (PDF)
            </button>
            <button
              type="button"
              onClick={handleGeneratePodcastBrief}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border/45 bg-surface-elevated/40 px-4 py-2.5 text-[12px] font-semibold text-text-secondary transition-colors hover:bg-surface-muted/35"
            >
              <BookOpenCheck className="h-3.5 w-3.5" strokeWidth={2} />
              Generate Podcast Brief
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        <PovBlock
          icon={Flag}
          title="Objective"
          summary="What this POV proves and why now"
        >
          <p className="text-[12px] leading-relaxed text-text-secondary">{objectiveText}</p>
        </PovBlock>

        <div className="grid gap-4 lg:grid-cols-2">
          <PovBlock
            icon={Cpu}
            title="Recommended Workload"
            summary="Customer-facing scope for the POV"
          >
            <ul className="space-y-1.5">
              {recommendedWorkload.map((item) => (
                <li key={item} className="flex gap-2 text-[12px] text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  {item}
                </li>
              ))}
            </ul>
          </PovBlock>
          <PovBlock icon={Users} title="Map Stakeholders" summary="Business and technical owners">
            <div className="space-y-2">
              <div className="flex flex-wrap items-start gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/50 px-3 py-2">
                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent/90">
                  Business
                </span>
                <span className="text-[12px] text-text-secondary">
                  {groupedStakeholders.business.join(" • ") || "TBD"}
                </span>
              </div>
              <div className="flex flex-wrap items-start gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/50 px-3 py-2">
                <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Technical
                </span>
                <span className="text-[12px] text-text-secondary">
                  {groupedStakeholders.technical.join(" • ") || "TBD"}
                </span>
              </div>
            </div>
          </PovBlock>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <PovBlock icon={Timer} title="POV Plan" summary="Three-phase execution plan">
            <ul className="space-y-2">
              {compactTimeline.map((row) => (
                <li key={row.phase} className="flex items-center gap-2 rounded-lg border border-surface-border/35 bg-surface-elevated/35 px-3 py-2 text-[12px] text-text-secondary">
                  <span className="min-w-12 text-[11px] font-semibold text-accent/90">{row.phase}</span>
                  <span>{row.milestone}</span>
                </li>
              ))}
            </ul>
          </PovBlock>

          <PovBlock icon={Target} title="Success Metrics" summary="Measurable proof criteria">
            <ul className="space-y-2">
              {successMetrics.map((c, i) => (
                <li key={c} className="flex gap-2 text-[12px] text-text-secondary">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/15 text-[10px] font-bold text-accent">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-text-faint">Expansion unlock: {plan.followOnExpansion}</p>
          </PovBlock>
        </div>

        <PovBlock icon={Briefcase} title="Recommended Next Step" summary="Single decisive action">
          <p className="text-[12px] font-medium text-text-primary">{recommendedNextStep}</p>
        </PovBlock>

        <PovBlock icon={BookOpenCheck} title="NotebookLM Prompt Generator" summary="Generate a share-ready briefing prompt">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateNotebookPrompt}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.08] px-3 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/[0.12]"
            >
              Generate NotebookLM Prompt
            </button>
            <button
              type="button"
              onClick={handleCopyNotebookPrompt}
              disabled={!notebookPrompt}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors",
                notebookPrompt
                  ? "border-surface-border/45 bg-surface-elevated/40 text-text-secondary hover:bg-surface-muted/35"
                  : "cursor-not-allowed border-surface-border/25 bg-surface-muted/20 text-text-faint"
              )}
            >
              {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Prompt"}
            </button>
          </div>
          {!!notebookPrompt && (
            <textarea
              value={notebookPrompt}
              readOnly
              className="mt-3 min-h-28 w-full rounded-lg border border-surface-border/45 bg-surface-muted/20 px-3 py-2 text-[11px] text-text-secondary"
            />
          )}
        </PovBlock>

        {!!podcastBrief && (
          <PovBlock icon={BookOpenCheck} title="Podcast Brief Output" summary="Concise briefing draft">
            <pre className="whitespace-pre-wrap text-[11px] text-text-secondary">{podcastBrief}</pre>
          </PovBlock>
        )}
      </div>
    </section>
  );
}

function PovBlock({
  icon: Icon,
  title,
  summary,
  children,
}: {
  icon: LucideIcon;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-surface-border/35 bg-surface-elevated/40 p-4">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-faint" strokeWidth={1.8} />
        <div>
          <h3 className="text-[12px] font-semibold text-text-primary">{title}</h3>
          <p className="text-[10px] text-text-faint">{summary}</p>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
