import type {
  Account,
  AccountSignal,
  Competitor,
  ExecutionItem,
  PriorityLevel,
  Stakeholder,
  WorkspaceDraft,
} from "@/types";

const priorityRank: Record<PriorityLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function parseSponsor(rawSponsor: string) {
  const match = rawSponsor.match(/^(.*?)\s+\((.*?)\)$/);
  if (!match) {
    return { name: rawSponsor, title: "Executive sponsor" };
  }

  return {
    name: match[1],
    title: match[2],
  };
}

function getChampionProfile(account: Account) {
  const wedge = account.firstWedge.toLowerCase();

  if (wedge.includes("platform") || wedge.includes("developer") || wedge.includes("engineering")) {
    return {
      name: "Platform engineering champion",
      title: "Director, Platform Engineering",
      team: "Engineering",
      note: "Best path to land remains developer productivity with a controlled platform cohort.",
    };
  }

  if (wedge.includes("finance") || wedge.includes("model risk")) {
    return {
      name: "Model risk champion",
      title: "SVP, Model Risk",
      team: "Risk",
      note: "Champion path depends on turning governance requirements into the reason to buy, not the reason to wait.",
    };
  }

  if (wedge.includes("support")) {
    return {
      name: "Support leader champion",
      title: "VP, Customer Support",
      team: "Customer Operations",
      note: "Operational buyer cares about ticket quality, handle time, and fast proof points.",
    };
  }

  if (wedge.includes("r&d") || wedge.includes("medical") || wedge.includes("clinical")) {
    return {
      name: "Medical affairs champion",
      title: "VP, Medical Affairs",
      team: "R&D",
      note: "This wedge wins when the workflow is obviously regulated, high-cost, and document-heavy.",
    };
  }

  if (wedge.includes("hr") || wedge.includes("payroll")) {
    return {
      name: "HR operations champion",
      title: "VP, HR Operations",
      team: "HR",
      note: "The buyer will need confidence in access controls before they will champion internally.",
    };
  }

  return {
    name: "Transformation champion",
    title: "VP, Enterprise Transformation",
    team: "Strategy",
    note: "The strongest internal narrative is a measured wedge with clear executive upside.",
  };
}

function getSecurityLead(account: Account) {
  if (account.complianceComplexity >= 90) {
    return "CISO / model risk office";
  }

  if (account.securitySensitivity >= 85) {
    return "security architecture lead";
  }

  return "security and IAM lead";
}

function getProcurementOwner(account: Account) {
  return account.complianceComplexity >= 85
    ? "legal + procurement"
    : "procurement sponsor";
}

function getTopCompetitor(competitors: Competitor[]) {
  return [...competitors].sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)[0];
}

function getSecondSponsor(account: Account) {
  return parseSponsor(account.executiveSponsors[1] ?? account.executiveSponsors[0] ?? "Executive Sponsor");
}

export function buildAccountSignals(
  account: Account,
  competitors: Competitor[]
): AccountSignal[] {
  const champion = getChampionProfile(account);
  const topCompetitor = getTopCompetitor(competitors);
  const secondSponsor = getSecondSponsor(account);
  const securityLead = getSecurityLead(account);

  const signals: AccountSignal[] = [
    {
      id: `${account.id}-wedge`,
      title: "Working hypothesis: best first wedge",
      summary: `${champion.title} is the cleanest path to land ${account.firstWedge.toLowerCase()}. The wedge matches the account profile and keeps the first deal tightly scoped.`,
      priority: "high",
      confidence: Math.min(94, Math.max(72, account.aiMaturityScore + 12)),
      owner: champion.name,
      impact: `$${account.estimatedLandValue.toFixed(2)}M land is reachable if the pilot stays narrow and measurable.`,
      recommendedAction: `Get ${champion.name} to co-author a 30-day pilot scope and success criteria this week.`,
      sourceType: "relationship",
      sourceLabel: "Account thesis",
      sourceFreshness: "Working hypothesis",
      disposition: "watch",
    },
    {
      id: `${account.id}-security`,
      title: "Working hypothesis: governance will decide speed",
      summary: `${account.topBlockers[1] ?? account.topBlockers[0]} The deal will slow down if security and legal remain abstract risks instead of owned workstreams.`,
      priority: account.securitySensitivity >= 90 ? "critical" : "high",
      confidence: Math.min(96, account.securitySensitivity),
      owner: securityLead,
      impact: "This is the control point that determines whether the pilot is treated as real or experimental.",
      recommendedAction: `Book the architecture and security review now, with a written data-flow narrative before the meeting.`,
      sourceType: "document",
      sourceLabel: "Blocker mapping",
      sourceFreshness: "Working hypothesis",
      disposition: "watch",
    },
    {
      id: `${account.id}-competition`,
      title: `Working hypothesis: primary competitor is ${topCompetitor?.name ?? "Microsoft"}`,
      summary: topCompetitor
        ? `${topCompetitor.name} has the strongest structural advantage in this account because of ${topCompetitor.strengthAreas.slice(0, 2).join(" and ")}.`
        : "The biggest threat is an incumbent platform already embedded in the account.",
      priority: topCompetitor && topCompetitor.accountRiskLevel >= 85 ? "high" : "medium",
      confidence: topCompetitor?.accountRiskLevel ?? 70,
      owner: secondSponsor.name,
      impact: "Without a sharp competitive point of view, bundled alternatives will drag the deal into indecision.",
      recommendedAction: `Arm the rep and champion with a one-page competitive memo tied specifically to ${account.name}.`,
      sourceType: "market",
      sourceLabel: "Competitive watchlist",
      sourceFreshness: "Working hypothesis",
      disposition: "watch",
    },
    {
      id: `${account.id}-expansion`,
      title: "Working hypothesis: best second motion",
      summary: `${account.topExpansionPaths[0]} is the most credible second motion once the initial wedge proves value.`,
      priority: "medium",
      confidence: Math.min(90, Math.max(68, account.aiMaturityScore + 6)),
      owner: secondSponsor.name,
      impact: `$${account.estimatedExpansionValue.toFixed(2)}M expansion upside becomes believable when phase two is named early.`,
      recommendedAction: `Mention the expansion thesis in every executive conversation, but do not sell phase two before phase one is safe.`,
      sourceType: "relationship",
      sourceLabel: "Account plan",
      sourceFreshness: "Working hypothesis",
      disposition: "watch",
    },
    {
      id: `${account.id}-executive`,
      title: "Working hypothesis: exec narrative needs tightening",
      summary: `The current account story has enough substance, but it should be framed around business urgency, safe deployment, and a narrow first win for ${account.name}.`,
      priority: "medium",
      confidence: 76,
      owner: secondSponsor.name,
      impact: "A stronger narrative shortens the gap between functional interest and sponsor-level commitment.",
      recommendedAction: `Prepare a briefing for ${secondSponsor.name} that names why now, why Claude, what the first proof point is, and what support is needed.`,
      sourceType: "crm",
      sourceLabel: "Executive account summary",
      sourceFreshness: "Working hypothesis",
      disposition: "watch",
    },
  ];

  return signals.sort((a, b) => {
    const priorityDiff = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return b.confidence - a.confidence;
  });
}

export function buildStakeholders(account: Account): Stakeholder[] {
  const champion = getChampionProfile(account);
  const sponsors = account.executiveSponsors.map(parseSponsor);
  const primarySponsor = sponsors[0] ?? { name: "Executive sponsor", title: "Executive sponsor" };
  const secondarySponsor = sponsors[1] ?? primarySponsor;

  return [
    {
      id: `${account.id}-champion`,
      name: champion.name,
      title: champion.title,
      team: champion.team,
      stance: "champion",
      influence: "high",
      relationshipStrength: 78,
      nextStep: "Turn the wedge into a measurable pilot with named success criteria.",
      note: champion.note,
    },
    {
      id: `${account.id}-sponsor-1`,
      name: primarySponsor.name,
      title: primarySponsor.title,
      team: "Executive",
      stance: "executive",
      influence: "high",
      relationshipStrength: 64,
      nextStep: "Align on business value, not product capability.",
      note: "Needs to believe this is strategically useful and operationally safe.",
    },
    {
      id: `${account.id}-sponsor-2`,
      name: secondarySponsor.name,
      title: secondarySponsor.title,
      team: "Executive",
      stance: "ally",
      influence: "high",
      relationshipStrength: 58,
      nextStep: "Use this leader to widen support once the first wedge is credible.",
      note: "Best used to reinforce urgency and unlock internal cross-functional coordination.",
    },
    {
      id: `${account.id}-security`,
      name: "Security reviewer",
      title: getSecurityLead(account),
      team: "Security",
      stance: account.securitySensitivity >= 90 ? "blocker" : "neutral",
      influence: "high",
      relationshipStrength: 38,
      nextStep: "Bring a clean deployment narrative before asking for approval.",
      note: "This stakeholder is not anti-Claude; they are anti-ambiguity.",
    },
    {
      id: `${account.id}-procurement`,
      name: "Procurement lead",
      title: getProcurementOwner(account),
      team: "Procurement",
      stance: "neutral",
      influence: "medium",
      relationshipStrength: 35,
      nextStep: "Start the commercial path earlier than feels necessary.",
      note: "The deal gets slower when procurement is treated as an end-stage surprise.",
    },
  ];
}

export function buildExecutionItems(account: Account): ExecutionItem[] {
  const champion = getChampionProfile(account);
  const primarySponsor = parseSponsor(account.executiveSponsors[0] ?? "Executive sponsor");

  return [
    {
      id: `${account.id}-pilot`,
      title: "Define the first pilot",
      phase: "Land",
      owner: champion.name,
      status: "in_progress",
      dueLabel: "This week",
      detail: `Keep the first motion centered on ${account.firstWedge.toLowerCase()}. The goal is a narrow, defensible proof point.`,
    },
    {
      id: `${account.id}-security-review`,
      title: "Run the security and architecture workstream",
      phase: "Governance",
      owner: getSecurityLead(account),
      status: account.securitySensitivity >= 90 ? "blocked" : "ready",
      dueLabel: "Next 7 days",
      detail: account.topBlockers[1] ?? account.topBlockers[0],
      decisionRequired: true,
      decisionStatus: "pending",
    },
    {
      id: `${account.id}-briefing`,
      title: "Tighten the executive story",
      phase: "Executive",
      owner: primarySponsor.name,
      status: "ready",
      dueLabel: "Before next sponsor sync",
      detail: "Frame why now, why Claude, what the first win is, and what support is needed to move.",
      decisionRequired: true,
      decisionStatus: "pending",
    },
    {
      id: `${account.id}-procurement`,
      title: "Start the commercial path before the pilot ends",
      phase: "Commercial",
      owner: getProcurementOwner(account),
      status: account.topBlockers.some((blocker) => blocker.toLowerCase().includes("procurement"))
        ? "blocked"
        : "ready",
      dueLabel: "This month",
      detail: account.topBlockers.find((blocker) => blocker.toLowerCase().includes("procurement")) ??
        "Commercial alignment should begin before the pilot is fully complete.",
    },
    {
      id: `${account.id}-expand`,
      title: `Map the expansion path: ${account.topExpansionPaths[0]}`,
      phase: "Expansion",
      owner: champion.name,
      status: "ready",
      dueLabel: "After pilot success criteria are defined",
      detail: "Keep expansion visible in the account story, but sequence it after the first wedge is secure.",
    },
  ];
}

export function buildWorkspaceDraft(
  account: Account,
  competitors: Competitor[]
): WorkspaceDraft {
  const topCompetitor = getTopCompetitor(competitors);

  return {
    dealThesis: `Land ${account.firstWedge.toLowerCase()} first, prove a controlled win quickly, then use that proof to open ${account.topExpansionPaths[0].toLowerCase()}.`,
    winTheme: `Do not let ${topCompetitor?.name ?? "the incumbent"} turn this into a bundled platform decision. Keep the evaluation focused on model quality, governance, and the workflow where Claude clearly wins.`,
    thisWeekFocus: `Lock the pilot sponsor, define success criteria, and schedule the governance workstream before momentum stalls.`,
    operatorNotes: `Use executive alignment to create urgency, but keep the first ask narrow. This account should feel like a disciplined land-and-expand motion, not a broad transformation pitch.`,
  };
}

export function getCurrentPhaseLabel(items: ExecutionItem[]) {
  const activeItem =
    items.find((item) => item.status === "blocked") ??
    items.find((item) => item.status === "in_progress") ??
    items.find((item) => item.status === "ready") ??
    items[0];

  return activeItem?.phase ?? "Land";
}
