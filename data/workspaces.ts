import { accounts } from "@/data/accounts";
import { agentDefinitions } from "@/data/agents";
import { getCompetitorsByAccount } from "@/data/competitors";
import type {
  Account,
  AccountPlan,
  Agent,
  AgentAction,
  ApprovalRequest,
  AuditEntry,
  DataSourceStatus,
  EvidenceLink,
  ExecBrief,
  ExpansionMotion,
  ManagerSnapshot,
  Meeting,
  Opportunity,
  OpportunityStage,
  OrgNode,
  SellerWorkflow,
  SellerWorkspace,
  Signal,
  Stakeholder,
  Task,
  WorkQueueItem,
} from "@/types";

const WORKFLOWS: SellerWorkflow[] = [
  {
    id: "my-book",
    title: "My Book",
    objective: "Keep the rep focused on the highest-leverage work across active accounts.",
    owner: "AE",
    status: "live",
    summary: "Prioritized queue of approvals, prep, follow-up, and expansion moves.",
  },
  {
    id: "account-os",
    title: "Account Planning",
    objective: "Maintain one live source of truth for the account strategy.",
    owner: "AE + Claude",
    status: "live",
    summary: "Stakeholder map, qualification gaps, whitespace, blockers, and winning themes.",
  },
  {
    id: "deal-room",
    title: "Deal Execution",
    objective: "Move the land motion from wedge to deployment with fewer stalls.",
    owner: "AE + SE",
    status: "attention",
    summary: "Pilot, security, legal, procurement, and mutual action plan tracking.",
  },
  {
    id: "exec-prep",
    title: "Meeting Prep & Follow-up",
    objective: "Give the seller the right narrative before and after every key interaction.",
    owner: "AE",
    status: "live",
    summary: "Briefs, objection handling, follow-up drafts, and CRM-ready notes.",
  },
  {
    id: "expansion-engine",
    title: "Expansion Planning",
    objective: "Turn one winning wedge into a multi-org expansion path.",
    owner: "AE + Expansion Agent",
    status: "building",
    summary: "Whitespace mapping, sponsor paths, adoption signals, and next teams to pursue.",
  },
];

const ORG_BLUEPRINT = [
  { name: "Platform Engineering", useCase: "Developer productivity and internal tooling" },
  { name: "Security", useCase: "Policy mapping, review packets, and governance alignment" },
  { name: "Finance", useCase: "Business case, ROI, and governed knowledge workflows" },
  { name: "Legal", useCase: "Contract review and enterprise agreement alignment" },
  { name: "Customer Support", useCase: "Service workflows, resolution quality, and deflection" },
  { name: "Operations", useCase: "Process documentation and knowledge handoffs" },
  { name: "Product", useCase: "PRD synthesis, support feedback, and roadmap context" },
  { name: "Executive Leadership", useCase: "QBR prep and sponsor storytelling" },
] as const;

function daysFromNow(days: number, hour = 10): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function normalizeName(value: string): string {
  return value.split(" (")[0]?.trim() ?? value;
}

function toId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getPrimaryStage(account: Account): OpportunityStage {
  if (account.securitySensitivity >= 95 || account.complianceComplexity >= 92) {
    return "security_review";
  }
  if (account.competitivePressure >= 90) {
    return "executive_alignment";
  }
  if (account.aiMaturityScore >= 80) {
    return "pilot_design";
  }
  return "discovery";
}

function getPrimaryTeam(account: Account): string {
  const wedge = account.firstWedge.toLowerCase();
  if (wedge.includes("support")) return "Customer Support";
  if (wedge.includes("finance") || wedge.includes("model risk")) return "Finance";
  if (wedge.includes("legal")) return "Legal";
  if (wedge.includes("r&d") || wedge.includes("medical")) return "Product";
  if (wedge.includes("developer") || wedge.includes("engineering") || wedge.includes("code")) {
    return "Platform Engineering";
  }
  return "Operations";
}

function buildDataSources(account: Account): DataSourceStatus[] {
  const hasSalesforce = account.existingVendorFootprint.some((vendor) =>
    vendor.toLowerCase().includes("salesforce")
  );

  return [
    {
      id: "salesforce",
      label: "Salesforce",
      category: "crm",
      status: hasSalesforce ? "connected" : "planned",
      freshness: hasSalesforce ? "12 min" : "planned",
      lastSync: hoursAgo(1),
    },
    {
      id: "gong",
      label: "Gong / call notes",
      category: "conversation",
      status: "syncing",
      freshness: "2 hrs",
      lastSync: hoursAgo(2),
    },
    {
      id: "docs",
      label: "Docs and collateral",
      category: "knowledge",
      status: "connected",
      freshness: "4 hrs",
      lastSync: hoursAgo(4),
    },
    {
      id: "slack",
      label: "Slack threads",
      category: "collaboration",
      status: "connected",
      freshness: "30 min",
      lastSync: hoursAgo(1),
    },
    {
      id: "usage",
      label: "Pilot usage signals",
      category: "product",
      status: "planned",
      freshness: "planned",
      lastSync: hoursAgo(10),
    },
  ];
}

function buildStakeholders(account: Account): Stakeholder[] {
  const primaryTeam = getPrimaryTeam(account);
  const execSponsors = account.executiveSponsors.slice(0, 2).map((name, index) => ({
    id: `${account.id}-exec-${index}`,
    name: normalizeName(name),
    title: index === 0 ? "Executive sponsor" : "Executive reviewer",
    team: "Executive Leadership",
    role: "executive_sponsor" as const,
    influence: 86 - index * 8,
    sentiment: "supporter" as const,
    lastTouch: hoursAgo(30 + index * 8),
    nextStep: index === 0 ? "Confirm sponsor talking points" : "Share executive memo before next review",
  }));

  return [
    {
      id: `${account.id}-champion`,
      name: `${account.name} ${primaryTeam} champion`,
      title: primaryTeam === "Finance" ? "SVP, Model Risk" : `Director, ${primaryTeam}`,
      team: primaryTeam,
      role: "champion",
      influence: 88,
      sentiment: "supporter",
      lastTouch: hoursAgo(18),
      nextStep: "Lock success criteria and mutual action plan",
    },
    {
      id: `${account.id}-technical`,
      name: `${account.name} technical buyer`,
      title: "Senior Director, Architecture",
      team: "Platform Engineering",
      role: "technical_buyer",
      influence: 79,
      sentiment: "neutral",
      lastTouch: hoursAgo(26),
      nextStep: "Review deployment topology and identity path",
    },
    {
      id: `${account.id}-security`,
      name: `${account.name} security lead`,
      title: "Director, Security Architecture",
      team: "Security",
      role: "security",
      influence: 74,
      sentiment: account.securitySensitivity >= 90 ? "skeptical" : "neutral",
      lastTouch: hoursAgo(42),
      nextStep: "Share governance packet and data-flow answers",
    },
    {
      id: `${account.id}-economic`,
      name: `${account.name} budget owner`,
      title: "VP, Transformation Finance",
      team: "Finance",
      role: "economic_buyer",
      influence: 82,
      sentiment: "neutral",
      lastTouch: hoursAgo(55),
      nextStep: "Quantify land value and 12-month expansion case",
    },
    {
      id: `${account.id}-coach`,
      name: `${account.name} internal coach`,
      title: "Chief of Staff to CIO",
      team: "Executive Leadership",
      role: "coach",
      influence: 68,
      sentiment: "supporter",
      lastTouch: hoursAgo(12),
      nextStep: "Validate executive narrative before sponsor meeting",
    },
    ...execSponsors,
  ];
}

function buildSignals(account: Account, stakeholders: Stakeholder[]): Signal[] {
  const champion = stakeholders.find((stakeholder) => stakeholder.role === "champion");
  const securityLead = stakeholders.find((stakeholder) => stakeholder.role === "security");
  const execSponsor = stakeholders.find((stakeholder) => stakeholder.role === "executive_sponsor");

  return [
    {
      id: `${account.id}-signal-crm`,
      source: "crm",
      title: "Champion momentum increasing",
      summary: `${champion?.name ?? "Champion"} updated the pilot scope in CRM and requested success criteria before next week.`,
      priority: "high",
      occurredAt: hoursAgo(5),
      linkedStakeholderIds: champion ? [champion.id] : [],
      recommendedAction: "Send the pilot scorecard and confirm decision timeline.",
    },
    {
      id: `${account.id}-signal-call`,
      source: "call",
      title: "Security objections narrowed",
      summary: `${securityLead?.name ?? "Security"} is focused on auditability and data boundary questions, not model quality concerns.`,
      priority: account.securitySensitivity >= 90 ? "critical" : "medium",
      occurredAt: hoursAgo(11),
      linkedStakeholderIds: securityLead ? [securityLead.id] : [],
      recommendedAction: "Package governance controls into a single shareable review artifact.",
    },
    {
      id: `${account.id}-signal-news`,
      source: "news",
      title: "Competitive window is active",
      summary: `The current buying motion is vulnerable to bundled AI positioning. This is the right window to push Claude's model-quality and vendor-choice story.`,
      priority: "medium",
      occurredAt: hoursAgo(20),
      linkedStakeholderIds: [],
      recommendedAction: "Lead the next meeting with a clear why-Claude, why-now narrative.",
    },
    {
      id: `${account.id}-signal-exec`,
      source: "email",
      title: "Sponsor review requested",
      summary: `${execSponsor?.name ?? "Executive sponsor"} requested a one-page narrative ahead of the next leadership review.`,
      priority: "high",
      occurredAt: hoursAgo(28),
      linkedStakeholderIds: execSponsor ? [execSponsor.id] : [],
      recommendedAction: "Draft a concise executive memo with business case, risk posture, and expansion path.",
    },
  ];
}

function buildTasks(account: Account): Task[] {
  return [
    {
      id: `${account.id}-task-pilot`,
      title: "Finalize pilot success criteria",
      workflowId: "deal-room",
      owner: "George Trosley",
      status: "in_progress",
      priority: "high",
      dueDate: daysFromNow(1),
      detail: "Define 3 measurable proof points, owners, and review dates before the pilot kickoff.",
    },
    {
      id: `${account.id}-task-security`,
      title: "Send security packet",
      workflowId: "deal-room",
      owner: "Security Agent",
      status: "todo",
      priority: account.securitySensitivity >= 90 ? "critical" : "high",
      dueDate: daysFromNow(2),
      detail: "Bundle data handling, audit logging, identity, and deployment answers into a single artifact.",
    },
    {
      id: `${account.id}-task-exec`,
      title: "Prepare executive sponsor memo",
      workflowId: "exec-prep",
      owner: "Executive Narrative Agent",
      status: "todo",
      priority: "high",
      dueDate: daysFromNow(2, 14),
      detail: "Summarize why now, why Claude, expected impact, and open risks for the next exec review.",
    },
    {
      id: `${account.id}-task-crm`,
      title: "Update Salesforce with multi-threading plan",
      workflowId: "my-book",
      owner: "Territory Intelligence Agent",
      status: "todo",
      priority: "medium",
      dueDate: daysFromNow(3),
      detail: "Document the current sponsor map, next meetings, and whitespace hypotheses in CRM.",
    },
    {
      id: `${account.id}-task-expansion`,
      title: "Sequence next expansion team",
      workflowId: "expansion-engine",
      owner: "Expansion Strategy Agent",
      status: "blocked",
      priority: "medium",
      dueDate: daysFromNow(4),
      detail: "Pick the next team to pursue once the land motion clears security and sponsor alignment.",
    },
  ];
}

function buildMeetings(account: Account, stakeholders: Stakeholder[]): Meeting[] {
  const champion = stakeholders.find((stakeholder) => stakeholder.role === "champion");
  const securityLead = stakeholders.find((stakeholder) => stakeholder.role === "security");
  const execSponsor = stakeholders.find((stakeholder) => stakeholder.role === "executive_sponsor");

  return [
    {
      id: `${account.id}-meeting-discovery`,
      title: "Pilot scorecard review",
      type: "follow_up",
      startAt: daysFromNow(1, 11),
      owner: "George Trosley",
      attendees: [champion?.name ?? "Champion", "Solutions Engineer"],
      objective: "Agree success criteria, timeline, and buyer-side owners.",
      status: "upcoming",
    },
    {
      id: `${account.id}-meeting-security`,
      title: "Security architecture review",
      type: "security",
      startAt: daysFromNow(3, 13),
      owner: "Security Agent",
      attendees: [securityLead?.name ?? "Security lead", "Solutions Architect"],
      objective: "Resolve deployment, audit, and data-boundary objections.",
      status: "upcoming",
    },
    {
      id: `${account.id}-meeting-exec`,
      title: "Executive sponsor prep",
      type: "exec",
      startAt: daysFromNow(5, 9),
      owner: "Executive Narrative Agent",
      attendees: [execSponsor?.name ?? "Executive sponsor", "George Trosley"],
      objective: "Rehearse the narrative and align on the business case.",
      status: "upcoming",
    },
    {
      id: `${account.id}-meeting-last`,
      title: "Technical discovery recap",
      type: "discovery",
      startAt: hoursAgo(32),
      owner: "Technical Architecture Agent",
      attendees: [champion?.name ?? "Champion", "Architecture lead"],
      objective: "Review deployment constraints and technical success criteria.",
      status: "completed",
    },
  ];
}

function buildOpportunities(account: Account, stakeholders: Stakeholder[]): Opportunity[] {
  const champion = stakeholders.find((stakeholder) => stakeholder.role === "champion");
  const execSponsor = stakeholders.find((stakeholder) => stakeholder.role === "executive_sponsor");
  const primaryStage = getPrimaryStage(account);

  return [
    {
      id: `${account.id}-land`,
      name: `${account.name} land motion`,
      stage: primaryStage,
      amount: account.estimatedLandValue,
      forecastCategory: primaryStage === "executive_alignment" ? "commit" : "best_case",
      closeDate: daysFromNow(45),
      useCase: account.firstWedge,
      sponsor: champion?.name ?? "Champion",
      blockers: account.topBlockers.slice(0, 2),
      nextStep: "Convert current momentum into a time-bound pilot decision.",
    },
    {
      id: `${account.id}-expand`,
      name: `${account.name} expansion path`,
      stage: "expansion",
      amount: Number((account.estimatedExpansionValue * 0.45).toFixed(2)),
      forecastCategory: "pipeline",
      closeDate: daysFromNow(120),
      useCase: account.topExpansionPaths[0] ?? "Cross-functional AI rollout",
      sponsor: execSponsor?.name ?? "Executive sponsor",
      blockers: ["Land motion must produce a credible success story first", "Need stronger buying committee coverage"],
      nextStep: "Identify the best adjacent team and package the first expansion hypothesis.",
    },
  ];
}

function buildAccountPlan(account: Account): AccountPlan {
  return {
    objective: `Land ${account.firstWedge.toLowerCase()} and create an account-level expansion story within two quarters.`,
    wedge: account.firstWedge,
    valueHypothesis: `Claude can help ${account.name} move faster in high-trust workflows while preserving enterprise governance and vendor choice.`,
    winThemes: [
      "Model quality and reasoning depth for real enterprise work",
      "Human-in-the-loop governance for high-trust workflows",
      "Vendor choice outside bundled incumbent AI motions",
    ],
    whitespaceThemes: account.topExpansionPaths,
    blockers: account.topBlockers,
    nextMilestones: [
      "Lock sponsor-backed pilot scorecard",
      "Complete security and legal readiness package",
      "Convert pilot success into one adjacent-team expansion plan",
    ],
    qualification: [
      {
        id: `${account.id}-qual-metrics`,
        label: "Metrics and success criteria",
        status: "partial",
        note: "Pilot scorecard exists but buyer-side owners are not fully locked.",
      },
      {
        id: `${account.id}-qual-economic`,
        label: "Economic buyer access",
        status: "partial",
        note: "Executive sponsors are aware, but budget timing still needs to be pinned down.",
      },
      {
        id: `${account.id}-qual-decision`,
        label: "Decision process clarity",
        status: account.complianceComplexity >= 90 ? "gap" : "partial",
        note: "Security, legal, and procurement sequencing remains the biggest risk to timing.",
      },
      {
        id: `${account.id}-qual-pain`,
        label: "Compelling use-case pain",
        status: "strong",
        note: "The current wedge clearly aligns with an active business priority.",
      },
    ],
  };
}

function buildExpansionMotions(account: Account, stakeholders: Stakeholder[]): ExpansionMotion[] {
  const expansionSponsor = stakeholders.find((stakeholder) => stakeholder.role === "coach");
  const teams = ["Customer Support", "Finance", "Operations"];

  return account.topExpansionPaths.slice(0, 3).map((path, index) => ({
    id: `${account.id}-expansion-${index}`,
    team: teams[index] ?? "Product",
    useCase: path,
    stage: index === 0 ? "multithreading" : index === 1 ? "mapped" : "pilot",
    arrPotential: Number((account.estimatedExpansionValue * (0.22 + index * 0.08)).toFixed(2)),
    sponsor: expansionSponsor?.name ?? "Chief of Staff to CIO",
    adoptionSignal: index === 0 ? "Adjacent team already asking for discovery" : "Interest inferred from current account priorities",
    confidence: 74 - index * 8,
    nextStep: index === 0 ? "Open stakeholder mapping and validate budget owner" : "Confirm whether the use case can ride the land motion narrative",
  }));
}

function buildOrgNodes(account: Account, expansions: ExpansionMotion[]): OrgNode[] {
  const primaryTeam = getPrimaryTeam(account);
  const stage = getPrimaryStage(account);

  return ORG_BLUEPRINT.map((node, index) => {
    const expansion = expansions.find((item) => item.team === node.name);
    const isPrimary = node.name === primaryTeam;
    const status = isPrimary
      ? stage === "deployment" || stage === "executive_alignment"
        ? "pilot"
        : "engaged"
      : expansion?.stage === "pilot"
        ? "pilot"
        : expansion?.stage === "multithreading"
          ? "engaged"
          : expansion
            ? "identified"
            : index < 2
              ? "identified"
              : "latent";

    return {
      id: `${account.id}-${toId(node.name)}`,
      name: node.name,
      useCase: expansion?.useCase ?? node.useCase,
      buyingLikelihood: Math.min(94, 58 + index * 4 + (isPrimary ? 12 : 0)),
      arrPotential: Number(
        (
          expansion?.arrPotential ??
          (isPrimary ? account.estimatedLandValue * 0.6 : account.estimatedExpansionValue * 0.08)
        ).toFixed(2)
      ),
      status,
      recommendedNextStep: expansion?.nextStep ?? (isPrimary ? "Drive pilot alignment and create internal success story" : "Map sponsor and connect use case to current momentum"),
    };
  });
}

function buildEvidence(signals: Signal[], account: Account): EvidenceLink[] {
  return [
    {
      id: `${account.id}-evidence-1`,
      label: "Recent CRM update",
      source: "crm",
      detail: signals[0]?.summary ?? "CRM notes captured a stronger champion signal.",
      freshness: "5 hrs ago",
    },
    {
      id: `${account.id}-evidence-2`,
      label: "Last call summary",
      source: "call",
      detail: signals[1]?.summary ?? "Recent call confirmed the top blocker.",
      freshness: "11 hrs ago",
    },
    {
      id: `${account.id}-evidence-3`,
      label: "Executive request",
      source: "email",
      detail: signals[3]?.summary ?? "Sponsor requested a concise next-step memo.",
      freshness: "1 day ago",
    },
  ];
}

function buildAgentActions(
  account: Account,
  signals: Signal[],
  expansions: ExpansionMotion[]
): AgentAction[] {
  const evidence = buildEvidence(signals, account);
  const topExpansion = expansions[0];
  const topCompetitor = getCompetitorsByAccount(account.id)
    .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)[0];

  return [
    {
      id: `${account.id}-action-crm`,
      agentId: "territory",
      agentName: "Territory Intelligence Agent",
      title: "Refresh CRM account strategy",
      summary: "Update the opportunity notes, multi-threading map, and next-step owners in Salesforce.",
      workflowId: "my-book",
      actionType: "update_crm",
      targetSystem: "Salesforce",
      status: "ready",
      priority: "medium",
      confidence: 0.84,
      rationale: "The account plan changed materially after the latest champion and sponsor signals.",
      approvalRequired: false,
      evidence: evidence.slice(0, 2),
      linkedTaskIds: [`${account.id}-task-crm`],
      linkedExpansionIds: [],
      estimatedImpact: "Improves inspection hygiene and keeps the account story current.",
    },
    {
      id: `${account.id}-action-security`,
      agentId: "security",
      agentName: "Security and Compliance Agent",
      title: "Send governed security packet",
      summary: "Package architecture, auditability, identity, and data-boundary answers for buyer review.",
      workflowId: "deal-room",
      actionType: "security_packet",
      targetSystem: "Email + docs",
      status: "awaiting_approval",
      priority: account.securitySensitivity >= 90 ? "critical" : "high",
      confidence: 0.91,
      rationale: "Security is the primary gating factor and the objections are now specific enough to answer cleanly.",
      approvalRequired: true,
      evidence: evidence.slice(0, 2),
      linkedTaskIds: [`${account.id}-task-security`],
      linkedExpansionIds: [],
      estimatedImpact: "Can pull the deal out of security limbo and preserve buyer momentum.",
    },
    {
      id: `${account.id}-action-brief`,
      agentId: "executive",
      agentName: "Executive Narrative Agent",
      title: "Draft executive sponsor memo",
      summary: "Prepare a one-page why-now, why-Claude narrative for the next leadership review.",
      workflowId: "exec-prep",
      actionType: "exec_memo",
      targetSystem: "Docs",
      status: "awaiting_approval",
      priority: "high",
      confidence: 0.88,
      rationale: "Sponsor pull is present, but the narrative needs to translate technical progress into executive urgency.",
      approvalRequired: true,
      evidence: [evidence[0], evidence[2]],
      linkedTaskIds: [`${account.id}-task-exec`],
      linkedExpansionIds: [],
      estimatedImpact: "Improves executive alignment and gives the rep a cleaner sponsor ask.",
    },
    {
      id: `${account.id}-action-meeting`,
      agentId: "research",
      agentName: "Research Agent",
      title: "Generate meeting prep brief",
      summary: "Summarize stakeholder sentiment, likely objections, and the strongest next-step ask before tomorrow's call.",
      workflowId: "exec-prep",
      actionType: "meeting_brief",
      targetSystem: "Workspace",
      status: "ready",
      priority: "high",
      confidence: 0.86,
      rationale: "The next meeting is close enough that the seller needs a single, focused prep artifact.",
      approvalRequired: false,
      evidence: evidence,
      linkedTaskIds: [`${account.id}-task-pilot`],
      linkedExpansionIds: [],
      estimatedImpact: "Sharpens the live call and reduces the chance of missing a stakeholder concern.",
    },
    {
      id: `${account.id}-action-competitive`,
      agentId: "competitive",
      agentName: "Competitive Strategy Agent",
      title: "Assemble countermove against incumbent AI",
      summary: `Build a tailored positioning memo against ${topCompetitor?.name ?? "the incumbent motion"}.`,
      workflowId: "deal-room",
      actionType: "competitive_brief",
      targetSystem: "Workspace",
      status: "ready",
      priority: "medium",
      confidence: 0.79,
      rationale: "The current buying motion will be evaluated against bundled or incumbent alternatives.",
      approvalRequired: false,
      evidence: [evidence[0], evidence[1]],
      linkedTaskIds: [],
      linkedExpansionIds: [],
      estimatedImpact: "Gives the rep a cleaner story for why Claude wins in this account.",
    },
    {
      id: `${account.id}-action-expansion`,
      agentId: "expansion",
      agentName: "Expansion Strategy Agent",
      title: "Sequence the next expansion motion",
      summary: `Turn ${topExpansion?.team ?? "the next adjacent team"} into a post-land expansion plan with a mapped sponsor path.`,
      workflowId: "expansion-engine",
      actionType: "expansion_plan",
      targetSystem: "Workspace",
      status: "queued",
      priority: "medium",
      confidence: 0.73,
      rationale: "Whitespace exists now, but the team should only activate it after the land motion creates proof.",
      approvalRequired: false,
      evidence: [evidence[0]],
      linkedTaskIds: [`${account.id}-task-expansion`],
      linkedExpansionIds: topExpansion ? [topExpansion.id] : [],
      estimatedImpact: "Creates a deliberate expand motion instead of a reactive one.",
    },
  ];
}

function buildApprovals(account: Account, actions: AgentAction[]): ApprovalRequest[] {
  return actions
    .filter((action) => action.approvalRequired && action.status === "awaiting_approval")
    .map((action, index) => ({
      id: `${account.id}-approval-${index}`,
      title: action.title,
      reason: action.summary,
      requestingAgent: action.agentName,
      estimatedImpact: action.estimatedImpact,
      riskLevel: action.priority === "critical" ? "high" : action.priority === "high" ? "medium" : "low",
      timestamp: hoursAgo(2 + index * 3),
      status: "pending",
      linkedActionId: action.id,
      reviewer: "George Trosley",
      targetSystem: action.targetSystem,
      evidence: action.evidence,
    }));
}

function buildAuditTrail(account: Account, approvals: ApprovalRequest[]): AuditEntry[] {
  const approvalEntry =
    approvals[0] != null
      ? [
          {
            id: `${account.id}-audit-approval`,
            actor: "Human Oversight Agent",
            action: "Flagged approval required",
            detail: `${approvals[0].title} is waiting for seller review before execution.`,
            timestamp: approvals[0].timestamp,
            outcome: "created" as const,
          },
        ]
      : [];

  return [
    {
      id: `${account.id}-audit-sync`,
      actor: "Workspace",
      action: "Synced CRM and conversation signals",
      detail: "Fresh account updates were folded into the seller workspace.",
      timestamp: hoursAgo(1),
      outcome: "synced",
    },
    {
      id: `${account.id}-audit-plan`,
      actor: "Territory Intelligence Agent",
      action: "Refreshed account plan",
      detail: "Whitespace, blockers, and sponsor coverage were updated from the latest signals.",
      timestamp: hoursAgo(6),
      outcome: "completed",
    },
    ...approvalEntry,
  ];
}

function buildExecBrief(account: Account, meetings: Meeting[]): ExecBrief {
  const nextMeeting = meetings.find((meeting) => meeting.status === "upcoming");

  return {
    headline: `Land ${account.name} through ${account.firstWedge.toLowerCase()} and create a visible expansion story before the next executive review.`,
    whyNow: `${account.name} has an active wedge, visible blocker set, and a buying window that can be won with a sharper sponsor narrative and tighter execution.`,
    talkTrack: [
      `Lead with the wedge: ${account.firstWedge}.`,
      "Tie Claude to a business-critical workflow where governance matters as much as output quality.",
      "Show the rep-owned path from pilot success to adjacent-team expansion.",
    ],
    objections: [
      account.topBlockers[0] ?? "Security review timing",
      "Bundled incumbent AI options will look easier on paper.",
      "The buyer needs proof that this can scale beyond a single pilot.",
    ],
    followUpDraft: `Thanks for the time today. Based on the discussion, I will send the pilot scorecard, the governance packet, and a short executive narrative so we can keep the ${nextMeeting?.title.toLowerCase() ?? "next review"} on track.`,
    nextMeeting: nextMeeting?.title ?? "Executive sponsor review",
  };
}

function buildWorkQueue(
  tasks: Task[],
  meetings: Meeting[],
  approvals: ApprovalRequest[],
  signals: Signal[]
): WorkQueueItem[] {
  const upcomingMeeting = meetings.find((meeting) => meeting.status === "upcoming");

  return [
    {
      id: `${tasks[0]?.id ?? "task"}-queue`,
      title: tasks[0]?.title ?? "Finalize next step",
      summary: tasks[0]?.detail ?? "Move the current motion forward.",
      priority: tasks[0]?.priority ?? "high",
      dueLabel: "Tomorrow",
      workflowId: tasks[0]?.workflowId ?? "deal-room",
      type: "task",
      actionLabel: "Finish the scorecard",
    },
    ...(approvals[0]
      ? [
          {
            id: `${approvals[0].id}-queue`,
            title: approvals[0].title,
            summary: approvals[0].reason,
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
      id: `${signals[0]?.id ?? "signal"}-queue`,
      title: signals[0]?.title ?? "Review latest signal",
      summary: signals[0]?.summary ?? "A new signal needs review.",
      priority: signals[0]?.priority ?? "medium",
      dueLabel: "Fresh",
      workflowId: "my-book",
      type: "signal",
      actionLabel: "Apply signal",
    },
    {
      id: `${tasks[2]?.id ?? "task-exec"}-queue`,
      title: tasks[2]?.title ?? "Prep sponsor memo",
      summary: tasks[2]?.detail ?? "Package the why-now story.",
      priority: tasks[2]?.priority ?? "high",
      dueLabel: "This week",
      workflowId: tasks[2]?.workflowId ?? "exec-prep",
      type: "task",
      actionLabel: "Draft narrative",
    },
  ];
}

function buildManagerSnapshot(
  account: Account,
  opportunities: Opportunity[],
  tasks: Task[]
): ManagerSnapshot {
  const commit = opportunities
    .filter((opportunity) => opportunity.forecastCategory === "commit")
    .reduce((sum, opportunity) => sum + opportunity.amount, 0);
  const bestCase = opportunities.reduce((sum, opportunity) => sum + opportunity.amount, 0);

  return {
    commit: Number(commit.toFixed(2)),
    bestCase: Number(bestCase.toFixed(2)),
    coverage: Number((bestCase / Math.max(account.estimatedLandValue, 0.1)).toFixed(1)),
    riskCount: tasks.filter((task) => task.status === "blocked" || task.priority === "critical").length,
    inspectionFocus: "Multi-threading is still thinner than the value story. Push stakeholder coverage before procurement.",
    coachingNote: "Use the next sponsor interaction to elevate from a pilot conversation to a platform-standard narrative.",
  };
}

function buildAgents(actions: AgentAction[]): Agent[] {
  const actionByAgent = new Map<string, AgentAction[]>();
  for (const action of actions) {
    const current = actionByAgent.get(action.agentId) ?? [];
    current.push(action);
    actionByAgent.set(action.agentId, current);
  }

  return agentDefinitions.map((definition) => {
    const agentActions = actionByAgent.get(definition.id) ?? [];
    const topAction = agentActions[0];
    const status = topAction?.status === "awaiting_approval"
      ? "awaiting_approval"
      : topAction?.status === "ready"
        ? "recommending"
        : topAction != null
          ? "analyzing"
          : definition.status;

    return {
      ...definition,
      status,
      confidenceScore: topAction?.confidence ?? 0.6,
      lastActionAt: hoursAgo(agentActions.length + 1),
      activeRecommendation: topAction?.summary,
    };
  });
}

export function createWorkspace(accountId: string): SellerWorkspace {
  const account = accounts.find((item) => item.id === accountId) ?? accounts[0];
  const stakeholders = buildStakeholders(account);
  const signals = buildSignals(account, stakeholders);
  const tasks = buildTasks(account);
  const meetings = buildMeetings(account, stakeholders);
  const opportunities = buildOpportunities(account, stakeholders);
  const accountPlan = buildAccountPlan(account);
  const expansionMotions = buildExpansionMotions(account, stakeholders);
  const orgNodes = buildOrgNodes(account, expansionMotions);
  const agentActions = buildAgentActions(account, signals, expansionMotions);
  const approvals = buildApprovals(account, agentActions);
  const auditTrail = buildAuditTrail(account, approvals);
  const execBrief = buildExecBrief(account, meetings);
  const workQueue = buildWorkQueue(tasks, meetings, approvals, signals);
  const managerSnapshot = buildManagerSnapshot(account, opportunities, tasks);

  return {
    accountId: account.id,
    workflows: WORKFLOWS,
    dataSources: buildDataSources(account),
    workQueue,
    opportunities,
    stakeholders,
    meetings,
    tasks,
    signals,
    accountPlan,
    expansionMotions,
    agentActions,
    approvals,
    auditTrail,
    managerSnapshot,
    execBrief,
    currentRecommendation: `Run the ${account.firstWedge.toLowerCase()} motion as the proof point, approve the security and exec assets, and use the next sponsor meeting to frame the first expansion path.`,
    orgNodes,
    competitiveLandscape: getCompetitorsByAccount(account.id),
  };
}

export function buildAgentRoster(workspace: SellerWorkspace): Agent[] {
  return buildAgents(workspace.agentActions);
}
