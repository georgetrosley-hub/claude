"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { useApp } from "@/app/context/app-context";
import { useTerritoryData } from "@/app/context/territory-data-context";
import type { PriorityAccount } from "@/data/territory-data";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

function accountDisplayName(id: string): string {
  const map: Record<string, string> = {
    "us-financial-technology": "U.S. Fin Tech",
    "sagent-lending": "Sagent",
    "ciena-corp": "Ciena",
  };
  return map[id] ?? id;
}

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
      className={cn(
        "rounded-lg border p-4 transition-colors cursor-pointer",
        isSelected
          ? "border-accent/30 bg-accent/[0.06]"
          : "border-surface-border/40 bg-surface-elevated/50 hover:border-surface-border/60"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[13px] font-semibold tracking-tight text-text-primary">
          {account.name}
        </h3>
        <span className="rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent/90 bg-accent/10">
          P{account.priority}
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-text-muted line-clamp-2">
        {account.whyMatters}
      </p>
      <p className="mt-2.5 text-[11px] font-medium text-accent/90">
        → {account.nextAction}
      </p>
    </article>
  );
}

function AccountDetailCard({ account }: { account: PriorityAccount }) {
  const sections = [
    { label: "Why this account matters", value: account.whyMatters },
    { label: "Best expansion wedge", value: account.expansionWedge },
    { label: "Confirm first", value: account.confirmFirst },
    { label: "POV hypothesis", value: account.povHypothesis },
    { label: "Recommended next action", value: account.nextAction },
  ] as const;

  return (
    <div className="space-y-4 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-widest text-accent/80">
        {account.name}
      </h4>
      <div className="space-y-4">
        {sections.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
              {label}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border/30">
        <span className="rounded bg-surface-muted/40 px-2 py-1 text-[10px] text-text-faint">
          Proof: {account.proofPoint}
        </span>
        <span className="rounded bg-surface-muted/40 px-2 py-1 text-[10px] text-text-faint">
          Pivot: {account.pivotIfNeeded}
        </span>
      </div>
    </div>
  );
}

function AIExecutionPanel({
  account,
  onOpenStrategy,
}: {
  account: PriorityAccount;
  onOpenStrategy: () => void;
}) {
  const actions = useMemo(
    () => [
      { label: "Draft discovery agenda", desc: `Qualify wedge: ${account.expansionWedge.slice(0, 50)}…` },
      { label: "Generate POV talking points", desc: `Hypothesis: ${account.povHypothesis.slice(0, 45)}…` },
      { label: "Map stakeholder next steps", desc: `Validate: ${account.confirmFirst.slice(0, 45)}…` },
    ],
    [account]
  );

  return (
    <div className="rounded-lg border border-accent/20 bg-accent/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent/80" strokeWidth={1.8} />
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-accent/90">
            AI-Assisted Execution
          </h4>
        </div>
        <button
          type="button"
          onClick={onOpenStrategy}
          className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-medium text-accent transition-colors hover:bg-accent/20"
        >
          Get strategy
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {actions.map((a) => (
          <li
            key={a.label}
            className="flex items-start gap-2 text-[11px] text-text-secondary"
          >
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent/50" />
            <span>
              <span className="font-medium text-text-primary">{a.label}</span>
              <span className="text-text-faint"> — {a.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Overview({
  account,
  onSelectAccount,
  onOpenStrategy,
}: {
  account: { id: string };
  onSelectAccount: (id: string) => void;
  onOpenStrategy?: () => void;
}) {
  const { priorityAccounts, next7Days, activities, signals, addActivity, addSignal } =
    useTerritoryData();

  const [activityInput, setActivityInput] = useState("");
  const [signalInput, setSignalInput] = useState("");
  const [activityAccount, setActivityAccount] = useState(account.id);
  const [signalAccount, setSignalAccount] = useState(account.id);
  const [briefingWindow, setBriefingWindow] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    setActivityAccount(account.id);
    setSignalAccount(account.id);
  }, [account.id]);

  const selectedAccount = useMemo(
    () => priorityAccounts.find((p) => p.id === account.id) ?? priorityAccounts[0],
    [account.id, priorityAccounts]
  );

  const handleAddActivity = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addActivity(activityAccount, activityInput);
      setActivityInput("");
    },
    [activityAccount, activityInput, addActivity]
  );

  const handleAddSignal = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addSignal(signalAccount, signalInput);
      setSignalInput("");
    },
    [signalAccount, signalInput, addSignal]
  );

  const briefingContent = useMemo(() => {
    const w = briefingWindow;
    const base = {
      whatChanged: "Sponsor alignment tightening. Evaluation criteria taking shape.",
      nextAction: selectedAccount.nextAction,
      snowflakeImplication: "Lead with governed execution in high-urgency workflows.",
    };
    if (w === "24h") return { ...base, whatChanged: "Decision ownership converging." };
    if (w === "30d") return { ...base, whatChanged: "Formal buying motion. Governance in play." };
    return base;
  }, [briefingWindow, selectedAccount.nextAction]);

  const discoveryPrep = useMemo(
    () => ({
      angles: [
        "Where does data-to-decision delay create the highest cost?",
        "What governance blockers slow deployment confidence?",
        "What 90-day result justifies expansion sponsorship?",
      ],
      talkTracks: [
        "Faster delivery without trading governance.",
        "One workflow leadership cares about. Prove value fast.",
        "Territory execution decision, not tooling debate.",
      ],
    }),
    []
  );

  const expansionSequence = ["Initial Workload", "Early Adoption", "Platform Trust", "Expanded Consumption"];
  const filteredWeekItems = useMemo(
    () => next7Days.filter((item) => item.account === account.id),
    [account.id, next7Days]
  );
  const filteredActivities = useMemo(
    () => activities.filter((a) => a.account === account.id).slice(0, 8),
    [account.id, activities]
  );
  const filteredSignals = useMemo(
    () => signals.filter((s) => s.account === account.id).slice(0, 8),
    [account.id, signals]
  );

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* OVERVIEW — Territory ownership + expansion */}
      <section id="overview" className="scroll-mt-24">
        <div className="rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent/80">
            Field Execution
          </p>
          <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-text-primary sm:text-[24px]">
            Territory ownership & expansion execution
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            Strategic accounts. Expansion-first. Identify workload, validate POV, drive consumption.
          </p>
          <p className="mt-2 text-[11px] text-text-faint">
            Public intel. Validate footprint and opportunities post-onboarding.
          </p>
        </div>
      </section>

      {/* PRIORITY ACCOUNTS */}
      <section id="priority-accounts" className="scroll-mt-24 space-y-5">
        <SectionHeader
          title="Priority Accounts"
          subtitle="Three accounts. Data complexity outpacing decision-making."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {priorityAccounts.map((pa) => (
            <AccountCard
              key={pa.id}
              account={pa}
              isSelected={account.id === pa.id}
              onSelect={() => onSelectAccount(pa.id)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr,340px]">
          <AccountDetailCard account={selectedAccount} />
          {onOpenStrategy && (
            <AIExecutionPanel account={selectedAccount} onOpenStrategy={onOpenStrategy} />
          )}
        </div>
      </section>

      {/* ACCOUNT BRIEF */}
      <section id="account-brief" className="scroll-mt-24 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5 sm:p-6">
        <SectionHeader
          title="Account Brief"
          subtitle={`${selectedAccount.name} — Signal-driven next actions`}
        />
        <div className="mt-4 flex gap-2">
          {(["24h", "7d", "30d"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setBriefingWindow(w)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors",
                briefingWindow === w
                  ? "border border-accent/25 bg-accent/10 text-accent"
                  : "border border-surface-border/40 bg-surface-muted/30 text-text-muted hover:text-text-secondary"
              )}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-surface-border/40 bg-surface-muted/20 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
              What changed
            </p>
            <p className="mt-1.5 text-[12px] text-text-secondary">
              {briefingContent.whatChanged}
            </p>
          </div>
          <div className="rounded-md border border-accent/20 bg-accent/[0.06] p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-accent/90">
              Next action
            </p>
            <p className="mt-1.5 text-[12px] text-text-secondary">
              {briefingContent.nextAction}
            </p>
          </div>
          <div className="rounded-md border border-surface-border/40 p-3 sm:col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
              Snowflake implication
            </p>
            <p className="mt-1.5 text-[12px] text-text-secondary">
              {briefingContent.snowflakeImplication}
            </p>
          </div>
        </div>
      </section>

      {/* DISCOVERY PREP */}
      <section id="discovery-prep" className="scroll-mt-24 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5 sm:p-6">
        <SectionHeader
          title="Discovery Prep"
          subtitle="Qualification angles and talk tracks"
        />
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">
              Discovery angles
            </p>
            <ul className="mt-2.5 space-y-2 text-[12px] text-text-secondary">
              {discoveryPrep.angles.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">
              Talk tracks
            </p>
            <ul className="mt-2.5 space-y-2 text-[12px] text-text-secondary">
              {discoveryPrep.talkTracks.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* POV PLAN */}
      <section id="pov-plan" className="scroll-mt-24 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5 sm:p-6">
        <SectionHeader
          title="POV Plan"
          subtitle="Hypothesis-led positioning"
        />
        <div className="mt-5 space-y-4">
          <div className="rounded-md border border-accent/20 bg-accent/[0.06] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent/90">
              POV hypothesis
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
              {selectedAccount.povHypothesis}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-surface-border/40 bg-surface-muted/20 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                Snowflake
              </p>
              <p className="mt-1.5 text-[12px] text-text-secondary">
                Governed execution. Faster path to measurable outcomes.
              </p>
            </div>
            <div className="rounded-md border border-rose-400/15 bg-rose-400/[0.04] p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-rose-300/90">
                Databricks
              </p>
              <p className="mt-1.5 text-[12px] text-text-secondary">
                Technical incumbency where business proof is weak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPANSION PATH */}
      <section id="expansion-path" className="scroll-mt-24 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5 sm:p-6">
        <SectionHeader
          title="Expansion Path"
          subtitle={`${selectedAccount.name} — Land → prove → expand`}
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {expansionSequence.map((step) => (
            <span
              key={step}
              className="rounded-md border border-surface-border/40 bg-surface-muted/20 px-3 py-2 text-[11px] font-medium text-text-secondary"
            >
              {step}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-[12px] font-medium text-text-primary">
            Wedge: {selectedAccount.expansionWedge}
          </p>
          <p className="text-[12px] text-text-secondary">
            Proof: {selectedAccount.proofPoint}. Pivot: {selectedAccount.pivotIfNeeded}.
          </p>
        </div>
      </section>

      {/* WEEKLY BRIEFING */}
      <section id="weekly-briefing" className="scroll-mt-24 rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5 sm:p-6">
        <SectionHeader
          title="Weekly Briefing"
          subtitle={`${selectedAccount.name} — This week's priorities`}
        />
        <ul className="mt-5 space-y-2">
          {filteredWeekItems.length > 0 ? (
            filteredWeekItems.map((item) => (
              <li
                key={`${item.day}-${item.action}`}
                className="flex items-center gap-3 rounded-md border border-surface-border/40 bg-surface-muted/20 px-3 py-2.5 text-[12px]"
              >
                <span className="font-medium text-text-faint">{item.day}</span>
                <span className="text-text-secondary">{item.action}</span>
              </li>
            ))
          ) : (
            <li className="rounded-md border border-surface-border/40 bg-surface-muted/20 px-4 py-5 text-[12px] text-text-muted">
              No priorities for {selectedAccount.name} this week.
            </li>
          )}
        </ul>
      </section>

      {/* RECENT SIGNALS */}
      <section id="recent-signals" className="scroll-mt-24 space-y-5">
        <SectionHeader
          title="Recent Signals"
          subtitle={`${selectedAccount.name} — News, outreach, activity`}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-primary">
              Activity
            </h4>
            <form onSubmit={handleAddActivity} className="mt-4 flex gap-2">
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                placeholder="Log activity…"
                className="min-w-0 flex-1 rounded-md border border-surface-border/40 bg-surface px-2.5 py-2 text-[12px] text-text-primary placeholder:text-text-faint focus:border-accent/30 focus:outline-none"
              />
              <select
                value={activityAccount}
                onChange={(e) => setActivityAccount(e.target.value)}
                className="rounded-md border border-surface-border/40 bg-surface px-2 py-2 text-[12px] text-text-primary"
              >
                {priorityAccounts.map((pa) => (
                  <option key={pa.id} value={pa.id}>
                    {accountDisplayName(pa.id)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md bg-accent/90 px-3 py-2 text-[11px] font-medium text-white hover:bg-accent"
              >
                Add
              </button>
            </form>
            <div className="mt-4 max-h-44 space-y-2 overflow-y-auto">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((a, i) => (
                  <div
                    key={`${a.timestamp}-${a.text}-${i}`}
                    className="flex gap-2 text-[11px]"
                  >
                    <span className="shrink-0 text-text-faint">{a.timestamp}</span>
                    <span className="text-text-secondary">{a.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-text-muted">
                  No activity for {selectedAccount.name} yet.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-surface-border/40 bg-surface-elevated/50 p-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-primary">
              Signals
            </h4>
            <form onSubmit={handleAddSignal} className="mt-4 flex gap-2">
              <input
                type="text"
                value={signalInput}
                onChange={(e) => setSignalInput(e.target.value)}
                placeholder="Add signal…"
                className="min-w-0 flex-1 rounded-md border border-surface-border/40 bg-surface px-2.5 py-2 text-[12px] text-text-primary placeholder:text-text-faint focus:border-accent/30 focus:outline-none"
              />
              <select
                value={signalAccount}
                onChange={(e) => setSignalAccount(e.target.value)}
                className="rounded-md border border-surface-border/40 bg-surface px-2 py-2 text-[12px] text-text-primary"
              >
                {priorityAccounts.map((pa) => (
                  <option key={pa.id} value={pa.id}>
                    {accountDisplayName(pa.id)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md bg-accent/90 px-3 py-2 text-[11px] font-medium text-white hover:bg-accent"
              >
                Add
              </button>
            </form>
            <div className="mt-4 max-h-44 space-y-2 overflow-y-auto">
              {filteredSignals.length > 0 ? (
                filteredSignals.map((s, i) => (
                  <div
                    key={`${s.timestamp}-${s.text}-${i}`}
                    className="flex gap-2 text-[11px]"
                  >
                    <span className="shrink-0 text-text-faint">{s.timestamp}</span>
                    <span className="text-text-secondary">{s.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-text-muted">
                  No signals for {selectedAccount.name} yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
