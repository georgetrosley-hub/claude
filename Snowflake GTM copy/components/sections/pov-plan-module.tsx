"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { PriorityAccount } from "@/data/territory-data";
import { buildPovPlanFromPriorityAccount, type PovPlan } from "@/data/pov-plans";
import { buildPovPlanGenerationPrompt } from "@/lib/prompts/pov-plan";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  Briefcase,
  Cpu,
  Database,
  Flag,
  GitBranch,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";

interface PovPlanModuleProps {
  priorityAccount: PriorityAccount;
  onGeneratePovPlan: (prompt: string) => void;
}

export function PovPlanModule({ priorityAccount, onGeneratePovPlan }: PovPlanModuleProps) {
  const plan: PovPlan = buildPovPlanFromPriorityAccount(priorityAccount);
  const prompt = buildPovPlanGenerationPrompt(priorityAccount, plan);

  return (
    <section
      id="pov-plan"
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/[0.07] via-surface-elevated/20 to-transparent shadow-card"
    >
      <div className="border-b border-surface-border/45 bg-surface/40 px-6 py-5 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
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
            <p className="mt-1 text-[11px] text-text-faint">
              Hypothesis → motion → proof → expansion
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGeneratePovPlan(prompt)}
            className="ds-focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-accent px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_1px_0_rgb(255_255_255/0.2)_inset] transition-all duration-200 hover:bg-accent/95 active:scale-[0.99]"
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={2} />
            Run POV plan
          </button>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <PovBlock
          icon={Flag}
          title="Outcomes"
          summary="What this POV proves to the business"
        >
          <p className="text-[13px] font-medium leading-snug text-text-primary">{plan.objective}</p>
        </PovBlock>

        <div className="grid gap-4 lg:grid-cols-2">
          <PovBlock
            icon={Briefcase}
            title="Problem"
            summary="Pain or constraint to relieve"
          >
            <p className="text-[13px] leading-relaxed text-text-secondary">{plan.businessProblem}</p>
          </PovBlock>
          <PovBlock
            icon={Cpu}
            title="Snowflake scope"
            summary="Workload or capability in scope"
          >
            <p className="text-[13px] leading-relaxed text-text-secondary">{plan.snowflakeWorkload}</p>
          </PovBlock>
        </div>

        <PovBlock icon={Users} title="Map stakeholders" summary="Business and technical coverage">
          <div className="grid gap-2 sm:grid-cols-2">
            {plan.stakeholders.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/50 px-3 py-2"
              >
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    s.kind === "business"
                      ? "bg-accent/10 text-accent/90"
                      : "bg-surface-muted text-text-muted"
                  )}
                >
                  {s.kind}
                </span>
                <span className="text-[12px] text-text-secondary">{s.title}</span>
              </div>
            ))}
          </div>
        </PovBlock>

        <PovBlock icon={Database} title="Data inputs" summary="Minimum viable inputs">
          <ul className="space-y-1.5">
            {plan.dataRequired.map((d, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-text-secondary">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                {d}
              </li>
            ))}
          </ul>
        </PovBlock>

        <PovBlock icon={Timer} title="POV timeline" summary="Milestones and checkpoints">
          <div className="space-y-2">
            {plan.timeline.map((row, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border border-surface-border/35 bg-surface-elevated/40 px-3 py-2 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="shrink-0 text-[11px] font-semibold text-accent/90">{row.period}</span>
                <span className="text-[12px] text-text-secondary">{row.milestone}</span>
              </div>
            ))}
          </div>
        </PovBlock>

        <PovBlock icon={Target} title="Success metrics" summary="Measurable pass/fail">
          <ul className="space-y-2">
            {plan.successCriteria.map((c, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-text-secondary">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/15 text-[10px] font-bold text-accent">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </PovBlock>

        <PovBlock
          icon={GitBranch}
          title="Expansion unlock"
          summary="What this POV opens if it lands"
        >
          <p className="text-[13px] leading-relaxed text-text-secondary">{plan.followOnExpansion}</p>
        </PovBlock>
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
    <div className="rounded-xl border border-surface-border/45 bg-surface-elevated/45 p-4 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] transition-shadow duration-200 hover:border-surface-border/55">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-surface-border/40 bg-surface-muted/25">
          <Icon className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[12px] font-semibold tracking-tight text-text-primary">{title}</h3>
          <p className="mt-0.5 text-[10px] leading-snug text-text-faint">{summary}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-surface-border/30 pt-4">{children}</div>
    </div>
  );
}
