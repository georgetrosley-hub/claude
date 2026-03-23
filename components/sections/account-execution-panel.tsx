"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Check,
  Clipboard,
  Loader2,
  Play,
  RefreshCw,
  Workflow,
} from "lucide-react";
import { useApiKey } from "@/app/context/api-key-context";
import { useApp } from "@/app/context/app-context";
import { useTerritoryData } from "@/app/context/territory-data-context";
import { useToast } from "@/app/context/toast-context";
import type { PriorityAccount } from "@/data/territory-data";
import { cn } from "@/lib/utils";
import { readApiErrorMessage } from "@/lib/client/api";

type PhaseId = "brief" | "discovery" | "pov" | "expansion";

type ActionId =
  | "account_brief"
  | "discovery_questions"
  | "pov_plan"
  | "signals_summary"
  | "exec_followup"
  | "stakeholder_map";

const PROMPT_TYPE: Record<ActionId, string> = {
  account_brief: "ae_account_brief",
  discovery_questions: "ae_discovery_questions",
  pov_plan: "ae_pov_plan",
  signals_summary: "ae_signals_summary",
  exec_followup: "ae_exec_followup",
  stakeholder_map: "ae_stakeholder_map",
};

type ActionDef = {
  id: ActionId;
  label: string;
  tab: string;
  phase: PhaseId;
};

const ACTIONS: ActionDef[] = [
  { id: "account_brief", label: "Account brief", tab: "Brief", phase: "brief" },
  {
    id: "discovery_questions",
    label: "Discovery questions",
    tab: "Discovery",
    phase: "discovery",
  },
  { id: "pov_plan", label: "POV plan", tab: "POV", phase: "pov" },
  {
    id: "signals_summary",
    label: "Signal summary",
    tab: "Signals",
    phase: "expansion",
  },
  {
    id: "exec_followup",
    label: "Exec follow-up",
    tab: "Follow-up",
    phase: "expansion",
  },
  {
    id: "stakeholder_map",
    label: "Map stakeholders",
    tab: "Stakeholders",
    phase: "expansion",
  },
];

const PHASE_ORDER: { id: PhaseId; label: string }[] = [
  { id: "brief", label: "Brief" },
  { id: "discovery", label: "Discovery" },
  { id: "pov", label: "POV" },
  { id: "expansion", label: "Expansion" },
];

function phaseComplete(
  phase: PhaseId,
  outputs: Partial<Record<ActionId, string>>
): boolean {
  const ids = ACTIONS.filter((a) => a.phase === phase).map((a) => a.id);
  return ids.every((id) => Boolean(outputs[id]?.trim()));
}

function buildTerritoryContext(
  priority: PriorityAccount | undefined,
  accountId: string,
  signals: { timestamp: string; account: string; text: string }[],
  activities: { timestamp: string; account: string; text: string }[]
): string {
  const lines: string[] = [];

  if (priority) {
    lines.push(
      "## Territory profile",
      `- Account: ${priority.name} (${priority.industry})`,
      `- Status: ${priority.status}`,
      `- Why it matters: ${priority.whyMatters}`,
      `- Expansion wedge: ${priority.expansionWedge}`,
      `- Confirm first: ${priority.confirmFirst}`,
      `- Working hypothesis: ${priority.povHypothesis}`,
      `- Next action (baseline): ${priority.nextAction}`,
      `- Competitive context: ${priority.competitiveContext.join(" · ")}`,
      `- Current motion: ${priority.currentMotion}`
    );
  }

  const scopedSignals = signals.filter((s) => s.account === accountId).slice(0, 8);
  const scopedActivity = activities.filter((a) => a.account === accountId).slice(0, 8);

  lines.push("", "## Recent signals (curated log)");
  if (scopedSignals.length === 0) {
    lines.push("- None logged for this account in the tracker.");
  } else {
    for (const s of scopedSignals) {
      lines.push(`- ${s.timestamp}: ${s.text}`);
    }
  }

  lines.push("", "## Recent activity");
  if (scopedActivity.length === 0) {
    lines.push("- None logged for this account in the feed.");
  } else {
    for (const a of scopedActivity) {
      lines.push(`- ${a.timestamp}: ${a.text}`);
    }
  }

  return lines.join("\n");
}

const mdComponents = {
  h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-3 first:mt-0 text-[13px] font-semibold text-text-primary" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-3 first:mt-0 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-faint"
      {...props}
    />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-2 first:mt-0 text-[12px] font-semibold text-text-primary" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mt-2 first:mt-0 text-[12px] leading-relaxed text-text-secondary" {...props} />
  ),
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-2 list-disc space-y-1 pl-4" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-2 list-decimal space-y-1 pl-4" {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<"li">) => (
    <li className="text-[12px] leading-relaxed text-text-secondary" {...props} />
  ),
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="mt-2 overflow-x-auto rounded-lg border border-surface-border/40">
      <table className="min-w-full border-collapse text-left text-[11px]" {...props} />
    </div>
  ),
  thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-surface-muted/40 text-[10px] uppercase tracking-wide text-text-faint" {...props} />
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => (
    <th className="border-b border-surface-border/40 px-2 py-1.5 font-medium" {...props} />
  ),
  td: (props: React.ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-surface-border/30 px-2 py-1.5 text-text-secondary" {...props} />
  ),
  code: (props: React.ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-surface-muted/50 px-1 py-0.5 font-mono text-[11px] text-text-primary" {...props} />
  ),
};

export function AccountExecutionPanel() {
  const { account, competitors } = useApp();
  const { signals, activities, priorityAccounts } = useTerritoryData();
  const { hasApiKey, getRequestHeaders } = useApiKey();
  const { showToast } = useToast();

  const priority = useMemo(
    () => priorityAccounts.find((p) => p.id === account.id),
    [account.id, priorityAccounts]
  );

  const territoryContext = useMemo(
    () => buildTerritoryContext(priority, account.id, signals, activities),
    [priority, account.id, signals, activities]
  );

  const [viewing, setViewing] = useState<ActionId | null>(null);
  const [outputs, setOutputs] = useState<Partial<Record<ActionId, string>>>({});
  const [loading, setLoading] = useState<ActionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    setOutputs({});
    setViewing(null);
    setLoading(null);
    setError(null);
  }, [account.id]);

  const readyCount = useMemo(
    () => ACTIONS.filter((a) => Boolean(outputs[a.id]?.trim())).length,
    [outputs]
  );

  const runAction = useCallback(
    async (actionId: ActionId) => {
      setViewing(actionId);
      setError(null);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(actionId);
      setOutputs((prev) => {
        const next = { ...prev };
        delete next[actionId];
        return next;
      });

      let assembled = "";

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getRequestHeaders(),
          },
          body: JSON.stringify({
            type: PROMPT_TYPE[actionId],
            account,
            competitors,
            context: territoryContext,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await readApiErrorMessage(response));
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as { text?: string };
              if (parsed.text) {
                assembled += parsed.text;
                setOutputs((prev) => ({ ...prev, [actionId]: assembled }));
              }
            } catch {
              // skip malformed frames
            }
          }
        }

        setOutputs((prev) => ({ ...prev, [actionId]: assembled.trim() }));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Could not complete this run.");
      } finally {
        setLoading(null);
        abortRef.current = null;
      }
    },
    [account, competitors, getRequestHeaders, territoryContext]
  );

  const copyOutput = useCallback(
    async (actionId: ActionId) => {
      const text = outputs[actionId];
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
      } catch {
        showToast("Copy failed");
      }
    },
    [outputs, showToast]
  );

  const selectAction = useCallback((id: ActionId) => {
    setViewing(id);
    setError(null);
  }, []);

  const activeDef = viewing ? ACTIONS.find((a) => a.id === viewing) : null;
  const activeOutput = viewing ? outputs[viewing] : null;
  const isLoading = loading !== null;
  const loadingThis = viewing !== null && loading === viewing;

  const tabTargets = useMemo(() => {
    const withContent = ACTIONS.filter((a) => outputs[a.id]?.trim());
    if (viewing && !withContent.find((a) => a.id === viewing)) {
      return [...withContent, ACTIONS.find((a) => a.id === viewing)!];
    }
    return withContent;
  }, [outputs, viewing]);

  return (
    <section
      className="scroll-mt-24 rounded-2xl border border-surface-border/50 bg-surface-elevated/35 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
      aria-label="Execution runbook"
    >
      <div className="border-b border-surface-border/40 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border/50 bg-surface-muted/30">
              <Workflow className="h-4 w-4 text-accent" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold tracking-tight text-text-primary">
                Runbook
              </h2>
              <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-text-muted">
                Brief → discovery → POV → expansion. Pick a step, run, copy into CRM or email.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-surface-border/50 bg-surface-muted/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-text-faint">
              {account.name}
            </span>
            <span className="rounded-full border border-surface-border/40 px-2.5 py-1 text-[10px] font-medium tabular-nums text-text-muted">
              {readyCount}/{ACTIONS.length} ready
            </span>
          </div>
        </div>

        {!hasApiKey && (
          <p className="mt-3 rounded-lg border border-accent/20 bg-accent/[0.06] px-3 py-2 text-[11px] text-accent/95">
            Add your API key in the header to run steps. Outputs stay in this session until refresh or account
            change.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2" aria-hidden>
          {PHASE_ORDER.map((p, i) => {
            const complete = phaseComplete(p.id, outputs);
            return (
              <div key={p.id} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && (
                  <span className="hidden h-px w-4 bg-surface-border/50 sm:block sm:w-6" />
                )}
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                    complete
                      ? "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-300/95"
                      : "border-surface-border/45 bg-surface-muted/20 text-text-faint"
                  )}
                >
                  {complete ? (
                    <Check className="h-3 w-3 shrink-0" strokeWidth={2.4} />
                  ) : (
                    <span className="flex h-3 w-3 items-center justify-center rounded-full border border-surface-border/60 text-[8px] text-text-faint">
                      {i + 1}
                    </span>
                  )}
                  {p.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(200px,248px)_1fr] lg:divide-x lg:divide-surface-border/40">
        <div className="max-h-[min(52vh,420px)] overflow-y-auto p-3 sm:p-4 lg:max-h-none lg:overflow-visible">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-faint">Run steps</p>
          <div className="mt-2 space-y-4">
            {PHASE_ORDER.map((phase) => {
              const phaseActions = ACTIONS.filter((a) => a.phase === phase.id);
              return (
                <div key={phase.id}>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-faint/90">
                    {phase.label}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {phaseActions.map((a) => {
                      const done = Boolean(outputs[a.id]?.trim());
                      const running = loading === a.id;
                      const selected = viewing === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => selectAction(a.id)}
                          className={cn(
                            "flex w-full items-start justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25",
                            selected
                              ? "border-accent/35 bg-accent/[0.07] text-text-primary"
                              : "border-surface-border/40 bg-surface-muted/15 text-text-secondary hover:border-accent/20",
                            running && "ring-1 ring-accent/25"
                          )}
                        >
                          <span className="min-w-0 leading-snug">{a.label}</span>
                          <span className="flex shrink-0 items-center gap-1 pt-0.5">
                            {running && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden />
                            )}
                            {done && !running && (
                              <Check className="h-3.5 w-3.5 text-emerald-400/90" strokeWidth={2.2} aria-hidden />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-[300px] flex-col border-t border-surface-border/35 lg:border-t-0">
          {!viewing && (
            <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6">
              <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-surface-border/55 bg-surface-muted/[0.10] px-6 py-9 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border/50 bg-surface-elevated/20">
                  <Workflow className="h-4 w-4 text-accent" strokeWidth={1.8} />
                </div>
                <p className="text-[13px] font-medium text-text-primary">No step selected</p>
                <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-text-muted">
                  Choose a run step on the left: brief, discovery, POV, or expansion outputs. Copy-ready for
                  reviews and follow-ups.
                </p>
              </div>
            </div>
          )}

          {viewing && activeDef && (
            <>
              <div className="border-b border-surface-border/35 px-3 py-2 sm:px-4">
                {tabTargets.length > 0 && (
                  <div className="mb-2 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tabTargets.map((t) => {
                      const active = viewing === t.id;
                      const has = Boolean(outputs[t.id]?.trim());
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => selectAction(t.id)}
                          className={cn(
                            "shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25",
                            active
                              ? "border-accent/35 bg-accent/[0.10] text-accent ring-1 ring-accent/15"
                              : "border-surface-border/45 bg-surface-muted/20 text-text-muted hover:bg-surface-muted/30 hover:border-surface-border/60",
                            has && !active && "text-text-secondary"
                          )}
                        >
                          {t.tab}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-faint">Output</p>
                    <p className="truncate text-[12px] font-semibold text-text-primary">{activeDef.label}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void copyOutput(viewing)}
                      disabled={!activeOutput || loadingThis}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60",
                        activeOutput && !loadingThis
                          ? "border-surface-border/50 bg-surface-muted/25 text-text-secondary hover:border-accent/25 hover:text-text-primary"
                          : "cursor-not-allowed border-surface-border/35 text-text-faint"
                      )}
                    >
                      <Clipboard className="h-3.5 w-3.5" strokeWidth={2} />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => void runAction(viewing)}
                      disabled={!hasApiKey || isLoading}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60",
                        hasApiKey && !isLoading
                          ? "border-accent/30 bg-accent/[0.1] text-accent hover:bg-accent/[0.14]"
                          : "cursor-not-allowed border-surface-border/40 text-text-faint"
                      )}
                    >
                      {activeOutput ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                          Rerun
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" strokeWidth={2} />
                          Run
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {loadingThis && (
                <div className="relative h-0.5 w-full overflow-hidden bg-surface-border/35">
                  <motion.div
                    className="absolute inset-y-0 w-[28%] bg-gradient-to-r from-transparent via-accent/45 to-transparent"
                    initial={false}
                    animate={{ x: ["-30%", "380%"] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}

              <div className="max-h-[min(440px,56vh)] flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                {error && (
                  <p className="rounded-lg border border-rose-400/25 bg-rose-500/[0.08] px-3 py-2 text-[12px] text-rose-200/95">
                    {error}
                  </p>
                )}

                {loadingThis && !activeOutput && (
                  <div className="space-y-3 pt-1" aria-busy>
                    <div className="space-y-2 rounded-lg border border-surface-border/35 bg-surface-muted/10 p-3">
                      <div className="h-2 w-1/3 rounded bg-surface-muted/55 animate-pulse" />
                      <div className="h-2 w-full rounded bg-surface-muted/45 animate-pulse" />
                      <div className="h-2 w-5/6 rounded bg-surface-muted/40 animate-pulse" />
                    </div>
                    <div className="space-y-2 rounded-lg border border-surface-border/35 bg-surface-muted/10 p-3">
                      <div className="h-2 w-2/5 rounded bg-surface-muted/50 animate-pulse" />
                      <div className="h-2 w-full rounded bg-surface-muted/38 animate-pulse" />
                      <div className="h-2 w-4/5 rounded bg-surface-muted/35 animate-pulse" />
                      <div className="h-2 w-3/5 rounded bg-surface-muted/32 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-text-faint">
                      Generating output…
                    </p>
                  </div>
                )}

                {activeOutput && (
                  <article className="min-w-0 rounded-lg border border-surface-border/30 bg-surface-muted/[0.07] p-3 sm:p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {activeOutput}
                    </ReactMarkdown>
                  </article>
                )}

                {!loadingThis && !activeOutput && !error && (
                  <div className="rounded-lg border border-surface-border/45 bg-surface-muted/[0.12] px-4 py-5 text-center sm:px-5">
                    <p className="text-[12px] leading-relaxed text-text-secondary">
                      Select <span className="font-medium text-text-primary">Run</span> to generate copy-ready
                      markdown for this account.
                    </p>
                    {!hasApiKey && (
                      <p className="mt-2 text-[11px] text-text-faint">API key required in the header.</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
