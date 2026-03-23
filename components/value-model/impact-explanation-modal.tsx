"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImpactExplanationSection = {
  title: string;
  body: string;
};

type ImpactExplanationModalProps = {
  open: boolean;
  onClose: () => void;
  accountLabel: string;
  sections: ImpactExplanationSection[];
};

export function ImpactExplanationModal({
  open,
  onClose,
  accountLabel,
  sections,
}: ImpactExplanationModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-[81] w-full max-w-lg rounded-2xl border border-surface-border/50",
          "bg-surface-elevated/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
          "max-h-[min(88vh,640px)] overflow-hidden"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-surface-border/40 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-faint">
              Executive summary
            </p>
            <h2 id={titleId} className="mt-1 text-[15px] font-semibold tracking-tight text-text-primary">
              Explain the impact · {accountLabel}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-surface-border/45 bg-surface-muted/25 p-2 text-text-muted transition-colors hover:border-accent/25 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto px-5 py-4 text-[12px] leading-relaxed text-text-secondary">
          {sections.map((s) => (
            <div key={s.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-faint">{s.title}</p>
              <p className="mt-1.5 text-text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
