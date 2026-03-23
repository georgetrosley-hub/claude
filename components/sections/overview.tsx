"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { useTerritoryData } from "@/app/context/territory-data-context";
import type { PriorityAccount } from "@/data/territory-data";
import { cn } from "@/lib/utils";

function AccountCard({
  account,
  isSelected,
  onSelect,
}: {
  account: PriorityAccount;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      className={cn(
        "rounded-xl border p-4 transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-accent/25",
        isSelected
          ? "border-accent/35 bg-accent/[0.08] hover:border-accent/45"
          : "border-surface-border/50 bg-surface-muted/20 hover:bg-surface-muted/30 hover:border-accent/25"
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-semibold text-text-primary">{account.name}</h3>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase text-accent">
          P{account.priority}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-text-secondary line-clamp-2">{account.whyMatters}</p>
      <p className="mt-2 text-[11px] font-medium text-accent/90">→ {account.nextAction}</p>
    </article>
  );
}

function AccountDetailCard({ account }: { account: PriorityAccount }) {
  return (
    <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/30 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">Industry</p>
          <p className="mt-1 text-[12px] text-text-secondary">{account.industry}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">Priority</p>
          <p className="mt-1 text-[12px] text-text-secondary">P{account.priority}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">Primary expansion wedge</p>
          <p className="mt-1 text-[12px] text-text-secondary">{account.expansionWedge}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">Status</p>
          <p className="mt-1 text-[12px] text-text-secondary">{account.status}</p>
        </div>
      </div>
    </div>
  );
}

type ExecutionActionId =
  | "discovery-questions"
  | "pov-plan"
  | "recent-signals"
  | "executive-follow-up"
  | "stakeholder-map";

const ACTION_LABELS: Record<ExecutionActionId, string> = {
  "discovery-questions": "Generate Discovery Questions",
  "pov-plan": "Generate POV Plan",
  "recent-signals": "Summarize Recent Signals",
  "executive-follow-up": "Draft Executive Follow-Up",
  "stakeholder-map": "Map Stakeholders",
};

const MOTION_BY_ACCOUNT: Record<string, { targetWorkload: string; whyNow: string; keyStakeholders: string[] }> = {
  "us-financial-technology": {
    targetWorkload: "Regulatory reporting and risk anomaly triage",
    whyNow: "Regulatory pressure and ownership tightening make governed execution urgent this quarter.",
    keyStakeholders: ["Head of Risk", "Regulatory Reporting Lead", "Data Platform Director"],
  },
  "sagent-lending": {
    targetWorkload: "Dara deployment performance and exception resolution",
    whyNow: "Early rollout risk creates immediate pressure to prove reliable customer outcomes.",
    keyStakeholders: ["Product VP", "Customer Success Leader", "Data Engineering Manager"],
  },
  "ciena-corp": {
    targetWorkload: "Order-to-fulfillment margin and backlog risk visibility",
    whyNow: "AI demand is rising faster than operational execution and forecast confidence.",
    keyStakeholders: ["CFO Org / FP&A", "Revenue Operations", "Supply Chain Analytics Lead"],
  },
};

function toBullets(value: string, max = 3): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function Overview({
  account,
  onSelectAccount,
}: {
  account: { id: string };
  onSelectAccount: (id: string) => void;
}) {
  const { priorityAccounts, activities, signals } = useTerritoryData();
  const [selectedAction, setSelectedAction] = useState<ExecutionActionId>("discovery-questions");

  useEffect(() => {
    setSelectedAction("discovery-questions");
  }, [account.id]);

  const selectedAccount = useMemo(
    () => priorityAccounts.find((p) => p.id === account.id) ?? priorityAccounts[0],
    [account.id, priorityAccounts]
  );

  const motion = MOTION_BY_ACCOUNT[selectedAccount.id] ?? {
    targetWorkload: selectedAccount.expansionWedge,
    whyNow: selectedAccount.whyMatters,
    keyStakeholders: ["Business Owner", "Data Platform Owner", "Finance Sponsor"],
  };

  const confirmFirstBullets = useMemo(() => toBullets(selectedAccount.confirmFirst), [selectedAccount.confirmFirst]);

  const successCriteria = useMemo(
    () => [
      `Prove "${selectedAccount.proofPoint}" with baseline and target delta.`,
      "Confirm accountable owner, budget path, and weekly operating cadence.",
      "Secure expansion decision tied to a business KPI within 90 days.",
    ],
    [selectedAccount.proofPoint]
  );

  const latestSignals = useMemo(
    () => signals.filter((s) => s.account === selectedAccount.id).slice(0, 3),
    [signals, selectedAccount.id]
  );
  const latestActivities = useMemo(
    () => activities.filter((a) => a.account === selectedAccount.id).slice(0, 2),
    [activities, selectedAccount.id]
  );

  const actionOutput = useMemo(() => {
    if (selectedAction === "discovery-questions") {
      return [
        `Where does ${motion.targetWorkload.toLowerCase()} create the most measurable business delay today?`,
        "Which team owns the KPI we need to move in the next 90 days?",
        "What governance requirement blocks faster deployment right now?",
      ];
    }
    if (selectedAction === "pov-plan") {
      return [
        `Objective: Prove ${motion.targetWorkload.toLowerCase()} can improve a named KPI within one quarter.`,
        `Success: ${selectedAccount.proofPoint}.`,
        "Success: Confirm owner, baseline, and target before kickoff.",
      ];
    }
    if (selectedAction === "recent-signals") {
      if (!latestSignals.length) return ["No recent account-specific signals logged yet."];
      return latestSignals.map((s) => `${s.timestamp}: ${s.text}`);
    }
    if (selectedAction === "executive-follow-up") {
      return [
        `Subject: ${selectedAccount.name} - proposed ${motion.targetWorkload} execution plan`,
        `We recommend one focused POV on ${motion.targetWorkload.toLowerCase()} tied to ${selectedAccount.proofPoint.toLowerCase()}.`,
        `If this aligns, we will confirm owner and launch a 90-day plan this week.`,
      ];
    }
    return [
      `${motion.keyStakeholders[0]} - business outcome owner`,
      `${motion.keyStakeholders[1]} - platform and delivery owner`,
      `${motion.keyStakeholders[2]} - expansion approval path`,
    ];
  }, [selectedAction, motion, selectedAccount.name, selectedAccount.proofPoint, latestSignals]);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section id="overview" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-5 sm:p-6">
        <h1 className="text-[20px] font-semibold tracking-tight text-text-primary sm:text-[22px]">Account Execution</h1>
        <p className="mt-2 text-[12px] text-text-muted">
          Focused operator view: choose an account, run discovery, execute one POV, and drive one next action.
        </p>
      </section>

      <section id="priority-accounts" className="scroll-mt-24 space-y-4">
        <SectionHeader
          title="Priority Accounts"
          subtitle="Three named accounts — same job: prove value, then expand consumption."
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {priorityAccounts.map((pa) => (
            <AccountCard
              key={pa.id}
              account={pa}
              isSelected={account.id === pa.id}
              onSelect={() => onSelectAccount(pa.id)}
            />
          ))}
        </div>
      </section>

      <section id="account-header" className="scroll-mt-24 space-y-3">
        <SectionHeader title="Account Header" subtitle="Core account context for this week's execution." />
        <AccountDetailCard account={selectedAccount} />
      </section>

      <section id="why-this-account-matters" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader title="Why This Account Matters" subtitle="Business impact and Snowflake relevance." />
        <ul className="mt-3 space-y-2 text-[12px] text-text-secondary">
          <li>• {selectedAccount.whyMatters}</li>
          <li>• Snowflake can win by proving governed execution on one executive-visible workflow.</li>
        </ul>
      </section>

      <section id="recommended-motion" className="scroll-mt-24 rounded-2xl border border-accent/30 bg-accent/[0.06] p-4 sm:p-6">
        <SectionHeader title="Recommended Motion" subtitle="Decisive, account-specific execution path." />
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-accent/25 bg-surface/50 p-3">
            <p className="text-[10px] uppercase text-accent/90">Target workload</p>
            <p className="mt-1 text-[12px] text-text-secondary">{motion.targetWorkload}</p>
          </div>
          <div className="rounded-lg border border-accent/25 bg-surface/50 p-3">
            <p className="text-[10px] uppercase text-accent/90">Why this matters now</p>
            <p className="mt-1 text-[12px] text-text-secondary">{motion.whyNow}</p>
          </div>
          <div className="rounded-lg border border-accent/25 bg-surface/50 p-3">
            <p className="text-[10px] uppercase text-accent/90">Key stakeholders</p>
            <ul className="mt-1 space-y-1 text-[12px] text-text-secondary">
              {motion.keyStakeholders.map((k) => (
                <li key={k}>• {k}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="what-to-confirm-first" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader title="What to Confirm First" subtitle="Discovery checks before committing resources." />
        <ul className="mt-3 space-y-2 text-[12px] text-text-secondary">
          {confirmFirstBullets.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>

      <section id="pov-plan" className="scroll-mt-24 rounded-2xl border border-accent/30 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader title="POV Plan" subtitle="Compact plan to prove value quickly." />
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-surface-border/50 bg-surface-muted/30 p-3">
            <p className="text-[10px] uppercase text-text-faint">Objective</p>
            <p className="mt-1 text-[12px] text-text-secondary">{selectedAccount.povHypothesis}</p>
          </div>
          <div className="rounded-lg border border-surface-border/50 bg-surface-muted/30 p-3">
            <p className="text-[10px] uppercase text-text-faint">Success criteria</p>
            <ul className="mt-1 space-y-1 text-[12px] text-text-secondary">
              {successCriteria.map((criterion) => (
                <li key={criterion}>• {criterion}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="execution-actions" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader
          title="Execution Actions"
          subtitle="Context-aware outputs for immediate account execution."
        />
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr,2fr]">
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(ACTION_LABELS) as ExecutionActionId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedAction(id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25",
                  selectedAction === id
                    ? "border-accent/35 bg-accent/[0.10] text-accent"
                    : "border-surface-border/50 bg-surface-muted/20 text-text-secondary hover:bg-surface-muted/35"
                )}
              >
                {ACTION_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-surface-border/50 bg-surface-muted/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-faint">{ACTION_LABELS[selectedAction]}</p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-text-secondary">
              {actionOutput.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
            {!!latestActivities.length && (
              <div className="mt-3 border-t border-surface-border/50 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-text-faint">Recent account activity</p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-text-secondary">
                  {latestActivities.map((item) => (
                    <li key={`${item.timestamp}-${item.text}`}>• {item.timestamp}: {item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recommended-next-action" className="scroll-mt-24 rounded-2xl border border-accent/35 bg-accent/[0.10] p-4 sm:p-6">
        <SectionHeader title="Recommended Next Action" subtitle="Single decisive move for this week." />
        <p className="mt-3 text-[13px] font-medium text-text-primary">{selectedAccount.nextAction}</p>
      </section>
    </div>
  );
}
