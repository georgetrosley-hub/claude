"use client";

import { SectionHeader } from "@/components/ui/section-header";

export function ExecutionSection() {
  return (
    <section id="execution" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Execution | How I’d win"
        subtitle="Land with a two-week proof point, then expand into finance + ops + GTM with sequenced workloads."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="ds-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            First workload
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
            {[
              "Claude Code for Blue Planet engineering",
              "Target: dev velocity, code review, onboarding",
              "Land with 50–100 engineering seats",
              "Measure: cycle time, PR throughput, onboarding speed",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ds-panel-accent p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent/70">
            POV plan (2 weeks)
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
            {[
              "Ask: how much time is spent on code review and context switching between repos?",
              'If the answer is “too much,” Claude Code is the workload.',
              "Deliver measurable sprint velocity improvement in 2 weeks.",
              "Show hours reclaimed per engineer per week.",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ds-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            Who I’d engage
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
            {[
              "VP Engineering, Blue Planet (land)",
              "Director FP&A → CFO (expand: forecast automation)",
              "Director Sales Operations (expand: backlog intelligence)",
              "CIO / CISO (enterprise-wide: security, governance, SSO)",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-surface-border" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ds-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            Why Claude (enterprise)
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
            Ciena operates in defense-adjacent, IP-sensitive infrastructure. They need an AI partner that leads with safety and
            data governance. Claude Enterprise offers SSO, SCIM, audit logs, role-based access and a commitment not to train on customer data.
            Claude Code gives engineering teams an AI-native dev workflow. The 1M token context window lets RFP teams process full technical specs in a single session.
          </p>
        </div>

        <div className="ds-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            Competitive positioning
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
            {[
              "vs Copilot: Claude Code is stronger for agentic workflows and complex codebases. No Microsoft lock-in",
              "vs ChatGPT: Safety and data governance are critical in defense-adjacent infrastructure. Customer data never trains the model",
              "vs Databricks: Claude is the productivity layer, not the data layer. Complementary play",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-surface-border" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

