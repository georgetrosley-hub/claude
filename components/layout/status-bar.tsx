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
import { SnowflakeBrandmark, SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
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
      <header className="shrink-0 border-b border-surface-border/30 bg-surface/95 backdrop-blur-sm px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8">
        <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="touch-target inline-flex h-9 w-9 min-h-[40px] min-w-[40px] items-center justify-center rounded text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 lg:inline-flex"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <SnowflakeBrandmark
                height={22}
                priority
                className="max-w-[min(52vw,11rem)] sm:max-w-none"
              />
              <div className="hidden min-w-0 sm:block">
                <span className="font-semibold text-[13px] text-text-primary tracking-tight">
                  Enterprise Territory Execution
                </span>
                <span className="ml-2 text-[11px] text-text-faint">Snowflake Enterprise AE</span>
              </div>
            </div>

            <div className="h-4 w-px bg-surface-border/50" />

            <div className="relative hidden min-w-[160px] sm:block">
              <select
                value={account.id}
                onChange={(e) => onAccountChange(e.target.value)}
                className="w-full appearance-none rounded bg-transparent py-1.5 pr-6 text-[12px] text-text-secondary cursor-pointer border-none focus:outline-none focus:ring-1 focus:ring-accent/25 hover:text-text-primary transition-colors"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-surface-elevated text-text-primary">
                    {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-text-faint" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {oversightStatus === "active" && (
              <>
                <span className="hidden items-center gap-1.5 rounded border border-accent/15 bg-accent/10 px-2 py-1 text-[11px] font-medium text-accent sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {pendingDecisions} open decisions
                </span>
                <span
                  className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-accent/20 bg-accent/10 px-2 text-[11px] font-semibold tabular-nums text-accent sm:hidden"
                  title={`${pendingDecisions} open decisions`}
                >
                  {pendingDecisions}
                </span>
              </>
            )}
            {dealHealth && (
              <>
                <span
                  className={`hidden rounded px-2 py-1 text-[10px] font-medium sm:inline-block ${
                    dealHealth.status === "healthy"
                      ? "bg-emerald-500/10 text-emerald-400/90"
                      : dealHealth.status === "attention"
                        ? "bg-accent/10 text-accent/90"
                        : "bg-rose-500/10 text-rose-400/90"
                  }`}
                  title={dealHealth.reason}
                >
                  {dealHealth.label}
                </span>
                <span
                  className={`inline-flex h-8 max-w-[5.5rem] items-center justify-center truncate rounded-lg px-2 text-[9px] font-semibold leading-tight sm:hidden ${
                    dealHealth.status === "healthy"
                      ? "bg-emerald-500/10 text-emerald-400/90"
                      : dealHealth.status === "attention"
                        ? "bg-accent/10 text-accent/90"
                        : "bg-rose-500/10 text-rose-400/90"
                  }`}
                  title={`${dealHealth.label} — ${dealHealth.reason}`}
                >
                  {dealHealth.label}
                </span>
              </>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25"
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsApiKeyOpen(true)}
              className={cn(
                "flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25",
                hasApiKey
                  ? "text-accent/90 hover:bg-accent/10"
                  : "text-text-muted hover:bg-surface-muted/40 hover:text-text-secondary"
              )}
            >
              <KeyRound className="h-3 w-3" />
              <span className="hidden sm:inline">{isReady && hasApiKey ? "AI" : "API"}</span>
            </button>
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1 rounded bg-accent/15 px-2 py-1.5 text-[10px] font-medium text-accent transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 sm:gap-1.5 sm:px-3 sm:text-[11px]"
              >
                <MessageCircle className="h-3 w-3 shrink-0" strokeWidth={2} />
                <span className="hidden min-[380px]:inline">Execution Desk</span>
                <span className="min-[380px]:hidden">Desk</span>
              </button>
            )}
          </div>
        </div>

        <div className="sm:hidden">
          <label htmlFor="status-account-mobile" className="sr-only">
            Account
          </label>
          <div className="relative">
            <select
              id="status-account-mobile"
              value={account.id}
              onChange={(e) => onAccountChange(e.target.value)}
              className={cn(
                "min-h-[44px] w-full appearance-none rounded-lg border border-surface-border/50 bg-surface-muted/25 py-2.5 pl-3 pr-9",
                "text-[13px] text-text-primary cursor-pointer outline-none transition-colors",
                "focus:border-accent/35 focus:ring-1 focus:ring-accent/20 hover:border-surface-border/70"
              )}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id} className="bg-surface-elevated text-text-primary">
                  {a.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
          </div>
        </div>
        </div>
      </header>

      {isApiKeyOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/30 px-4 py-10 sm:py-24">
          <div className="w-full max-w-md rounded-xl border border-surface-border/50 bg-surface-elevated shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <SnowflakeLogoIcon size={24} className="shrink-0 opacity-90" />
                <div>
                  <p className="text-[13px] font-medium text-text-primary">API Key</p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Required for Execution Desk and runbook.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyOpen(false)}
                className="rounded-md p-1.5 text-text-muted hover:bg-surface-muted/40 hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25"
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
                  className="w-full rounded-lg border border-surface-border/50 bg-surface px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-accent/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>

              <div className="rounded-lg bg-surface/60 px-3 py-2 text-[11px] text-text-secondary">
                {hasApiKey ? "Saved. Ready for Execution Desk." : "Add key to enable Execution Desk."}
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
                  className="rounded-md px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-muted/30 hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25"
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
                    "rounded-md px-3 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60",
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
