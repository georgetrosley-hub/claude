"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { AgentCard } from "@/components/ui/agent-card";
import { ApprovalCard } from "@/components/ui/approval-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatRelativeLabel } from "@/lib/formatters";
import type { Agent, AgentAction, ApprovalRequest, AuditEntry } from "@/types";

interface AgentActionsProps {
  agents: Agent[];
  actions: AgentAction[];
  approvals: ApprovalRequest[];
  auditTrail: AuditEntry[];
  lastApprovedTitle: string | null;
  clearLastApproved: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string) => void;
}

const actionTone = {
  queued: "text-text-muted",
  ready: "text-text-secondary",
  awaiting_approval: "text-claude-coral/80",
  completed: "text-claude-coral/60",
  modified: "text-text-secondary",
  rejected: "text-text-muted",
} as const;

export function AgentActions({
  agents,
  actions,
  approvals,
  auditTrail,
  lastApprovedTitle,
  clearLastApproved,
  onApprove,
  onReject,
  onModify,
}: AgentActionsProps) {
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending");

  useEffect(() => {
    if (!lastApprovedTitle) return;
    const timeout = setTimeout(clearLastApproved, 2500);
    return () => clearTimeout(timeout);
  }, [lastApprovedTitle, clearLastApproved]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Agent Actions"
        subtitle="Grounded actions, evidence, approvals, and auditability in one place."
      />

      <AnimatePresence>
        {lastApprovedTitle && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 rounded-lg border border-claude-coral/20 bg-claude-coral/[0.04] px-5 py-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-claude-coral/15">
              <Check className="h-4 w-4 text-claude-coral" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">Approved</p>
              <p className="text-[12px] text-text-secondary">{lastApprovedTitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-[14px] font-medium text-text-primary">Human review queue</h3>
              <span className="text-[11px] text-text-muted">{pendingApprovals.length} pending</span>
            </div>
            {pendingApprovals.length === 0 ? (
              <p className="text-[12px] text-text-secondary">No approvals pending. Agent actions can run cleanly.</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <ApprovalCard
                    key={approval.id}
                    approval={approval}
                    onApprove={() => onApprove(approval.id)}
                    onReject={() => onReject(approval.id)}
                    onModify={() => onModify(approval.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Action center</h3>
            <div className="mt-5 space-y-4">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-lg border border-surface-border/40 bg-surface/40 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-text-primary">{action.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                        {action.summary}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] uppercase tracking-[0.12em] ${actionTone[action.status]}`}>
                      {action.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-text-muted">
                    <span>{action.agentName}</span>
                    <span>{action.targetSystem}</span>
                    <span>{Math.round(action.confidence * 100)}% confidence</span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-text-secondary">
                    {action.rationale}
                  </p>
                  <div className="mt-4 space-y-2">
                    {action.evidence.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-surface-border/40 bg-surface/35 px-3 py-2"
                      >
                        <p className="text-[11px] text-text-primary">{item.label}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Agent roster</h3>
            <div className="mt-5 space-y-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Audit trail</h3>
            <div className="mt-5 space-y-4">
              {auditTrail.map((entry) => (
                <div key={entry.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] text-text-primary">{entry.action}</p>
                    <span className="text-[11px] text-text-muted">
                      {formatRelativeLabel(entry.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {entry.detail}
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
