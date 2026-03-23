/**
 * Directional “Snowflake-enabled” share of modeled recoverable value.
 * Derived only from existing model inputs — not user-controlled adoption or penetration.
 */
import { clamp } from "@/lib/value-model-format";

export type SnowflakeEnabledResult = {
  /** Dollar value in the same units as the base recoverable metric */
  value: number;
  /** Portion of the base recoverable bucket (0–1) considered achievable in a practical first motion */
  unlockRatio: number;
};

/** Ciena: share of recoverable margin practically attainable quickly on governed operational data. */
export function computeCienaSnowflakeEnabled(
  recoverableMargin: number,
  improvementPct: number,
  grossMarginPct: number,
  riskPct: number
): SnowflakeEnabledResult {
  const improvementNorm = (improvementPct - 5) / 50;
  const marginNorm = (grossMarginPct - 18) / 44;
  const riskNorm = (riskPct - 5) / 40;
  let ratio = 0.46 + improvementNorm * 0.26 + marginNorm * 0.12 + riskNorm * 0.08;
  ratio = clamp(ratio, 0.42, 0.88);
  return { value: recoverableMargin * ratio, unlockRatio: ratio };
}

/** Sagent: share of recoverable ARR realistically protected when detection accelerates across customers. */
export function computeSagentSnowflakeEnabled(
  recoverableArr: number,
  recoverablePct: number,
  detectDays: number,
  underPct: number
): SnowflakeEnabledResult {
  const recoveryNorm = (recoverablePct - 10) / 70;
  const speedNorm = 1 - (detectDays - 5) / 55;
  const stressNorm = (underPct - 3) / 32;
  let ratio = 0.44 + recoveryNorm * 0.22 + speedNorm * 0.22 + stressNorm * 0.06;
  ratio = clamp(ratio, 0.4, 0.9);
  return { value: recoverableArr * ratio, unlockRatio: ratio };
}

/** U.S. FinTech: share of avoidable risk addressable quickly without adding architectural drag. */
export function computeFintechSnowflakeEnabled(
  avoidableRisk: number,
  avoidablePct: number,
  anomalyPct: number,
  lossRatePct: number
): SnowflakeEnabledResult {
  const avoidNorm = (avoidablePct - 15) / 75;
  const anomalyNorm = (anomalyPct - 0.5) / 13.5;
  const lossNorm = Math.min(lossRatePct, 2) / 2;
  let ratio = 0.48 + avoidNorm * 0.24 + anomalyNorm * 0.1 + (1 - lossNorm) * 0.06;
  ratio = clamp(ratio, 0.43, 0.86);
  return { value: avoidableRisk * ratio, unlockRatio: ratio };
}
