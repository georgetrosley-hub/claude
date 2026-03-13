"use client";

import { useState } from "react";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

interface ClaudeAction {
  id: string;
  label: string;
  prompt: string;
}

interface ClaudeActionBarProps {
  title: string;
  subtitle?: string;
  account: Account;
  competitors: Competitor[];
  actions: ClaudeAction[];
  className?: string;
}

export function ClaudeActionBar({
  title,
  subtitle,
  account,
  competitors,
  actions,
  className,
}: ClaudeActionBarProps) {
  const generation = useStreaming();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const activeAction = actions.find((action) => action.id === activeActionId) ?? null;

  const runAction = (action: ClaudeAction) => {
    setActiveActionId(action.id);
    setActiveLabel(action.label);
    generation.startStream({
      url: "/api/chat",
      body: {
        messages: [{ role: "user", content: action.prompt }],
        account,
        competitors,
      },
    });
  };

  const runCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    setActiveActionId(null);
    setActiveLabel("Custom question");
    generation.startStream({
      url: "/api/chat",
      body: {
        messages: [{ role: "user", content: trimmed }],
        account,
        competitors,
      },
    });
  };

  return (
    <section className={cn("rounded-[28px] border-2 border-claude-coral/40 bg-claude-coral/[0.08] p-5 sm:p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-claude-coral/[0.12]">
          <ClaudeSparkle size={14} className="text-claude-coral" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text-primary">{title}</p>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => runAction(action)}
            className={cn(
              "rounded-lg border-2 px-4 py-2.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-claude-coral/40 focus-visible:ring-offset-2",
              activeActionId === action.id
                ? "border-claude-coral bg-claude-coral/[0.12] text-claude-coral shadow-sm"
                : "border-surface-border bg-surface-muted/40 text-text-primary hover:border-claude-coral/50 hover:bg-claude-coral/[0.06] hover:text-claude-coral/90"
            )}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint/80">
            Or ask Claude something else
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              value={customText}
              onChange={(event) => setCustomText(event.target.value)}
              rows={2}
              placeholder="e.g. Pressure-test this update, write follow-up messaging, or ask for a different angle on the deal..."
              className="w-full resize-none rounded-[18px] border border-surface-border/40 bg-surface px-3 py-2 text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:border-claude-coral/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={runCustom}
              className="shrink-0 rounded-[999px] border border-claude-coral/30 bg-claude-coral/90 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-claude-coral"
            >
              Ask Claude
            </button>
          </div>
        </div>
      </div>

      {(generation.content || generation.isStreaming) && (
        <StreamingContent
          content={generation.content}
          isStreaming={generation.isStreaming}
          onRegenerate={activeAction ? () => runAction(activeAction) : undefined}
          label={activeLabel ?? activeAction?.label}
          className="mt-5"
        />
      )}
    </section>
  );
}
