"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { AccountBusinessImpactModel } from "@/components/value-model/account-business-impact-model";

const FRAMING_BY_ACCOUNT: Record<string, string> = {
  "ciena-corp":
    "This is how solving the first workload translates into measurable margin and forecast risk.",
  "sagent-lending": "If this lands, this is the business impact on Dara retention and ARR.",
  "us-financial-technology":
    "This is how the first workload translates into measurable risk reduction on governed data.",
};

export function BusinessImpactSection({
  accountId,
  accountName,
  proofPoint,
}: {
  accountId: string;
  accountName: string;
  proofPoint: string;
}) {
  const framing = FRAMING_BY_ACCOUNT[accountId] ?? "Directional view of business value tied to the POV proof point.";

  return (
    <section id="business-impact" className="scroll-mt-24 space-y-5 sm:space-y-6">
      <SectionHeader
        title="Business Impact"
        subtitle={framing}
        showLogo
      />
      <AccountBusinessImpactModel accountId={accountId} accountName={accountName} proofPoint={proofPoint} />
    </section>
  );
}
