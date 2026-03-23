"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ValueModelCardProps = {
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
} & (
  | {
      variant?: "full";
      title: string;
      subtitle: string;
    }
  | {
      variant: "standalone";
      title?: undefined;
      subtitle?: undefined;
    }
);

export function ValueModelCard(props: ValueModelCardProps) {
  const { children, footer, action } = props;
  const variant = props.variant ?? "full";

  if (variant === "standalone") {
    return (
      <div className="rounded-xl border border-surface-border/40 bg-surface-elevated/45 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
        <div className="p-4 sm:p-5">{children}</div>
        {(action || footer) && (
          <div className="flex flex-col gap-3 border-t border-surface-border/30 px-4 py-3 sm:px-5">
            {action}
            {footer}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-border/40 bg-surface-elevated/45 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <div className="border-b border-surface-border/35 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border/50 bg-surface-muted/30">
              <BarChart3 className="h-4 w-4 text-accent" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold tracking-tight text-text-primary">{props.title}</h3>
              <p className="mt-0.5 text-[11px] leading-snug text-text-muted">{props.subtitle}</p>
            </div>
          </div>
          {action ? <div className="shrink-0 sm:pt-0.5">{action}</div> : null}
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {footer ? <div className="border-t border-surface-border/30 px-4 py-3 sm:px-5">{footer}</div> : null}
    </div>
  );
}

export function DirectionalDisclaimer() {
  return (
    <p className="text-[10px] leading-snug text-text-faint">
      Directional estimate for discussion — not a forecast, quote, or financial statement. Adjust inputs to reflect
      what you validate in discovery.
    </p>
  );
}

type SliderFieldProps = {
  id: string;
  label: string;
  hint?: string;
  /** Subtle cue for which direction strengthens/weakens the outcome (slider semantics). */
  orientationHint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  suffix: "%" | "$" | "days" | "none";
  formatDisplay: (n: number) => string;
  showNumberInput?: boolean;
};

export function SliderField({
  id,
  label,
  hint,
  orientationHint,
  min,
  max,
  step,
  value,
  onChange,
  suffix,
  formatDisplay,
  showNumberInput = true,
}: SliderFieldProps) {
  const handleInput = (raw: string) => {
    if (suffix === "$") {
      const cleaned = raw.replace(/[$,\s]/g, "");
      if (cleaned === "") return;
      const n = Number(cleaned);
      if (!Number.isFinite(n)) return;
      onChange(Math.min(max, Math.max(min, n)));
      return;
    }
    const cleaned = raw.replace(/,/g, "").trim();
    if (cleaned === "") return;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return;
    onChange(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <label htmlFor={`${id}-range`} className="text-[11px] font-medium text-text-secondary">
            {label}
          </label>
          {hint ? <p className="text-[10px] text-text-faint">{hint}</p> : null}
        </div>
        {showNumberInput ? (
          <div className="flex items-center gap-1.5">
            <input
              id={`${id}-num`}
              type="text"
              inputMode={suffix === "$" ? "decimal" : "numeric"}
              value={formatDisplay(value)}
              onChange={(e) => handleInput(e.target.value)}
              className={cn(
                "w-[min(100%,7.5rem)] rounded-lg border border-surface-border/50 bg-surface-muted/25 px-2 py-1.5",
                "text-right text-[12px] font-medium tabular-nums text-text-primary",
                "outline-none transition-colors focus:border-accent/35 focus:ring-1 focus:ring-accent/20"
              )}
              aria-label={`${label} value`}
            />
            {(suffix === "%" || suffix === "days") && (
              <span className="text-[11px] font-medium text-text-faint">{suffix}</span>
            )}
          </div>
        ) : (
          <span className="text-[12px] font-semibold tabular-nums text-text-primary">{formatDisplay(value)}</span>
        )}
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "value-slider h-2 w-full cursor-pointer rounded-full bg-surface-border/40",
          "accent-[rgb(var(--accent))]"
        )}
      />
      {orientationHint ? (
        <p className="text-[10px] leading-snug text-text-faint">{orientationHint}</p>
      ) : null}
    </div>
  );
}

type OutputMetricProps = {
  label: string;
  value: string;
  emphasize?: boolean;
};

export function OutputMetricRow({ label, value, emphasize }: OutputMetricProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border/35 bg-surface-muted/[0.12] px-4 py-3 sm:px-4 sm:py-3.5",
        emphasize && "border-accent/25 bg-accent/[0.06]"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-faint">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.65, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "mt-1.5 tabular-nums tracking-tight text-text-primary",
          emphasize ? "text-[22px] font-semibold sm:text-[24px]" : "text-[18px] font-semibold sm:text-[20px]"
        )}
      >
        {value}
      </motion.p>
    </div>
  );
}

export function InsightBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-surface-border/35 bg-surface-muted/[0.08] px-3.5 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-faint">Executive insight</p>
      <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{children}</p>
    </div>
  );
}

/** Tight attribution layer — causal, not a product list. */
export function SnowflakeAttributionBlock({ lines }: { lines: readonly string[] }) {
  return (
    <div className="rounded-lg border border-accent/22 bg-gradient-to-br from-accent/[0.07] to-transparent px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent/95">Impact enabled by Snowflake</p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((line) => (
          <li key={line} className="flex gap-2.5 text-[12px] leading-snug text-text-secondary">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/75" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Single time-to-value signal — pairs with attribution, stays compact. */
export function TimeToValueRow({ headline, subline }: { headline: string; subline?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-surface-border/40 bg-surface-muted/[0.10] px-3.5 py-2.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-2 text-text-muted">
        <Clock3 className="h-3.5 w-3.5 shrink-0 text-accent/85" strokeWidth={2} aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Time to value</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-text-primary">{headline}</p>
        {subline ? <p className="mt-0.5 text-[11px] leading-snug text-text-faint">{subline}</p> : null}
      </div>
    </div>
  );
}
