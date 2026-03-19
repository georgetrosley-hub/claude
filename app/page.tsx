"use client";

import { useEffect, useRef, useState } from "react";
import { AppProvider, useApp } from "@/app/context/app-context";
import { Sidebar, type SectionId } from "@/components/layout/sidebar";
import { StatusBar } from "@/components/layout/status-bar";
import { ChatPanel } from "@/components/layout/chat-panel";
import { Overview } from "@/components/sections/overview";

const SECTION_ANCHOR_BY_NAV: Record<SectionId, string> = {
  territoryPriorities: "territory-priorities",
  dailyBriefing: "daily-account-briefing",
  accountDossiers: "account-dossiers",
  operatingPriorities: "operating-priorities",
  executionFramework: "execution-framework",
  briefingEngine: "briefing-engine",
};

function MainContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("territoryPriorities");
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const activeSectionRef = useRef<SectionId>("territoryPriorities");
  const {
    account,
    accounts,
    competitors,
    signals,
    stakeholders,
    executionItems,
    accountUpdates,
    workspaceDraft,
    currentRecommendation,
    pipelineTarget,
    pendingDecisionCount,
    dealHealth,
    setAccountId,
    updateWorkspaceField,
    addAccountUpdate,
  } = useApp();

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    activeSectionRef.current = section;
    setMobileNavOpen(false);
    const targetId = SECTION_ANCHOR_BY_NAV[section];
    const targetElement = targetId ? document.getElementById(targetId) : null;
    targetElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setMobileNavOpen(false);
  };

  const handleAccountChange = (accountId: string) => {
    setAccountId(accountId);
    setMobileNavOpen(false);
  };

  const oversightStatus = pendingDecisionCount > 0 ? "active" as const : "idle" as const;

  const overviewNode = (
    <Overview
      account={account}
      competitors={competitors}
      signals={signals}
      stakeholders={stakeholders}
      executionItems={executionItems}
      accountUpdates={accountUpdates}
      workspaceDraft={workspaceDraft}
      pipelineTarget={pipelineTarget}
      currentRecommendation={currentRecommendation}
      dealHealth={dealHealth}
      onUpdateWorkspaceField={updateWorkspaceField}
      onAddAccountUpdate={addAccountUpdate}
    />
  );

  useEffect(() => {
    const scrollContainer = mainScrollRef.current;
    if (!scrollContainer) return;

    const sectionEntries = (Object.entries(SECTION_ANCHOR_BY_NAV) as [SectionId, string][])
      .map(([sectionId, anchorId]) => {
        const element = document.getElementById(anchorId);
        return element ? { sectionId, element } : null;
      })
      .filter((entry): entry is { sectionId: SectionId; element: HTMLElement } => entry !== null);

    if (!sectionEntries.length) return;

    const ratios = new Map<SectionId, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const matched = sectionEntries.find((item) => item.element === entry.target);
          if (!matched) continue;
          ratios.set(matched.sectionId, entry.intersectionRatio);
        }

        let bestSection = activeSection;
        let bestRatio = -1;
        for (const { sectionId } of sectionEntries) {
          const ratio = ratios.get(sectionId) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestSection = sectionId;
          }
        }

        if (bestSection !== activeSectionRef.current && bestRatio >= 0.3) {
          activeSectionRef.current = bestSection;
          setActiveSection(bestSection);
        }
      },
      {
        root: scrollContainer,
        rootMargin: "-16% 0px -40% 0px",
        threshold: [0.1, 0.25, 0.35, 0.5, 0.7, 0.9],
      }
    );

    for (const { element } of sectionEntries) {
      observer.observe(element);
    }

    let frameRequested = false;
    const updateProgress = () => {
      const maxScroll = Math.max(scrollContainer.scrollHeight - scrollContainer.clientHeight, 1);
      const nextProgress = Math.min(Math.max(scrollContainer.scrollTop / maxScroll, 0), 1);
      setScrollProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));
      frameRequested = false;
    };
    const onScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(updateProgress);
    };

    updateProgress();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-surface pb-[env(safe-area-inset-bottom)] lg:flex lg:h-screen">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onOpenChat={handleOpenChat}
        collapsed={sidebarCollapsed}
        scrollProgress={scrollProgress}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(41,181,232,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(41,181,232,0.04),transparent_55%)]" />

        <StatusBar
          account={account}
          accounts={accounts}
          onAccountChange={handleAccountChange}
          signalCount={signals.length}
          pendingDecisions={pendingDecisionCount}
          oversightStatus={oversightStatus}
          dealHealth={dealHealth}
          onOpenChat={handleOpenChat}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main
          ref={mainScrollRef as unknown as React.RefObject<HTMLElement>}
          className="relative flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-10"
        >
          <div className="mx-auto w-full max-w-6xl min-w-0">{overviewNode}</div>
        </main>
      </div>

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        account={account}
        competitors={competitors}
        activeSection={activeSection}
      />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
