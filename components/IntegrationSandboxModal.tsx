'use client';

import React, { useState } from 'react';
import { X, Network, Send, CheckCircle2, Copy, Check, Terminal, Play, Loader2, Sparkles } from 'lucide-react';
import { IntegrationEndpoint } from '../lib/types/ecommerce';

interface IntegrationSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockEndpoints: IntegrationEndpoint[] = [
  {
    id: 'shopify-graphql',
    name: 'Shopify Admin GraphQL: Discount Voucher Create',
    service: 'shopify',
    method: 'GRAPHQL',
    path: 'https://store-name.myshopify.com/admin/api/2026-07/graphql.json',
    description: 'Creates automated single-use or multi-use price rules directly on Shopify store.',
    samplePayload: {
      query: `mutation discountCodeAppCreate($codeAppInput: DiscountCodeAppInput!) {
  discountCodeAppCreate(codeAppInput: $codeAppInput) {
    codeAppDiscount {
      id
      title
      code
      status
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        codeAppInput: {
          title: "Agentic Cart Recovery 10% Off",
          code: "RECOVER10",
          discountPercentage: 10.0,
          appliesOncePerCustomer: true,
          endsAt: "2026-08-25T23:59:59Z"
        }
      }
    },
    sampleResponse: {
      data: {
        discountCodeAppCreate: {
          codeAppDiscount: {
            id: "gid://shopify/DiscountCodeApp/8912401928",
            title: "Agentic Cart Recovery 10% Off",
            code: "RECOVER10",
            status: "ACTIVE"
          },
          userErrors: []
        }
      }
    }
  },
  {
    id: 'stripe-coupons',
    name: 'Stripe REST API: Promotion Code & Voucher',
    service: 'stripe',
    method: 'POST',
    path: 'https://api.stripe.com/v1/promotion_codes',
    description: 'Generates merchant discount tokens tied directly to Stripe Checkout & Payment Links.',
    samplePayload: {
      coupon: "STRIPE_CPN_RECOVER10",
      code: "RECOVER10",
      max_redemptions: 50,
      metadata: {
        campaign: "agentic_cart_recovery",
        created_by: "growthcopilot_ai"
      }
    },
    sampleResponse: {
      id: "promo_1Nx0982HJs89123",
      object: "promotion_code",
      active: true,
      code: "RECOVER10",
      coupon: {
        id: "STRIPE_CPN_RECOVER10",
        percent_off: 10,
        valid: true
      },
      times_redeemed: 0
    }
  },
  {
    id: 'klaviyo-events',
    name: 'Klaviyo Track API: Flow Event Dispatch',
    service: 'klaviyo',
    method: 'POST',
    path: 'https://a.klaviyo.com/api/events/',
    description: 'Triggers dynamic abandoned checkout email sequences and hyper-personalized notifications.',
    samplePayload: {
      data: {
        type: "event",
        attributes: {
          metric: { name: "Agentic Triggered Cart Winback" },
          properties: {
            cart_value: 188.00,
            discount_code: "RECOVER10",
            saved_items: ["Apex Pro Seamless Compression Tights"]
          },
          profile: {
            email: "shopper@example.com",
            phone_number: "+15553457711"
          }
        }
      }
    },
    sampleResponse: {
      data: {
        type: "event",
        id: "klv_evt_9918231a",
        attributes: { status: "queued", delivered: true }
      }
    }
  },
  {
    id: 'whatsapp-cloud',
    name: 'WhatsApp Cloud API: Interactive HSM Broadcast',
    service: 'whatsapp',
    method: 'POST',
    path: 'https://graph.facebook.com/v19.0/104928192/messages',
    description: 'Sends instant WhatsApp message with Quick Reply buttons to high-intent shoppers.',
    samplePayload: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "+15553457711",
      type: "template",
      template: {
        name: "cart_recovery_discount_v2",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: "Tyler" },
              { type: "text", text: "RECOVER10" }
            ]
          }
        ]
      }
    },
    sampleResponse: {
      messaging_product: "whatsapp",
      contacts: [{ input: "+15553457711", wa_id: "15553457711" }],
      messages: [{ id: "wamid.HBgLMTU1NTM0NTc3MTE=" }]
    }
  }
];

export const IntegrationSandboxModal: React.FC<IntegrationSandboxModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeEndpointId, setActiveEndpointId] = useState<string>(mockEndpoints[0].id);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: number; latencyMs: number } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentEndpoint = mockEndpoints.find(e => e.id === activeEndpointId) || mockEndpoints[0];

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    await new Promise(r => setTimeout(r, 650));
    setPingResult({
      status: 200,
      latencyMs: Math.round(110 + Math.random() * 45),
    });
    setIsPinging(false);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(currentEndpoint.samplePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl max-h-[90vh] rounded-3xl border border-cyan-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Live Integration Sandbox & Webhook Inspector</h3>
                <span className="badge-purple text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> API Gateways
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect GraphQL mutations, REST payloads, and simulate test webhook dispatches.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/40 border-b border-slate-800 overflow-x-auto">
          {mockEndpoints.map((endpoint) => {
            const isActive = endpoint.id === activeEndpointId;
            return (
              <button
                key={endpoint.id}
                onClick={() => {
                  setActiveEndpointId(endpoint.id);
                  setPingResult(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {endpoint.name.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* Payload & Inspector Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Endpoint Info Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px] font-bold">
                  {currentEndpoint.method}
                </span>
                <span className="text-xs font-mono text-slate-300">{currentEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-400">{currentEndpoint.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {pingResult && (
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>HTTP {pingResult.status} OK ({pingResult.latencyMs}ms)</span>
                </div>
              )}

              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isPinging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isPinging ? 'Sending Ping...' : 'Test Dispatch'}</span>
              </button>
            </div>
          </div>

          {/* Side by Side: Request Payload vs Live Mock Response */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Request Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Outbound Request Payload
                </span>
                <button
                  onClick={handleCopyPayload}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-cyan-300 font-mono text-xs overflow-x-auto max-h-[300px] shadow-inner">
                {JSON.stringify(currentEndpoint.samplePayload, null, 2)}
              </pre>
            </div>

            {/* Mock Response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mock API Response (200 OK)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Simulated Production Response</span>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[300px] shadow-inner">
                {JSON.stringify(currentEndpoint.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
