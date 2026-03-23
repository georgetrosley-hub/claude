"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SnowflakeLogoIcon, SnowflakeWordmark } from "@/components/ui/snowflake-logo";
import {
  MessageCircle,
  LayoutDashboard,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Newspaper,
  ClipboardCheck,
  BookOpenCheck,
} from "lucide-react";

const SNOWFLAKE_SUMMIT_URL = "https://www.snowflake.com/en/summit/";

const sectionGroups = [
  {
    label: "Field console",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "thisWeeksPriorities", label: "Weekly Briefing", icon: Newspaper },
      { id: "priorityAccounts", label: "Priority Accounts", icon: Target },
      { id: "povPlan", label: "POV Plan", icon: BookOpenCheck },
      { id: "recentSignals", label: "Recent Signals", icon: ClipboardCheck },
    ],
  },
] as const;

type SectionItem = (typeof sectionGroups)[number]["items"][number];
export type SectionId = SectionItem["id"];

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  onOpenChat: () => void;
  collapsed: boolean;
  scrollProgress: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

interface SidebarBodyProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  onOpenChat: () => void;
  scrollProgress: number;
  compact?: boolean;
  onToggleCollapsed?: () => void;
  onCloseMobile?: () => void;
}

function SidebarBody({
  activeSection,
  onSectionChange,
  onOpenChat,
  scrollProgress,
  compact = false,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarBodyProps) {
  const handleSectionSelect = (id: SectionId) => {
    onSectionChange(id);
    onCloseMobile?.();
  };

  return (
    <>
      <div className={cn("relative border-b border-surface-border/35 px-5 py-5", compact && "px-3 py-4")}>
        <div className="flex items-center justify-between gap-2">
          <div className={cn("flex items-center gap-2.5", compact && "justify-center")}>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-surface-border/45 bg-surface-muted/20 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
              <SnowflakeLogoIcon size={24} className="h-full w-full" />
            </div>
            {!compact && (
              <div>
                <SnowflakeWordmark />
                <p className="mt-0.5 text-[11px] leading-none tracking-tight text-text-muted">
                  Field Console
                </p>
              </div>
            )}
          </div>
          {onToggleCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="ds-focus-ring hidden rounded-md p-1.5 text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-secondary active:scale-[0.97] lg:inline-flex"
              aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
              title={compact ? "Expand sidebar" : "Collapse sidebar"}
            >
              {compact ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="ds-focus-ring rounded-md p-1.5 text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-secondary active:scale-[0.97] lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className={cn("px-3 pb-3", compact && "px-2")}>
        <button
          type="button"
          onClick={() => {
            onOpenChat();
            onCloseMobile?.();
          }}
          className={cn(
            "ds-focus-ring flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.07] px-3 py-3 text-[12px] font-medium text-accent shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] transition-all duration-200 ease-out-expo hover:border-accent/35 hover:bg-accent/[0.11] active:scale-[0.99]",
            compact && "min-h-[40px] justify-center px-0 py-2"
          )}
          aria-label="Deal Desk"
          title="Deal Desk"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
          {!compact && "Deal Desk"}
        </button>
      </div>

      <nav className={cn("relative flex-1 overflow-y-auto px-3 py-1", compact && "px-2")}>
        {!compact && (
          <div className="pointer-events-none absolute bottom-5 left-2 top-2 w-px rounded-full bg-surface-border/50">
            <div
              className="w-full origin-top rounded-full bg-text-muted/70 transition-[height] duration-100 ease-linear"
              style={{ height: `${Math.max(0, Math.min(scrollProgress, 1)) * 100}%` }}
              aria-hidden
            />
          </div>
        )}
        {sectionGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!compact && (
              <p className="mb-2 px-2.5 text-label text-text-faint/80">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSectionSelect(id)}
                    className={cn(
                      "ds-focus-ring group relative flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-200 ease-out-expo",
                      compact && "min-h-[40px] justify-center px-0 py-2",
                      isActive
                        ? "bg-surface-muted/55 font-semibold text-accent shadow-[inset_0_0_0_1px_rgb(41_181_232/0.12)]"
                        : "text-text-muted hover:bg-surface-muted/35 hover:text-text-secondary active:scale-[0.995]"
                    )}
                    aria-label={label}
                    title={label}
                  >
                    <Icon
                      className={cn(
                        "h-[14px] w-[14px] shrink-0 transition-colors duration-200",
                        isActive ? "text-accent" : "opacity-45 group-hover:opacity-70"
                      )}
                      strokeWidth={1.8}
                    />
                    {!compact && (
                      <span>{label}</span>
                    )}
                    {isActive && !compact && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(41_181_232/0.45)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("mt-auto border-t border-surface-border/40 bg-surface-muted/[0.06] px-5 py-4", compact && "px-3")}>
        <div className={cn("flex items-center gap-2.5", compact && "justify-center")}>
          <SnowflakeLogoIcon size={20} className="shrink-0 opacity-80" />
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-text-secondary">Enterprise AE</p>
              <p className="text-[10px] text-text-faint">Land & expand · Strategic accounts</p>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="space-y-2 px-5 pb-4">
          <a
            href={SNOWFLAKE_SUMMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] text-accent/80 hover:text-accent underline underline-offset-2"
          >
            Snowflake Summit →
          </a>
              <p className="text-[10px] text-text-faint/60">
            Internal · snowflake.com
          </p>
        </div>
      )}
    </>
  );
}

export function Sidebar({
  activeSection,
  onSectionChange,
  onOpenChat,
  collapsed,
  scrollProgress,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 border-r border-surface-border/50 bg-surface-elevated/25 shadow-[inset_-1px_0_0_rgb(255_255_255/0.03)] backdrop-blur-sm transition-[width] duration-200 ease-out-expo lg:flex lg:flex-col",
          collapsed ? "lg:w-20" : "lg:w-56"
        )}
      >
        <SidebarBody
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onOpenChat={onOpenChat}
          scrollProgress={scrollProgress}
          compact={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onCloseMobile}
              aria-label="Close navigation"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col border-r border-surface-border/50 bg-surface shadow-panel lg:hidden"
            >
              <SidebarBody
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                onOpenChat={onOpenChat}
                scrollProgress={scrollProgress}
                onCloseMobile={onCloseMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
