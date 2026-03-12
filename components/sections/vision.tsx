"use client";

import { motion } from "framer-motion";
import { BarChart3, Shield, Sparkles, Zap } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const roadmap = [
  {
    icon: Zap,
    title: "Connected data foundation",
    desc: "Move from mock data to live Salesforce, calls, docs, and usage signals so the workspace reflects what is actually happening in the account.",
  },
  {
    icon: BarChart3,
    title: "Rep and manager operating loop",
    desc: "Add inspection, forecasting, coaching, and manager workflows so the product becomes the daily system for both reps and leaders.",
  },
  {
    icon: Shield,
    title: "Governed execution",
    desc: "Keep approvals, evidence, policy checks, and audit logs first-class as agent actions expand into email, CRM, and task execution.",
  },
  {
    icon: Sparkles,
    title: "Multi-role revenue workspace",
    desc: "Extend the seller OS into solutions, customer success, and post-sale expansion motions without losing the rep-owned relationship.",
  },
];

export function Vision() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl space-y-12"
    >
      <SectionHeader
        title="Roadmap"
        subtitle="Where the seller OS should go next once the core workflows are in place."
      />

      <section className="rounded-xl border border-surface-border/50 bg-surface-elevated/35 p-6">
        <p className="text-[15px] leading-relaxed text-text-secondary">
          The product now has the right seller-workflow shell: `My Book`, `Account OS`, `Deal Room`,
          `Exec Prep`, `Expansion Engine`, `Agent Actions`, and `Manager View`. The next step is to
          connect these surfaces to live systems so Claude becomes the operating layer for real seller
          work, not just a polished simulation.
        </p>
      </section>

      <div className="space-y-6">
        {roadmap.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted/60">
                <Icon className="h-3.5 w-3.5 text-claude-coral/70" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-text-primary">{item.title}</p>
                <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <section className="border-t border-surface-border/40 pt-8">
        <p className="text-[13px] text-text-muted leading-relaxed">
          The strongest positioning remains simple: Claude does not replace the seller. Claude keeps
          the system moving while the seller owns the relationship, the narrative, and the final call.
        </p>
      </section>
    </motion.div>
  );
}
