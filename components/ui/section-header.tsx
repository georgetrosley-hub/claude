"use client";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Deprecated. Kept for backwards compatibility. */
  showLogo?: boolean;
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <header>
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-faint">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-text-primary sm:text-[22px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-text-muted">
          {subtitle}
        </p>
      )}
    </header>
  );
}
