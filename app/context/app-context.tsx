"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { accounts, defaultAccountId } from "@/data/accounts";
import { buildAgentRoster, createWorkspace } from "@/data/workspaces";
import type { Account, Agent, ApprovalRequest, SellerWorkspace } from "@/types";

interface AppContextValue {
  accountId: string;
  account: Account;
  accounts: Account[];
  workspace: SellerWorkspace;
  agents: Agent[];
  setAccountId: (id: string) => void;
  lastApprovedTitle: string | null;
  clearLastApproved: () => void;
  handleApprove: (approvalId: string) => void;
  handleReject: (approvalId: string) => void;
  handleModify: (approvalId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function buildWorkQueueSnapshot(workspace: SellerWorkspace): SellerWorkspace["workQueue"] {
  const primaryTask = workspace.tasks[0];
  const execTask = workspace.tasks[2];
  const pendingApproval = workspace.approvals.find((approval) => approval.status === "pending");
  const upcomingMeeting = workspace.meetings.find((meeting) => meeting.status === "upcoming");
  const primarySignal = workspace.signals[0];

  return [
    {
      id: `${primaryTask?.id ?? "task"}-queue`,
      title: primaryTask?.title ?? "Finalize next step",
      summary: primaryTask?.detail ?? "Move the current motion forward.",
      priority: primaryTask?.priority ?? "high",
      dueLabel: "Tomorrow",
      workflowId: primaryTask?.workflowId ?? "deal-room",
      type: "task",
      actionLabel: "Finish the scorecard",
    },
    ...(pendingApproval
      ? [
          {
            id: `${pendingApproval.id}-queue`,
            title: pendingApproval.title,
            summary: pendingApproval.reason,
            priority: "critical" as const,
            dueLabel: "Awaiting review",
            workflowId: "deal-room",
            type: "approval" as const,
            actionLabel: "Review approval",
          },
        ]
      : []),
    ...(upcomingMeeting
      ? [
          {
            id: `${upcomingMeeting.id}-queue`,
            title: upcomingMeeting.title,
            summary: upcomingMeeting.objective,
            priority: "high" as const,
            dueLabel: "Upcoming",
            workflowId: upcomingMeeting.type === "exec" ? "exec-prep" : "deal-room",
            type: "meeting" as const,
            actionLabel: "Open meeting brief",
          },
        ]
      : []),
    {
      id: `${primarySignal?.id ?? "signal"}-queue`,
      title: primarySignal?.title ?? "Review latest signal",
      summary: primarySignal?.summary ?? "A new signal needs review.",
      priority: primarySignal?.priority ?? "medium",
      dueLabel: "Fresh",
      workflowId: "my-book",
      type: "signal",
      actionLabel: "Apply signal",
    },
    {
      id: `${execTask?.id ?? "task-exec"}-queue`,
      title: execTask?.title ?? "Prep sponsor memo",
      summary: execTask?.detail ?? "Package the why-now story.",
      priority: execTask?.priority ?? "high",
      dueLabel: "This week",
      workflowId: execTask?.workflowId ?? "exec-prep",
      type: "task",
      actionLabel: "Draft narrative",
    },
  ];
}

function updateWorkspaceForDecision(
  workspace: SellerWorkspace,
  approvalId: string,
  nextStatus: ApprovalRequest["status"]
): SellerWorkspace {
  const approval = workspace.approvals.find((item) => item.id === approvalId);
  if (!approval) return workspace;

  const linkedAction = workspace.agentActions.find(
    (action) => action.id === approval.linkedActionId
  );
  const nextActionStatus =
    nextStatus === "approved"
      ? "completed"
      : nextStatus === "modified"
        ? "modified"
        : "rejected";

  const nextTasks =
    linkedAction == null
      ? workspace.tasks
      : workspace.tasks.map((task) => {
          if (!linkedAction.linkedTaskIds.includes(task.id)) return task;
          if (nextStatus === "approved") {
            return { ...task, status: "in_progress" as const };
          }
          if (nextStatus === "modified") {
            return { ...task, status: "todo" as const };
          }
          return { ...task, status: "blocked" as const };
        });

  const nextExpansionMotions =
    linkedAction == null
      ? workspace.expansionMotions
      : workspace.expansionMotions.map((motion) => {
          if (!linkedAction.linkedExpansionIds.includes(motion.id)) return motion;
          if (nextStatus === "approved") {
            return { ...motion, stage: "multithreading" as const };
          }
          return motion;
        });

  const auditVerb =
    nextStatus === "approved"
      ? "Approved action"
      : nextStatus === "modified"
        ? "Requested modification"
        : "Rejected action";

  const nextApprovals = workspace.approvals.map((item) =>
    item.id === approvalId ? { ...item, status: nextStatus } : item
  );

  const nextAgentActions = workspace.agentActions.map((action) =>
    action.id === approval.linkedActionId ? { ...action, status: nextActionStatus } : action
  );

  const nextManagerSnapshot = {
    ...workspace.managerSnapshot,
    riskCount: nextTasks.filter(
      (task) => task.status === "blocked" || task.priority === "critical"
    ).length,
  };

  const nextWorkspace = {
    ...workspace,
    approvals: nextApprovals,
    agentActions: nextAgentActions,
    tasks: nextTasks,
    expansionMotions: nextExpansionMotions,
    managerSnapshot: nextManagerSnapshot,
    auditTrail: [
      {
        id: `${approval.id}-${nextStatus}`,
        actor: "George Trosley",
        action: auditVerb,
        detail: `${approval.title} was ${nextStatus} in the agent action center.`,
        timestamp: new Date(),
        outcome:
          nextStatus === "approved"
            ? "approved"
            : nextStatus === "modified"
              ? "modified"
              : "rejected",
      },
      ...workspace.auditTrail,
    ],
    currentRecommendation:
      nextStatus === "approved"
        ? `The approved action "${approval.title}" is now in motion. Use that momentum to tighten the pilot scorecard and prepare the next sponsor conversation.`
        : nextStatus === "modified"
          ? `The seller requested changes to "${approval.title}". Revise the artifact, keep the narrative tight, and return for review.`
          : `The seller rejected "${approval.title}". Reassess the risk, preserve sponsor trust, and pick the next safest action.`,
  };

  return {
    ...nextWorkspace,
    workQueue: buildWorkQueueSnapshot(nextWorkspace),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountIdState] = useState(defaultAccountId);
  const [workspace, setWorkspace] = useState<SellerWorkspace>(() =>
    createWorkspace(defaultAccountId)
  );
  const [lastApprovedTitle, setLastApprovedTitle] = useState<string | null>(null);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const agents = useMemo(() => buildAgentRoster(workspace), [workspace]);

  const setAccountId = useCallback((id: string) => {
    setAccountIdState(id);
    setWorkspace(createWorkspace(id));
    setLastApprovedTitle(null);
  }, []);

  const clearLastApproved = useCallback(() => setLastApprovedTitle(null), []);

  const handleApprove = useCallback((approvalId: string) => {
    const approval = workspace.approvals.find((item) => item.id === approvalId);
    if (!approval) return;
    setWorkspace((prev) => updateWorkspaceForDecision(prev, approvalId, "approved"));
    setLastApprovedTitle(approval.title);
  }, [workspace.approvals]);

  const handleReject = useCallback((approvalId: string) => {
    setWorkspace((prev) => updateWorkspaceForDecision(prev, approvalId, "rejected"));
  }, []);

  const handleModify = useCallback((approvalId: string) => {
    setWorkspace((prev) => updateWorkspaceForDecision(prev, approvalId, "modified"));
  }, []);

  const value: AppContextValue = {
    accountId,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
