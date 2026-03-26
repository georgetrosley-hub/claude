"use client";

import { CoverSection } from "@/components/sections/ciena/cover-section";
import { WhyCienaSection } from "@/components/sections/ciena/why-ciena-section";
import { WhyNowSection } from "@/components/sections/ciena/why-now-section";
import { ExecutionSection } from "@/components/sections/ciena/execution-section";
import { DollarsSection } from "@/components/sections/ciena/dollars-section";
import { ExpansionSection } from "@/components/sections/ciena/expansion-section";
import { PrioritizationSection } from "@/components/sections/ciena/prioritization-section";
import { ClosingSection } from "@/components/sections/ciena/closing-section";

export function CienaDeck() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <CoverSection />
      <WhyCienaSection />
      <WhyNowSection />
      <ExecutionSection />
      <DollarsSection />
      <ExpansionSection />
      <PrioritizationSection />
      <ClosingSection />
    </div>
  );
}

