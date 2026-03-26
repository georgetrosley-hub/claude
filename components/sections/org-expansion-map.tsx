"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { OrgNodeCard } from "@/components/ui/org-node-card";
import { clamp } from "@/lib/value-model-format";
import type { OrgNode, Account, Competitor } from "@/types";

interface OrgExpansionMapProps {
  nodes: OrgNode[];
  account: Account;
  competitors: Competitor[];
}

const departmentOrder = [
  "Engineering",
  "Platform Engineering",
  "Finance",
  "Operations",
  "Security",
  "Data / AI",
  "Product",
] as const;

const defaultUseCases: Record<(typeof departmentOrder)[number], string> = {
  Engineering: "Code generation and review",
  "Platform Engineering": "Internal tooling and docs",
  Finance: "Excel and reporting automation",
  "Data / AI": "Model and data workflows",
  Operations: "Backlog and fulfillment visibility",
  Security: "Governance and audit controls",
  Product: "Specs and roadmap synthesis",
};

const activeStatuses = new Set<OrgNode["status"]>(["engaged", "pilot", "deployed"]);

const statusPriority: Record<OrgNode["status"], number> = {
  deployed: 0,
  pilot: 1,
  engaged: 2,
  identified: 3,
  latent: 4,
};

const laneConfig = [
  {
    id: "active",
    title: "Active motion",
    description: "Departments already in live conversations, pilots, or deployment.",
    emptyState: "No departments are in active motion yet.",
    className: "border-accent/12 bg-accent/[0.04]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => activeStatuses.has(node.status)),
  },
  {
    id: "next",
    title: "Build next",
    description: "Qualified expansion candidates with strong fit but more mapping required.",
    emptyState: "No near-term candidates have been identified yet.",
    className: "border-sky-400/12 bg-sky-400/[0.04]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => node.status === "identified"),
  },
  {
    id: "later",
    title: "Longer-term bets",
    description: "Strategic teams to sequence after the initial wedge is proving out.",
    emptyState: "No longer-term bets are currently queued.",
    className: "border-white/8 bg-white/[0.02]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => node.status === "latent"),
  },
] as const;

export function OrgExpansionMap({ nodes, account }: OrgExpansionMapProps) {
  const normalizedSeed = useMemo<OrgNode[]>(
    () =>
      departmentOrder.map((name) => {
        const existing = nodes.find((node) => node.name === name);
        if (existing) return existing;
        return {
          id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          name,
          useCase: defaultUseCases[name],
          buyingLikelihood: 50,
          arrPotential: 0,
          status: "latent",
          recommendedNextStep: "Map stakeholders",
        };
      }),
    [nodes]
  );

  const [nodeState, setNodeState] = useState<OrgNode[]>(normalizedSeed);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Keep state in sync when the caller provides a different seed list (rare).
  // We intentionally preserve local edits while the user is interacting; reset only when seed identity changes.
  const seedSignature = useMemo(
    () => normalizedSeed.map((n) => `${n.id}:${n.arrPotential}:${n.buyingLikelihood}:${n.status}`).join("|"),
    [normalizedSeed]
  );
  useEffect(() => {
    setNodeState(normalizedSeed);
    setSelectedDeptId(null);
  }, [seedSignature]);

  const normalizedNodes = nodeState;

  const rankedNodes = useMemo(
    () =>
      [...normalizedNodes].sort((a, b) => {
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;
        if (b.arrPotential !== a.arrPotential) return b.arrPotential - a.arrPotential;
        if (b.buyingLikelihood !== a.buyingLikelihood) {
          return b.buyingLikelihood - a.buyingLikelihood;
        }
        return a.name.localeCompare(b.name);
      }),
    [normalizedNodes]
  );

  const activeNodes = rankedNodes.filter((node) => activeStatuses.has(node.status));
  const totalPotential = normalizedNodes.reduce((sum, node) => sum + node.arrPotential, 0);
  const averageLikelihood = Math.round(
    normalizedNodes.reduce((sum, node) => sum + node.buyingLikelihood, 0) / normalizedNodes.length
  );
  const focusNode = rankedNodes[0] ?? normalizedNodes[0];
  const laneGroups = laneConfig.map((lane) => ({
    ...lane,
    nodes: lane.items(rankedNodes),
  }));

  const selectedNode = useMemo(
    () => (selectedDeptId ? normalizedNodes.find((n) => n.id === selectedDeptId) ?? null : null),
    [normalizedNodes, selectedDeptId]
  );

  const updateSelected = (patch: Partial<Pick<OrgNode, "buyingLikelihood" | "arrPotential" | "status">>) => {
    if (!selectedDeptId) return;
    setNodeState((prev) =>
      prev.map((n) => {
        if (n.id !== selectedDeptId) return n;
        return { ...n, ...patch };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-10 sm:space-y-12"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          title="Org expansion map"
          subtitle={`${activeNodes.length} departments in motion · $${totalPotential.toFixed(2)}M total expansion ARR potential`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[12px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Departments in motion
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            {activeNodes.length}
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Pilot, deployed, or actively engaged teams.
          </p>
        </div>

        <div className="rounded-[12px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Expansion ARR
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            ${totalPotential.toFixed(2)}M
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Total across mapped departments.
          </p>
        </div>

        <div className="rounded-[12px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Avg. buying likelihood
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            {averageLikelihood}%
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Average across mapped departments.
          </p>
        </div>

        <div className="rounded-[12px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-accent/65">
            Highest priority
          </p>
          <p className="mt-3 text-[18px] font-semibold tracking-tight text-text-primary">
            {focusNode?.name ?? "No focus area"}
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            {focusNode ? `${focusNode.buyingLikelihood}% likelihood · $${focusNode.arrPotential.toFixed(2)}M ARR` : "Prioritize the first internal wedge."}
          </p>
        </div>
      </div>

      <div className="pt-3" />

      <div className="space-y-10">
        {laneGroups.map((lane, laneIndex) => {
          const isActiveLane = lane.id === "active";
          const isNextLane = lane.id === "next";
          const isLaterLane = lane.id === "later";

          const headerTitle =
            lane.id === "active" ? "ACTIVE MOTION" : lane.id === "next" ? "BUILD NEXT" : "LONGER-TERM";

          return (
            <motion.section
              key={lane.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: laneIndex * 0.06, duration: 0.4 }}
              className={cn(laneIndex === 0 ? "pt-2" : "")}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-[14px] font-semibold tracking-tight text-text-primary">
                      {headerTitle}
                    </p>
                    <span className="rounded-full bg-[#F5F4EE] px-2.5 py-1 text-[12px] font-medium text-text-muted">
                      {lane.nodes.length}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-text-muted">
                    {lane.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {lane.nodes.length > 0 ? (
                  lane.nodes.map((node) => {
                    const isPrimary = isActiveLane && node.name === "Engineering";
                    const isSecondary =
                      isNextLane && (node.name === "Finance" || node.name === "Operations");
                    const isDeemphasized =
                      !isPrimary && !isSecondary && (node.name === "Security" || node.name === "Data / AI" || node.name === "Product");

                    return (
                      <OrgNodeCard
                        key={node.id}
                        node={node}
                        onClick={() => setSelectedDeptId(node.id)}
                        tone={isPrimary ? "primary" : isDeemphasized ? "muted" : "secondary"}
                        className={cn(
                          node.id === selectedDeptId ? "ring-2 ring-accent/20" : "",
                          isPrimary && "md:scale-[1.01]"
                        )}
                      />
                    );
                  })
                ) : (
                  <div className="rounded-[12px] bg-white px-6 py-8 text-[13px] leading-relaxed text-text-muted shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] md:col-span-2">
                    {lane.emptyState}
                  </div>
                )}
              </div>

              {isLaterLane ? (
                <div className="mt-10" />
              ) : (
                <div className="mt-10" />
              )}
            </motion.section>
          );
        })}

        <div className="pt-2" />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[12px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Executive sponsors
            </p>
            <div className="mt-4 space-y-2">
              {account.executiveSponsors.slice(0, 4).map((sponsor) => (
                <div key={sponsor} className="text-[13px] leading-relaxed text-text-secondary">
                  {sponsor}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Key blockers
            </p>
            <div className="mt-4 space-y-2">
              {account.topBlockers.slice(0, 4).map((blocker) => (
                <div key={blocker} className="text-[13px] leading-relaxed text-text-secondary">
                  {blocker}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Best expansion paths
            </p>
            <div className="mt-4 space-y-3">
              {account.topExpansionPaths.slice(0, 3).map((path, index) => (
                <div key={path} className="text-[13px] leading-relaxed text-text-secondary">
                  <span className="mr-2 font-medium text-text-faint">{index + 1}.</span>
                  {path}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2" />

        <div className="rounded-[12px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            Department details (interactive)
          </p>

          {!selectedNode ? (
            <div className="mt-4 rounded-[12px] bg-[#FAF9F5] px-5 py-6 text-[13px] leading-relaxed text-text-muted">
              Click a department card to tune likelihood and ARR potential.
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="rounded-[12px] bg-[#FAF9F5] p-5">
                <p className="text-[14px] font-semibold text-text-primary">{selectedNode.name}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{selectedNode.useCase}</p>
                <p className="mt-3 text-[12px] text-text-muted">
                  Next move: <span className="text-text-secondary">{selectedNode.recommendedNextStep}</span>
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                        Buying likelihood
                      </p>
                      <p className="mt-1 text-[12px] text-text-muted">
                        Directional readiness. Tune based on stakeholder mapping.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-full bg-[#F5F4EE] px-3 py-1.5 text-[12px] text-text-secondary">
                      {selectedNode.buyingLikelihood}%
                    </div>
                  </div>
                  <input
                    className="value-slider w-full"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={selectedNode.buyingLikelihood}
                    onChange={(e) =>
                      updateSelected({
                        buyingLikelihood: clamp(Number(e.target.value), 0, 100),
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                        ARR potential
                      </p>
                      <p className="mt-1 text-[12px] text-text-muted">
                        Directional $M estimate for this department’s motion.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-full bg-[#F5F4EE] px-3 py-1.5 text-[12px] text-text-secondary">
                      ${selectedNode.arrPotential.toFixed(2)}M
                    </div>
                  </div>
                  <input
                    className="value-slider w-full"
                    type="range"
                    min={0}
                    max={0.6}
                    step={0.01}
                    value={selectedNode.arrPotential}
                    onChange={(e) =>
                      updateSelected({
                        arrPotential: clamp(Number(e.target.value), 0, 0.6),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
