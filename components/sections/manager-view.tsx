"use client";

import { motion } from "framer-motion";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/formatters";
import type { ManagerSnapshot, Opportunity, SellerWorkflow, Task } from "@/types";

interface ManagerViewProps {
  snapshot: ManagerSnapshot;
  opportunities: Opportunity[];
  tasks: Task[];
  workflows: SellerWorkflow[];
}

export function ManagerView({
  snapshot,
  opportunities,
  tasks,
  workflows,
}: ManagerViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Manager View"
        subtitle="Inspection, forecast quality, and coaching in the same workspace."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Commit" value={formatCurrency(snapshot.commit)} subtitle="Current commit view" />
        <MetricCard label="Best case" value={formatCurrency(snapshot.bestCase)} subtitle="Weighted upside in play" />
        <MetricCard label="Coverage" value={`${snapshot.coverage}x`} subtitle="Pipeline to land-value multiple" />
        <MetricCard label="Risks" value={snapshot.riskCount} subtitle="Critical or blocked items" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Inspection summary</h3>
          <div className="mt-5 space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-text-primary">{opportunity.name}</p>
                  <span className="text-[11px] text-text-muted">{opportunity.forecastCategory}</span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                  {opportunity.nextStep}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Coaching note</h3>
          <p className="mt-5 text-[13px] leading-relaxed text-text-secondary">
            {snapshot.coachingNote}
          </p>
          <div className="mt-6 border-t border-surface-border/40 pt-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Inspection focus</p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
              {snapshot.inspectionFocus}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Workflow health</h3>
          <div className="mt-5 space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-text-primary">{workflow.title}</p>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {workflow.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                  {workflow.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Blocked work</h3>
          <div className="mt-5 space-y-4">
            {tasks
              .filter((task) => task.status === "blocked" || task.priority === "critical")
              .map((task) => (
                <div key={task.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-text-primary">{task.title}</p>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-claude-coral/70">
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {task.detail}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
