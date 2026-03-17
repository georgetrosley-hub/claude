import type { Account } from "@/types";

/**
 * Accounts: single-account mode for ADP.
 */
export const accounts: Account[] = [
  {
    id: "adp",
    name: "ADP",
    tam: 0,
    employeeCount: 0,
    developerPopulation: 0,
    aiMaturityScore: 0,
    securitySensitivity: 0,
    complianceComplexity: 0,
    competitivePressure: 0,
    existingVendorFootprint: ["Databricks (publicly referenced)", "Snowflake (publicly referenced)"],
    executiveSponsors: [],
    firstWedge: "Governed serving layer + external data distribution",
    estimatedLandValue: 0,
    estimatedExpansionValue: 0,
    topBlockers: ["Databricks engineering entrenchment", "Platform standardization politics", "Governance/PII risk review"],
    topExpansionPaths: [
      "Governed BI/SQL serving layer consolidation",
      "External data products (benchmarks/licensing) distribution",
      "Compliance analytics + audit-grade reporting",
      "AI-ready governed data foundation for broad access",
    ],
  },
];

/** Default account */
export const defaultAccountId = "adp";
