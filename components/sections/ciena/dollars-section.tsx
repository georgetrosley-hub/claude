"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { clamp } from "@/lib/value-model-format";
import { ImpactExplanationModal, type ImpactExplanationSection } from "@/components/value-model/impact-explanation-modal";

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
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

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

  const assumptionsSections: ImpactExplanationSection[] = useMemo(
    () => [
      {
        title: "What this model is",
        body: "A directional Year 1 ARR range from phased seat rollout × per-seat ARR assumptions. It is not a forecast, quote, or procurement-backed pricing schedule.",
      },
      {
        title: "Key assumptions",
        body: `Seats: ${formatInt(phase1Seats)} (Phase 1), ${formatInt(phase2Seats)} (Phase 2), ${formatInt(phase3Seats)} (Phase 3). Per-seat ARR: $${formatInt(minArrPerSeat)}–$${formatInt(maxArrPerSeat)}.`,
      },
      {
        title: "How I’d validate in discovery",
        body: "Confirm seatable populations (engineering, FP&A, ops), procurement motion, security requirements (SSO/SCIM/audit), and the proof point that unlocks the next tranche. Convert the range into an approved rollout plan before scaling.",
      },
      {
        title: "What’s excluded",
        body: "Multi-year expansion, services, usage-based uplift, and any ‘everyone adopts’ assumptions. The goal is a credible first-year range tied to a sequence.",
      },
    ],
    [maxArrPerSeat, minArrPerSeat, phase1Seats, phase2Seats, phase3Seats]
  );

  return (
    <section id="dollars" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="What this looks like in dollars"
        subtitle="Phased enterprise deployment. Tune seats and per-seat ARR assumptions and watch Year 1 ARR update."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="space-y-4">
          <div className="ds-panel-accent p-6 sm:p-7">
            <div className="ds-inset pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/80">
              Year 1 ARR potential (interactive)
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-[34px] font-semibold tracking-tight text-text-primary">
                {formatMoneyCompact(totals.minArr)} – {formatMoneyCompact(totals.maxArr)}
              </p>
              <p className="pb-1 text-[12px] text-text-muted">
                across {formatInt(totals.sumSeats)} seats
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-text-secondary">
              Phased rollout with a credible per-seat range.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-[12px] text-text-muted">
                Executive readout: directional Year 1 ARR range tied to a sequenced rollout.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {phases.map((p) => {
              const min = p.seats * p.minArrPerSeat;
              const max = p.seats * p.maxArrPerSeat;
              return (
                <div key={p.label} className="ds-card p-6">
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
          <div className="ds-card p-6">
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

              <div className="pt-2 border-t border-surface-border/70" />

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

      <ImpactExplanationModal
        open={assumptionsOpen}
        onClose={() => setAssumptionsOpen(false)}
        accountLabel="Ciena"
        sections={assumptionsSections}
      />
    </section>
  );
}

