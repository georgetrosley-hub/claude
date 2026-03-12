"use client";

import { motion } from "framer-motion";
import { OrgExpansionMap } from "@/components/sections/org-expansion-map";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { ExpansionMotion, OrgNode } from "@/types";

interface ExpansionEngineProps {
  motions: ExpansionMotion[];
  orgNodes: OrgNode[];
}

const stageTone = {
  mapped: "text-text-muted",
  multithreading: "text-text-secondary",
  pilot: "text-claude-coral/80",
  deployed: "text-claude-coral",
} as const;

export function ExpansionEngine({ motions, orgNodes }: ExpansionEngineProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Expansion Engine"
        subtitle="Whitespace, sponsor paths, and next teams to open after the land motion."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {motions.map((motion) => (
          <div
            key={motion.id}
            className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[15px] font-medium text-text-primary">{motion.team}</p>
              <span className={`text-[10px] uppercase tracking-[0.12em] ${stageTone[motion.stage]}`}>
                {motion.stage}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
              {motion.useCase}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 text-[12px]">
              <span className="text-text-muted">{motion.sponsor}</span>
              <span className="text-claude-coral/80">{formatCurrency(motion.arrPotential)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-[11px]">
              <span className="text-text-secondary">{motion.adoptionSignal}</span>
              <span className="text-text-muted">{formatPercent(motion.confidence)}</span>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-text-secondary">
              {motion.nextStep}
            </p>
          </div>
        ))}
      </section>

      <OrgExpansionMap nodes={orgNodes} />
    </motion.div>
  );
}
