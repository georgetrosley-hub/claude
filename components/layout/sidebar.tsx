"use client";

import { cn } from "@/lib/utils";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import {
  BarChart3,
  BriefcaseBusiness,
  Bot,
  FileText,
  Handshake,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";

const sectionGroups = [
  {
    label: "Seller work",
    items: [
      { id: "myBook", label: "My Book", icon: BriefcaseBusiness },
      { id: "accountOs", label: "Account OS", icon: Workflow },
      { id: "dealRoom", label: "Deal Room", icon: Handshake },
      { id: "execPrep", label: "Exec Prep", icon: FileText },
      { id: "expansion", label: "Expansion Engine", icon: Network },
    ],
  },
  {
    label: "Ops and review",
    items: [
      { id: "actions", label: "Agent Actions", icon: Bot },
      { id: "manager", label: "Manager View", icon: BarChart3 },
      { id: "vision", label: "Roadmap", icon: Sparkles },
    ],
  },
] as const;

const sections = sectionGroups.flatMap((group) => group.items);

export type SectionId = (typeof sections)[number]["id"];

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-surface-border/40 bg-surface-elevated/20">
      {/* Brand header */}
      <div className="relative px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-claude-coral/10">
            <ClaudeSparkle size={14} className="text-claude-coral" />
          </div>
          <div>
            <h1 className="text-[13px] font-semibold tracking-tight text-text-primary">
              Claude
            </h1>
            <p className="text-[11px] text-text-muted">
              Seller OS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3">
        <div className="space-y-5">
          {sectionGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2.5 text-[10px] uppercase tracking-[0.16em] text-text-faint">
                {group.label}
              </p>
              <div className="mt-2 space-y-0.5">
                {group.items.map(({ id, label, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onSectionChange(id)}
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[13px] transition-all duration-150",
                        isActive
                          ? "bg-surface-muted/50 text-text-primary"
                          : "text-text-muted hover:bg-surface-muted/30 hover:text-text-secondary"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[14px] w-[14px] shrink-0 transition-colors duration-200",
                          isActive ? "text-claude-coral/70" : "opacity-45 group-hover:opacity-70"
                        )}
                        strokeWidth={1.8}
                      />
                      <span className={cn(isActive && "font-medium")}>{label}</span>
                      {isActive && (
                        <span className="ml-auto h-1 w-1 rounded-full bg-claude-coral/60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="mt-auto border-t border-surface-border/30 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted/80 text-[10px] font-semibold text-text-secondary ring-1 ring-surface-border/50">
            GT
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-text-secondary">George Trosley</p>
            <p className="text-[10px] text-text-faint">Enterprise AE · Claude</p>
          </div>
        </div>
      </div>

      {/* Anthropic footer */}
      <div className="px-5 pb-4">
        <p className="text-[10px] text-text-faint/60">
          Powered by Anthropic
        </p>
      </div>
    </aside>
  );
}
