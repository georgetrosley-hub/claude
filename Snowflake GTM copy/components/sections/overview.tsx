"use client";

import { useCallback, useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { useTerritoryData } from "@/app/context/territory-data-context";
import type { PriorityAccount } from "@/data/territory-data";
import { AccountExecutionPanel } from "@/components/sections/account-execution-panel";
import { PovPlanModule } from "@/components/sections/pov-plan-module";
import { cn } from "@/lib/utils";

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
        "group cursor-pointer rounded-xl border p-4 shadow-card transition-all duration-200 ease-out-expo",
        isSelected
          ? "border-accent/35 bg-accent/[0.07] shadow-card ring-1 ring-accent/15"
          : "border-surface-border/45 bg-surface-elevated/30 hover:border-accent/20 hover:bg-surface-muted/35 hover:shadow-card-hover"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[14px] font-semibold tracking-tight text-text-primary">{account.name}</h3>
        <span className="shrink-0 rounded-md border border-accent/20 bg-accent/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          P{account.priority}
        </span>
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-text-secondary line-clamp-2">{account.whyMatters}</p>
      <p className="mt-3 text-[11px] font-medium text-accent/90 transition-colors group-hover:text-accent">
        → {account.nextAction}
      </p>
    </article>
  );
}

function AccountDetailCard({ account }: { account: PriorityAccount }) {
  const sections = [
    { label: "Why it matters", value: account.whyMatters },
    { label: "Expansion wedge", value: account.expansionWedge },
    { label: "What to confirm first", value: account.confirmFirst },
    { label: "Working hypothesis", value: account.povHypothesis },
    { label: "Recommended next action", value: account.nextAction },
  ] as const;

  return (
    <div className="space-y-3.5 rounded-xl border border-accent/25 bg-gradient-to-b from-accent/[0.06] to-accent/[0.02] p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent/90">
        {account.name}
      </h4>
      {sections.map(({ label, value }) => (
        <div key={label}>
          <p className="text-label text-text-faint/90">{label}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">{value}</p>
        </div>
      ))}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="rounded-md border border-surface-border/40 bg-surface-muted/30 px-2 py-1 text-[10px] font-medium text-text-faint">
          Proof point: {account.proofPoint}
        </span>
        <span className="rounded-md border border-surface-border/40 bg-surface-muted/30 px-2 py-1 text-[10px] font-medium text-text-faint">
          Pivot if blocked: {account.pivotIfNeeded}
        </span>
      </div>
    </div>
  );
}

export function Overview({
  account,
  onSelectAccount,
  onOpenStrategy,
  onOpenStrategyWithPrompt,
}: {
  account: { id: string };
  onSelectAccount: (id: string) => void;
  onOpenStrategy?: () => void;
  onOpenStrategyWithPrompt?: (prompt: string) => void;
}) {
  const { priorityAccounts, next7Days, activities, signals, addActivity, addSignal } =
    useTerritoryData();

  const [activityInput, setActivityInput] = useState("");
  const [signalInput, setSignalInput] = useState("");
  const [activityAccount, setActivityAccount] = useState(account.id);
  const [signalAccount, setSignalAccount] = useState(account.id);
  const [briefingWindow, setBriefingWindow] = useState<"24h" | "7d" | "30d">("7d");

  const selectedAccount = useMemo(
    () => priorityAccounts.find((p) => p.id === account.id) ?? priorityAccounts[0],
    [account.id, priorityAccounts]
  );

  const briefingContent = useMemo(() => {
    const w = briefingWindow;
    const base = {
      whatChanged: "Sponsor ownership and evaluation criteria tightening across accounts.",
      whyMatters: "Early POV quality now directly affects competitive position.",
      snowflakeImplication: "Lead with governed execution in high-urgency workflows.",
      databricksImplication: "Incumbent inertia persists without business-led wedge.",
      nextAction: selectedAccount.nextAction,
    };
    if (w === "24h") return { ...base, whatChanged: "Decision ownership converging across stakeholders." };
    if (w === "30d") return { ...base, whatChanged: "Formalized buying motion with governance influence." };
    return base;
  }, [briefingWindow, selectedAccount.nextAction]);

  const discoveryPrep = useMemo(
    () => ({
      angles: [
        "Where does delayed data-to-decision flow create highest business cost?",
        "What governance blockers slow deployment confidence?",
        "Which 90-day result justifies expansion sponsorship?",
      ],
      talkTracks: [
        "We can improve delivery speed without trading away governance.",
        "Start with one workflow leadership cares about and prove value fast.",
        "This is a territory execution decision, not a tooling debate.",
      ],
    }),
    []
  );

  const expansionSequence = ["Initial Workload", "Early Adoption", "Platform Trust", "Expanded Consumption"];

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

  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        className="ds-page-section scroll-mt-28 p-5 sm:p-6"
      >
        <p className="text-label text-text-faint/90">Territory snapshot</p>
        <h1 className="mt-2 text-[1.375rem] font-semibold tracking-tight text-text-primary sm:text-[1.5rem]">
          Overview
        </h1>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-text-muted">
          One screen for priority accounts, briefs, POV, and expansion. Built for live reviews and fast CRM paste.
        </p>
        <p className="mt-2 text-[11px] leading-snug text-text-faint">
          Public-source prototype — validate consumption, pipeline, and footprint after onboarding.
        </p>
        {onOpenStrategy && (
          <button
            type="button"
            onClick={onOpenStrategy}
            className="ds-focus-ring mt-6 inline-flex items-center justify-center rounded-lg border border-accent/30 bg-accent/[0.10] px-4 py-2.5 text-[12px] font-semibold text-accent shadow-[0_1px_0_rgb(255_255_255/0.05)_inset] transition-all duration-200 hover:border-accent/40 hover:bg-accent/[0.16] active:scale-[0.99]"
          >
            Open Deal Desk
          </button>
        )}
      </section>

      <AccountExecutionPanel />

      <section id="priority-accounts" className="scroll-mt-24 space-y-5 sm:space-y-6">
        <SectionHeader
          title="Priority Accounts"
          subtitle="Three named accounts — same job: prove value, then expand consumption."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {priorityAccounts.map((pa) => (
            <AccountCard
              key={pa.id}
              account={pa}
              isSelected={account.id === pa.id}
              onSelect={() => onSelectAccount(pa.id)}
            />
          ))}
        </div>
        <AccountDetailCard account={selectedAccount} />
      </section>

      <section id="account-brief" className="ds-page-section scroll-mt-24 p-5 sm:p-6">
        <SectionHeader
          title="Account Brief"
          subtitle={`${selectedAccount.name} — what shifted, Snowflake angle, next move`}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {(["24h", "7d", "30d"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setBriefingWindow(w)}
              className={cn(
                "ds-focus-ring rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200",
                briefingWindow === w
                  ? "border border-accent/35 bg-accent/[0.11] text-accent shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] ring-1 ring-accent/15"
                  : "border border-surface-border/50 bg-surface-muted/35 text-text-muted hover:border-surface-border/70 hover:bg-surface-muted/45 hover:text-text-secondary"
              )}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-surface-border/45 bg-surface-muted/25 p-4 shadow-[0_1px_0_rgb(255_255_255/0.03)_inset]">
            <p className="text-label text-text-faint/90">Signal shift</p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{briefingContent.whatChanged}</p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
            <p className="text-label text-accent/90">Recommended next action</p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{briefingContent.nextAction}</p>
          </div>
          <div className="rounded-xl border border-surface-border/45 bg-surface-elevated/25 p-4 sm:col-span-2">
            <p className="text-label text-text-faint/90">Snowflake angle</p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{briefingContent.snowflakeImplication}</p>
          </div>
        </div>
      </section>

      <section id="discovery-prep" className="ds-page-section scroll-mt-24 p-5 sm:p-6">
        <SectionHeader title="Discovery Prep" subtitle="Qualification angles and talk tracks" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase text-text-faint">Qualification angles</p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-text-secondary">
              {discoveryPrep.angles.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-text-faint">Talk tracks</p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-text-secondary">
              {discoveryPrep.talkTracks.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {onOpenStrategyWithPrompt ? (
        <PovPlanModule
          priorityAccount={selectedAccount}
          onGeneratePovPlan={onOpenStrategyWithPrompt}
        />
      ) : (
        <section id="pov-plan" className="ds-page-section scroll-mt-24 p-5 sm:p-6">
          <SectionHeader title="POV Plan" subtitle="Prove value — Snowflake vs Databricks framing" />
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
              <p className="text-label text-accent/90">Working hypothesis</p>
              <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{selectedAccount.povHypothesis}</p>
            </div>
            <p className="text-label text-text-faint/90">Competitive context</p>
            <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-surface-border/45 bg-surface-muted/25 p-4">
                <p className="text-label text-text-faint/90">Snowflake</p>
                <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                  Governed enterprise execution; faster path to measurable outcomes.
                </p>
              </div>
              <div className="rounded-xl border border-rose-400/25 bg-rose-400/[0.06] p-4">
                <p className="text-label text-rose-300/90">Databricks</p>
                <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                  Technical incumbency remains where business proof is weak.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="expansion-path" className="ds-page-section scroll-mt-24 p-5 sm:p-6">
        <SectionHeader title="Expansion Path" subtitle="Land → prove → expand" />
        <div className="mt-4 flex flex-wrap gap-2">
          {expansionSequence.map((step) => (
            <span
              key={step}
              className="rounded-lg border border-surface-border/45 bg-surface-muted/25 px-3 py-2 text-[12px] font-medium text-text-secondary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset]"
            >
              {step}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-text-secondary">
          Land one workflow, prove value quickly, then broaden adoption across teams.
        </p>
      </section>

      <section id="this-weeks-priorities" className="ds-page-section scroll-mt-24 p-5 sm:p-6">
        <SectionHeader title="Weekly Briefing" subtitle="Next 7 days — by account" />
        <ul className="mt-4 space-y-2">
          {next7Days.map((item) => (
            <li
              key={`${item.day}-${item.action}`}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-border/45 bg-surface-muted/20 px-3 py-2.5 text-[12px] shadow-[0_1px_0_rgb(255_255_255/0.03)_inset] transition-colors hover:border-surface-border/60 hover:bg-surface-muted/30"
            >
              <span className="font-medium text-text-faint">{item.day}</span>
              <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] text-accent">
                {accountDisplayName(item.account)}
              </span>
              <span className="text-text-secondary">{item.action}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="recent-signals" className="scroll-mt-24 space-y-5 sm:space-y-6">
        <SectionHeader
          title="Field log"
          subtitle="Recent activity and signals — sync to CRM when live"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-surface-border/45 bg-surface-elevated/35 p-4 shadow-card">
            <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">Recent Activity</h4>
            <form onSubmit={handleAddActivity} className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                placeholder="Log touch, note, or meeting…"
                className="min-w-0 flex-1 rounded-lg border border-surface-border/50 bg-surface px-2.5 py-2 text-[12px] text-text-primary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset] placeholder:text-text-faint focus:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <select
                value={activityAccount}
                onChange={(e) => setActivityAccount(e.target.value)}
                className="rounded-lg border border-surface-border/50 bg-surface px-2 py-2 text-[12px] font-medium text-text-primary focus:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/15"
              >
                {priorityAccounts.map((pa) => (
                  <option key={pa.id} value={pa.id}>
                    {accountDisplayName(pa.id)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="ds-focus-ring rounded-lg border border-accent/25 bg-accent px-3 py-2 text-[11px] font-semibold text-white shadow-[0_1px_0_rgb(255_255_255/0.12)_inset] transition-all duration-200 hover:bg-accent/95 active:scale-[0.98]"
              >
                Log
              </button>
            </form>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {activities.slice(0, 8).map((a, i) => (
                <div key={i} className="flex gap-2 text-[11px]">
                  <span className="shrink-0 text-text-faint">{a.timestamp}</span>
                  <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                    {accountDisplayName(a.account)}
                  </span>
                  <span className="text-text-secondary">{a.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-surface-border/45 bg-surface-elevated/35 p-4 shadow-card">
            <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">Recent Signals</h4>
            <form onSubmit={handleAddSignal} className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={signalInput}
                onChange={(e) => setSignalInput(e.target.value)}
                placeholder="Add signal…"
                className="min-w-0 flex-1 rounded-lg border border-surface-border/50 bg-surface px-2.5 py-2 text-[12px] text-text-primary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset] placeholder:text-text-faint focus:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <select
                value={signalAccount}
                onChange={(e) => setSignalAccount(e.target.value)}
                className="rounded-lg border border-surface-border/50 bg-surface px-2 py-2 text-[12px] font-medium text-text-primary focus:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/15"
              >
                {priorityAccounts.map((pa) => (
                  <option key={pa.id} value={pa.id}>
                    {accountDisplayName(pa.id)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="ds-focus-ring rounded-lg border border-accent/25 bg-accent px-3 py-2 text-[11px] font-semibold text-white shadow-[0_1px_0_rgb(255_255_255/0.12)_inset] transition-all duration-200 hover:bg-accent/95 active:scale-[0.98]"
              >
                Log
              </button>
            </form>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {signals.slice(0, 8).map((s, i) => (
                <div key={i} className="flex gap-2 text-[11px]">
                  <span className="shrink-0 text-text-faint">{s.timestamp}</span>
                  <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                    {accountDisplayName(s.account)}
                  </span>
                  <span className="text-text-secondary">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
