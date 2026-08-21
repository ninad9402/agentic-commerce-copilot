export type BrandTone = 'urgency' | 'playful' | 'luxury' | 'technical';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  inventory: number;
  conversionRate: number;
  trafficMonthly: number;
  decliningRate?: number;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string; // YYYY-MM-DD
  rfmSegment: 'VIP' | 'Loyal' | 'At-Risk' | 'Cart Abandoner' | 'New';
  cartItemsCount?: number;
  lastCartValue?: number;
  lastCartDate?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: 'completed' | 'refunded' | 'cancelled';
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  cartValue: number;
  abandonedAt: string;
  checkoutStep: 'shipping' | 'payment' | 'address';
}

export interface StoreDataset {
  id: string;
  name: string;
  industry: string;
  logo: string;
  currency: string;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  abandonedCarts: AbandonedCart[];
}

export interface StoreKPIs {
  totalRevenue: number;
  revenueTrend: number; // percentage
  totalOrders: number;
  avgOrderValue: number;
  cartAbandonmentRate: number;
  totalAbandonedValue: number;
  repeatPurchaseRate: number;
  customerLTV: number;
  atRiskCustomersCount: number;
  decliningSkusCount: number;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  category: 'cart_recovery' | 'customer_retention' | 'product_optimization' | 'cross_sell';
  description: string;
  impactScore: 'High' | 'Medium' | 'Critical';
  expectedUpliftRevenue: number;
  confidenceScore: number; // 0-100%
  effortLevel: 'Low' | 'Medium' | 'High';
  targetAudienceCount: number;
  primaryMetricTarget: string;
  suggestedAction: string;
}

export interface AgentThought {
  id: string;
  timestamp: string;
  phase: 'analysis' | 'planning' | 'tool_call' | 'drafting' | 'approval_required' | 'execution' | 'evaluation';
  message: string;
  details?: Record<string, any>;
  toolInvoked?: string;
  agentRole?: string;
}

export interface DraftedCampaignAsset {
  id: string;
  opportunityId: string;
  campaignTitle: string;
  targetSegment: string;
  channel: 'email' | 'sms' | 'shopify_discount' | 'ad_copy' | 'product_copy';
  emailSubject?: string;
  emailPreviewText?: string;
  emailBodyHtml?: string;
  smsBody?: string;
  discountCode?: string;
  discountPercentage?: number;
  minOrderValue?: number;
  adHook?: string;
  adBody?: string;
  adCta?: string;
  revisedProductDescription?: string;
  productIdToOptimize?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'executed';
}

export interface ClosedLoopMetrics {
  campaignId: string;
  campaignTitle: string;
  executedAt: string;
  targetCount: number;
  projectedRevenue: number;
  actualRevenue: number;
  openRate: number; // e.g. 42.5%
  clickRate: number; // e.g. 18.2%
  conversions: number;
  conversionRate: number;
  roiPercentage: number;
  agentMemoryInsight: string;
}

// Multi-Agent Swarm Collaboration Types
export type SpecializedAgentRole = 'data_miner' | 'copywriter' | 'pricing_guardrail' | 'dispatch_engineer';

export interface SpecializedAgent {
  role: SpecializedAgentRole;
  name: string;
  title: string;
  avatar: string;
  color: string;
  description: string;
  capabilities: string[];
}

export interface SwarmStep {
  id: string;
  agentRole: SpecializedAgentRole;
  agentName: string;
  agentAvatar: string;
  phase: string;
  message: string;
  timestamp: string;
  outputPayload?: Record<string, any>;
  status: 'pending' | 'active' | 'completed';
}

export interface SwarmExecutionState {
  status: 'idle' | 'running' | 'completed' | 'paused_guardrail';
  currentAgentRole?: SpecializedAgentRole;
  steps: SwarmStep[];
  synthesizedAssets: DraftedCampaignAsset[];
  guardrailChecks: {
    passed: boolean;
    marginSafety: string;
    discountCapApproved: boolean;
    audienceFilterValidated: boolean;
  };
}

// A/B Multi-Variant Testing Types
export interface CampaignVariant {
  id: string;
  name: string;
  angle: 'Urgency & Scarcity' | 'Social Proof & Value' | 'Exclusivity & Curiosity';
  description: string;
  expectedConversionLift: number;
  confidenceScore: number;
  assets: DraftedCampaignAsset[];
  keyHighlight: string;
}

// Merchant Guardrails
export interface MerchantGuardrail {
  id: string;
  title: string;
  category: 'pricing' | 'messaging' | 'timing' | 'brand_safety';
  description: string;
  ruleValue: string;
  enabled: boolean;
}

// Mock Integration Sandbox Types
export interface IntegrationEndpoint {
  id: string;
  name: string;
  service: 'shopify' | 'stripe' | 'klaviyo' | 'whatsapp';
  method: 'POST' | 'GRAPHQL' | 'REST';
  path: string;
  description: string;
  samplePayload: Record<string, any>;
  sampleResponse: Record<string, any>;
}
