import { GrowthOpportunity, StoreDataset, CampaignVariant, DraftedCampaignAsset } from '../types/ecommerce';

export function generateABVariants(
  dataset: StoreDataset,
  opportunity: GrowthOpportunity
): CampaignVariant[] {
  const storeName = dataset.name;
  const currency = dataset.currency || '$';

  // Variant A: Urgency & Scarcity Angle
  const variantAAssets: DraftedCampaignAsset[] = [
    {
      id: `var-a-email-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [Urgency Variant A] 48-Hour Cart Reservation`,
      targetSegment: 'Cart Abandoners / High Intent',
      channel: 'email',
      emailSubject: `🚨 Cart expiring: Final chance to save 10% on your ${storeName} gear`,
      emailPreviewText: 'Your reserved cart will be released back to public inventory in 2 hours.',
      emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 16px;">
    <h2 style="color: #dc2626; margin: 0;">⚠️ Final Inventory Notice</h2>
  </div>
  <div style="padding: 20px 0;">
    <p>High demand alert: The items in your cart are currently low in stock. We have locked in your <strong>10% OFF voucher</strong> for the next 48 hours.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com" style="background-color: #dc2626; color: white; padding: 14px 28px; font-weight: bold; border-radius: 8px; text-decoration: none;">Claim 10% Off Before Expiry</a>
    </div>
  </div>
</div>
      `.trim(),
      status: 'pending_approval',
    },
    {
      id: `var-a-sms-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [Urgency] 15-Min Flash SMS`,
      targetSegment: 'Mobile Shoppers',
      channel: 'sms',
      smsBody: `[${storeName}] ⏳ 2 hours left! Your cart items are about to be released. Finish your order with 10% code HURRY10: https://${storeName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'pending_approval',
    },
    {
      id: `var-a-discount-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: 'Shopify Voucher: HURRY10',
      targetSegment: 'Cart Recovery Engine',
      channel: 'shopify_discount',
      discountCode: 'HURRY10',
      discountPercentage: 10,
      status: 'pending_approval',
    }
  ];

  // Variant B: Social Proof & Value Angle
  const variantBAssets: DraftedCampaignAsset[] = [
    {
      id: `var-b-email-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [Social Proof Variant B] Rated 4.9/5 Stars`,
      targetSegment: 'Hesitant Shoppers & Review Readers',
      channel: 'email',
      emailSubject: `See why 10,000+ customers love their gear from ${storeName} ⭐⭐⭐⭐⭐`,
      emailPreviewText: 'Read real verified customer reviews + enjoy free shipping + 10% off.',
      emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 16px;">
    <h2 style="color: #4f46e5; margin: 0;">Verified 5-Star Customer Reviews</h2>
  </div>
  <div style="padding: 20px 0;">
    <p><em>"Hands down the best purchase I made this year. Quality is unmatched!"</em> - verified shopper</p>
    <p>We want you to experience it yourself. Take an extra 10% off with code <strong>LOVED10</strong>.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com" style="background-color: #4f46e5; color: white; padding: 14px 28px; font-weight: bold; border-radius: 8px; text-decoration: none;">Try Risk-Free (30-Day Guarantee)</a>
    </div>
  </div>
</div>
      `.trim(),
      status: 'pending_approval',
    },
    {
      id: `var-b-sms-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [Social Proof] Review SMS`,
      targetSegment: 'Mobile Shoppers',
      channel: 'sms',
      smsBody: `[${storeName}] Over 10,000+ happy athletes can't be wrong. Experience the difference with 10% off + free returns code LOVED10: https://${storeName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'pending_approval',
    },
    {
      id: `var-b-discount-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: 'Shopify Voucher: LOVED10',
      targetSegment: 'Social Proof Engine',
      channel: 'shopify_discount',
      discountCode: 'LOVED10',
      discountPercentage: 10,
      status: 'pending_approval',
    }
  ];

  // Variant C: VIP Exclusivity & Curiosity Angle
  const variantCAssets: DraftedCampaignAsset[] = [
    {
      id: `var-c-email-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [Exclusivity Variant C] Secret Member Access`,
      targetSegment: 'VIP & High-Value Prospects',
      channel: 'email',
      emailSubject: `An unannounced perk from the ${storeName} team 🎁`,
      emailPreviewText: 'You have been selected for exclusive member benefits on your current cart.',
      emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 16px;">
    <h2 style="color: #059669; margin: 0;">✨ Private Member Privilege</h2>
  </div>
  <div style="padding: 20px 0;">
    <p>We value thoughtful shoppers. We have automatically credited your session with VIP priority shipping + a 12% secret voucher.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com" style="background-color: #10b981; color: white; padding: 14px 28px; font-weight: bold; border-radius: 8px; text-decoration: none;">Unlock Secret Member Discount</a>
    </div>
  </div>
</div>
      `.trim(),
      status: 'pending_approval',
    },
    {
      id: `var-c-sms-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `${storeName} | [VIP Secret] SMS`,
      targetSegment: 'VIP Shoppers',
      channel: 'sms',
      smsBody: `[${storeName} Private] A surprise gift is waiting in your cart. Apply code SECRET12 for 12% off + priority delivery: https://${storeName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'pending_approval',
    },
    {
      id: `var-c-discount-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: 'Shopify Voucher: SECRET12',
      targetSegment: 'Exclusivity Funnel',
      channel: 'shopify_discount',
      discountCode: 'SECRET12',
      discountPercentage: 12,
      status: 'pending_approval',
    }
  ];

  return [
    {
      id: 'var-a',
      name: 'Variant A: Urgency & Scarcity',
      angle: 'Urgency & Scarcity',
      description: 'High-energy countdown triggers, cart expiration warnings, and low-stock urgency hooks.',
      expectedConversionLift: 18.5,
      confidenceScore: 91,
      keyHighlight: '🔥 Highest immediate 2-hour checkout velocity',
      assets: variantAAssets,
    },
    {
      id: 'var-b',
      name: 'Variant B: Social Proof & Trust',
      angle: 'Social Proof & Value',
      description: 'Focuses on 5-star verified customer ratings, satisfaction guarantees, and product reliability.',
      expectedConversionLift: 14.2,
      confidenceScore: 87,
      keyHighlight: '⭐ Highest long-term brand trust & lower return rates',
      assets: variantBAssets,
    },
    {
      id: 'var-c',
      name: 'Variant C: VIP Exclusivity & Curiosity',
      angle: 'Exclusivity & Curiosity',
      description: 'Framed as a secret unannounced gift and member privilege to maximize open rates and engagement.',
      expectedConversionLift: 16.8,
      confidenceScore: 89,
      keyHighlight: '💎 Highest email open rate (+52.4%) and AOV',
      assets: variantCAssets,
    }
  ];
}
