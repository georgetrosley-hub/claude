"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SnowflakeEnabledValueBlockProps = {
  title: string;
  valueDisplay: string;
  /** e.g. "≈ 68% of recoverable margin" */
  portionLine: string;
  /** 0–100, portion of the recoverable bucket practically unlockable in a first motion */
  barPercent: number;
  supportingText: string;
  timeToValueBadge: string;
  timeToValueHint?: string;
};

export function SnowflakeEnabledValueBlock({
  title,
  valueDisplay,
  portionLine,
  barPercent,
  supportingText,
  timeToValueBadge,
  timeToValueHint,
}: SnowflakeEnabledValueBlockProps) {
  const pct = Math.round(clampPct(barPercent));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-accent/30",
        "bg-gradient-to-br from-accent/[0.12] via-surface-muted/[0.08] to-transparent",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/[0.06] blur-2xl" aria-hidden />
      <div className="relative space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-accent/[0.12]">
              <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/95">{title}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border border-accent/35 bg-accent/[0.14] px-2.5 py-1",
              "text-[10px] font-semibold tracking-wide text-accent"
            )}
          >
            {timeToValueBadge}
          </span>
        </div>

        <div>
          <motion.p
            key={valueDisplay}
            initial={{ opacity: 0.7, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="tabular-nums text-[26px] font-semibold tracking-tight text-text-primary sm:text-[28px]"
          >
            {valueDisplay}
          </motion.p>
          <p className="mt-1 text-[12px] font-medium text-text-secondary">{portionLine}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[10px] text-text-faint">
            <span>Practically unlockable in an initial motion</span>
            <span className="tabular-nums font-medium text-text-muted">{pct}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-surface-border/50"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Portion of modeled recoverable value attainable quickly with Snowflake"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent/90 to-accent/60"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            />
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-text-secondary">{supportingText}</p>
        {timeToValueHint ? (
          <p className="text-[11px] leading-snug text-text-faint">{timeToValueHint}</p>
        ) : null}
      </div>
    </div>
  );
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}
