"use client";

import { useMemo, useState } from "react";
import {
  DirectionalDisclaimer,
  InsightBox,
  OutputMetricRow,
  SliderField,
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
        "inline-flex w-full items-center justify-center rounded-lg border border-accent/28 bg-accent/[0.08] px-3 py-2",
        "text-[11px] font-semibold text-accent transition-colors hover:bg-accent/[0.12] sm:w-auto"
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
        title: "What this model means",
        body: `Directionally: ${formatCurrencyCompact(revenueAtRisk)} revenue at risk → ${formatCurrencyCompact(marginExposure)} margin exposure (${formatPercent(grossMarginPct)} GM) → ${formatCurrencyCompact(recoverableMargin)} recoverable at ${formatPercent(improvementPct)} of that exposure. Inputs: ${formatCurrencyCompact(backlog)} backlog, ${formatPercent(riskPct)} at-risk. Proof: ${proofPoint}.`,
      },
      {
        title: "Why the business impact matters",
        body: `When demand outpaces execution, the failure mode isn’t “more AI revenue” — it’s margin surprise and forecast credibility. This framing keeps the conversation on CFO-relevant outcomes: timing, margin bridge, and decision-grade reporting.`,
      },
      {
        title: "How Snowflake helps solve it",
        body: `Snowflake becomes the governed layer that joins order, backlog, and fulfillment signals to margin logic — so leadership sees exposure as it forms, not after reporting cycles reconcile. The workload is narrow: a few AI deals, decision-grade lineage, and a refresh cadence executives trust.`,
      },
      {
        title: "Why this is a strong first workload",
        body: `It’s scoped, measurable, and directly tied to the POV: unified visibility from order → backlog → fulfillment → margin. Win here, and expansion is portfolio coverage and executive Q&A on governed data — not a platform debate.`,
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
        title="Business Impact Model"
        subtitle="Quantify the margin exposure created by backlog and fulfillment risk on AI deals."
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
        title: "What this model means",
        body: `Directionally: ${formatCount(atRiskDeployments)} at-risk deployments, ${formatCurrencyCompact(arrAtRisk)} ARR at risk (${formatCurrencyCompact(arr)} avg ARR), ${formatCurrencyCompact(recoverableArr)} recoverable at ${formatPercent(recoverablePct)}. Detection lag modeled ~${detectDays} days. Proof: ${proofPoint}.`,
      },
      {
        title: "Why the business impact matters",
        body: `Dara can be “built” and still fail in market if deployments drift. Boards don’t reward launches; they reward retention, expansion, and predictable outcomes. This keeps the POV tied to customer health and revenue protection.`,
      },
      {
        title: "How Snowflake helps solve it",
        body: `Snowflake operationalizes deployment and exception signals into a governed ops mart — so teams align on which customers are off-track, why, and what it costs. The motion is commercially sharp: identify the cohort, quantify exposure, then tighten the workflow.`,
      },
      {
        title: "Why this is a strong first workload",
        body: `It’s narrow, time-boxed, and aligned to your execution plan: one ops-owned workflow, measurable cycle-time improvement, and a dashboard CS + Product can trust for the pilot cohort.`,
      },
    ],
    [arr, arrAtRisk, atRiskDeployments, detectDays, proofPoint, recoverableArr, recoverablePct, underPct]
  );

  return (
    <>
      <ValueModelCard
        title="Business Impact Model"
        subtitle="Estimate the ARR and retention exposure tied to underperforming Dara deployments."
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
        title: "What this model means",
        body: `Directionally: ${formatCurrencyCompact(volumeImpacted)} impacted volume → ${formatCurrencyCompact(riskExposure)} exposure (${formatPercent(lossRatePct, 2)} loss on affected flow) → ${formatCurrencyCompact(avoidableRisk)} avoidable at ${formatPercent(avoidablePct)}. Baseline: ${formatCurrencyCompact(annualVolume)} annual flow, ${formatPercent(anomalyPct, 1)} affected. Proof: ${proofPoint}.`,
      },
      {
        title: "Why the business impact matters",
        body: `You already have secure access to data — the constraint is decision speed under scrutiny. Regulators and boards care about control and evidence, not “more dashboards.” This model keeps the POV in risk and operating terms.`,
      },
      {
        title: "How Snowflake helps solve it",
        body: `Snowflake becomes the governed path from curated marts to published KPIs — with lineage and access controls leadership can defend. The POV compares anomaly detection speed against the current reporting cycle on a scoped workflow slice.`,
      },
      {
        title: "Why this is a strong first workload",
        body: `It’s aligned to your plan: one regulatory reporting domain, side-by-side proof, and an executive readout that ties speed to audit-ready evidence — the wedge for broader governed expansion.`,
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
        title="Business Impact Model"
        subtitle="Illustrate the risk reduction opportunity from faster anomaly detection on securitization workflows."
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
