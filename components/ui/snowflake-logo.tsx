"use client";

import { cn } from "@/lib/utils";

const SNOWFLAKE_BLUE = "rgb(var(--accent))";

interface SnowflakeLogoProps {
  className?: string;
  size?: number;
}

/** Snowflake brand mark — six-arm snowflake in brand blue */
export function SnowflakeLogoIcon({ className, size = 24 }: SnowflakeLogoProps) {
  const s = size ?? 24;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83M7.05 7.05l2.12 2.12M14.83 14.83l2.12 2.12M7.05 16.95l2.12-2.12M14.83 9.17l2.12-2.12M16.95 7.05l-2.12 2.12M9.17 14.83l-2.12 2.12M16.95 16.95l-2.12-2.12M9.17 9.17l-2.12-2.12M12 7v3l2.5 2.5M12 14v3"
        stroke={SNOWFLAKE_BLUE}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Wordmark: Snowflake */
export function SnowflakeWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-tight text-[15px] text-text-primary", className)}>
      Snowflake
    </span>
  );
}

/** Logo + wordmark for header/sidebar */
export function SnowflakeLogoImage({ className, size = 24 }: SnowflakeLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SnowflakeLogoIcon size={size} />
    </div>
  );
}

/** Icon-only for compact UI (same as SnowflakeLogoIcon, alias for drop-in) */
export function SnowflakeLogo({ className, size = 20 }: SnowflakeLogoProps) {
  return <SnowflakeLogoIcon className={className} size={size} />;
}
