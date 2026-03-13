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
    <section className={cn("rounded-[28px] border border-white/8 bg-white/[0.03] p-5 sm:p-6", className)}>
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
              "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
              activeActionId === action.id
                ? "border-claude-coral/20 bg-claude-coral/[0.10] text-claude-coral"
                : "border-white/10 bg-white/[0.04] text-text-secondary hover:bg-white/[0.06]"
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
