"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { OrgExpansionMap } from "@/components/sections/org-expansion-map";
import type { OrgNode } from "@/types";

const CIENA_EXPANSION_NODES: OrgNode[] = [
  {
    id: "blue-planet-engineering",
    name: "Engineering",
    useCase: "Claude Code: agentic dev, review acceleration, onboarding",
    buyingLikelihood: 82,
    arrPotential: 0.18,
    status: "pilot",
    recommendedNextStep: "Pick one sprint + baseline cycle-time metrics",
  },
  {
    id: "platform-eng",
    name: "Platform Engineering",
    useCase: "Internal tooling, repo-aware docs, golden-path automation",
    buyingLikelihood: 72,
    arrPotential: 0.14,
    status: "engaged",
    recommendedNextStep: "Map dev productivity KPIs + leaders",
  },
  {
    id: "security",
    name: "Security",
    useCase: "Governance, access controls, audit trail, safe usage policy",
    buyingLikelihood: 66,
    arrPotential: 0.12,
    status: "identified",
    recommendedNextStep: "Define enterprise guardrails + rollout controls",
  },
  {
    id: "it",
    name: "IT",
    useCase: "Provisioning workflow + SSO/SCIM rollout planning",
    buyingLikelihood: 58,
    arrPotential: 0.08,
    status: "latent",
    recommendedNextStep: "Sequence identity + device posture requirements",
  },
  {
    id: "finance",
    name: "Finance",
    useCase: "Forecast automation + backlog risk analysis under new CFO",
    buyingLikelihood: 76,
    arrPotential: 0.22,
    status: "identified",
    recommendedNextStep: "Define 2–3 deal cohort + margin exposure POV",
  },
  {
    id: "legal",
    name: "Legal",
    useCase: "Policy + contract review with auditable controls",
    buyingLikelihood: 54,
    arrPotential: 0.06,
    status: "latent",
    recommendedNextStep: "Package procurement/security artifacts",
  },
  {
    id: "operations",
    name: "Operations",
    useCase: "Backlog intelligence + fulfillment-to-margin visibility",
    buyingLikelihood: 70,
    arrPotential: 0.18,
    status: "identified",
    recommendedNextStep: "Align on ‘single version of backlog truth’",
  },
  {
    id: "customer-support",
    name: "Customer Support",
    useCase: "Internal KB search + ticket summarization",
    buyingLikelihood: 52,
    arrPotential: 0.06,
    status: "latent",
    recommendedNextStep: "Quantify handle-time + deflection upside",
  },
  {
    id: "product",
    name: "Product",
    useCase: "PRDs/spec generation + competitive synthesis",
    buyingLikelihood: 56,
    arrPotential: 0.08,
    status: "latent",
    recommendedNextStep: "Tie to roadmap velocity and doc quality",
  },
  {
    id: "data-ai",
    name: "Data / AI",
    useCase: "RFP ingestion + technical analysis at 1M-token context",
    buyingLikelihood: 64,
    arrPotential: 0.1,
    status: "identified",
    recommendedNextStep: "Pilot on one RFP response cycle",
  },
  {
    id: "exec",
    name: "Executive Leadership",
    useCase: "Cross-functional synthesis + board-ready reporting",
    buyingLikelihood: 60,
    arrPotential: 0.08,
    status: "latent",
    recommendedNextStep: "Define executive readout cadence + KPIs",
  },
];

export function ExpansionSection() {
  // OrgExpansionMap requires account/competitors today; we’ll pass light, safe placeholders.
  // The component will be refactored to client-only interaction and will not call APIs.
  const account = {
    id: "ciena",
    name: "Ciena",
    firstWedge: "Land with Claude Code in Blue Planet engineering and prove measurable sprint velocity gain in 2 weeks.",
    executiveSponsors: ["VP Engineering (Blue Planet)", "CFO / FP&A leader", "Director Sales Ops", "CIO / CISO"],
    topBlockers: ["Security & governance requirements", "Procurement sequencing", "Change management at scale"],
    topExpansionPaths: [
      "Engineering wedge → FP&A (forecast automation) → Sales Ops (backlog intelligence) → enterprise rollout",
      "Engineering wedge → RFP response acceleration → GTM enablement → broader knowledge workflows",
      "Security governance first → controlled pilots → scale with SSO/SCIM + auditability",
    ],
    estimatedLandValue: 0.12,
    estimatedExpansionValue: 2.1,
    employeeCount: 9000,
  } as const;

  return (
    <section id="expansion" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeader
        title="Expansion map"
        subtitle="From engineering wedge to enterprise rollout. Click departments and tune ARR/likelihood to explore sequencing."
      />
      <OrgExpansionMap nodes={CIENA_EXPANSION_NODES} account={account as any} competitors={[]} />
    </section>
  );
}

