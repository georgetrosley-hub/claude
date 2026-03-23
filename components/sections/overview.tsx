"use client";

import { useMemo } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { useTerritoryData } from "@/app/context/territory-data-context";
import type { PriorityAccount } from "@/data/territory-data";
import { PovPlanModule } from "@/components/sections/pov-plan-module";
import { cn } from "@/lib/utils";

const WHY_NOW_BY_ACCOUNT: Record<string, string> = {
  "us-financial-technology":
    "Regulatory scrutiny is tightening now, and delayed anomaly visibility increases audit and operating risk.",
  "sagent-lending":
    "Early Dara deployments are under delivery pressure now, so proving reliable outcomes is time-critical.",
  "ciena-corp":
    "AI demand is outpacing execution now, and leadership needs defensible margin visibility before forecast risk compounds.",
};

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
      <p className="mt-2 text-[11px] font-medium text-[#36b39a]">Why now: {WHY_NOW_BY_ACCOUNT[account.id] ?? account.status}</p>
      <p className="mt-2 text-[11px] font-semibold text-accent">Next action: {account.nextAction}</p>
    </article>
  );
}

export function Overview({
  account,
  onSelectAccount,
  onOpenStrategyWithPrompt,
}: {
  account: { id: string };
  onSelectAccount: (id: string) => void;
  onOpenStrategyWithPrompt?: (prompt: string) => void;
}) {
  const { priorityAccounts } = useTerritoryData();

  const selectedAccount = useMemo(
    () => priorityAccounts.find((p) => p.id === account.id) ?? priorityAccounts[0],
    [account.id, priorityAccounts]
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <section id="overview" className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-5 sm:p-6">
        <h1 className="text-[20px] font-semibold tracking-tight text-text-primary sm:text-[22px]">POV Builder</h1>
        <p className="mt-2 text-[12px] text-text-muted">
          Select an account, create urgency, and produce one sendable POV plan leadership can approve.
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

      <PovPlanModule
        priorityAccount={selectedAccount}
        onGeneratePovPlan={onOpenStrategyWithPrompt}
      />
    </div>
  );
}
