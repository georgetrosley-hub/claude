"use client";

import { useMemo, useState } from "react";
import {
  DirectionalDisclaimer,
  InsightBox,
  OutputMetricRow,
  SliderField,
  SnowflakeAttributionBlock,
  ValueModelCard,
} from "@/components/value-model/value-model-primitives";
import { ImpactExplanationModal, type ImpactExplanationSection } from "@/components/value-model/impact-explanation-modal";
import {
  clamp,
  formatCount,
  formatCurrencyCompact,
  formatCurrencyInput,
  formatPercent,
} from "@/lib/value-model-format";
import {
  computeCienaSnowflakeEnabled,
  computeFintechSnowflakeEnabled,
  computeSagentSnowflakeEnabled,
} from "@/lib/snowflake-enabled-value";
import { SnowflakeEnabledValueBlock } from "@/components/value-model/snowflake-enabled-value-block";
import { cn } from "@/lib/utils";

type AccountBusinessImpactModelProps = {
  accountId: string;
  accountName: string;
  proofPoint: string;
};

export function AccountBusinessImpactModel({ accountId, accountName, proofPoint }: AccountBusinessImpactModelProps) {
  if (accountId === "ciena-corp") {
    return <CienaImpactModel accountName={accountName} proofPoint={proofPoint} />;
  }
  if (accountId === "sagent-lending") {
    return <SagentImpactModel accountName={accountName} proofPoint={proofPoint} />;
  }
  if (accountId === "us-financial-technology") {
    return <UsFintechImpactModel accountName={accountName} proofPoint={proofPoint} />;
  }
  return null;
}

function ExplainButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-lg border border-accent/28 bg-accent/[0.08] px-3 py-2.5",
        "text-[11px] font-semibold text-accent transition-colors hover:bg-accent/[0.12]"
      )}
    >
      Explain the Impact
    </button>
  );
}

/* ——— Ciena ——— */

function CienaImpactModel({ accountName, proofPoint }: { accountName: string; proofPoint: string }) {
  const [backlog, setBacklog] = useState(45_000_000);
  const [riskPct, setRiskPct] = useState(18);
  const [grossMarginPct, setGrossMarginPct] = useState(42);
  const [improvementPct, setImprovementPct] = useState(25);
  const [explainOpen, setExplainOpen] = useState(false);

  const revenueAtRisk = backlog * (riskPct / 100);
  const marginExposure = revenueAtRisk * (grossMarginPct / 100);
  const recoverableMargin = marginExposure * (improvementPct / 100);

  const snowflakeEnabled = useMemo(
    () => computeCienaSnowflakeEnabled(recoverableMargin, improvementPct, grossMarginPct, riskPct),
    [recoverableMargin, improvementPct, grossMarginPct, riskPct]
  );

  const insight = useMemo(() => {
    const rev = formatCurrencyCompact(revenueAtRisk);
    const me = formatCurrencyCompact(marginExposure);
    if (revenueAtRisk >= 8_000_000) {
      return `At this backlog risk level, roughly ${rev} in revenue is exposed before margin even enters the conversation. Margin exposure sits near ${me} — meaning modest gains in fulfillment visibility can defend material dollars, not just dashboards.`;
    }
    if (revenueAtRisk >= 2_000_000) {
      return `Even at this scale, ${rev} in revenue-at-risk translates to meaningful margin exposure (${me}). The point isn’t precision — it’s whether leadership can act before variance shows up in the forecast.`;
    }
    return `Directionally, backlog uncertainty still converts to revenue-at-risk (${rev}) and margin exposure (${me}). The POV is about making that visible early enough for trade-offs, not after the quarter locks.`;
  }, [marginExposure, revenueAtRisk]);

  const sections: ImpactExplanationSection[] = useMemo(
    () => [
      {
        title: "Total business exposure",
        body: `At these inputs, ${formatCurrencyCompact(revenueAtRisk)} in revenue is at risk (${formatPercent(riskPct)} of ${formatCurrencyCompact(backlog)} backlog). At ${formatPercent(grossMarginPct)} gross margin, that is ${formatCurrencyCompact(marginExposure)} in margin exposure. If visibility and coordination improve enough to recover ${formatPercent(improvementPct)} of that exposure, recoverable margin is ${formatCurrencyCompact(recoverableMargin)}. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Snowflake-enabled value",
        body: `Directionally ${formatCurrencyCompact(snowflakeEnabled.value)} — about ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of recoverable margin — is realistically attainable in an initial motion. Snowflake works on ERP and CRM data already in place, avoids a long pipeline rebuild before anything is visible, and gives sales, ops, and finance the same governed view of backlog → fulfillment → margin. That is how the recoverable pool becomes practical to capture quickly, not just theoretically.`,
      },
      {
        title: "Why that matters commercially",
        body: `This isn’t “better reporting.” It’s whether finance and ops can see backlog-driven margin exposure before the forecast locks — when trade-offs are still available. That’s the difference between a dashboard and a decision artifact.`,
      },
      {
        title: "Why this is the right first workload",
        body: `It matches the wedge: order → backlog → fulfillment → margin on 2–3 deals. Win the proof, and expansion is portfolio coverage and governed exec readouts — not a platform bake-off.`,
      },
    ],
    [
      backlog,
      grossMarginPct,
      improvementPct,
      marginExposure,
      proofPoint,
      recoverableMargin,
      revenueAtRisk,
      riskPct,
      snowflakeEnabled.unlockRatio,
      snowflakeEnabled.value,
    ]
  );

  return (
    <>
      <ValueModelCard
        variant="standalone"
        action={<ExplainButton onClick={() => setExplainOpen(true)} />}
        footer={<DirectionalDisclaimer />}
      >
        <div className="space-y-4">
          <SliderField
            id="ciena-backlog"
            label="Total AI backlog"
            hint="Directional backlog tied to AI demand you’re executing against."
            orientationHint="Larger backlog increases total revenue at risk when risk share is held constant."
            min={5_000_000}
            max={120_000_000}
            step={500_000}
            value={backlog}
            onChange={(n) => setBacklog(clamp(n, 5_000_000, 120_000_000))}
            suffix="$"
            formatDisplay={(n) => `$${formatCurrencyInput(n)}`}
          />
          <SliderField
            id="ciena-risk"
            label="Percent of backlog at risk"
            orientationHint="Higher backlog risk increases revenue and margin exposure."
            min={5}
            max={45}
            step={1}
            value={riskPct}
            onChange={(n) => setRiskPct(clamp(n, 5, 45))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />
          <SliderField
            id="ciena-gm"
            label="Gross margin"
            orientationHint="Higher gross margin widens margin exposure from the same revenue at risk."
            min={18}
            max={62}
            step={1}
            value={grossMarginPct}
            onChange={(n) => setGrossMarginPct(clamp(n, 18, 62))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />
          <SliderField
            id="ciena-imp"
            label="Optional improvement from better visibility"
            hint="Share of margin exposure you could protect with earlier detection and coordination."
            orientationHint="Greater visibility improvement increases recoverable margin."
            min={5}
            max={55}
            step={1}
            value={improvementPct}
            onChange={(n) => setImprovementPct(clamp(n, 5, 55))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <OutputMetricRow label="Revenue at risk" value={formatCurrencyCompact(revenueAtRisk)} />
            <OutputMetricRow label="Margin exposure" value={formatCurrencyCompact(marginExposure)} emphasize />
            <OutputMetricRow label="Recoverable margin" value={formatCurrencyCompact(recoverableMargin)} />
          </div>

          <SnowflakeEnabledValueBlock
            title="Value unlockable with Snowflake"
            valueDisplay={formatCurrencyCompact(snowflakeEnabled.value)}
            portionLine={
              recoverableMargin > 0
                ? `≈ ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of recoverable margin in an initial motion`
                : "No recoverable margin at these inputs — raise exposure or visibility improvement to see directional unlock."
            }
            barPercent={recoverableMargin > 0 ? snowflakeEnabled.unlockRatio * 100 : 0}
            supportingText="Because Snowflake can work on existing operational data quickly, a meaningful portion of this margin protection is realistically achievable in an initial motion — without waiting for a pipeline rebuild."
            timeToValueBadge="Fast on existing data"
            timeToValueHint="First cross-functional backlog-to-margin signal without a multi-quarter replatform gate."
          />

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Works directly on existing ERP and CRM data — no prerequisite “clean everything first” science project.",
              "Avoids a long pipeline rebuild before the business sees backlog-to-margin exposure.",
              "Creates finance, ops, and sales visibility on the same governed view of demand vs. fulfillment.",
              "Useful output in days — not months — so the POV proves value before architecture debates take over.",
            ]}
          />
        </div>
      </ValueModelCard>

      <ImpactExplanationModal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        accountLabel={accountName}
        sections={sections}
      />
    </>
  );
}

/* ——— Sagent ——— */

function SagentImpactModel({ accountName, proofPoint }: { accountName: string; proofPoint: string }) {
  const [deployments, setDeployments] = useState(48);
  const [underPct, setUnderPct] = useState(12);
  const [arr, setArr] = useState(420_000);
  const [recoverablePct, setRecoverablePct] = useState(45);
  const [detectDays, setDetectDays] = useState(21);
  const [explainOpen, setExplainOpen] = useState(false);

  const atRiskDeployments = Math.round(deployments * (underPct / 100));
  const arrAtRisk = atRiskDeployments * arr;
  const recoverableArr = arrAtRisk * (recoverablePct / 100);

  const snowflakeEnabled = useMemo(
    () => computeSagentSnowflakeEnabled(recoverableArr, recoverablePct, detectDays, underPct),
    [recoverableArr, recoverablePct, detectDays, underPct]
  );

  const insight = useMemo(() => {
    const adr = formatCurrencyCompact(arrAtRisk);
    const rec = formatCurrencyCompact(recoverableArr);
    if (atRiskDeployments <= 1) {
      return `Even a single at-risk deployment at this ARR density creates ${adr} in ARR exposure. Earlier detection (your current estimate: ${detectDays} days) is the difference between a CS save and a churn story.`;
    }
    return `Across ${formatCount(atRiskDeployments)} at-risk deployments, ARR exposure is about ${adr}, with ${rec} directionally recoverable if issues surface earlier. This is a retention economics conversation — not a feature checklist.`;
  }, [arrAtRisk, atRiskDeployments, detectDays, recoverableArr]);

  const sections: ImpactExplanationSection[] = useMemo(
    () => [
      {
        title: "Total business exposure",
        body: `Across ${formatCount(atRiskDeployments)} underperforming deployments (${formatPercent(underPct)} of ${formatCount(deployments)}), ARR at risk is ${formatCurrencyCompact(arrAtRisk)} at ${formatCurrencyCompact(arr)} average ARR. If ${formatPercent(recoverablePct)} of that exposure is recoverable with earlier detection, recoverable ARR is ${formatCurrencyCompact(recoverableArr)}. Operational detection lag is modeled at ${detectDays} days. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Snowflake-enabled value",
        body: `Directionally ${formatCurrencyCompact(snowflakeEnabled.value)} — about ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of recoverable ARR — is realistically attainable in an initial motion. Snowflake unifies product, CS, and deployment signals so issues surface across customers without heavy custom engineering, which is what makes faster detection economically credible before retention damage sets in.`,
      },
      {
        title: "Why that matters commercially",
        body: `Retention is the board metric. If Dara rollouts drift, ARR leaks quietly — and CS can’t fix what it can’t see across customers. This is a health-and-economics story, not a telemetry flex.`,
      },
      {
        title: "Why this is the right first workload",
        body: `It matches the POV: one ops-owned exception path, measurable cycle-time improvement, and a pilot cohort view CS + Product will defend. Win that, then widen coverage — still anchored to retention economics.`,
      },
    ],
    [
      arr,
      arrAtRisk,
      atRiskDeployments,
      deployments,
      detectDays,
      proofPoint,
      recoverableArr,
      recoverablePct,
      snowflakeEnabled.unlockRatio,
      snowflakeEnabled.value,
      underPct,
    ]
  );

  return (
    <>
      <ValueModelCard
        variant="standalone"
        action={<ExplainButton onClick={() => setExplainOpen(true)} />}
        footer={<DirectionalDisclaimer />}
      >
        <div className="space-y-4">
          <SliderField
            id="sg-deploy"
            label="Number of Dara deployments"
            orientationHint="More deployments scale total ARR at risk when underperformance share is held constant."
            min={10}
            max={200}
            step={1}
            value={deployments}
            onChange={(n) => setDeployments(clamp(Math.round(n), 10, 200))}
            suffix="none"
            formatDisplay={(n) => formatCount(n)}
          />
          <SliderField
            id="sg-under"
            label="Percent underperforming"
            orientationHint="A higher underperforming share increases at-risk deployments and ARR exposure."
            min={3}
            max={35}
            step={1}
            value={underPct}
            onChange={(n) => setUnderPct(clamp(n, 3, 35))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />
          <SliderField
            id="sg-arr"
            label="Average ARR per customer"
            orientationHint="Higher ARR density increases dollars at risk for the same deployment count."
            min={120_000}
            max={1_500_000}
            step={10_000}
            value={arr}
            onChange={(n) => setArr(clamp(n, 120_000, 1_500_000))}
            suffix="$"
            formatDisplay={(n) => `$${formatCurrencyInput(n)}`}
          />
          <SliderField
            id="sg-rec"
            label="Percent of at-risk ARR recoverable with earlier detection"
            orientationHint="Earlier detection increases realistically recoverable ARR."
            min={10}
            max={80}
            step={1}
            value={recoverablePct}
            onChange={(n) => setRecoverablePct(clamp(n, 10, 80))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />
          <SliderField
            id="sg-days"
            label="Time to detect issues (operational)"
            hint="Used to contextualize urgency — not part of the ARR math."
            orientationHint="Shorter detection lag improves how much recoverable ARR is realistic to capture."
            min={5}
            max={60}
            step={1}
            value={detectDays}
            onChange={(n) => setDetectDays(clamp(Math.round(n), 5, 60))}
            suffix="days"
            formatDisplay={(n) => String(n)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <OutputMetricRow label="At-risk deployments" value={formatCount(atRiskDeployments)} />
            <OutputMetricRow label="ARR at risk" value={formatCurrencyCompact(arrAtRisk)} emphasize />
            <OutputMetricRow label="Recoverable ARR" value={formatCurrencyCompact(recoverableArr)} />
          </div>

          <SnowflakeEnabledValueBlock
            title="ARR recoverable with Snowflake"
            valueDisplay={formatCurrencyCompact(snowflakeEnabled.value)}
            portionLine={
              recoverableArr > 0
                ? `≈ ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of recoverable ARR in an initial motion`
                : "No recoverable ARR at these inputs — adjust deployment or recovery assumptions."
            }
            barPercent={recoverableArr > 0 ? snowflakeEnabled.unlockRatio * 100 : 0}
            supportingText="The faster deployment issues become visible across customers, the more realistic it becomes to protect ARR before underperformance turns into retention risk — without slowing active rollouts."
            timeToValueBadge="Weeks, not quarters"
            timeToValueHint="Cross-customer cohort visibility before you fund a slow custom rebuild."
          />

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Unifies product, customer success, and deployment data for cross-customer truth.",
              "Visibility without heavy bespoke engineering — fewer hand-built bridges, faster alignment.",
              "Insight across Dara customers without slowing active rollouts.",
              "Moves you from “quarterly surprises” to weekly operational clarity on what’s failing.",
            ]}
          />
        </div>
      </ValueModelCard>

      <ImpactExplanationModal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        accountLabel={accountName}
        sections={sections}
      />
    </>
  );
}

/* ——— U.S. FinTech ——— */

function UsFintechImpactModel({ accountName, proofPoint }: { accountName: string; proofPoint: string }) {
  const [annualVolume, setAnnualVolume] = useState(2_800_000_000);
  const [anomalyPct, setAnomalyPct] = useState(4);
  const [lossRatePct, setLossRatePct] = useState(0.35);
  const [avoidablePct, setAvoidablePct] = useState(55);
  const [explainOpen, setExplainOpen] = useState(false);

  const volumeImpacted = annualVolume * (anomalyPct / 100);
  const riskExposure = volumeImpacted * (lossRatePct / 100);
  const avoidableRisk = riskExposure * (avoidablePct / 100);

  const snowflakeEnabled = useMemo(
    () => computeFintechSnowflakeEnabled(avoidableRisk, avoidablePct, anomalyPct, lossRatePct),
    [avoidableRisk, avoidablePct, anomalyPct, lossRatePct]
  );

  const insight = useMemo(() => {
    const exp = formatCurrencyCompact(riskExposure);
    const av = formatCurrencyCompact(avoidableRisk);
    return `At this workflow scale, affected volume drives roughly ${exp} in estimated exposure. Faster anomaly surfacing on securitization exceptions can directionally reduce avoidable downstream risk (${av}) — measured, governed, and audit-friendly.`;
  }, [avoidableRisk, riskExposure]);

  const sections: ImpactExplanationSection[] = useMemo(
    () => [
      {
        title: "Total business exposure",
        body: `${formatCurrencyCompact(annualVolume)} annual workflow volume with ${formatPercent(anomalyPct, 1)} affected by anomalies yields ${formatCurrencyCompact(volumeImpacted)} impacted volume. At ${formatPercent(lossRatePct, 2)} estimated loss on affected flow, exposure is ${formatCurrencyCompact(riskExposure)}. If ${formatPercent(avoidablePct)} of that loss is avoidable with faster detection, avoidable risk is ${formatCurrencyCompact(avoidableRisk)}. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Snowflake-enabled value",
        body: `Directionally ${formatCurrencyCompact(snowflakeEnabled.value)} — about ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of avoidable risk — is realistically addressable in an initial motion. Snowflake extends secure sharing on governed data, which reduces detection lag without unnecessary movement or shadow copies — the executive tradeoff in a regulated environment.`,
      },
      {
        title: "Why that matters commercially",
        body: `Secure access isn’t the bottleneck — decision speed under scrutiny is. The risk is downstream exposure that compounds while reporting catches up. The POV is measured: faster anomaly surfacing on a governed slice, not a platform science fair.`,
      },
      {
        title: "Why this is the right first workload",
        body: `One regulatory reporting domain, side-by-side vs. delayed reporting, executive readout tied to lineage and access controls. Prove speed with evidence, then expand the governed footprint — that’s the wedge.`,
      },
    ],
    [
      annualVolume,
      anomalyPct,
      avoidablePct,
      avoidableRisk,
      lossRatePct,
      proofPoint,
      riskExposure,
      snowflakeEnabled.unlockRatio,
      snowflakeEnabled.value,
      volumeImpacted,
    ]
  );

  return (
    <>
      <ValueModelCard
        variant="standalone"
        action={<ExplainButton onClick={() => setExplainOpen(true)} />}
        footer={<DirectionalDisclaimer />}
      >
        <div className="space-y-4">
          <SliderField
            id="ft-vol"
            label="Annual workflow volume"
            hint="Directional volume flowing through the scoped securitization process."
            orientationHint="Higher annual volume scales impacted volume when anomaly share is held constant."
            min={400_000_000}
            max={8_000_000_000}
            step={50_000_000}
            value={annualVolume}
            onChange={(n) => setAnnualVolume(clamp(n, 400_000_000, 8_000_000_000))}
            suffix="$"
            formatDisplay={(n) => `$${formatCurrencyInput(n)}`}
          />
          <SliderField
            id="ft-anom"
            label="Percent of volume affected by anomalies"
            orientationHint="A larger affected share increases downstream exposure."
            min={0.5}
            max={14}
            step={0.5}
            value={anomalyPct}
            onChange={(n) => setAnomalyPct(clamp(n, 0.5, 14))}
            suffix="%"
            formatDisplay={(n) => n.toFixed(1)}
          />
          <SliderField
            id="ft-loss"
            label="Estimated loss rate on affected volume"
            orientationHint="A higher loss rate on affected flow increases total risk exposure."
            min={0.05}
            max={2}
            step={0.05}
            value={lossRatePct}
            onChange={(n) => setLossRatePct(clamp(n, 0.05, 2))}
            suffix="%"
            formatDisplay={(n) => n.toFixed(2)}
          />
          <SliderField
            id="ft-avoid"
            label="Percent of loss avoidable with faster detection"
            orientationHint="Faster anomaly detection increases avoidable risk reduction."
            min={15}
            max={90}
            step={1}
            value={avoidablePct}
            onChange={(n) => setAvoidablePct(clamp(n, 15, 90))}
            suffix="%"
            formatDisplay={(n) => String(n)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <OutputMetricRow label="Volume impacted" value={formatCurrencyCompact(volumeImpacted)} />
            <OutputMetricRow label="Estimated risk exposure" value={formatCurrencyCompact(riskExposure)} emphasize />
            <OutputMetricRow label="Avoidable risk" value={formatCurrencyCompact(avoidableRisk)} />
          </div>

          <SnowflakeEnabledValueBlock
            title="Risk reduction enabled by Snowflake"
            valueDisplay={formatCurrencyCompact(snowflakeEnabled.value)}
            portionLine={
              avoidableRisk > 0
                ? `≈ ${formatPercent(snowflakeEnabled.unlockRatio * 100, 0)} of avoidable risk in an initial motion`
                : "No avoidable risk at these inputs — adjust volume, anomaly, or loss assumptions."
            }
            barPercent={avoidableRisk > 0 ? snowflakeEnabled.unlockRatio * 100 : 0}
            supportingText="In a regulated environment, the value is not just the analytics outcome. It is the ability to act faster without introducing additional architectural risk — extending secure sharing on data you already govern."
            timeToValueBadge="Governed speed"
            timeToValueHint="Reduce detection lag without new data sprawl or ungoverned copies."
          />

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Extends existing secure data sharing — fewer new seams in a regulated environment.",
              "Faster anomaly detection on governed data — evidence leadership can defend.",
              "Avoids unnecessary data movement and duplicate copies just to chase speed.",
              "Supports faster decisions without increasing architectural or compliance risk.",
            ]}
          />
        </div>
      </ValueModelCard>

      <ImpactExplanationModal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        accountLabel={accountName}
        sections={sections}
      />
    </>
  );
}
