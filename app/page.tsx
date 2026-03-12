"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/app/context/app-context";
import { Sidebar, type SectionId } from "@/components/layout/sidebar";
import { StatusBar } from "@/components/layout/status-bar";
import { AccountOs } from "@/components/sections/account-os";
import { AgentActions } from "@/components/sections/agent-actions";
import { DealRoom } from "@/components/sections/deal-room";
import { ExecPrep } from "@/components/sections/exec-prep";
import { ExpansionEngine } from "@/components/sections/expansion-engine";
import { ManagerView } from "@/components/sections/manager-view";
import { MyBook } from "@/components/sections/my-book";
import { Vision } from "@/components/sections/vision";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/lib/formatters";

function MainContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("myBook");
  const {
    account,
    accounts,
    workspace,
    agents,
    setAccountId,
    lastApprovedTitle,
    clearLastApproved,
    handleApprove,
    handleReject,
    handleModify,
  } = useApp();

  const pipelineValue = workspace.opportunities.reduce(
    (sum, opportunity) => sum + opportunity.amount,
    0
  );
  const whitespaceValue = workspace.expansionMotions.reduce(
    (sum, motion) => sum + motion.arrPotential,
    0
  );
  const nextMeeting = workspace.meetings.find((meeting) => meeting.status === "upcoming");
  const activeAgentsCount = agents.filter((agent) => agent.status !== "idle").length;
  const connectedSources = workspace.dataSources.filter(
    (source) => source.status === "connected"
  ).length;
  const openApprovals = workspace.approvals.filter(
    (approval) => approval.status === "pending"
  ).length;

  const sections: Record<SectionId, React.ReactNode> = {
    myBook: (
      <MyBook
        currentRecommendation={workspace.currentRecommendation}
        workflows={workspace.workflows}
        workQueue={workspace.workQueue}
        tasks={workspace.tasks}
        meetings={workspace.meetings}
      />
    ),
    accountOs: (
      <AccountOs
        account={account}
        accountPlan={workspace.accountPlan}
        stakeholders={workspace.stakeholders}
        dataSources={workspace.dataSources}
        competitiveLandscape={workspace.competitiveLandscape}
      />
    ),
    dealRoom: (
      <DealRoom
        opportunities={workspace.opportunities}
        tasks={workspace.tasks}
        milestones={workspace.accountPlan.nextMilestones}
      />
    ),
    execPrep: (
      <ExecPrep
        brief={workspace.execBrief}
        meetings={workspace.meetings}
        signals={workspace.signals}
      />
    ),
    expansion: (
      <ExpansionEngine
        motions={workspace.expansionMotions}
        orgNodes={workspace.orgNodes}
      />
    ),
    actions: (
      <AgentActions
        agents={agents}
        actions={workspace.agentActions}
        approvals={workspace.approvals}
        auditTrail={workspace.auditTrail}
        lastApprovedTitle={lastApprovedTitle}
        clearLastApproved={clearLastApproved}
        onApprove={handleApprove}
        onReject={handleReject}
        onModify={handleModify}
      />
    ),
    manager: (
      <ManagerView
        snapshot={workspace.managerSnapshot}
        opportunities={workspace.opportunities}
        tasks={workspace.tasks}
        workflows={workspace.workflows}
      />
    ),
    vision: <Vision />,
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Subtle Anthropic ambient gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,119,86,0.02),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(218,119,86,0.01),transparent_55%)]" />

        <StatusBar
          account={account}
          accounts={accounts}
          onAccountChange={setAccountId}
          pipelineValue={pipelineValue}
          whitespaceValue={whitespaceValue}
          nextMeeting={nextMeeting ? formatDateTime(nextMeeting.startAt) : "No meeting scheduled"}
          connectedSources={connectedSources}
          activeAgents={activeAgentsCount}
          openApprovals={openApprovals}
        />
        <main className="relative flex-1 overflow-y-auto px-10 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto max-w-5xl"
            >
              {sections[activeSection]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
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
