"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

export function WhyCienaSection() {
  return (
    <section id="why-ciena" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Why Ciena"
        subtitle="Ciena builds the networking infrastructure AI runs on. Their opportunity is to use frontier AI internally to operate the business at the speed of their market."
        showLogo
      />

      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/25 p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-faint">
          Account thesis
        </p>
        <p className="mt-3 max-w-4xl text-[14px] leading-relaxed text-text-secondary">
          Ciena enables AI at the infrastructure layer, but their internal teams are not using frontier AI to operate the
          business. That gap between what they enable for others and what they use themselves is the wedge—and it widens
          every quarter.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Growth under pressure",
            bullets: [
              "19% revenue growth in FY25",
              "$7.8B record backlog entering 2026",
              "Raised guidance to $6.3B",
              "New CFO driving forecast accuracy",
              "33% growth on AI demand alone",
            ],
          },
          {
            title: "Knowledge-worker density",
            bullets: [
              "9,000+ employees globally",
              "Blue Planet software engineering org",
              "WaveLogic silicon R&D teams",
              "Sales ops managing $7.8B backlog",
              "FP&A under margin pressure",
            ],
          },
          {
            title: "Claude fit",
            bullets: [
              "Claude Code for Blue Planet devs",
              "1M token context for RFP responses",
              "Enterprise security for IP protection",
              "Agentic workflows for sales ops",
              "Safety alignment for defense work",
            ],
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.45 }}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              {card.title}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-text-secondary">
              {card.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  <span className="min-w-0">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

