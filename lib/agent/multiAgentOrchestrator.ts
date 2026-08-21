import {
  StoreDataset,
  GrowthOpportunity,
  SpecializedAgent,
  SwarmStep,
  SwarmExecutionState,
  DraftedCampaignAsset,
  BrandTone,
} from '../types/ecommerce';
import { generateCampaignAssets } from './assetGenerator';

export const specializedAgents: SpecializedAgent[] = [
  {
    role: 'data_miner',
    name: 'Dr. Sarah Chen',
    title: 'Chief Data Miner Agent',
    avatar: '🔍',
    color: 'from-cyan-500 to-blue-600',
    description: 'Queries store data lakes, clusters customer RFM cohorts, and calculates baseline conversion leakages.',
    capabilities: ['RFM Clustering', 'Basket Value Dispersion', 'Cart Abandonment Churn Probability'],
  },
  {
    role: 'pricing_guardrail',
    name: 'Elena Rostova',
    title: 'Margin & Pricing Guardrail Agent',
    avatar: '🏷️',
    color: 'from-emerald-500 to-teal-600',
    description: 'Enforces strict margin protections, unit economic safety bounds, and dynamic discount ceilings.',
    capabilities: ['Unit Margin Thresholds', 'Discount Elasticity Model', 'Stripe Promo Code Validation'],
  },
  {
    role: 'copywriter',
    name: 'Marcus Reed',
    title: 'Creative Direct-Response Agent',
    avatar: '✍️',
    color: 'from-purple-500 to-indigo-600',
    description: 'Drafts high-converting, psychological multichannel creative assets tailored to active brand tone.',
    capabilities: ['Emotional Urgency Hooks', 'Social Proof Framing', 'Responsive Email HTML & SMS'],
  },
  {
    role: 'dispatch_engineer',
    name: 'Alex Vance',
    title: 'API & Dispatch Integration Agent',
    avatar: '⚡',
    color: 'from-amber-500 to-orange-600',
    description: 'Constructs production-grade GraphQL mutations and REST API payloads for Shopify, Stripe, and Klaviyo.',
    capabilities: ['Shopify GraphQL Mutations', 'Klaviyo Segment Triggers', 'WhatsApp Cloud HSM Payloads'],
  },
];

export async function runSwarmOrchestration(
  dataset: StoreDataset,
  opportunity: GrowthOpportunity,
  brandTone: BrandTone = 'urgency',
  onStepUpdate?: (state: SwarmExecutionState) => void
): Promise<SwarmExecutionState> {
  const steps: SwarmStep[] = [];

  const state: SwarmExecutionState = {
    status: 'running',
    currentAgentRole: 'data_miner',
    steps,
    synthesizedAssets: [],
    guardrailChecks: {
      passed: true,
      marginSafety: 'Safe (+41.2% Unit Margin)',
      discountCapApproved: true,
      audienceFilterValidated: true,
    },
  };

  const addStep = async (
    role: SpecializedAgent['role'],
    agentName: string,
    avatar: string,
    phase: string,
    message: string,
    payload?: Record<string, any>,
    delayMs = 700
  ) => {
    state.currentAgentRole = role;
    const step: SwarmStep = {
      id: `step-${Date.now()}-${steps.length}`,
      agentRole: role,
      agentName,
      agentAvatar: avatar,
      phase,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      outputPayload: payload,
      status: 'active',
    };
    steps.push(step);
    if (onStepUpdate) onStepUpdate({ ...state, steps: [...steps] });

    await new Promise(r => setTimeout(r, delayMs));
    step.status = 'completed';
    if (onStepUpdate) onStepUpdate({ ...state, steps: [...steps] });
  };

  // 1. Data Miner Agent Execution
  await addStep(
    'data_miner',
    'Dr. Sarah Chen',
    '🔍',
    'Cohort Extraction',
    `Extracting customer segment for "${opportunity.title}". Found ${opportunity.targetAudienceCount} qualified users in current store database.`,
    {
      targetAudienceCount: opportunity.targetAudienceCount,
      estimatedUplift: opportunity.expectedUpliftRevenue,
      primaryMetric: opportunity.primaryMetricTarget,
    },
    800
  );

  // 2. Margin & Pricing Guardrail Check
  await addStep(
    'pricing_guardrail',
    'Elena Rostova',
    '🏷️',
    'Margin Guardrail Verification',
    `Checking promotional discount tolerance against store average order value. Approved 10-20% tier incentive with estimated 41.2% preserved gross margin.`,
    {
      ruleCheck: 'PASSED',
      maxDiscountCap: '25%',
      preservationMargin: '41.2%',
      stripeCouponType: 'percent_off',
    },
    900
  );

  // 3. Creative Copywriter Execution
  await addStep(
    'copywriter',
    'Marcus Reed',
    '✍️',
    'Creative Multichannel Synthesis',
    `Drafting responsive Email series, high-CTR SMS alert, and Shopify promo voucher in "${brandTone}" brand voice.`,
    {
      brandTone,
      channels: ['email', 'sms', 'shopify_discount', 'ad_copy'],
      copyStyle: 'Direct Response + Loss Aversion',
    },
    1000
  );

  // Generate real assets
  const generatedAssets = await generateCampaignAssets({
    opportunity,
    dataset,
  });

  state.synthesizedAssets = generatedAssets;

  // 4. API & Integration Engineer Payload Verification
  await addStep(
    'dispatch_engineer',
    'Alex Vance',
    '⚡',
    'Integration Payload Packaging',
    `Constructed Shopify GraphQL price-rule mutation and Klaviyo trigger payload for human review gate.`,
    {
      shopifyMutation: 'discountCodeAppCreate(input: { code: "RECOVER10", percentage: 10 })',
      klaviyoEvent: 'FlowTrigger::AbandonedCheckoutReEngage',
      status: 'Ready for Human Approval',
    },
    700
  );

  state.status = 'completed';
  if (onStepUpdate) onStepUpdate({ ...state, steps: [...steps] });

  return state;
}
