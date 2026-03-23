"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  KeyRound,
  Menu,
  MessageCircle,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useApiKey } from "@/app/context/api-key-context";
import { useTheme } from "@/app/context/theme-context";
import { cn } from "@/lib/utils";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
import type { Account } from "@/types";
import type { DealHealthSummary } from "@/lib/deal-health";

interface StatusBarProps {
  account: Account;
  accounts: Account[];
  onAccountChange: (id: string) => void;
  signalCount: number;
  pendingDecisions: number;
  oversightStatus: "active" | "idle";
  dealHealth?: DealHealthSummary;
  onOpenChat?: () => void;
  onOpenMobileNav: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function StatusBar({
  account,
  accounts,
  onAccountChange,
  signalCount,
  pendingDecisions,
  oversightStatus,
  dealHealth,
  onOpenChat,
  onOpenMobileNav,
  sidebarCollapsed,
  onToggleSidebar,
}: StatusBarProps) {
  const { apiKey, hasApiKey, isReady, setApiKey, clearApiKey } = useApiKey();
  const { theme, toggleTheme } = useTheme();
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [draftApiKey, setDraftApiKey] = useState("");

  useEffect(() => {
    if (isApiKeyOpen) {
      setDraftApiKey(apiKey);
    }
  }, [apiKey, isApiKeyOpen]);

  return (
    <>
      <header className="relative z-10 shrink-0 border-b border-surface-border/45 bg-surface/90 px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-nav backdrop-blur-md sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" aria-hidden />
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="ds-focus-ring touch-target inline-flex h-9 w-9 min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-primary active:scale-[0.97] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleSidebar}
              className="ds-focus-ring hidden h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-primary active:scale-[0.97] lg:inline-flex"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border/45 bg-surface-muted/20 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
                <SnowflakeLogoIcon size={20} className="opacity-95" />
              </span>
              <div className="hidden sm:block">
                <span className="text-[13px] font-semibold tracking-tight text-text-primary">Field Console</span>
                <span className="ml-2 text-[11px] font-medium text-text-faint">Enterprise AE</span>
              </div>
            </div>

            <div className="hidden h-5 w-px bg-surface-border/55 sm:block" aria-hidden />

            <div className="relative hidden min-w-[168px] sm:block">
              <select
                value={account.id}
                onChange={(e) => onAccountChange(e.target.value)}
                className="ds-focus-ring w-full cursor-pointer appearance-none rounded-lg border border-surface-border/40 bg-surface-muted/15 py-2 pl-3 pr-8 text-[12px] font-medium text-text-secondary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset] transition-colors duration-150 hover:border-surface-border/60 hover:bg-surface-muted/25 hover:text-text-primary"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-surface-elevated text-text-primary">
                    {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {oversightStatus === "active" && (
              <span className="hidden items-center gap-1.5 rounded-md border border-accent/20 bg-accent/[0.08] px-2.5 py-1 text-[11px] font-medium text-accent shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_6px_rgb(41_181_232/0.5)]" />
                {pendingDecisions} open decisions
              </span>
            )}
            {dealHealth && (
              <span
                className={`hidden rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-block ${
                  dealHealth.status === "healthy"
                    ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400/95"
                    : dealHealth.status === "attention"
                      ? "border-accent/20 bg-accent/[0.08] text-accent/95"
                      : "border-rose-500/20 bg-rose-500/[0.08] text-rose-400/95"
                }`}
                title={dealHealth.reason}
              >
                {dealHealth.label}
              </span>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="ds-focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-primary active:scale-[0.97]"
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsApiKeyOpen(true)}
              className={cn(
                "ds-focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-colors duration-150",
                hasApiKey
                  ? "border border-accent/15 bg-accent/[0.06] text-accent/95 hover:border-accent/25 hover:bg-accent/[0.1]"
                  : "text-text-muted hover:bg-surface-muted/45 hover:text-text-secondary"
              )}
            >
              <KeyRound className="h-3 w-3" />
              <span className="hidden sm:inline">{isReady && hasApiKey ? "AI" : "API"}</span>
            </button>
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="ds-focus-ring flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent/[0.12] px-3 py-2 text-[11px] font-semibold text-accent shadow-[0_1px_0_rgb(255_255_255/0.06)_inset] transition-all duration-200 hover:border-accent/35 hover:bg-accent/[0.18] active:scale-[0.98]"
              >
                <MessageCircle className="h-3 w-3" strokeWidth={2} />
                Deal Desk
              </button>
            )}
          </div>
        </div>
      </header>

      {isApiKeyOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 py-10 backdrop-blur-[2px] sm:py-24">
          <div className="w-full max-w-md rounded-2xl border border-surface-border/50 bg-surface-elevated shadow-panel">
            <div className="flex items-center justify-between border-b border-surface-border/45 px-5 py-4">
              <div className="flex items-center gap-3">
                <SnowflakeLogoIcon size={24} className="shrink-0 opacity-90" />
                <div>
                  <p className="text-[13px] font-medium text-text-primary">API Key</p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Required for Deal Desk and runbook.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyOpen(false)}
                className="rounded-md p-1.5 text-text-muted hover:bg-surface-muted/40 hover:text-text-secondary transition-colors"
                aria-label="Close API key dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="space-y-2">
                <label htmlFor="api-key-input" className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                  API Key
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  value={draftApiKey}
                  onChange={(e) => setDraftApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full rounded-lg border border-surface-border/50 bg-surface px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-accent/30 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-surface/60 px-3 py-2 text-[11px] text-text-secondary">
                {hasApiKey ? "Saved. Ready for Deal Desk." : "Add key to enable Deal Desk."}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    clearApiKey();
                    setDraftApiKey("");
                  }}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-text-muted hover:bg-surface-muted/30 hover:text-text-secondary transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear key
                </button>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyOpen(false)}
                    className="rounded-md px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-muted/30 hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey(draftApiKey);
                      setIsApiKeyOpen(false);
                    }}
                    disabled={!draftApiKey.trim()}
                    className={cn(
                      "rounded-md px-3 py-2 text-[11px] font-medium transition-colors",
                      draftApiKey.trim()
                        ? "bg-accent/90 text-white hover:bg-accent"
                        : "bg-surface-muted/50 text-text-muted"
                    )}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
