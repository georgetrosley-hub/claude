"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { accounts, defaultAccountId } from "@/data/accounts";
import { createInitialAgents } from "@/data/agents";
import { getCompetitorsByAccount } from "@/data/competitors";
import {
  buildAccountSignals,
  buildExecutionItems,
  buildStakeholders,
  buildWorkspaceDraft,
  getCurrentPhaseLabel,
} from "@/data/account-ops";
import type {
  Account,
  Agent,
  AccountSignal,
  ExecutionItem,
  Stakeholder,
  WorkspaceDraft,
} from "@/types";

interface AppState {
  accountId: string;
  account: Account;
  agents: Agent[];
  signals: AccountSignal[];
  stakeholders: Stakeholder[];
  executionItems: ExecutionItem[];
  workspaceDraft: WorkspaceDraft;
  currentPhase: string;
  currentRecommendation: string;
  pipelineTarget: number;
}

interface AppContextValue extends AppState {
  accounts: Account[];
  competitors: ReturnType<typeof getCompetitorsByAccount>;
  pendingDecisionCount: number;
  lastDecisionTitle: string | null;
  setAccountId: (id: string) => void;
  clearLastDecision: () => void;
  handleApproveDecision: (itemId: string) => void;
  handleDeferDecision: (itemId: string) => void;
  updateWorkspaceField: (field: keyof WorkspaceDraft, value: string) => void;
  updateStakeholderStance: (stakeholderId: string, stance: Stakeholder["stance"]) => void;
  updateExecutionStatus: (itemId: string, status: ExecutionItem["status"]) => void;
  updateSignalDisposition: (
    signalId: string,
    disposition: AccountSignal["disposition"]
  ) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountIdState] = useState(defaultAccountId);
  const [agents, setAgents] = useState<Agent[]>(() =>
    createInitialAgents()
  );
  const [signalsByAccount, setSignalsByAccount] = useState<Record<string, AccountSignal[]>>(
    () =>
      Object.fromEntries(
        accounts.map((account) => [
          account.id,
          buildAccountSignals(account, getCompetitorsByAccount(account.id)),
        ])
      )
  );
  const [stakeholdersByAccount, setStakeholdersByAccount] = useState<
    Record<string, Stakeholder[]>
  >(() =>
    Object.fromEntries(
      accounts.map((account) => [account.id, buildStakeholders(account)])
    )
  );
  const [executionItemsByAccount, setExecutionItemsByAccount] = useState<
    Record<string, ExecutionItem[]>
  >(() =>
    Object.fromEntries(
      accounts.map((account) => [account.id, buildExecutionItems(account)])
    )
  );
  const [workspaceDraftsByAccount, setWorkspaceDraftsByAccount] = useState<
    Record<string, WorkspaceDraft>
  >(() =>
    Object.fromEntries(
      accounts.map((account) => [
        account.id,
        buildWorkspaceDraft(account, getCompetitorsByAccount(account.id)),
      ])
    )
  );
  const [lastDecisionTitle, setLastDecisionTitle] = useState<string | null>(null);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const competitors = getCompetitorsByAccount(accountId);
  const signals = useMemo(
    () => signalsByAccount[accountId] ?? buildAccountSignals(account, competitors),
    [account, accountId, competitors, signalsByAccount]
  );
  const stakeholders = useMemo(
    () => stakeholdersByAccount[accountId] ?? buildStakeholders(account),
    [account, accountId, stakeholdersByAccount]
  );
  const executionItems = useMemo(
    () => executionItemsByAccount[accountId] ?? buildExecutionItems(account),
    [account, accountId, executionItemsByAccount]
  );
  const workspaceDraft = useMemo(
    () =>
      workspaceDraftsByAccount[accountId] ??
      buildWorkspaceDraft(account, competitors),
    [account, accountId, competitors, workspaceDraftsByAccount]
  );

  const setAccountId = useCallback((id: string) => {
    setAccountIdState(id);
    setAgents(createInitialAgents());
    setLastDecisionTitle(null);
  }, []);

  const clearLastDecision = useCallback(() => setLastDecisionTitle(null), []);
  const handleApproveDecision = useCallback((itemId: string) => {
    setExecutionItemsByAccount((prev) => ({
      ...prev,
      [accountId]: (prev[accountId] ?? executionItems).map((item) =>
        item.id === itemId
          ? {
              ...item,
              decisionStatus: "approved" as const,
              status: "in_progress" as const,
            }
          : item
      ),
    }));
    const approvedItem = executionItems.find((item) => item.id === itemId);
    setLastDecisionTitle(approvedItem?.title ?? "Decision recorded");
  }, [accountId, executionItems]);

  const handleDeferDecision = useCallback((itemId: string) => {
    setExecutionItemsByAccount((prev) => ({
      ...prev,
      [accountId]: (prev[accountId] ?? executionItems).map((item) =>
        item.id === itemId
          ? {
              ...item,
              decisionStatus: "deferred" as const,
            }
          : item
      ),
    }));
  }, [accountId, executionItems]);

  const updateWorkspaceField = useCallback(
    (field: keyof WorkspaceDraft, value: string) => {
      setWorkspaceDraftsByAccount((prev) => ({
        ...prev,
        [accountId]: {
          ...(prev[accountId] ?? workspaceDraft),
          [field]: value,
        },
      }));
    },
    [accountId, workspaceDraft]
  );

  const updateStakeholderStance = useCallback(
    (stakeholderId: string, stance: Stakeholder["stance"]) => {
      setStakeholdersByAccount((prev) => ({
        ...prev,
        [accountId]: (prev[accountId] ?? stakeholders).map((stakeholder) =>
          stakeholder.id === stakeholderId
            ? { ...stakeholder, stance }
            : stakeholder
        ),
      }));
    },
    [accountId, stakeholders]
  );

  const updateExecutionStatus = useCallback(
    (itemId: string, status: ExecutionItem["status"]) => {
      setExecutionItemsByAccount((prev) => ({
        ...prev,
        [accountId]: (prev[accountId] ?? executionItems).map((item) =>
          item.id === itemId ? { ...item, status } : item
        ),
      }));
    },
    [accountId, executionItems]
  );

  const updateSignalDisposition = useCallback(
    (signalId: string, disposition: AccountSignal["disposition"]) => {
      setSignalsByAccount((prev) => ({
        ...prev,
        [accountId]: (prev[accountId] ?? signals).map((signal) =>
          signal.id === signalId ? { ...signal, disposition } : signal
        ),
      }));
    },
    [accountId, signals]
  );

  const currentPhase = getCurrentPhaseLabel(executionItems);
  const pendingDecisionCount = executionItems.filter(
    (item) => item.decisionRequired && item.decisionStatus === "pending"
  ).length;
  const pipelineTarget = account.estimatedLandValue + account.estimatedExpansionValue * 0.4;
  const currentRecommendation = signals[0]?.recommendedAction ?? `Proceed with ${account.firstWedge}.`;

  const value: AppContextValue = {
    accountId,
    account,
    agents,
    signals,
    stakeholders,
    executionItems,
    workspaceDraft,
    currentPhase,
    currentRecommendation,
    pipelineTarget,
    accounts,
    competitors,
    pendingDecisionCount,
    lastDecisionTitle,
    setAccountId,
    clearLastDecision,
    handleApproveDecision,
    handleDeferDecision,
    updateWorkspaceField,
    updateStakeholderStance,
    updateExecutionStatus,
    updateSignalDisposition,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
