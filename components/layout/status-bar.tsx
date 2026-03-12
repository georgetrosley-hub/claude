"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import { formatCurrency } from "@/lib/formatters";
import type { Account } from "@/types";

interface StatusBarProps {
  account: Account;
  accounts: Account[];
  onAccountChange: (id: string) => void;
  pipelineValue: number;
  whitespaceValue: number;
  nextMeeting: string;
  connectedSources: number;
  activeAgents: number;
  openApprovals: number;
}

export function StatusBar({
  account,
  accounts,
  onAccountChange,
  pipelineValue,
  whitespaceValue,
  nextMeeting,
  connectedSources,
  activeAgents,
  openApprovals,
}: StatusBarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-surface-border/35 bg-surface/40 px-6">
      <div className="flex items-center gap-6">
        {/* Account selector */}
        <div className="relative">
          <select
            value={account.id}
            onChange={(e) => onAccountChange(e.target.value)}
            className={cn(
              "appearance-none rounded bg-transparent py-1.5 pr-7 text-[13px] text-text-primary",
              "cursor-pointer border-none focus:outline-none focus:ring-0"
            )}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-surface-elevated text-text-primary">
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-[12px]">
          <span className="text-text-muted">
            <span className="tabular-nums text-text-primary">{formatCurrency(pipelineValue)}</span>
            {" "}pipeline
          </span>
          <span className="text-text-muted">
            <span className="tabular-nums text-claude-coral/90">{formatCurrency(whitespaceValue)}</span>
            {" "}whitespace
          </span>
          <span className="hidden text-text-muted lg:inline">{nextMeeting}</span>
          <span className="text-text-muted">
            <span className="tabular-nums text-text-secondary">{activeAgents}</span>
            {" "}agents
          </span>
          <span className="hidden text-text-muted xl:inline">
            <span className="tabular-nums text-text-secondary">{connectedSources}</span>
            {" "}systems
          </span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-[11px]">
        {openApprovals > 0 ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude-coral/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-claude-coral/70" />
            </span>
            <span className="text-claude-coral/80">
              {openApprovals} approval{openApprovals === 1 ? "" : "s"} open
            </span>
          </>
        ) : (
          <>
            <ClaudeSparkle size={10} className="text-text-faint" />
            <span className="text-[11px] text-text-faint">Ready</span>
          </>
        )}
      </div>
    </header>
  );
}
