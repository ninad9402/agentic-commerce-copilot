import { DraftedCampaignAsset, ClosedLoopMetrics } from '../types/ecommerce';

export interface ExecutionResult {
  success: boolean;
  message: string;
  shopifyDiscountCode?: string;
  stripeCouponId?: string;
  klaviyoCampaignId?: string;
  dispatchedRecipientCount?: number;
  closedLoopResult?: ClosedLoopMetrics;
}

export async function executeApprovedCampaign(
  asset: DraftedCampaignAsset,
  projectedRevenue: number,
  audienceCount: number
): Promise<ExecutionResult> {
  // Simulate 1.2 second network execution latency to mock APIs
  await new Promise(r => setTimeout(r, 1200));

  const shopifyDiscount = asset.discountCode || 'RECOVER10';
  const stripeCoupon = `STRIPE_CPN_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const klaviyoCampaign = `KLV_CMP_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Calculate actual uplift simulation (85-115% of projected revenue)
  const multiplier = 0.90 + Math.random() * 0.28;
  const actualRevenue = Math.round(projectedRevenue * multiplier);
  const openRate = +(38 + Math.random() * 14).toFixed(1);
  const clickRate = +(14 + Math.random() * 9).toFixed(1);
  const conversions = Math.round(audienceCount * (clickRate / 100) * 0.45);
  const conversionRate = +((conversions / Math.max(audienceCount, 1)) * 100).toFixed(1);
  const roiPercentage = Math.round((actualRevenue / 150) * 100);

  const closedLoopResult: ClosedLoopMetrics = {
    campaignId: `cmp-${Date.now()}`,
    campaignTitle: asset.campaignTitle,
    executedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    targetCount: audienceCount,
    projectedRevenue,
    actualRevenue,
    openRate,
    clickRate,
    conversions,
    conversionRate,
    roiPercentage,
    agentMemoryInsight: `Dispatched campaign reached ${audienceCount} target users. Conversion rate +${conversionRate}% yielded $${actualRevenue.toLocaleString()} revenue uplift.`,
  };

  return {
    success: true,
    message: `Successfully executed campaign across Shopify, Stripe, and Klaviyo APIs. ${audienceCount} recipients queued.`,
    shopifyDiscountCode: shopifyDiscount,
    stripeCouponId: stripeCoupon,
    klaviyoCampaignId: klaviyoCampaign,
    dispatchedRecipientCount: audienceCount,
    closedLoopResult,
  };
}
