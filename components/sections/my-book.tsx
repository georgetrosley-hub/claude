"use client";

import { motion } from "framer-motion";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { Meeting, SellerWorkflow, Task, WorkQueueItem } from "@/types";

interface MyBookProps {
  currentRecommendation: string;
  workflows: SellerWorkflow[];
  workQueue: WorkQueueItem[];
  tasks: Task[];
  meetings: Meeting[];
}

const workflowTone = {
  live: "text-claude-coral/80",
  attention: "text-text-secondary",
  building: "text-text-muted",
} as const;

export function MyBook({
  currentRecommendation,
  workflows,
  workQueue,
  tasks,
  meetings,
}: MyBookProps) {
  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const upcomingMeetings = meetings.filter((meeting) => meeting.status === "upcoming").slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="My Book"
        subtitle="The default seller workbench for what needs action now."
      />

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-xl border border-claude-coral/15 bg-claude-coral/[0.04] p-6">
          <div className="flex items-center gap-2 text-[12px] text-claude-coral/70">
            <ClaudeSparkle size={12} />
            Next best action
          </div>
          <p className="mt-4 max-w-3xl text-[22px] leading-relaxed text-text-primary">
            {currentRecommendation}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard label="Open work" value={openTasks} subtitle="Tasks not yet complete" />
          <MetricCard label="Approvals" value={workQueue.filter((item) => item.type === "approval").length} subtitle="Human review required" />
          <MetricCard label="Meetings" value={upcomingMeetings.length} subtitle="Upcoming buyer touchpoints" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-text-primary">Priority queue</h3>
            <span className="text-[11px] text-text-muted">Ranked by seller leverage</span>
          </div>
          <div className="space-y-3">
            {workQueue.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-surface-border/40 bg-surface/40 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                      {item.summary}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-claude-coral/70">
                    {item.priority}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-[11px]">
                  <span className="text-text-muted">{item.dueLabel}</span>
                  <span className="text-text-secondary">{item.actionLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Anchored workflows</h3>
            <div className="mt-5 space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-text-primary">{workflow.title}</p>
                    <span className={`text-[10px] uppercase tracking-[0.12em] ${workflowTone[workflow.status]}`}>
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
            <h3 className="text-[14px] font-medium text-text-primary">Upcoming meetings</h3>
            <div className="mt-5 space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-text-primary">{meeting.title}</p>
                    <span className="text-[11px] text-text-muted">
                      {formatDateTime(meeting.startAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {meeting.objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Daily loop"
          value={formatCurrency(tasks.length * 0.12)}
          subtitle="Approximate value of current active motions"
        />
        <MetricCard
          label="Ready to run"
          value={workQueue.filter((item) => item.type !== "approval").length}
          subtitle="Actions the seller can move right now"
        />
        <MetricCard
          label="Coverage"
          value={`${workflows.filter((workflow) => workflow.status === "live").length}/${workflows.length}`}
          subtitle="Core workflows already live in the workspace"
        />
      </section>
    </motion.div>
  );
}
