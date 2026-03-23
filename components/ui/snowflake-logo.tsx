"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/snowflake-logo.png";
/** Horizontal wordmark (Wikimedia Snowflake_Logo.svg) — viewBox 184×44, transparent */
const WORDMARK_HORIZONTAL_SRC = "/snowflake-logo-horizontal.svg";
const WORDMARK_HW_RATIO = 184 / 44;

interface SnowflakeLogoProps {
  className?: string;
  size?: number;
}

/** Snowflake brand mark — PNG asset, works in both light and dark themes */
export function SnowflakeLogoIcon({ className, size = 24 }: SnowflakeLogoProps) {
  const s = size ?? 24;
  return (
    <Image
      src={LOGO_SRC}
      alt="Snowflake"
      width={s}
      height={s}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
      unoptimized
    />
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

/** Full horizontal Snowflake logo (icon + wordmark). SVG has transparent background. */
export function SnowflakeBrandmark({
  className,
  height = 26,
  priority,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const h = height;
  const w = Math.round(h * WORDMARK_HW_RATIO);
  return (
    <img
      src={WORDMARK_HORIZONTAL_SRC}
      alt="Snowflake"
      width={w}
      height={h}
      className={cn("shrink-0 object-contain object-left", className)}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
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
