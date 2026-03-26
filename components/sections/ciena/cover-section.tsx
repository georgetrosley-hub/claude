"use client";

import { useToast } from "@/app/context/toast-context";

export function CoverSection() {
  const { showToast } = useToast();

  const handleCopySummary = async () => {
    const summary = [
      "Ciena account strategy — Claude Enterprise",
      "",
      "Thesis",
      "Ciena builds the infrastructure AI runs on, but their teams are not using frontier AI to run the business. That gap is the wedge. It widens every quarter.",
      "",
      "Motion (land → prove → expand)",
      "- Land: Claude Code for Blue Planet engineering",
      "- Prove: measurable sprint velocity gain in 2 weeks",
      "- Expand: finance + ops + GTM with sequenced workloads",
      "",
      "Ask",
      "Give me the first wedge with Blue Planet engineering and two weeks to prove measurable velocity gain. If I can land that proof point, I’ll turn it into a repeatable expansion motion across finance, ops and GTM. Then scale to an enterprise rollout.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      showToast("Executive summary copied");
    } catch {
      showToast("Copy failed — try again");
    }
  };

  return (
    <section id="cover" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <div className="ds-panel-accent rounded-[18px] p-6 sm:p-8">
        <div className="ds-inset pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-faint">
            Account Strategy · March 2026
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
            How I’d win Ciena for Claude Enterprise
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            This is how I land a wedge, prove value fast and expand across an enterprise account. Ciena is the example.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-text-muted">
            <span className="rounded-full bg-white/70 px-3 py-1.5 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              Wedge
            </span>
            <span className="text-text-faint">→</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              Proof (2 weeks)
            </span>
            <span className="text-text-faint">→</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              Value
            </span>
            <span className="text-text-faint">→</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              Expand
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Copy executive summary
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-[12px] text-text-secondary">
            <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              George Trosley
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              Enterprise Account Executive
            </span>
            <span className="rounded-full bg-accent/15 px-3 py-1.5 font-medium text-accent">
              Ciena
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

