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
  const activeAction = actions.find((action) => action.id === activeActionId) ?? null;

  const runAction = (action: ClaudeAction) => {
    setActiveActionId(action.id);
    generation.startStream({
      url: "/api/chat",
      body: {
        messages: [{ role: "user", content: action.prompt }],
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

      {(generation.content || generation.isStreaming) && activeAction && (
        <StreamingContent
          content={generation.content}
          isStreaming={generation.isStreaming}
          onRegenerate={() => runAction(activeAction)}
          label={activeAction.label}
          className="mt-5"
        />
      )}
    </section>
  );
}
