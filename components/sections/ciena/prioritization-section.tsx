"use client";

import { SectionHeader } from "@/components/ui/section-header";

export function PrioritizationSection() {
  return (
    <section id="prioritization" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Summary & prioritization"
        subtitle="Three workloads, each with an explicit proof point and a pivot if discovery changes the wedge."
      />

      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <div className="grid gap-3 lg:grid-cols-3">
          {[
            {
              n: "1",
              workload: "Claude Code for Blue Planet engineering",
              proof: "Sprint velocity gain in 2 weeks",
              pivot: "RFP response acceleration",
            },
            {
              n: "2",
              workload: "FP&A forecast automation + backlog intelligence",
              proof: "Margin visibility on 2–3 AI deals in 24 hours",
              pivot: "Supply chain constraint visibility",
            },
            {
              n: "3",
              workload: "Enterprise-wide Claude deployment",
              proof: "20%+ seat adoption in Year 1 (1,800 seats)",
              pivot: "Department-by-department rollout",
            },
          ].map((row) => (
            <div key={row.n} className="rounded-[22px] border border-surface-border/45 bg-surface-elevated/25 p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-faint">
                Workload {row.n}
              </p>
              <p className="mt-2 text-[13px] font-semibold text-text-primary">{row.workload}</p>
              <div className="mt-3 space-y-2 text-[12px] leading-relaxed text-text-secondary">
                <p>
                  <span className="text-text-faint">Proof point:</span> {row.proof}
                </p>
                <p>
                  <span className="text-text-faint">Pivot if needed:</span> {row.pivot}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-accent/12 bg-gradient-to-br from-accent/[0.06] via-surface-elevated/70 to-surface/60 p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent/70">
          Closing position
        </p>
        <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-text-secondary">
          <p>
            I position Claude as the operating layer for how Ciena teams write, analyze, build and decide. Start with engineering. Expand into finance and ops.
          </p>
          <p>
            Start small. Prove value fast. Expand only where outcomes are measurable.
          </p>
          <p>Each step tests a hypothesis.</p>
        </div>
      </div>
    </section>
  );
}

