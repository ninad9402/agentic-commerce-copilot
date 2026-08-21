'use client';

import React from 'react';
import { GrowthOpportunity } from '../lib/types/ecommerce';
import { Rocket, Target, Zap, TrendingUp, ShieldAlert, Award, Bot, Layers } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: GrowthOpportunity;
  onSelect: (opp: GrowthOpportunity) => void;
  onOpenSwarm?: (opp: GrowthOpportunity) => void;
  onOpenVariants?: (opp: GrowthOpportunity) => void;
  isSelected?: boolean;
  currency?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onOpenSwarm,
  onOpenVariants,
  isSelected = false,
  currency = '$',
}) => {
  const getBadgeStyle = (impact: GrowthOpportunity['impactScore']) => {
    switch (impact) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div
      className={`glass-panel p-5 rounded-3xl border glass-panel-hover flex flex-col justify-between transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Header & Impact Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getBadgeStyle(opportunity.impactScore)} flex items-center gap-1`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            {opportunity.impactScore} Priority Opportunity
          </span>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{opportunity.confidenceScore}% AI Model</span>
          </div>
        </div>

        {/* Opportunity Title & Rationale */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mt-2">
          {opportunity.description}
        </p>

        {/* Action Strategy */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            Agentic Strategy Recommendation:
          </div>
          <p className="text-slate-400 line-clamp-2">{opportunity.suggestedAction}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/60 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] uppercase font-semibold">Target Audience</span>
            <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              {opportunity.targetAudienceCount.toLocaleString()} Users
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] uppercase font-semibold">Expected Uplift</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1 mt-0.5 text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              +{currency}{opportunity.expectedUpliftRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 space-y-2">
        {/* Primary Deploy Button */}
        <button
          onClick={() => onSelect(opportunity)}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Rocket className="w-4 h-4 text-cyan-300 animate-bounce" />
          Deploy Copilot Experiment
        </button>

        {/* Secondary Swarm & A/B Variant Triggers */}
        <div className="grid grid-cols-2 gap-2">
          {onOpenSwarm && (
            <button
              onClick={() => onOpenSwarm(opportunity)}
              className="flex items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-800 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Multi-Agent</span>
            </button>
          )}

          {onOpenVariants && (
            <button
              onClick={() => onOpenVariants(opportunity)}
              className="flex items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-800 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>A/B Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
