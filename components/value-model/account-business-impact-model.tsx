"use client";

import { useMemo, useState } from "react";
import {
  DirectionalDisclaimer,
  InsightBox,
  OutputMetricRow,
  SliderField,
  SnowflakeAttributionBlock,
  TimeToValueRow,
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
        title: "What the numbers imply",
        body: `At these inputs, directionally ${formatCurrencyCompact(revenueAtRisk)} revenue at risk flows to ${formatCurrencyCompact(marginExposure)} margin exposure (${formatPercent(grossMarginPct)} GM) and ${formatCurrencyCompact(recoverableMargin)} recoverable if visibility improves ${formatPercent(improvementPct)} of that exposure — anchored to ${formatCurrencyCompact(backlog)} backlog with ${formatPercent(riskPct)} at-risk. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Why that matters commercially",
        body: `This isn’t “better reporting.” It’s whether finance and ops can see backlog-driven margin exposure before the forecast locks — when trade-offs are still available. That’s the difference between a dashboard and a decision artifact.`,
      },
      {
        title: "Why Snowflake makes this outcome practical",
        body: `The value lands because Snowflake unifies ERP/CRM-backed signals into a governed cross-functional view quickly — without forcing a long pipeline rebuild before leadership sees anything useful. Friction drops, time-to-insight compresses, and the POV stays narrow: a few AI deals, defensible lineage, refresh leadership trusts.`,
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

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Works directly on existing ERP and CRM data — no prerequisite “clean everything first” science project.",
              "Avoids a long pipeline rebuild before the business sees backlog-to-margin exposure.",
              "Creates finance, ops, and sales visibility on the same governed view of demand vs. fulfillment.",
              "Useful output in days — not months — so the POV proves value before architecture debates take over.",
            ]}
          />

          <TimeToValueRow
            headline="Days, not months"
            subline="First cross-functional backlog-to-margin signal without a multi-quarter replatform gate."
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
        title: "What the numbers imply",
        body: `Directionally ${formatCount(atRiskDeployments)} at-risk deployments → ${formatCurrencyCompact(arrAtRisk)} ARR at risk (${formatCurrencyCompact(arr)} avg ARR) → ${formatCurrencyCompact(recoverableArr)} recoverable at ${formatPercent(recoverablePct)}. Detection lag modeled ~${detectDays} days. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Why that matters commercially",
        body: `Retention is the board metric. If Dara rollouts drift, ARR leaks quietly — and CS can’t fix what it can’t see across customers. This is a health-and-economics story, not a telemetry flex.`,
      },
      {
        title: "Why Snowflake makes this outcome practical",
        body: `Snowflake collapses product, CS, and deployment signals into governed cross-customer visibility without a custom engineering program before action is possible. You get speed and alignment: identify the cohort, quantify exposure, then tighten the workflow — without slowing active rollouts.`,
      },
      {
        title: "Why this is the right first workload",
        body: `It matches the POV: one ops-owned exception path, measurable cycle-time improvement, and a pilot cohort view CS + Product will defend. Win that, then widen coverage — still anchored to retention economics.`,
      },
    ],
    [arr, arrAtRisk, atRiskDeployments, detectDays, proofPoint, recoverableArr, recoverablePct, underPct]
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

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Unifies product, customer success, and deployment data for cross-customer truth.",
              "Visibility without heavy bespoke engineering — fewer hand-built bridges, faster alignment.",
              "Insight across Dara customers without slowing active rollouts.",
              "Moves you from “quarterly surprises” to weekly operational clarity on what’s failing.",
            ]}
          />

          <TimeToValueRow
            headline="Weeks, not quarters"
            subline="Cross-customer cohort visibility before you fund a slow custom rebuild."
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

  const insight = useMemo(() => {
    const exp = formatCurrencyCompact(riskExposure);
    const av = formatCurrencyCompact(avoidableRisk);
    return `At this workflow scale, affected volume drives roughly ${exp} in estimated exposure. Faster anomaly surfacing on securitization exceptions can directionally reduce avoidable downstream risk (${av}) — measured, governed, and audit-friendly.`;
  }, [avoidableRisk, riskExposure]);

  const sections: ImpactExplanationSection[] = useMemo(
    () => [
      {
        title: "What the numbers imply",
        body: `${formatCurrencyCompact(annualVolume)} annual flow, ${formatPercent(anomalyPct, 1)} affected → ${formatCurrencyCompact(volumeImpacted)} impacted volume → ${formatCurrencyCompact(riskExposure)} exposure at ${formatPercent(lossRatePct, 2)} loss on affected flow → ${formatCurrencyCompact(avoidableRisk)} avoidable at ${formatPercent(avoidablePct)}. Proof bar: ${proofPoint}.`,
      },
      {
        title: "Why that matters commercially",
        body: `Secure access isn’t the bottleneck — decision speed under scrutiny is. The risk is downstream exposure that compounds while reporting catches up. The POV is measured: faster anomaly surfacing on a governed slice, not a platform science fair.`,
      },
      {
        title: "Why Snowflake makes this outcome practical",
        body: `Snowflake extends existing secure sharing patterns so insights land on governed data without unnecessary new movement or shadow copies. You reduce detection lag without increasing architectural risk — the regulated-environment tradeoff executives actually care about.`,
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

          <InsightBox>{insight}</InsightBox>

          <SnowflakeAttributionBlock
            lines={[
              "Extends existing secure data sharing — fewer new seams in a regulated environment.",
              "Faster anomaly detection on governed data — evidence leadership can defend.",
              "Avoids unnecessary data movement and duplicate copies just to chase speed.",
              "Supports faster decisions without increasing architectural or compliance risk.",
            ]}
          />

          <TimeToValueRow
            headline="Faster decisions on governed data"
            subline="Reduce detection lag without new data sprawl or ungoverned copies."
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
