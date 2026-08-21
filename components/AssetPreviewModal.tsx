'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Tag, Layout, CheckCircle, ShieldAlert, Edit2, Play, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { DraftedCampaignAsset, GrowthOpportunity } from '../lib/types/ecommerce';

interface AssetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: DraftedCampaignAsset[];
  opportunity: GrowthOpportunity;
  onApproveAndExecute: (approvedAssets: DraftedCampaignAsset[]) => void;
  isExecuting?: boolean;
}

export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
  isOpen,
  onClose,
  assets,
  opportunity,
  onApproveAndExecute,
  isExecuting = false,
}) => {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [editableAssets, setEditableAssets] = useState<DraftedCampaignAsset[]>(assets);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state when assets change
  useEffect(() => {
    setEditableAssets(assets);
    setActiveAssetIndex(0);
  }, [assets, opportunity.id]);

  if (!isOpen || assets.length === 0) return null;

  const currentAsset = editableAssets[activeAssetIndex] || editableAssets[0] || assets[0];

  const handleTextChange = (field: keyof DraftedCampaignAsset, value: any) => {
    const updated = [...editableAssets];
    updated[activeAssetIndex] = {
      ...updated[activeAssetIndex],
      [field]: value,
    };
    setEditableAssets(updated);
  };

  const handleCopyContent = () => {
    let contentToCopy = '';
    if (currentAsset.channel === 'email') {
      contentToCopy = `Subject: ${currentAsset.emailSubject || ''}\nPreview: ${currentAsset.emailPreviewText || ''}\n\n${currentAsset.emailBodyHtml || ''}`;
    } else if (currentAsset.channel === 'sms') {
      contentToCopy = currentAsset.smsBody || '';
    } else if (currentAsset.channel === 'shopify_discount') {
      contentToCopy = currentAsset.discountCode || '';
    } else if (currentAsset.channel === 'ad_copy') {
      contentToCopy = `Hook: ${currentAsset.adHook || ''}\nBody: ${currentAsset.adBody || ''}\nCTA: ${currentAsset.adCta || ''}`;
    } else if (currentAsset.channel === 'product_copy') {
      contentToCopy = currentAsset.revisedProductDescription || '';
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(contentToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getChannelIcon = (channel: DraftedCampaignAsset['channel']) => {
    switch (channel) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'shopify_discount': return Tag;
      case 'ad_copy': return Layout;
      case 'product_copy': return FileText;
      default: return Sparkles;
    }
  };

  const getChannelLabel = (channel: DraftedCampaignAsset['channel']) => {
    switch (channel) {
      case 'email': return 'Email Campaign';
      case 'sms': return 'SMS Broadcast';
      case 'shopify_discount': return 'Shopify Voucher';
      case 'ad_copy': return 'Social Ad Copy';
      case 'product_copy': return 'Product Copy';
      default: return 'Campaign Asset';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-indigo-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Human Approval & Asset Review Gate</h3>
                <span className="badge-warning text-xs font-semibold px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Review and edit the AI-generated campaign assets before publishing to external mock APIs.
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

        {/* Channel Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-900/40 border-b border-slate-800 overflow-x-auto">
          {editableAssets.map((asset, idx) => {
            const Icon = getChannelIcon(asset.channel);
            const isActive = idx === activeAssetIndex;
            return (
              <button
                key={asset.id || idx}
                onClick={() => setActiveAssetIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{getChannelLabel(asset.channel)}</span>
              </button>
            );
          })}
        </div>

        {/* Asset Editor & Device Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editable Metadata Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" /> Asset Specifications
              </span>
              <span className="text-xs text-slate-400 font-medium">{currentAsset.targetSegment}</span>
            </div>

            {/* Campaign Title */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Campaign Title</label>
              <input
                type="text"
                value={currentAsset.campaignTitle || ''}
                onChange={(e) => handleTextChange('campaignTitle', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email-specific fields */}
            {currentAsset.channel === 'email' && (
              <>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={currentAsset.emailSubject || ''}
                    onChange={(e) => handleTextChange('emailSubject', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Preview Text</label>
                  <input
                    type="text"
                    value={currentAsset.emailPreviewText || ''}
                    onChange={(e) => handleTextChange('emailPreviewText', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {/* SMS specific fields */}
            {currentAsset.channel === 'sms' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">SMS Message Body</label>
                <textarea
                  rows={4}
                  value={currentAsset.smsBody || ''}
                  onChange={(e) => handleTextChange('smsBody', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>
            )}

            {/* Shopify Discount fields */}
            {currentAsset.channel === 'shopify_discount' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={currentAsset.discountCode || ''}
                    onChange={(e) => handleTextChange('discountCode', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-400 outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={currentAsset.discountPercentage || 10}
                    onChange={(e) => handleTextChange('discountPercentage', parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Ad copy fields */}
            {currentAsset.channel === 'ad_copy' && (
              <>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ad Hook</label>
                  <input
                    type="text"
                    value={currentAsset.adHook || ''}
                    onChange={(e) => handleTextChange('adHook', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ad Body</label>
                  <textarea
                    rows={3}
                    value={currentAsset.adBody || ''}
                    onChange={(e) => handleTextChange('adBody', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={currentAsset.adCta || ''}
                    onChange={(e) => handleTextChange('adCta', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </>
            )}

            {/* Product copy fields */}
            {currentAsset.channel === 'product_copy' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Revised Product Description Copy</label>
                <textarea
                  rows={8}
                  value={currentAsset.revisedProductDescription || ''}
                  onChange={(e) => handleTextChange('revisedProductDescription', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>
            )}
          </div>

          {/* Right: Live Realistic Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Device Live Visual Preview
              </span>
              <button
                onClick={handleCopyContent}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Asset'}</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 overflow-y-auto max-h-[380px] shadow-inner">
              {currentAsset.channel === 'email' && currentAsset.emailBodyHtml && (
                <div
                  className="bg-white rounded-xl overflow-hidden shadow-lg p-2 text-black"
                  dangerouslySetInnerHTML={{ __html: currentAsset.emailBodyHtml }}
                />
              )}

              {currentAsset.channel === 'sms' && (
                <div className="max-w-[280px] mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-2xl relative">
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3" />
                  <div className="bg-indigo-600 text-white rounded-2xl p-3 text-xs leading-relaxed shadow-sm">
                    {currentAsset.smsBody}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-2">SMS Message • iMessage</p>
                </div>
              )}

              {currentAsset.channel === 'shopify_discount' && (
                <div className="bg-slate-950 border border-dashed border-indigo-500/50 rounded-xl p-6 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Shopify Dynamic Discount Voucher</span>
                  <div className="text-3xl font-black text-indigo-400 my-3 tracking-widest uppercase">
                    {currentAsset.discountCode}
                  </div>
                  <p className="text-xs text-emerald-400 font-bold">{currentAsset.discountPercentage}% OFF Entire Order</p>
                  <p className="text-[11px] text-slate-500 mt-2">Auto-applied via Shopify Script & Stripe Payment Voucher</p>
                </div>
              )}

              {currentAsset.channel === 'ad_copy' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Sponsored Ad</h5>
                      <p className="text-[10px] text-slate-500">Meta & Google Ads Network</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 font-bold">{currentAsset.adHook}</p>
                  <p className="text-xs text-slate-400">{currentAsset.adBody}</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg">
                    {currentAsset.adCta || 'Shop Now'}
                  </button>
                </div>
              )}

              {currentAsset.channel === 'product_copy' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h5 className="text-xs font-bold text-slate-200">Optimized Product Page Layout</h5>
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    {currentAsset.revisedProductDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Targeting {opportunity.targetAudienceCount.toLocaleString()} users across Shopify, Stripe, Klaviyo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={() => onApproveAndExecute(editableAssets)}
              disabled={isExecuting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {isExecuting ? 'Dispatching to Mock APIs...' : 'Approve & Execute Campaign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
