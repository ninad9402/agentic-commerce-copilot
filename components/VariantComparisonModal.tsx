'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, TrendingUp, Award, Zap, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { StoreDataset, GrowthOpportunity, CampaignVariant, DraftedCampaignAsset } from '../lib/types/ecommerce';
import { generateABVariants } from '../lib/agent/abTestGenerator';

interface VariantComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: StoreDataset;
  opportunity: GrowthOpportunity;
  onSelectVariant: (variantAssets: DraftedCampaignAsset[]) => void;
}

export const VariantComparisonModal: React.FC<VariantComparisonModalProps> = ({
  isOpen,
  onClose,
  dataset,
  opportunity,
  onSelectVariant,
}) => {
  const variants = useMemo(() => generateABVariants(dataset, opportunity), [dataset, opportunity]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('var-a');

  if (!isOpen) return null;

  const activeVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl max-h-[90vh] rounded-3xl border border-indigo-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">A/B Multi-Variant Experimentation Studio</h3>
                <span className="badge-purple text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> 3 Strategic Angles
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compare conversion angles for: <strong className="text-slate-200">{opportunity.title}</strong>
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

        {/* 3 Variant Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-900/30 border-b border-slate-800">
          {variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-200">{v.name}</span>
                  <span className="badge-purple text-[10px] font-bold px-2 py-0.5 rounded-full">
                    +{v.expectedConversionLift}% Lift
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{v.description}</p>
                <div className="text-[11px] text-amber-300 font-semibold p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {v.keyHighlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Variant Asset Deep Dive */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Generated Multichannel Assets for {activeVariant.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeVariant.confidenceScore}% AI Confidence Model</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVariant.assets.map((asset) => (
              <div key={asset.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {asset.channel.toUpperCase()} CHANNEL
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-900">
                    {asset.targetSegment}
                  </span>
                </div>

                {asset.channel === 'email' && (
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-300 font-semibold">Subject: {asset.emailSubject}</p>
                    <p className="text-slate-500 italic">Preview: {asset.emailPreviewText}</p>
                  </div>
                )}

                {asset.channel === 'sms' && (
                  <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-slate-300 font-mono border border-slate-800">
                    {asset.smsBody}
                  </div>
                )}

                {asset.channel === 'shopify_discount' && (
                  <div className="p-3 rounded-xl bg-slate-950 text-center border border-dashed border-indigo-500/40">
                    <span className="text-lg font-black text-indigo-400 tracking-widest">{asset.discountCode}</span>
                    <span className="text-xs text-emerald-400 font-bold block mt-1">{asset.discountPercentage}% OFF</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Selecting a variant will push its customized assets to the approval pipeline</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onSelectVariant(activeVariant.assets);
                onClose();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Apply {activeVariant.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
