"use client";

import { SectionHeader } from "@/components/ui/section-header";

export function ClosingSection() {
  return (
    <section id="closing" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Close"
        subtitle="If this lands: prove value fast, expand with intent, and scale what works."
      />

      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-[14px] font-semibold tracking-tight text-text-primary">
          The ask
        </p>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-text-secondary">
          Give me the first wedge with Blue Planet engineering and two weeks to prove measurable velocity gain. If I can
          land that proof point, I’ll turn it into a repeatable expansion motion across finance, ops and GTM. Then scale
          to an enterprise rollout.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Land", value: "50–100 seats · Blue Planet Engineering" },
            { label: "Expand", value: "500 seats · FP&A + Sales Ops + Supply Chain" },
            { label: "Scale", value: "1,800+ seats · Enterprise rollout" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[22px] border border-surface-border/45 bg-surface-elevated/25 p-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-faint">
                {card.label}
              </p>
              <p className="mt-2 text-[13px] font-semibold text-text-primary">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-surface-border/40 pt-5 text-[12px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>George Trosley · March 2026</span>
          <span className="text-text-faint">Built with Cursor and Claude · March 2026</span>
        </div>
      </div>
    </section>
  );
}

