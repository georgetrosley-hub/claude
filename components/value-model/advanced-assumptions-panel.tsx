"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdvancedAssumptionsPanelProps = {
  children: ReactNode;
  className?: string;
};

/** Collapsed by default — secondary inputs only when discovery requires tuning. */
export function AdvancedAssumptionsPanel({ children, className }: AdvancedAssumptionsPanelProps) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-surface-border/35 bg-surface-muted/[0.06]",
        className
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-[10px] font-medium text-text-faint",
          "transition-colors hover:text-text-muted",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span>Advanced assumptions</span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 text-text-faint transition-transform group-open:rotate-180"
          strokeWidth={2}
          aria-hidden
        />
      </summary>
      <div className="space-y-3 border-t border-surface-border/30 px-3 pb-3 pt-3">{children}</div>
    </details>
  );
}
