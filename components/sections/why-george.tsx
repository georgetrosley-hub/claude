"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Target,
  Zap,
  Building2,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { AdaptiveLogo } from "@/components/ui/adaptive-logo";

const ALIGNMENT = [
  {
    icon: Shield,
    title: "You displace KnowBe4 & Proofpoint. So do I.",
    detail:
      "My resume explicitly calls out legacy vendor displacement of KnowBe4 and Proofpoint. I reframe the conversation from compliance checkbox to measurable risk reduction — exactly how Adaptive wins.",
  },
  {
    icon: Target,
    title: "Enterprise healthcare is in your sweet spot. It's mine too.",
    detail:
      "St. Luke's ($1.65M), Penn State Health ($1.32M), Sanofi ($745K), Tower Health ($373K). I've closed multi-site health systems and pharma through security and compliance urgency. Same buyers: CISO, IT Security, GRC, clinical informatics.",
  },
  {
    icon: Zap,
    title: "Deepfake & AI threat training isn't a nice-to-have. I sell that urgency.",
    detail:
      "I create executive urgency around emerging threats and board-level security concerns. Selling 'training completions' vs 'risk reduction' is the shift I've made at every security platform — and Adaptive's deepfake training is the wedge.",
  },
  {
    icon: Building2,
    title: "Founder DNA. I've built and exited.",
    detail:
      "Lochness Labs: raised $2.5M, scaled to 150K+ users and $45M transaction volume, exited via acquisition. I partner with product and engineering, move fast, and thrive in founder-led cultures.",
  },
  {
    icon: TrendingUp,
    title: "Greenfield pipeline from zero. Repeatedly.",
    detail:
      "Verkada: 157% attainment, $6M+ pipeline and $1.34M closed in first year in a territory with no pipeline or channel. Everpure: $25M+ pipeline from ~80% whitespace. I don't need a warm book — I build it.",
  },
];

const QUOTE = {
  text: "Seeing a deepfake of myself in the training? That's when it clicked that this isn't hypothetical. It's real, and my users need to be ready.",
  author: "Michael Archuleta, CIO at Mt. San Rafael Hospital",
  source: "Adaptive Security",
};

export function WhyGeorge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 sm:space-y-12"
    >
      <SectionHeader
        title="Why George for Adaptive"
        subtitle="Direct alignment with your product, buyers, and competitive motion — one page for hiring managers"
      />

      {/* Hero one-liner */}
      <div className="rounded-2xl border border-accent/25 bg-accent/[0.08] p-5 sm:p-6">
        <p className="text-base font-medium leading-relaxed text-text-primary sm:text-lg">
          I&apos;ve already sold the playbook you&apos;re building: security awareness and risk reduction that displaces legacy training vendors, into the same regulated enterprises (healthcare, finance, pharma) where Adaptive wins.
        </p>
        <p className="mt-3 text-[13px] text-text-muted">
          This page is why the fit isn&apos;t a stretch — it&apos;s a shortcut.
        </p>
      </div>

      {/* Alignment cards */}
      <div className="space-y-4">
        {ALIGNMENT.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
            className="flex gap-4 rounded-xl border border-surface-border/60 bg-surface-elevated/40 p-4 sm:p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <item.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                {item.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Customer quote — shows I've done my homework on Adaptive */}
      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-5 sm:p-6">
        <p className="text-[13px] font-medium uppercase tracking-wider text-text-faint">
          Why this role fits
        </p>
        <blockquote className="mt-2 text-[15px] italic leading-relaxed text-text-secondary">
          &ldquo;{QUOTE.text}&rdquo;
        </blockquote>
        <p className="mt-2 text-[12px] text-text-muted">
          — {QUOTE.author}, {QUOTE.source}
        </p>
        <p className="mt-3 text-[12px] text-text-faint">
          I&apos;ve read your site and case studies. I want to be the AE who brings that &quot;holy shit&quot; moment to more enterprises — with the same deepfake and AI-threat training that makes Adaptive different.
        </p>
      </div>

      {/* By the numbers */}
      <section className="rounded-2xl border border-surface-border/50 bg-surface-elevated/20 p-5 sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          By the numbers
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">$35M+</span>
            <span className="text-[13px] text-text-muted">Career revenue</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">118–157%</span>
            <span className="text-[13px] text-text-muted">Quota attainment (measured periods)</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">KnowBe4 / Proofpoint</span>
            <span className="text-[13px] text-text-muted">Legacy displacement experience</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">Healthcare & pharma</span>
            <span className="text-[13px] text-text-muted">Multi-site enterprise wins</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">Founder</span>
            <span className="text-[13px] text-text-muted">Built & scaled, then exited</span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <AdaptiveLogo size={28} />
          <div>
            <p className="font-semibold text-text-primary">Ready to talk?</p>
            <p className="text-[13px] text-text-muted">
              Let&apos;s discuss how I&apos;d build pipeline and expansion for Adaptive.
            </p>
          </div>
        </div>
        <a
          href="https://www.adaptivesecurity.com/demo/security-awareness-training"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent/90"
        >
          Book a demo
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
