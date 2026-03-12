"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDateTime } from "@/lib/formatters";
import type { ExecBrief, Meeting, Signal } from "@/types";

interface ExecPrepProps {
  brief: ExecBrief;
  meetings: Meeting[];
  signals: Signal[];
}

export function ExecPrep({ brief, meetings, signals }: ExecPrepProps) {
  const nextMeetings = meetings.filter((meeting) => meeting.status === "upcoming").slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Exec Prep"
        subtitle="Narrative, objections, and follow-up for the next important conversation."
      />

      <section className="rounded-xl border border-claude-coral/15 bg-claude-coral/[0.04] p-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-claude-coral/70">Headline</p>
        <p className="mt-3 max-w-4xl text-[22px] leading-relaxed text-text-primary">
          {brief.headline}
        </p>
        <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-text-secondary">
          {brief.whyNow}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Talk track</h3>
          <div className="mt-5 space-y-4">
            {brief.talkTrack.map((item, index) => (
              <div key={item} className="flex gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted/70 text-[10px] text-text-secondary">
                  {index + 1}
                </div>
                <p className="text-[12px] leading-relaxed text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Likely objections</h3>
          <div className="mt-5 space-y-3">
            {brief.objections.map((objection) => (
              <div
                key={objection}
                className="rounded-lg border border-surface-border/40 bg-surface/40 px-4 py-4"
              >
                <p className="text-[12px] leading-relaxed text-text-secondary">{objection}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Next meetings</h3>
          <div className="mt-5 space-y-4">
            {nextMeetings.map((meeting) => (
              <div key={meeting.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-text-primary">{meeting.title}</p>
                  <span className="text-[11px] text-text-muted">{formatDateTime(meeting.startAt)}</span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                  {meeting.objective}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <h3 className="text-[14px] font-medium text-text-primary">Follow-up draft</h3>
          <p className="mt-5 text-[13px] leading-relaxed text-text-secondary">
            {brief.followUpDraft}
          </p>
          <div className="mt-6 border-t border-surface-border/40 pt-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Fresh signals to reference</p>
            <div className="mt-3 space-y-3">
              {signals.slice(0, 3).map((signal) => (
                <div key={signal.id}>
                  <p className="text-[12px] text-text-primary">{signal.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {signal.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
