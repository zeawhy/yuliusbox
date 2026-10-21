import pricingDataJson from "../../data/video-model-pricing.json";

export interface VideoModelPricing {
    id: string;
    name: string;
    provider: string;
    resolution: string;
    price_per_second: number;
    promo_price_per_second: number | null;
    promo_until: string | null;
    source_url: string;
    source_type: "official" | "third_party";
    checked_at: string;
    notes: string;
}

export const VIDEO_MODELS: VideoModelPricing[] = pricingDataJson as VideoModelPricing[];

export const PRICING_LAST_UPDATED = "2026-10-21";

export interface ModelCalculationResult {
    model: VideoModelPricing;
    duration: number;
    fps: number;
    totalFrames: number;
    effectiveRate: number;
    totalCost: number;
    isPromoActive: boolean;
    isPromoExpired: boolean;
    daysRemaining: number | null;
    savingsPercent: number | null;
    costPerFrame: number;
    costPerMinute: number;
    isCheapest: boolean;
}

/**
 * Calculates pricing for a given model, duration, and FPS against a target date.
 */
export function calculateModelCost(
    model: VideoModelPricing,
    duration: number,
    fps: number = 24,
    currentDate: Date = new Date("2026-10-21T12:00:00Z")
): Omit<ModelCalculationResult, "isCheapest"> {
    let effectiveRate = model.price_per_second;
    let isPromoActive = false;
    let isPromoExpired = false;
    let daysRemaining: number | null = null;
    let savingsPercent: number | null = null;

    if (model.promo_until && model.promo_price_per_second !== null) {
        const promoEnd = new Date(`${model.promo_until}T23:59:59Z`);
        const diffMs = promoEnd.getTime() - currentDate.getTime();
        daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        if (diffMs > 0) {
            effectiveRate = model.promo_price_per_second;
            isPromoActive = true;
            savingsPercent = Math.round(
                ((model.price_per_second - model.promo_price_per_second) / model.price_per_second) * 100
            );
        } else {
            effectiveRate = model.price_per_second;
            isPromoExpired = true;
        }
    }

    const totalCost = duration * effectiveRate;
    const totalFrames = duration * fps;
    const costPerFrame = totalFrames > 0 ? totalCost / totalFrames : 0;
    const costPerMinute = effectiveRate * 60;

    return {
        model,
        duration,
        fps,
        totalFrames,
        effectiveRate,
        totalCost,
        isPromoActive,
        isPromoExpired,
        daysRemaining,
        savingsPercent,
        costPerFrame,
        costPerMinute,
    };
}

/**
 * Calculates costs for all models and marks the cheapest one.
 */
export function calculateAllModels(
    models: VideoModelPricing[],
    duration: number,
    fps: number = 24,
    currentDate: Date = new Date("2026-10-21T12:00:00Z")
): ModelCalculationResult[] {
    const rawResults = models.map((m) => calculateModelCost(m, duration, fps, currentDate));
    
    // Find minimum totalCost
    let minCost = Infinity;
    for (const res of rawResults) {
        if (res.totalCost < minCost) {
            minCost = res.totalCost;
        }
    }

    return rawResults.map((res) => ({
        ...res,
        isCheapest: Math.abs(res.totalCost - minCost) < 0.000001,
    }));
}
