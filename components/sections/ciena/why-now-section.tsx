"use client";

import { SectionHeader } from "@/components/ui/section-header";

function Callout({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="ds-card p-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent/70">
        {eyebrow}
      </p>
      <p className="mt-2 text-[15px] font-semibold tracking-tight text-text-primary">
        {title}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}

export function WhyNowSection() {
  return (
    <section id="why-now" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Why now"
        subtitle="The timing is margin pressure plus execution drag. This is where frontier AI becomes a business operating advantage."
      />

      <p className="max-w-3xl text-[13px] leading-relaxed text-text-secondary">
        AI is no longer an innovation lever here. It is a margin and execution problem.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "AI demand is surging",
            body:
              "33% growth on AI demand and a $7.8B backlog under new CFO pressure. Forecast accuracy and margin are now board-level problems.",
          },
          {
            title: "Operational scrutiny increased",
            body:
              "S&P 500 inclusion (Feb 2026) adds institutional scrutiny. AI adoption is now a margin story, not an innovation story.",
          },
          {
            title: "Blue Planet pivot is accelerating",
            body:
              "Engineering headcount is growing while review cycles and context switching eat velocity. Developer productivity tooling is the gap.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="ds-card p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              {card.title}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ds-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            What’s actually broken
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
            {[
              "Finance, ops and sales running off different versions of backlog and fulfillment data. Millions in unmanaged margin exposure",
              "Blue Planet engineering scaling without frontier AI tooling. Review cycles and context switching eating velocity",
              "RFP teams manually assembling proposals across a product portfolio that has doubled in complexity",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-surface-border" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <Callout
            eyebrow="My hypothesis"
            title="The gap is widening"
            body='“Ciena builds the infrastructure AI runs on. Their risk is that every other company on their network is using frontier AI to operate, and they are not. That gap is widening every quarter.”'
          />
          <Callout
            eyebrow="Proof point I need"
            title="Velocity gain in two weeks"
            body="Show measurable developer velocity gain on one Blue Planet sprint within 2 weeks of deployment."
          />
        </div>
      </div>
    </section>
  );
}

