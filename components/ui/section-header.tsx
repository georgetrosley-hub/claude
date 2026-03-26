"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Deprecated. Kept for backwards compatibility. */
  showLogo?: boolean;
}

export function SectionHeader({ title, subtitle, showLogo }: SectionHeaderProps) {
  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        {showLogo ? null : null}
        <div>
          <h2 className="text-[14px] font-semibold leading-none tracking-tight text-text-primary sm:text-[15px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
