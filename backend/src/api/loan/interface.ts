export interface responseLoanRequest {
    id?: string;
    applicationNumber?: string;
    legalName?: string;
    annualRevenue?: number;
    offerDetails: {
        minAmount: number;
        maxAmount: number;
        interestRate: number;
        allowedTerms: number[];
    };
    selectedDetails?: {
        amount?: number;
        termMonths?: number;
    };
}

export interface LoanCalculationResult {
    minAmount: number;
    maxAmount: number;
    interestRate: number;
    allowedTerms: number[];
    calculationSnapshot?: any;
}


type RiskTier = "A" | "B" | "C" | "D";

const BASE_RATE = 20; // % anual base
const SPREAD_BY_TIER: Record<RiskTier, number> = { A: 8, B: 12, C: 18, D: 28 };
const FACTOR_BY_TIER: Record<RiskTier, number> = { A: 0.35, B: 0.25, C: 0.15, D: 0.10 };

const TERMS_A = [12, 18, 24, 36];
const TERMS_B = [12, 18, 24, 36];
const TERMS_C = [12, 18, 24];
const TERMS_D = [6, 12];

const ABSOLUTE_MIN_LOAN = 1_000;
const ABSOLUTE_MAX_LOAN = 5_000_000;
const ROUND_TO = 1_000;

// Industria → tier base
const INDUSTRY_BASE: Record<string, RiskTier> = {
  software: "A",
  services: "B",
  retail: "C",
  hospitality: "C",
  construction: "C",
  agriculture: "B",
};

// ------------------ Helpers ------------------
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const roundTo = (v: number, step: number) => Math.round(v / step) * step;

export function toDate(val: unknown): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === "number") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === "string") {
    const s = val.trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      const [, y, mo, day] = m;
      const d = new Date(Number(y), Number(mo) - 1, Number(day));
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function computeAgeYears(d: unknown): number | null {
  const date = toDate(d);
  if (!date) return null;
  const diffMs = Date.now() - date.getTime();
  if (!isFinite(diffMs) || diffMs < 0) return 0;
  return Math.floor(diffMs / (365.25 * 24 * 3600 * 1000));
}

export function baseTierByIndustry(industry?: string | null): RiskTier {
  if (!industry) return "B";
  const key = industry.trim().toLowerCase();
  return INDUSTRY_BASE[key] ?? "B";
}

const bumpBetter = (t: RiskTier): RiskTier => (t === "D" ? "C" : t === "C" ? "B" : t === "B" ? "A" : "A");
const bumpWorse  = (t: RiskTier): RiskTier => (t === "A" ? "B" : t === "B" ? "C" : t === "C" ? "D" : "D");

export function adjustTier(tier: RiskTier, ageYears: number | null, revPerEmp: number | null): RiskTier {
  let t = tier;
  if (ageYears != null) {
    if (ageYears >= 5) t = bumpBetter(t);
    else if (ageYears < 1) t = bumpWorse(t);
  }
  if (revPerEmp != null) {
    if (revPerEmp >= 1_000_000) t = bumpBetter(t);
    else if (revPerEmp < 200_000) t = bumpWorse(t);
  }
  return t;
}

export function allowedTermsFor(tier: RiskTier, ageYears: number | null, hasRevenue: boolean): number[] {
  if (!hasRevenue) return TERMS_D;
  if (tier === "A") return ageYears != null && ageYears >= 3 ? TERMS_A : TERMS_B;
  if (tier === "B") return ageYears != null && ageYears >= 3 ? TERMS_B : TERMS_C;
  if (tier === "C") return TERMS_C;
  return TERMS_D;
}

export function interestRateFor(tier: RiskTier, ageYears: number | null, revPerEmp: number | null): number {
  let rate = BASE_RATE + SPREAD_BY_TIER[tier];
  if (ageYears != null && ageYears >= 5) rate -= 1;
  if (revPerEmp != null && revPerEmp >= 1_000_000) rate -= 1;
  return clamp(Number(rate.toFixed(2)), 8, 80);
}

 export function capsFor(tier: RiskTier, revenue: number): { min: number; max: number } {
  const factor = FACTOR_BY_TIER[tier];
  const rawMax = revenue * factor;
  const max = clamp(roundTo(rawMax, ROUND_TO), ABSOLUTE_MIN_LOAN, ABSOLUTE_MAX_LOAN);
  const rawMin = revenue * 0.05;
  const min = clamp(roundTo(rawMin, ROUND_TO), ROUND_TO, max);
  return { min, max };
}
