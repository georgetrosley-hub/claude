"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/app/context/app-context";
import { Sidebar, type SectionId } from "@/components/layout/sidebar";
import { StatusBar } from "@/components/layout/status-bar";
import { ChatPanel } from "@/components/layout/chat-panel";
import { Overview } from "@/components/sections/overview";
import { Stakeholders } from "@/components/sections/stakeholders";
import { Execution } from "@/components/sections/execution";
import { Signals } from "@/components/sections/signals";
import { ArtifactsWorkspace } from "@/components/sections/artifacts-workspace";
import { motion, AnimatePresence } from "framer-motion";

function MainContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const {
    account,
    accounts,
    competitors,
    signals,
    stakeholders,
    executionItems,
    workspaceDraft,
    currentRecommendation,
    pipelineTarget,
    currentPhase,
    pendingDecisionCount,
    setAccountId,
    lastDecisionTitle,
    clearLastDecision,
    handleApproveDecision,
    handleDeferDecision,
    updateWorkspaceField,
    updateStakeholderStance,
    updateExecutionStatus,
    updateSignalDisposition,
  } = useApp();

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setMobileNavOpen(false);
  };

  const handleAccountChange = (accountId: string) => {
    setAccountId(accountId);
    setMobileNavOpen(false);
  };

  const estimatedArr = account.estimatedLandValue + account.estimatedExpansionValue * 0.35;
  const oversightStatus = pendingDecisionCount > 0 ? "active" as const : "idle" as const;

  const sections: Record<SectionId, React.ReactNode> = {
    overview: (
      <Overview
        account={account}
        competitors={competitors}
        signals={signals}
        stakeholders={stakeholders}
        executionItems={executionItems}
        workspaceDraft={workspaceDraft}
        pipelineTarget={pipelineTarget}
        currentRecommendation={currentRecommendation}
        onUpdateWorkspaceField={updateWorkspaceField}
      />
    ),
    stakeholders: (
      <Stakeholders
        account={account}
        competitors={competitors}
        stakeholders={stakeholders}
        onUpdateStakeholderStance={updateStakeholderStance}
      />
    ),
    execution: (
      <Execution
        account={account}
        competitors={competitors}
        executionItems={executionItems}
        lastDecisionTitle={lastDecisionTitle}
        clearLastDecision={clearLastDecision}
        onApproveDecision={handleApproveDecision}
        onDeferDecision={handleDeferDecision}
        onUpdateExecutionStatus={updateExecutionStatus}
      />
    ),
    signals: (
      <Signals
        account={account}
        competitors={competitors}
        signals={signals}
        onUpdateSignalDisposition={updateSignalDisposition}
      />
    ),
    artifacts: (
      <ArtifactsWorkspace
        account={account}
        competitors={competitors}
      />
    ),
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-surface lg:flex lg:h-screen">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onOpenChat={handleOpenChat}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,119,86,0.02),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(218,119,86,0.01),transparent_55%)]" />

        <StatusBar
          account={account}
          accounts={accounts}
          onAccountChange={handleAccountChange}
          pipelineTarget={pipelineTarget}
          estimatedArr={estimatedArr}
          currentPhase={currentPhase}
          signalCount={signals.length}
          pendingDecisions={pendingDecisionCount}
          oversightStatus={oversightStatus}
          onOpenChat={handleOpenChat}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto w-full max-w-6xl"
            >
              {sections[activeSection]}
            </motion.div>
          </AnimatePresence>
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
