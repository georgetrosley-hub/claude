"use client";

import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Show Snowflake logo next to title for a consistent branded look */
  showLogo?: boolean;
}

export function SectionHeader({ title, subtitle, showLogo }: SectionHeaderProps) {
  return (
    <header className="mb-6 sm:mb-7">
      <div className="flex items-start gap-3.5 sm:gap-4">
        {showLogo && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border/50 bg-surface-muted/25 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
            <SnowflakeLogoIcon size={22} className="opacity-95" />
          </span>
        )}
        <div className="min-w-0 pt-0.5">
          <h2 className="text-display-xs text-text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-body-sm text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
