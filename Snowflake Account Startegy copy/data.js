const ACCOUNTS = [
  {
    id: 'ciena',
    name: 'Ciena',
    priority: 1,
    hypothesis: "Ciena's risk is not demand. It's execution against that demand.",
    firstWorkload: 'Backlog risk + margin visibility on AI deals',
    proofPoint: 'Show backlog risk on 2 to 3 AI deals within 24 hours',
    pivotIfNeeded: 'Supply chain constraint visibility',
    lastTouch: '2025-03-18',
    nextAction: 'Request 2-3 AI deals from CFO org to map order > backlog > fulfillment > margin',
  },
  {
    id: 'sagent',
    name: 'Sagent',
    priority: 2,
    hypothesis: "Sagent's risk is not building Dara. It's proving it works across customers.",
    firstWorkload: 'Deployment performance view across Dara customers',
    proofPoint: 'Identify 1 to 2 underperforming Dara deployments',
    pivotIfNeeded: 'Borrower-level intelligence',
    lastTouch: '2025-03-15',
    nextAction: 'Ask Product/CS which of first 3-5 Dara deployments are at risk and why',
  },
  {
    id: 'usfintech',
    name: 'U.S. Fin Tech',
    priority: 3,
    hypothesis: "They've solved data access. They haven't solved decision speed.",
    firstWorkload: 'Securitization exception + anomaly monitoring',
    proofPoint: 'Surface real-time anomaly vs delayed reporting',
    pivotIfNeeded: 'Stakeholder reporting latency',
    lastTouch: '2025-03-12',
    nextAction: 'Ask where securitization anomalies surface too late today',
  },
];

const NEXT_7_DAYS = [
  { day: 'Mon 3/24', account: 'ciena', action: 'Draft CFO outreach — backlog risk angle' },
  { day: 'Tue 3/25', account: 'ciena', action: 'Request AI deal list from FP&A contact' },
  { day: 'Wed 3/26', account: 'sagent', action: 'Discovery call prep — Dara deployment risk' },
  { day: 'Thu 3/27', account: 'sagent', action: 'Follow-up with CS on deployment timelines' },
  { day: 'Fri 3/28', account: 'usfintech', action: 'SE alignment — scope anomaly workload' },
  { day: 'Mon 3/31', account: 'usfintech', action: 'Data platform leadership intro meeting' },
];

const DEFAULT_ACTIVITIES = [
  { timestamp: '2025-03-20', account: 'ciena', text: 'Research: New CFO appointed, raised FY26 guidance' },
  { timestamp: '2025-03-19', account: 'sagent', text: 'LinkedIn: CEO and President hired in past 12 months' },
  { timestamp: '2025-03-18', account: 'ciena', text: 'POV drafted: Backlog risk on AI deals' },
  { timestamp: '2025-03-15', account: 'sagent', text: 'Identified Dara first-wave rollout as compelling event' },
  { timestamp: '2025-03-12', account: 'usfintech', text: 'Mapped securitization ops exception workflows' },
];

const DEFAULT_SIGNALS = [
  { timestamp: '2025-03-21', account: 'ciena', text: 'Ciena Q3 earnings: AI demand 30%+ YoY, backlog at record levels' },
  { timestamp: '2025-03-19', account: 'sagent', text: 'Sagent: Dara entering first wave of at-scale customer rollouts' },
  { timestamp: '2025-03-18', account: 'usfintech', text: 'US FinTech strategic pivot: internal utility to external platform' },
  { timestamp: '2025-03-15', account: 'ciena', text: 'Street expects Ciena execution, not just demand — forecast accuracy pressure' },
  { timestamp: '2025-03-10', account: 'sagent', text: 'Board wants measurable platform outcomes from new leadership' },
];

const CONSUMPTION_MOCK = [
  { account: 'Ciena', value: '—', trend: 'demo', label: 'Connect post-role' },
  { account: 'Sagent', value: '—', trend: 'demo', label: 'Connect post-role' },
  { account: 'U.S. Fin Tech', value: '—', trend: 'demo', label: 'Connect post-role' },
];
