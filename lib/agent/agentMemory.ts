import { ClosedLoopMetrics, MerchantGuardrail } from '../types/ecommerce';

export interface MemoryEntry {
  id: string;
  timestamp: string;
  category: string;
  insight: string;
  weightDelta: number; // +0.15 priority increase
}

export const initialAgentMemories: MemoryEntry[] = [
  {
    id: 'mem-1',
    timestamp: '2026-08-10',
    category: 'cart_recovery',
    insight: 'SMS notifications dispatched within 30 minutes of cart abandonment achieved 2.4x higher conversion than 24-hour emails for cart values > $100.',
    weightDelta: +0.25,
  },
  {
    id: 'mem-2',
    timestamp: '2026-08-04',
    category: 'customer_retention',
    insight: 'Fixed monetary discount codes ($25 OFF) generated 34% higher repeat order rates compared to percentage discounts (15% OFF) for VIP customers.',
    weightDelta: +0.18,
  },
  {
    id: 'mem-3',
    timestamp: '2026-07-28',
    category: 'product_optimization',
    insight: 'Adding social proof sub-headings to product descriptions increased add-to-cart rates by +1.8% across high-traffic apparel SKUs.',
    weightDelta: +0.12,
  },
  {
    id: 'mem-4',
    timestamp: '2026-07-15',
    category: 'cross_sell',
    insight: 'Post-purchase 1-click add-on discounts under $30 had a 26.8% take-rate with zero checkout abandonment friction.',
    weightDelta: +0.15,
  }
];

export const defaultMerchantGuardrails: MerchantGuardrail[] = [
  {
    id: 'gr-1',
    title: 'Maximum Promotional Discount Ceiling',
    category: 'pricing',
    description: 'Autonomous agent is strictly prohibited from generating discounts higher than 25% without explicit executive override.',
    ruleValue: 'Max 25% Off',
    enabled: true,
  },
  {
    id: 'gr-2',
    title: 'Margin Safety Protection Threshold',
    category: 'pricing',
    description: 'Ensure unit gross margin remains above 35% after promotional vouchers and shipping subsidies.',
    ruleValue: 'Min 35% Gross Margin',
    enabled: true,
  },
  {
    id: 'gr-3',
    title: 'SMS Quiet Hours & TCPA Compliance',
    category: 'timing',
    description: 'Never queue SMS dispatches between 9:00 PM and 8:00 AM in customer local timezone.',
    ruleValue: '8 AM - 9 PM Local Time',
    enabled: true,
  },
  {
    id: 'gr-4',
    title: 'Brand Tone & Safety Verification',
    category: 'brand_safety',
    description: 'Verify copy against deceptive claims, spam trigger keywords, and unverified discount promises.',
    ruleValue: 'Zero Spam / Verified Claims',
    enabled: true,
  }
];

export function updateAgentMemory(newClosedLoopMetric: ClosedLoopMetrics): MemoryEntry {
  const isHighPerformer = newClosedLoopMetric.actualRevenue >= newClosedLoopMetric.projectedRevenue;
  
  const entry: MemoryEntry = {
    id: `mem-${Date.now()}`,
    timestamp: new Date().toISOString().split('T')[0],
    category: 'campaign_evaluation',
    insight: `Campaign "${newClosedLoopMetric.campaignTitle}" generated $${newClosedLoopMetric.actualRevenue.toLocaleString()} actual revenue (${isHighPerformer ? 'Exceeded' : 'Met'} target of $${newClosedLoopMetric.projectedRevenue.toLocaleString()}). Open rate reached ${newClosedLoopMetric.openRate}%. Updating future action weights.`,
    weightDelta: isHighPerformer ? +0.20 : +0.05,
  };

  return entry;
}
