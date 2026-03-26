"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { OrgNode } from "@/types";

interface OrgNodeCardProps {
  node: OrgNode;
  index?: number;
  className?: string;
  rank?: number;
  onClick?: () => void;
  tone?: "primary" | "secondary" | "muted";
}

const statusStyles: Record<
  OrgNode["status"],
  {
    label: string;
    badge: string;
  }
> = {
  latent: {
    label: "Latent",
    badge: "bg-[#B0AEA5]/15 text-[#7D7B73]",
  },
  identified: {
    label: "Identified",
    badge: "bg-[#6A9BCC]/15 text-[#3E6F9F]",
  },
  engaged: {
    label: "Engaged",
    badge: "bg-[#D97757]/15 text-[#B85F44]",
  },
  pilot: {
    label: "Pilot",
    badge: "bg-[#D97757]/15 text-[#B85F44]",
  },
  deployed: {
    label: "Deployed",
    badge: "bg-[#788C5D]/15 text-[#5D6F45]",
  },
};

function laneAccent(node: OrgNode): string {
  if (node.status === "engaged" || node.status === "pilot" || node.status === "deployed") return "bg-[#788C5D]";
  if (node.status === "identified") return "bg-[#6A9BCC]";
  return "bg-[#E8E6DC]";
}

export function OrgNodeCard({
  node,
  index = 0,
  className,
  rank,
  onClick,
  tone = "secondary",
}: OrgNodeCardProps) {
  const style = statusStyles[node.status];
  const accent = laneAccent(node);
  const emphasis = tone === "primary";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.02,
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "group relative flex min-h-[148px] flex-col overflow-hidden rounded-[12px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] transition-transform duration-200",
        emphasis && "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_28px_rgba(0,0,0,0.08)]",
        onClick && "cursor-pointer hover:-translate-y-[1px]",
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-1.5", accent)} />

      <div className={cn("flex items-start justify-between gap-3", tone === "muted" && "opacity-80")}>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]",
            style.badge
          )}
        >
          {style.label}
        </span>
      </div>

      <div className={cn("mt-4", tone === "muted" && "opacity-80")}>
        <h3 className={cn("text-[17px] font-semibold leading-snug text-text-primary", emphasis && "text-[18px]")}>
          {node.name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-text-muted">
          {node.useCase}
        </p>
      </div>

      <div className={cn("mt-auto flex items-end justify-between gap-4 pt-5", tone === "muted" && "opacity-80")}>
        <div className="text-[13px] text-text-muted tabular-nums">
          <span className="font-semibold text-text-primary">${node.arrPotential.toFixed(2)}M</span>
        </div>
        <div className="text-[13px] text-text-muted tabular-nums">
          <span className="font-semibold text-text-primary">{node.buyingLikelihood}%</span>
        </div>
      </div>
    </motion.div>
  );
}
