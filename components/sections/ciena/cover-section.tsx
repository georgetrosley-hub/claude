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
            This is how I land a wedge, prove value fast and expand across an enterprise account. Ciena is the example.
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
    </section>
  );
}

