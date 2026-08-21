import { GrowthOpportunity, StoreDataset, DraftedCampaignAsset } from '../types/ecommerce';

export interface GenerateAssetOptions {
  opportunity: GrowthOpportunity;
  dataset: StoreDataset;
  apiKey?: string;
  apiProvider?: 'openai' | 'gemini';
}

export async function generateCampaignAssets(
  options: GenerateAssetOptions
): Promise<DraftedCampaignAsset[]> {
  const { opportunity, dataset, apiKey, apiProvider } = options;

  // If user provided a custom OpenAI key, we can try calling OpenAI chat completions API
  if (apiKey && apiProvider === 'openai') {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an elite E-Commerce Growth Copywriter and Growth Hacker. Output valid JSON array containing campaign assets.'
            },
            {
              role: 'user',
              content: `Generate high-converting campaign assets for opportunity: ${opportunity.title}. Store: ${dataset.name} (${dataset.industry}). Category: ${opportunity.category}. Output format: JSON object.`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        const parsed = JSON.parse(data.choices[0].message.content);
        if (Array.isArray(parsed.assets)) {
          return parsed.assets;
        }
      }
    } catch (e) {
      console.warn('OpenAI API call failed, falling back to smart generative template engine', e);
    }
  }

  // High-converting smart fallback generator tailored by category & store
  const storeName = dataset.name;
  const currency = dataset.currency || '$';

  if (opportunity.category === 'cart_recovery') {
    const cart = dataset.abandonedCarts[0];
    const itemName = cart?.items[0]?.name || 'your items';
    const cartVal = cart ? `${currency}${cart.cartValue}` : `${currency}150`;

    return [
      {
        id: `asset-email-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: `${storeName} | Abandoned Cart Win-Back Series`,
        targetSegment: 'High-Intent Cart Abandoners (> 24 Hours)',
        channel: 'email',
        emailSubject: `Did you leave something behind at ${storeName}? 🛒 (10% off inside)`,
        emailPreviewText: 'Your cart is reserved! Use code RECOVER10 to complete your order before stock runs out.',
        emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #6366f1;">
    <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">${storeName}</h1>
    <p style="color: #718096; margin: 4px 0 0 0; font-size: 14px;">High Performance E-Commerce</p>
  </div>
  
  <div style="padding: 24px 0;">
    <h2 style="color: #2d3748; font-size: 20px; margin-top: 0;">Hey there! You left your gear in the cart 👋</h2>
    <p style="color: #4a5568; line-height: 1.6;">We noticed you were browsing <strong>${itemName}</strong>, but didn't finish checking out. Good news: we saved your cart for you!</p>
    
    <div style="background-color: #f7fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #2d3748;">Saved Cart Total: ${cartVal}</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #718096;">Includes high-demand items currently in low stock.</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com/checkout?discount=RECOVER10" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(79,70,229,0.3);">
        Complete My Purchase (10% Off)
      </a>
    </div>

    <p style="font-size: 13px; color: #a0aec0; text-align: center;">Use promo code <strong style="color: #4f46e5;">RECOVER10</strong> at checkout. Offer expires in 48 hours.</p>
  </div>
  
  <div style="border-top: 1px solid #edf2f7; padding-top: 16px; text-align: center; font-size: 12px; color: #a0aec0;">
    <p>© 2026 ${storeName}. All rights reserved.</p>
  </div>
</div>
        `.trim(),
        status: 'pending_approval',
      },
      {
        id: `asset-sms-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: `${storeName} | Instant SMS Recovery Alert`,
        targetSegment: 'Cart Abandoners with Phone Opt-in',
        channel: 'sms',
        smsBody: `[${storeName}] Hey! You left items in your cart. Stocks are running low! Complete your order in 60 secs with 10% off code RECOVER10: https://${storeName.toLowerCase().replace(/\s+/g, '')}.com/c/cart501 Reply STOP to opt out.`,
        status: 'pending_approval',
      },
      {
        id: `asset-discount-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: 'Shopify Dynamic Promo Voucher',
        targetSegment: 'Automated Cart Recovery Engine',
        channel: 'shopify_discount',
        discountCode: 'RECOVER10',
        discountPercentage: 10,
        minOrderValue: 50,
        status: 'pending_approval',
      }
    ];
  }

  if (opportunity.category === 'customer_retention') {
    return [
      {
        id: `asset-email-vip-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: `${storeName} | VIP Secret Loyalty Event`,
        targetSegment: 'At-Risk VIP Buyers (Unused for > 60 Days)',
        channel: 'email',
        emailSubject: `We miss you at ${storeName}! Here is $25 towards your next order 🎁`,
        emailPreviewText: 'An exclusive gift for our top supporters. Check out what is new!',
        emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #10b981;">
    <h1 style="color: #059669; margin: 0; font-size: 24px;">${storeName} VIP Access</h1>
  </div>
  <div style="padding: 24px 0;">
    <h2 style="color: #111827;">We noticed it's been a while since your last visit!</h2>
    <p style="color: #4b5563; line-height: 1.6;">As one of our valued VIP supporters, we wanted to personally invite you back to explore our latest collection with a complimentary <strong>$25 store credit</strong>.</p>
    
    <div style="background-color: #ecfdf5; border: 1px dashed #10b981; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #065f46; font-size: 14px; text-transform: uppercase; font-weight: bold;">Your Exclusive Voucher Code</p>
      <p style="font-size: 28px; font-weight: 900; color: #047857; margin: 8px 0; letter-spacing: 2px;">VIPGIFT25</p>
      <p style="margin: 0; font-size: 12px; color: #047857;">Valid on any order of ${currency}100 or more</p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com/vip-store?code=VIPGIFT25" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block;">
        Claim $25 Store Credit Now
      </a>
    </div>
  </div>
</div>
        `.trim(),
        status: 'pending_approval',
      },
      {
        id: `asset-sms-vip-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: `${storeName} | VIP Flash SMS Gift`,
        targetSegment: 'At-Risk VIPs',
        channel: 'sms',
        smsBody: `[${storeName} VIP] We miss you! Enjoy $25 off your next order with code VIPGIFT25. Valid for the next 48h: https://${storeName.toLowerCase().replace(/\s+/g, '')}.com/vip`,
        status: 'pending_approval',
      }
    ];
  }

  if (opportunity.category === 'cross_sell') {
    const accessory = dataset.products.find(p => p.category === 'Accessories' || p.category === 'Gear') || dataset.products[1] || dataset.products[0];
    return [
      {
        id: `asset-cross-sell-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: `${storeName} | Post-Purchase 1-Click Upsell Bundle`,
        targetSegment: 'Recent Buyers with In-Cart Upsell Prompt',
        channel: 'email',
        emailSubject: `Add ${accessory.name} to your order for 20% off! ⚡`,
        emailPreviewText: 'Exclusive 1-click bundle discount valid for the next 15 minutes.',
        emailBodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
  <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #8b5cf6;">
    <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">${storeName} Bundle Perks</h1>
  </div>
  <div style="padding: 24px 0;">
    <h2 style="color: #111827;">Complete your setup with ${accessory.name} 🔥</h2>
    <p style="color: #4b5563; line-height: 1.6;">Thank you for your recent purchase! As a special bonus, add <strong>${accessory.name}</strong> to your package with <strong>20% OFF</strong> and zero extra shipping fees.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="https://${storeName.toLowerCase().replace(/\s+/g, '')}.com/bundle?item=${accessory.id}&discount=BUNDLE20" style="background-color: #7c3aed; color: #ffffff; padding: 14px 28px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block;">
        Add to Order for ${currency}${(accessory.price * 0.8).toFixed(2)} (Save 20%)
      </a>
    </div>
  </div>
</div>
        `.trim(),
        status: 'pending_approval',
      },
      {
        id: `asset-discount-bundle-${Date.now()}`,
        opportunityId: opportunity.id,
        campaignTitle: 'Shopify 1-Click Bundle Voucher',
        targetSegment: 'Post-Checkout Upsell Funnel',
        channel: 'shopify_discount',
        discountCode: 'BUNDLE20',
        discountPercentage: 20,
        minOrderValue: 20,
        status: 'pending_approval',
      }
    ];
  }

  // Product optimization copy default
  const lowConvProduct = dataset.products[0];
  return [
    {
      id: `asset-product-rewrite-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `AI Copy Optimization: ${lowConvProduct.name}`,
      targetSegment: 'Landing Page & Product Page Visitors',
      channel: 'product_copy',
      productIdToOptimize: lowConvProduct.id,
      revisedProductDescription: `### 🚀 Upgraded High-Converting Product Copy: ${lowConvProduct.name}

**Value Proposition Hook:**
Experience unrivaled performance and precision engineering designed to push your boundaries.

**Key Benefits:**
- 🛡️ **Ultra-Durable Construction**: Built with medical-grade heat-regulating fabrics.
- ⚡ **Ergonomic Precision Fit**: Zero slippage, max comfort during high-intensity training.
- 💧 **Moisture-Wicking Tech**: Keeps you cool, dry, and focused when it counts.

**Social Proof Hook:**
*"Used by over 12,000+ athletes nationwide. Backed by our 30-Day No-Questions-Asked Ironclad Guarantee."*`,
      status: 'pending_approval',
    },
    {
      id: `asset-ad-copy-${Date.now()}`,
      opportunityId: opportunity.id,
      campaignTitle: `Meta & Google High-ROAS Retargeting Ad`,
      targetSegment: 'High-Intent Product Viewers (No Purchase)',
      channel: 'ad_copy',
      adHook: '🔥 Stop settling for ordinary gym gear that wears out after 3 washes.',
      adBody: `Meet the ${lowConvProduct.name}. Engineered for maximum durability, sweat-resistance, and elite comfort. Try it risk-free with free shipping + 30-day returns.`,
      adCta: 'Shop Now & Save 15%',
      status: 'pending_approval',
    }
  ];
}
