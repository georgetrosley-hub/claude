"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { clamp } from "@/lib/value-model-format";

type PhaseInputs = {
  label: string;
  months: string;
  seats: number;
  minArrPerSeat: number;
  maxArrPerSeat: number;
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
        <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-text-secondary">
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

  // Directional per-seat ARR ranges (tunable).
  const [minArrPerSeat, setMinArrPerSeat] = useState(720);
  const [maxArrPerSeat, setMaxArrPerSeat] = useState(960);

  const phases: PhaseInputs[] = useMemo(
    () => [
      {
        label: "Phase 1: Land",
        months: "Month 1–3",
        seats: phase1Seats,
        minArrPerSeat,
        maxArrPerSeat,
      },
      {
        label: "Phase 2: Expand",
        months: "Month 3–6",
        seats: phase2Seats,
        minArrPerSeat,
        maxArrPerSeat,
      },
      {
        label: "Phase 3: Scale",
        months: "Month 6–12",
        seats: phase3Seats,
        minArrPerSeat,
        maxArrPerSeat,
      },
    ],
    [phase1Seats, phase2Seats, phase3Seats, minArrPerSeat, maxArrPerSeat]
  );

  const totals = useMemo(() => {
    const sumSeats = phases.reduce((s, p) => s + p.seats, 0);
    const minArr = phases.reduce((s, p) => s + p.seats * p.minArrPerSeat, 0);
    const maxArr = phases.reduce((s, p) => s + p.seats * p.maxArrPerSeat, 0);
    return { sumSeats, minArr, maxArr };
  }, [phases]);

  return (
    <section id="dollars" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="What this looks like in dollars"
        subtitle="Phased enterprise deployment. Tune seats and per-seat ARR assumptions and watch Year 1 ARR update."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="space-y-4">
          <div className="rounded-[26px] border border-accent/12 bg-gradient-to-br from-accent/[0.06] via-surface-elevated/70 to-surface/60 p-5 sm:p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent/70">
              Year 1 ARR potential (interactive)
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-[30px] font-semibold tracking-tight text-text-primary">
                {formatMoneyCompact(totals.minArr)} – {formatMoneyCompact(totals.maxArr)}
              </p>
              <p className="pb-1 text-[12px] text-text-muted">
                across {formatInt(totals.sumSeats)} seats
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-text-secondary">
              Phased rollout with a credible per-seat range.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {phases.map((p) => {
              const min = p.seats * p.minArrPerSeat;
              const max = p.seats * p.maxArrPerSeat;
              return (
                <div key={p.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                    {p.label}
                  </p>
                  <p className="mt-2 text-[12px] text-text-muted">{p.months}</p>
                  <p className="mt-4 text-[14px] font-semibold text-text-primary">{formatInt(p.seats)} seats</p>
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {formatMoneyCompact(min)} – {formatMoneyCompact(max)} ARR
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Tune the model
            </p>
            <div className="mt-4 space-y-5">
              <RangeSlider
                label="Phase 1 seats"
                hint="Blue Planet engineering (land motion)"
                min={25}
                max={250}
                step={5}
                value={phase1Seats}
                onChange={(n) => setPhase1Seats(clamp(Math.round(n / 5) * 5, 25, 250))}
              />
              <RangeSlider
                label="Phase 2 seats"
                hint="FP&A + Sales Ops + Supply Chain"
                min={150}
                max={1200}
                step={25}
                value={phase2Seats}
                onChange={(n) => setPhase2Seats(clamp(Math.round(n / 25) * 25, 150, 1200))}
              />
              <RangeSlider
                label="Phase 3 seats"
                hint="Enterprise-wide rollout"
                min={600}
                max={4000}
                step={50}
                value={phase3Seats}
                onChange={(n) => setPhase3Seats(clamp(Math.round(n / 50) * 50, 600, 4000))}
              />

              <div className="pt-2 border-t border-surface-border/40" />

              <RangeSlider
                label="Min ARR per seat"
                hint="Directional lower bound"
                min={300}
                max={2400}
                step={10}
                value={minArrPerSeat}
                onChange={(n) => setMinArrPerSeat(clamp(n, 300, Math.max(300, maxArrPerSeat - 50)))}
              />
              <RangeSlider
                label="Max ARR per seat"
                hint="Directional upper bound"
                min={350}
                max={3000}
                step={10}
                value={maxArrPerSeat}
                onChange={(n) => setMaxArrPerSeat(clamp(n, Math.min(3000, minArrPerSeat + 50), 3000))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

