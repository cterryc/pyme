"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCompanyRiskScore = calculateCompanyRiskScore;
exports.getIndustryAdjustment = getIndustryAdjustment;
exports.getTierFromScore = getTierFromScore;
exports.interestRateFor = interestRateFor;
exports.capsFor = capsFor;
exports.computeAgeYears = computeAgeYears;
exports.clamp = clamp;
exports.roundTo = roundTo;
const RiskTier_1 = require("../../constants/RiskTier");
function calculateCompanyRiskScore(metrics) {
    let score = 0;
    const age = metrics.ageYears ?? 0;
    if (age < 1)
        score += 0;
    else if (age < 3)
        score += 10;
    else if (age < 5)
        score += 20;
    else
        score += 30;
    const revenue = metrics.revenue;
    if (revenue < 50000)
        score += 0;
    else if (revenue < 250000)
        score += 10;
    else if (revenue < 1000000)
        score += 20;
    else if (revenue < 5000000)
        score += 30;
    else
        score += 40;
    const revPerEmp = metrics.revPerEmp ?? 0;
    if (revPerEmp < 50000)
        score += 0;
    else if (revPerEmp < 150000)
        score += 10;
    else if (revPerEmp < 300000)
        score += 20;
    else
        score += 30;
    return score; // Puntaje total (0-100)
}
/**
 * Asigna un modificador al puntaje basado en el riesgo de la industria.
 * Usa los Tiers definidos en el Seed.
 */
function getIndustryAdjustment(industryTier) {
    switch (industryTier) {
        case RiskTier_1.RiskTier.A: return 10; // Industrias Top (Software) suman puntos
        case RiskTier_1.RiskTier.B: return 0; // Neutro
        case RiskTier_1.RiskTier.C: return -10; // Riesgo moderado (Retail)
        case RiskTier_1.RiskTier.D: return -20; // Alto riesgo (Construcción)
        default: return -10;
    }
}
/**
 * Mapea el puntaje numérico final (0-100) a un Tier de Riesgo.
 */
function getTierFromScore(score) {
    if (score >= 80)
        return RiskTier_1.RiskTier.A; // (80-100)
    if (score >= 60)
        return RiskTier_1.RiskTier.B; // (60-79)
    if (score >= 30)
        return RiskTier_1.RiskTier.C; // (30-59)
    return RiskTier_1.RiskTier.D; // (0-29)
}
/**
 * Calcula la tasa de interés final.
 * Tasa = BASE_RATE + spread (del seed) + ajuste sutil "intra-tier"
 */
function interestRateFor(BASE_RATE, tierConfig, score) {
    // Usa el spread realista del SeedService (ej. 1.5, 3.0, 6.0, 10.0)
    const tierSpread = Number(tierConfig.spread);
    let rate = BASE_RATE + tierSpread;
    // Ajuste "intra-tier" (mejora la tasa si estás en el extremo
    // superior de tu score)
    let scoreFloor = 0;
    let scoreCeiling = 100;
    switch (tierConfig.tier) {
        case RiskTier_1.RiskTier.A:
            [scoreFloor, scoreCeiling] = [80, 100];
            break;
        case RiskTier_1.RiskTier.B:
            [scoreFloor, scoreCeiling] = [60, 79];
            break;
        case RiskTier_1.RiskTier.C:
            [scoreFloor, scoreCeiling] = [30, 59];
            break;
        case RiskTier_1.RiskTier.D:
            [scoreFloor, scoreCeiling] = [0, 29];
            break;
    }
    const tierWidth = scoreCeiling - scoreFloor;
    if (tierWidth > 0) {
        const adjustmentFactor = (score - scoreFloor) / tierWidth;
        const intraTierDiscount = clamp(adjustmentFactor * 0.5, 0, 0.5); // Max 0.5% de descuento
        rate -= intraTierDiscount;
    }
    // Rango final realista
    return clamp(Number(rate.toFixed(2)), 3.0, 25.0);
}
/**
 * Calcula los montos mínimos y máximos del préstamo.
 * Usa el 'factor' (del seed) y los límites absolutos (del seed).
 */
function capsFor(tierConfig, revenue, configs) {
    // Usa el factor realista del SeedService (ej. 0.50, 0.30, 0.15, 0.10)
    const factor = Number(tierConfig.factor);
    const rawMax = revenue * factor;
    const max = clamp(roundTo(rawMax, configs.ROUND_TO), configs.ABSOLUTE_MIN_LOAN, configs.ABSOLUTE_MAX_LOAN // Usa el límite de 5M del seed
    );
    const rawMin = Math.min(revenue * 0.05, max * 0.1); // 5% de ingresos o 10% del max
    const min = clamp(roundTo(rawMin, configs.ROUND_TO), configs.ABSOLUTE_MIN_LOAN, // Usa el límite de 1k del seed
    max);
    return { min, max };
}
// --- OTROS HELPERS GENÉRICOS ---
function computeAgeYears(foundedDate) {
    if (!foundedDate)
        return null;
    try {
        const date = new Date(foundedDate);
        if (isNaN(date.getTime()))
            return null;
        const diffMs = Date.now() - date.getTime();
        if (!isFinite(diffMs) || diffMs < 0)
            return 0;
        return Math.floor(diffMs / (365.25 * 24 * 3600 * 1000));
    }
    catch (error) {
        console.error("Error computing age years:", error);
        return null;
    }
}
function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}
function roundTo(v, step) {
    return Math.round(v / step) * step;
}
