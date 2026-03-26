"use client";

export function CoverSection() {
  return (
    <section id="cover" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <div className="rounded-[18px] bg-[#141413] p-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.22),0_10px_30px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/65">
            Account Strategy · March 2026
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight text-white sm:text-[34px]">
            How I’d win Ciena for Claude Enterprise
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-white/72">
            This is how I land a wedge, prove value fast and expand across an enterprise account. Ciena is the example.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[12px] text-white/80">
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              George Trosley
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              Enterprise Account Executive
            </span>
            <span className="rounded-full bg-[#D97757]/20 px-3 py-1.5 text-[#FFD8CC]">
              Ciena
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

