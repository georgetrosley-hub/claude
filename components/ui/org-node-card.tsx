"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Building2,
  CircleDollarSign,
  Code2,
  Cog,
  Headphones,
  Laptop2,
  Network,
  Package,
  Scale,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrgNode } from "@/types";

interface OrgNodeCardProps {
  node: OrgNode;
  index?: number;
  className?: string;
  rank?: number;
  onClick?: () => void;
}

const departmentIcons: Record<string, LucideIcon> = {
  Engineering: Code2,
  "Platform Engineering": Boxes,
  Security: ShieldCheck,
  IT: Laptop2,
  Finance: CircleDollarSign,
  Legal: Scale,
  Operations: Cog,
  "Customer Support": Headphones,
  Product: Package,
  "Data / AI": BrainCircuit,
  "Executive Leadership": Building2,
};

const statusStyles: Record<
  OrgNode["status"],
  {
    label: string;
    badge: string;
    leftAccent: string;
  }
> = {
  latent: {
    label: "Latent",
    badge: "bg-[#B0AEA5]/15 text-[#7D7B73]",
    leftAccent: "bg-[#E8E6DC]",
  },
  identified: {
    label: "Identified",
    badge: "bg-[#6A9BCC]/15 text-[#3E6F9F]",
    leftAccent: "bg-[#6A9BCC]",
  },
  engaged: {
    label: "Engaged",
    badge: "bg-[#D97757]/15 text-[#B85F44]",
    leftAccent: "bg-[#D97757]",
  },
  pilot: {
    label: "Pilot",
    badge: "bg-[#D97757]/15 text-[#B85F44]",
    leftAccent: "bg-[#D97757]",
  },
  deployed: {
    label: "Deployed",
    badge: "bg-[#788C5D]/15 text-[#5D6F45]",
    leftAccent: "bg-[#788C5D]",
  },
};

export function OrgNodeCard({
  node,
  index = 0,
  className,
  rank,
  onClick,
}: OrgNodeCardProps) {
  const isActive =
    node.status === "engaged" || node.status === "pilot" || node.status === "deployed";
  const Icon = departmentIcons[node.name] ?? Network;
  const style = statusStyles[node.status];

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
        "group relative overflow-hidden rounded-[12px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] transition-transform duration-200",
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
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-1", style.leftAccent)} />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F5F4EE] text-[#141413]">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]",
                    style.badge
                  )}
                >
                  {style.label}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-3 text-[16px] font-semibold leading-snug text-text-primary"
                )}
              >
                {node.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-text-muted">
                {node.useCase}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-text-muted">
            <span className="tabular-nums">
              <span className="text-text-faint">ARR</span>{" "}
              <span className="font-semibold text-text-primary">${node.arrPotential.toFixed(2)}M</span>
            </span>
            <span className="tabular-nums">
              <span className="text-text-faint">Likelihood</span>{" "}
              <span className="font-semibold text-text-primary">{node.buyingLikelihood}%</span>
            </span>
          </div>

          <div className="mt-4 border-t border-surface-border/70 pt-3">
            <p className="text-[12px] leading-relaxed text-text-muted">
              {node.recommendedNextStep}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
