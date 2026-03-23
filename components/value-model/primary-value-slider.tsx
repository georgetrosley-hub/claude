"use client";

import { cn } from "@/lib/utils";

type PrimaryValueSliderProps = {
  id: string;
  /** Snowflake-positive framing — moving right should mean more value. */
  label: string;
  /** Optional short context under the label. */
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  suffix: "%" | "$" | "days" | "none";
  formatDisplay: (n: number) => string;
  /** Four anchor labels under the track (left → right = improvement). */
  anchors?: readonly [string, string, string, string];
  /** One line that updates with the slider — commercial interpretation. */
  interpretation: string;
};

export function PrimaryValueSlider({
  id,
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  suffix,
  formatDisplay,
  anchors = ["Current state", "Early improvement", "Moderate improvement", "Strong improvement"],
  interpretation,
}: PrimaryValueSliderProps) {
  return (
    <div className="space-y-3 rounded-xl border border-accent/20 bg-accent/[0.04] px-3.5 py-3.5 sm:px-4 sm:py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-snug text-text-primary">{label}</p>
          {hint ? <p className="mt-1 text-[10px] leading-snug text-text-faint">{hint}</p> : null}
        </div>
        <div className="flex items-baseline gap-1.5 rounded-lg border border-surface-border/40 bg-surface-muted/20 px-2.5 py-1.5">
          <span className="text-[12px] font-semibold tabular-nums text-text-primary">{formatDisplay(value)}</span>
          {(suffix === "%" || suffix === "days") && (
            <span className="text-[10px] font-medium text-text-faint">{suffix}</span>
          )}
        </div>
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
          "value-slider h-2.5 w-full cursor-pointer rounded-full bg-surface-border/45",
          "accent-[rgb(var(--accent))]"
        )}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      />

      <div className="grid grid-cols-4 gap-1 px-0.5">
        {anchors.map((a) => (
          <span key={a} className="text-center text-[9px] font-medium leading-tight text-text-faint sm:text-[10px]">
            {a}
          </span>
        ))}
      </div>

      <p className="text-[11px] leading-relaxed text-text-secondary">{interpretation}</p>
    </div>
  );
}
