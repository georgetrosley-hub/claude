"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Presentation,
  Target,
  Zap,
  DollarSign,
  Map,
  ListChecks,
  Flag,
} from "lucide-react";

const sectionGroups = [
  {
    label: "Ciena deck",
    items: [
      { id: "cover", label: "Cover", icon: Presentation },
      { id: "whyCiena", label: "Why Ciena", icon: Target },
      { id: "whyNow", label: "Why now", icon: Zap },
      { id: "execution", label: "Execution plan", icon: Flag },
      { id: "dollars", label: "Value in dollars", icon: DollarSign },
      { id: "expansion", label: "Expansion map", icon: Map },
      { id: "prioritization", label: "Prioritization", icon: ListChecks },
      { id: "closing", label: "Close", icon: Presentation },
    ],
  },
] as const;

type SectionItem = (typeof sectionGroups)[number]["items"][number];
export type SectionId = SectionItem["id"];

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  collapsed: boolean;
  scrollProgress: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

interface SidebarBodyProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  scrollProgress: number;
  compact?: boolean;
  onToggleCollapsed?: () => void;
  onCloseMobile?: () => void;
}

function SidebarBody({
  activeSection,
  onSectionChange,
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
      <div className={cn("relative px-5 py-5", compact && "px-3 py-4")}>
        <div className="flex items-center justify-between gap-2">
          <div className={cn("flex min-w-0 items-center gap-2", compact && "justify-center")}>
            <div className={cn("min-w-0", compact ? "text-center" : "")}>
              <p className={cn("text-[12px] font-semibold tracking-tight text-text-primary", compact && "text-[11px]")}>
                Claude Enterprise
              </p>
              {!compact && (
                <p className="mt-1 text-[11px] text-text-muted">Ciena account strategy (March 2026)</p>
              )}
            </div>
          </div>
          {onToggleCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 lg:inline-flex"
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
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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
              <p className="mb-1.5 px-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-text-faint/70">
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
                      "group flex w-full min-h-[44px] items-center gap-2 rounded-lg px-3 py-3 text-left text-[13px] transition-colors duration-150 active:bg-surface-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/25 border border-transparent",
                      compact && "justify-center px-0 py-2 min-h-[40px]",
                      isActive
                        ? "border-accent/35 bg-surface-muted/60 text-accent font-semibold"
                        : "text-text-muted hover:bg-surface-muted/30 hover:text-text-secondary hover:border-surface-border/50",
                      !isActive && id === "dollars" && "font-medium text-text-secondary/95"
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
                      <span className={cn(id === "dollars" && !isActive && "tracking-tight")}>{label}</span>
                    )}
                    {isActive && !compact && (
                      <span className="ml-auto h-1 w-1 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("mt-auto border-t border-surface-border/30 px-5 py-4", compact && "px-3")}>
        <div className={cn("flex items-center gap-2.5", compact && "justify-center")}>
          <div className="h-8 w-8 shrink-0 rounded-2xl border border-white/8 bg-white/[0.04] p-1.5">
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-accent/40 via-accent/15 to-transparent" />
          </div>
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-text-secondary">
                George Trosley
              </p>
              <p className="text-[10px] text-text-faint">Enterprise AE · Account strategy site</p>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="space-y-1 px-5 pb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-faint/70">
            Narrative
          </p>
          <p className="text-[10px] text-text-faint/60">Thesis → why now → execution → value → expansion.</p>
        </div>
      )}
    </>
  );
}

export function Sidebar({
  activeSection,
  onSectionChange,
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
          "hidden shrink-0 border-r border-surface-border/40 bg-surface-elevated/20 transition-[width] duration-200 lg:flex lg:flex-col",
          collapsed ? "lg:w-20" : "lg:w-56"
        )}
      >
        <SidebarBody
          activeSection={activeSection}
          onSectionChange={onSectionChange}
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
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col border-r border-surface-border/40 bg-surface shadow-2xl lg:hidden"
            >
              <SidebarBody
                activeSection={activeSection}
                onSectionChange={onSectionChange}
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
