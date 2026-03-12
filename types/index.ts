export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type WorkflowHealth = "live" | "attention" | "building";
export type ConnectionStatus = "connected" | "syncing" | "planned";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type OpportunityStage =
  | "signal"
  | "discovery"
  | "pilot_design"
  | "security_review"
  | "legal_review"
  | "procurement"
  | "executive_alignment"
  | "deployment"
  | "expansion";
export type ForecastCategory = "pipeline" | "best_case" | "commit";
export type StakeholderRole =
  | "champion"
  | "economic_buyer"
  | "technical_buyer"
  | "security"
  | "legal"
  | "coach"
  | "executive_sponsor";
export type StakeholderSentiment = "supporter" | "neutral" | "skeptical" | "blocker";
export type MeetingType = "discovery" | "security" | "exec" | "follow_up" | "qbr";
export type SignalSource = "crm" | "call" | "email" | "calendar" | "doc" | "product" | "support" | "news";
export type ActionType =
  | "draft_email"
  | "update_crm"
  | "meeting_brief"
  | "pilot_plan"
  | "exec_memo"
  | "security_packet"
  | "competitive_brief"
  | "expansion_plan";
export type QualificationStatus = "strong" | "partial" | "gap";
export type ExpansionStage = "mapped" | "multithreading" | "pilot" | "deployed";
export type ActionStatus =
  | "queued"
  | "ready"
  | "awaiting_approval"
  | "completed"
  | "modified"
  | "rejected";
export type AuditOutcome = "created" | "approved" | "modified" | "rejected" | "synced" | "completed";

export type EventType =
  | "research_signal"
  | "champion_identified"
  | "competitor_detected"
  | "architecture_recommendation"
  | "security_blocker"
  | "procurement_friction"
  | "legal_review"
  | "expansion_path"
  | "executive_narrative"
  | "deal_stage_advanced"
  | "approval_required";

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  agentName: string;
  priority: PriorityLevel;
  type: EventType;
  title: string;
  explanation: string;
  recommendedAction?: string;
  /** Calm operational phrasing for display */
  operationalPhrase?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "analyzing" | "recommending" | "awaiting_approval";
  confidenceScore: number;
  priority: PriorityLevel;
  lastActionAt: Date;
  activeRecommendation?: string;
  toolScope?: string[];
  goal?: string;
}

export interface OrgNode {
  id: string;
  name: string;
  useCase: string;
  buyingLikelihood: number;
  arrPotential: number;
  status: "latent" | "identified" | "engaged" | "pilot" | "deployed";
  recommendedNextStep: string;
}

export interface Competitor {
  id: string;
  name: string;
  category: "frontier" | "coding" | "search" | "workflow" | "cloud" | "vertical";
  strengthAreas: string[];
  claudeDifferentiation: string[];
  accountRiskLevel: number;
  detectedFootprint?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  reason: string;
  requestingAgent: string;
  estimatedImpact: string;
  riskLevel: "low" | "medium" | "high";
  timestamp: Date;
  status: "pending" | "approved" | "rejected" | "modified";
  linkedActionId?: string;
  reviewer?: string;
  targetSystem?: string;
  evidence?: EvidenceLink[];
}

export interface Account {
  id: string;
  name: string;
  employeeCount: number;
  developerPopulation: number;
  aiMaturityScore: number;
  securitySensitivity: number;
  complianceComplexity: number;
  competitivePressure: number;
  existingVendorFootprint: string[];
  executiveSponsors: string[];
  firstWedge: string;
  estimatedLandValue: number;
  estimatedExpansionValue: number;
  topBlockers: string[];
  topExpansionPaths: string[];
}

export type DealStage =
  | "signal_detection"
  | "champion_identified"
  | "pov_selected"
  | "pilot_design"
  | "security_review"
  | "legal_review"
  | "procurement"
  | "executive_alignment"
  | "initial_deployment"
  | "expansion_phase_1"
  | "expansion_phase_2";

export interface DealStageInfo {
  stage: DealStage;
  label: string;
  completed: boolean;
  current: boolean;
  confidence: number;
  blockers: string[];
  projectedArr: number;
}

export type CompetitorCategory =
  | "frontier"
  | "coding"
  | "search"
  | "workflow"
  | "cloud"
  | "vertical";

export interface SellerWorkflow {
  id: string;
  title: string;
  objective: string;
  owner: string;
  status: WorkflowHealth;
  summary: string;
}

export interface DataSourceStatus {
  id: string;
  label: string;
  category: "crm" | "conversation" | "knowledge" | "collaboration" | "product";
  status: ConnectionStatus;
  freshness: string;
  lastSync: Date;
}

export interface WorkQueueItem {
  id: string;
  title: string;
  summary: string;
  priority: PriorityLevel;
  dueLabel: string;
  workflowId: string;
  type: "task" | "meeting" | "approval" | "signal";
  actionLabel: string;
}

export interface EvidenceLink {
  id: string;
  label: string;
  source: SignalSource;
  detail: string;
  freshness: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  team: string;
  role: StakeholderRole;
  influence: number;
  sentiment: StakeholderSentiment;
  lastTouch: Date;
  nextStep: string;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount: number;
  forecastCategory: ForecastCategory;
  closeDate: Date;
  useCase: string;
  sponsor: string;
  blockers: string[];
  nextStep: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  startAt: Date;
  owner: string;
  attendees: string[];
  objective: string;
  status: "upcoming" | "completed";
}

export interface Task {
  id: string;
  title: string;
  workflowId: string;
  owner: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate: Date;
  detail: string;
}

export interface Signal {
  id: string;
  source: SignalSource;
  title: string;
  summary: string;
  priority: PriorityLevel;
  occurredAt: Date;
  linkedStakeholderIds: string[];
  recommendedAction: string;
}

export interface QualificationSignal {
  id: string;
  label: string;
  status: QualificationStatus;
  note: string;
}

export interface AccountPlan {
  objective: string;
  wedge: string;
  valueHypothesis: string;
  winThemes: string[];
  whitespaceThemes: string[];
  blockers: string[];
  nextMilestones: string[];
  qualification: QualificationSignal[];
}

export interface ExpansionMotion {
  id: string;
  team: string;
  useCase: string;
  stage: ExpansionStage;
  arrPotential: number;
  sponsor: string;
  adoptionSignal: string;
  confidence: number;
  nextStep: string;
}

export interface AgentAction {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  summary: string;
  workflowId: string;
  actionType: ActionType;
  targetSystem: string;
  status: ActionStatus;
  priority: PriorityLevel;
  confidence: number;
  rationale: string;
  approvalRequired: boolean;
  evidence: EvidenceLink[];
  linkedTaskIds: string[];
  linkedExpansionIds: string[];
  estimatedImpact: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  detail: string;
  timestamp: Date;
  outcome: AuditOutcome;
}

export interface ExecBrief {
  headline: string;
  whyNow: string;
  talkTrack: string[];
  objections: string[];
  followUpDraft: string;
  nextMeeting: string;
}

export interface ManagerSnapshot {
  commit: number;
  bestCase: number;
  coverage: number;
  riskCount: number;
  inspectionFocus: string;
  coachingNote: string;
}

export interface SellerWorkspace {
  accountId: string;
  workflows: SellerWorkflow[];
  dataSources: DataSourceStatus[];
  workQueue: WorkQueueItem[];
  opportunities: Opportunity[];
  stakeholders: Stakeholder[];
  meetings: Meeting[];
  tasks: Task[];
  signals: Signal[];
  accountPlan: AccountPlan;
  expansionMotions: ExpansionMotion[];
  agentActions: AgentAction[];
  approvals: ApprovalRequest[];
  auditTrail: AuditEntry[];
  managerSnapshot: ManagerSnapshot;
  execBrief: ExecBrief;
  currentRecommendation: string;
  orgNodes: OrgNode[];
  competitiveLandscape: Competitor[];
}
