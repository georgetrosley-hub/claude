"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label?: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function MetricCard({ label, value, subtitle, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "rounded-lg border border-surface-border/55 bg-surface-elevated/50 px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-colors duration-150",
        "hover:bg-surface-elevated/55 hover:border-surface-border/70",
        className
      )}
    >
      {label && (
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
          {label}
        </p>
      )}
      <p className={cn(
        "font-medium tabular-nums leading-none text-text-primary",
        label ? "mt-1.5" : "",
        String(value).length > 8 ? "text-xl" : "text-2xl tracking-tight"
      )}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-[12px] text-text-muted">{subtitle}</p>
      )}
    </motion.div>
  );
}
