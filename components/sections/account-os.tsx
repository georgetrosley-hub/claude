"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPercent } from "@/lib/formatters";
import type { Account, AccountPlan, Competitor, DataSourceStatus, Stakeholder } from "@/types";

interface AccountOsProps {
  account: Account;
  accountPlan: AccountPlan;
  stakeholders: Stakeholder[];
  dataSources: DataSourceStatus[];
  competitiveLandscape: Competitor[];
}

const qualificationTone = {
  strong: "text-claude-coral/80",
  partial: "text-text-secondary",
  gap: "text-text-muted",
} as const;

const connectionTone = {
  connected: "text-claude-coral/80",
  syncing: "text-text-secondary",
  planned: "text-text-muted",
} as const;

export function AccountOs({
  account,
  accountPlan,
  stakeholders,
  dataSources,
  competitiveLandscape,
}: AccountOsProps) {
  const topCompetitors = competitiveLandscape
    .slice()
    .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Account OS"
        subtitle="Live account memory: strategy, stakeholders, systems, and whitespace."
      />

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Account objective</p>
          <p className="mt-3 text-[20px] leading-relaxed text-text-primary">
            {accountPlan.objective}
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-text-secondary">
            {accountPlan.valueHypothesis}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Winning themes</p>
              <div className="mt-3 space-y-2">
                {accountPlan.winThemes.map((theme) => (
                  <p key={theme} className="text-[12px] text-text-secondary">
                    {theme}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Whitespace themes</p>
              <div className="mt-3 space-y-2">
                {accountPlan.whitespaceThemes.map((theme) => (
                  <p key={theme} className="text-[12px] text-text-secondary">
                    {theme}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Qualification</p>
          <div className="mt-5 space-y-4">
            {accountPlan.qualification.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-text-primary">{item.label}</p>
                  <span className={`text-[10px] uppercase tracking-[0.12em] ${qualificationTone[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[14px] font-medium text-text-primary">Stakeholder graph</h3>
            <span className="text-[11px] text-text-muted">{stakeholders.length} mapped</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {stakeholders.map((stakeholder) => (
              <div
                key={stakeholder.id}
                className="rounded-lg border border-surface-border/40 bg-surface/40 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{stakeholder.name}</p>
                    <p className="mt-1 text-[12px] text-text-secondary">{stakeholder.title}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {stakeholder.role.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-muted">
                  <span>{stakeholder.team}</span>
                  <span>{formatPercent(stakeholder.influence)}</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                  {stakeholder.nextStep}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Connected systems</h3>
            <div className="mt-5 space-y-4">
              {dataSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] text-text-primary">{source.label}</p>
                    <p className="mt-1 text-[12px] text-text-secondary">{source.freshness}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.12em] ${connectionTone[source.status]}`}>
                    {source.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <h3 className="text-[14px] font-medium text-text-primary">Competitive context</h3>
            <div className="mt-5 space-y-4">
              {topCompetitors.map((competitor) => (
                <div key={competitor.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-text-primary">{competitor.name}</p>
                    <span className="text-[11px] text-claude-coral/70">
                      {formatPercent(competitor.accountRiskLevel)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
                    {(competitor.detectedFootprint ?? competitor.strengthAreas[0] ?? "Competitive risk detected")}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
            <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Current vendor footprint</p>
            <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
              {account.existingVendorFootprint.join(" · ")}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
