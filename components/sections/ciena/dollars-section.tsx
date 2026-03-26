"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { clamp } from "@/lib/value-model-format";

type PhaseInputs = {
  label: string;
  months: string;
  seats: number;
};

function formatMoneyCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatInt(n: number) {
  return Math.round(n).toLocaleString();
}

function RangeSlider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            {label}
          </p>
          {hint && <p className="mt-1 text-[12px] text-text-muted">{hint}</p>}
        </div>
        <div className="shrink-0 rounded-full bg-[#F5F4EE] px-3 py-1.5 text-[12px] text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          {formatInt(value)}
          {suffix ?? ""}
        </div>
      </div>
      <input
        className="value-slider w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function DollarsSection() {
  const [phase1Seats, setPhase1Seats] = useState(100);
  const [phase2Seats, setPhase2Seats] = useState(500);
  const [phase3Seats, setPhase3Seats] = useState(1800);

  const [avgArrPerSeat, setAvgArrPerSeat] = useState(840);

  const phases: PhaseInputs[] = useMemo(
    () => [
      {
        label: "Phase 1: Land",
        months: "Month 1–3",
        seats: phase1Seats,
      },
      {
        label: "Phase 2: Expand",
        months: "Month 3–6",
        seats: phase2Seats,
      },
      {
        label: "Phase 3: Scale",
        months: "Month 6–12",
        seats: phase3Seats,
      },
    ],
    [phase1Seats, phase2Seats, phase3Seats]
  );

  const totals = useMemo(() => {
    const sumSeats = phases.reduce((s, p) => s + p.seats, 0);
    const arr = phases.reduce((s, p) => s + p.seats * avgArrPerSeat, 0);
    return { sumSeats, arr };
  }, [avgArrPerSeat, phases]);

  return (
    <section id="dollars" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="What this looks like in dollars"
        subtitle="Phased enterprise deployment. Tune seats and a fixed Avg ARR per seat and watch Year 1 ARR update."
      />

      <div className="space-y-4">
        <div className="ds-panel-accent p-6 sm:p-7">
          <div className="ds-inset pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/80">
            Year 1 ARR potential (interactive)
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <p className="text-[34px] font-semibold tracking-tight text-text-primary">
              {formatMoneyCompact(totals.arr)}
            </p>
            <p className="pb-1 text-[12px] text-text-muted">
              across {formatInt(totals.sumSeats)} seats
            </p>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-text-secondary">
            Phased rollout with a fixed average per-seat assumption.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-[12px] text-text-muted">
              Executive readout: directional Year 1 ARR tied to a sequenced rollout.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((p) => {
            const arr = p.seats * avgArrPerSeat;

            const isPhase1 = p.label.startsWith("Phase 1");
            const isPhase2 = p.label.startsWith("Phase 2");

            const seatSlider = isPhase1
              ? {
                  label: "Seats",
                  hint: "Blue Planet engineering (land motion)",
                  min: 25,
                  max: 250,
                  step: 5,
                  value: phase1Seats,
                  onChange: (n: number) => setPhase1Seats(clamp(Math.round(n / 5) * 5, 25, 250)),
                }
              : isPhase2
                ? {
                    label: "Seats",
                    hint: "FP&A + Sales Ops + Supply Chain",
                    min: 150,
                    max: 1200,
                    step: 25,
                    value: phase2Seats,
                    onChange: (n: number) => setPhase2Seats(clamp(Math.round(n / 25) * 25, 150, 1200)),
                  }
                : {
                    label: "Seats",
                    hint: "Enterprise-wide rollout",
                    min: 600,
                    max: 4000,
                    step: 50,
                    value: phase3Seats,
                    onChange: (n: number) => setPhase3Seats(clamp(Math.round(n / 50) * 50, 600, 4000)),
                  };

            return (
              <div key={p.label} className="ds-card p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                  {p.label}
                </p>
                <p className="mt-2 text-[12px] text-text-muted">{p.months}</p>
                <p className="mt-4 text-[14px] font-semibold text-text-primary">{formatInt(p.seats)} seats</p>
                <p className="mt-1 text-[12px] text-text-secondary">
                  {formatMoneyCompact(arr)} ARR
                </p>

                <div className="mt-5 space-y-5">
                  <RangeSlider
                    label={seatSlider.label}
                    hint={seatSlider.hint}
                    min={seatSlider.min}
                    max={seatSlider.max}
                    step={seatSlider.step}
                    value={seatSlider.value}
                    onChange={seatSlider.onChange}
                  />
                  <RangeSlider
                    label="Avg ARR per seat"
                    hint="Fixed assumption used across phases"
                    min={400}
                    max={2000}
                    step={10}
                    value={avgArrPerSeat}
                    onChange={(n) => setAvgArrPerSeat(clamp(n, 400, 2000))}
                    suffix=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

