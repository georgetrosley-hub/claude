"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { AccountBusinessImpactModel } from "@/components/value-model/account-business-impact-model";

const FRAMING_BY_ACCOUNT: Record<string, string> = {
  "ciena-corp":
    "The payoff: directional margin and forecast exposure — with one lever for Snowflake-enabled visibility.",
  "sagent-lending": "The payoff: retention economics on Dara — one lever for how much ARR early detection can protect.",
  "us-financial-technology":
    "The payoff: securitization risk on governed data — one lever for how much loss faster detection can avoid.",
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
