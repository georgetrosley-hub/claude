"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

export function CoverSection() {
  return (
    <section id="cover" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-faint">
            Account Strategy · March 2026
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
            How I’d win Ciena for Claude Enterprise
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-text-muted">
            If you dropped me in seat as an Anthropic Enterprise AE, this is the land motion, proof plan, and expansion map
            I’d execute—starting with a 2-week proof point and scaling to an enterprise rollout.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[12px] text-text-secondary">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              George Trosley
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              Enterprise Account Executive
            </span>
            <span className="rounded-full border border-accent/15 bg-accent/[0.06] px-3 py-1.5 text-accent/85">
              Ciena
            </span>
          </div>
        </motion.div>
      </div>

      <SectionHeader
        title="What you’ll see"
        subtitle="A tight narrative with two interactive modules (dollars + expansion) you can manipulate in real time."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Thesis",
            body: "Why Ciena is a must-win and why the gap is widening now.",
          },
          {
            title: "Execution",
            body: "First workload, 2-week proof point, and who I’d engage.",
          },
          {
            title: "Value",
            body: "Phased rollout with seat and ARR ranges you can tune.",
          },
          {
            title: "Expansion",
            body: "A sequenced map by function—active motion, next, later.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              {card.title}
            </p>
            <p className="mt-3 text-[13px] font-medium text-text-primary">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

