"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { Opportunity, Task } from "@/types";

interface DealRoomProps {
  opportunities: Opportunity[];
  tasks: Task[];
  milestones: string[];
}

const stageLabels: Record<Opportunity["stage"], string> = {
  signal: "Signal",
  discovery: "Discovery",
  pilot_design: "Pilot design",
  security_review: "Security review",
  legal_review: "Legal review",
  procurement: "Procurement",
  executive_alignment: "Executive alignment",
  deployment: "Deployment",
  expansion: "Expansion",
};

const taskTone = {
  todo: "text-text-secondary",
  in_progress: "text-claude-coral/80",
  blocked: "text-text-muted",
  done: "text-text-faint",
} as const;

export function DealRoom({ opportunities, tasks, milestones }: DealRoomProps) {
  const openTasks = tasks.filter((task) => task.status !== "done");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Deal Room"
        subtitle="Execution across pilot, security, legal, procurement, and sponsor alignment."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-medium text-text-primary">{opportunity.name}</p>
                <p className="mt-1 text-[12px] text-text-secondary">{opportunity.useCase}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.12em] text-claude-coral/70">
                {stageLabels[opportunity.stage]}
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Amount</p>
                <p className="mt-2 text-[18px] text-text-primary">{formatCurrency(opportunity.amount)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Forecast</p>
                <p className="mt-2 text-[18px] text-text-primary">{opportunity.forecastCategory}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Close</p>
                <p className="mt-2 text-[18px] text-text-primary">{formatDateTime(opportunity.closeDate)}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Top blockers</p>
              <div className="mt-3 space-y-2">
                {opportunity.blockers.map((blocker) => (
                  <p key={blocker} className="text-[12px] leading-relaxed text-text-secondary">
                    {blocker}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-5 border-t border-surface-border/40 pt-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Next step</p>
              <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                {opportunity.nextStep}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[14px] font-medium text-text-primary">Mutual action plan</h3>
            <span className="text-[11px] text-text-muted">{openTasks.length} open tasks</span>
          </div>
          <div className="mt-5 space-y-3">
            {openTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-surface-border/40 bg-surface/40 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-text-primary">{task.title}</p>
                  <span className={`text-[10px] uppercase tracking-[0.12em] ${taskTone[task.status]}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                  {task.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Milestones to unlock</h3>
          <div className="mt-5 space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone} className="flex gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted/70 text-[10px] text-text-secondary">
                  {index + 1}
                </div>
                <p className="text-[12px] leading-relaxed text-text-secondary">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
