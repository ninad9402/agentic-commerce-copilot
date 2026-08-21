'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, Zap, DollarSign, Target, ShieldCheck, ArrowUpRight, AlertTriangle, Sparkles } from 'lucide-react';
import { StoreKPIs } from '../lib/types/ecommerce';

interface StrategySimulatorProps {
  kpis: StoreKPIs;
  currency?: string;
  onApplyStrategy?: (strategy: { audiencePct: number; discountPct: number; channel: string }) => void;
}

export const StrategySimulator: React.FC<StrategySimulatorProps> = ({
  kpis,
  currency = '$',
  onApplyStrategy,
}) => {
  const [audiencePct, setAudiencePct] = useState<number>(75);
  const [discountPct, setDiscountPct] = useState<number>(10);
  const [channelMix, setChannelMix] = useState<'omnichannel' | 'email_only' | 'sms_first'>('omnichannel');
  const [urgencyHours, setUrgencyHours] = useState<number>(48);

  // Live Calculations
  const calculations = useMemo(() => {
    const totalAbandoned = kpis.totalAbandonedValue || 18500;
    const targetedValue = totalAbandoned * (audiencePct / 100);

    // Channel conversion multiplier
    let channelMultiplier = 0.22;
    if (channelMix === 'omnichannel') channelMultiplier = 0.32;
    if (channelMix === 'sms_first') channelMultiplier = 0.28;

    // Urgency elasticity
    const urgencyMultiplier = urgencyHours <= 24 ? 1.15 : urgencyHours <= 48 ? 1.0 : 0.88;

    const baseRecoveredOrdersValue = targetedValue * channelMultiplier * urgencyMultiplier;
    const grossUplift = Math.round(baseRecoveredOrdersValue);
    const discountCost = Math.round(grossUplift * (discountPct / 100));
    const netUplift = Math.max(0, grossUplift - discountCost);

    const aov = kpis.avgOrderValue || 85;
    const estimatedRecoveredOrders = Math.round(grossUplift / aov);
    const estimatedROAS = Math.round((netUplift / Math.max(discountCost * 0.15 + 40, 1)) * 10);

    const isMarginSafe = discountPct <= 20;

    return {
      grossUplift,
      discountCost,
      netUplift,
      estimatedRecoveredOrders,
      estimatedROAS,
      isMarginSafe,
    };
  }, [kpis, audiencePct, discountPct, channelMix, urgencyHours]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/70 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">Interactive Strategy & ROI Simulator</h3>
              <span className="badge-purple text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Real-Time Elasticity
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tune campaign audience coverage, discount tolerance, and urgency duration to forecast net returns.
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
          calculations.isMarginSafe
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          {calculations.isMarginSafe ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Unit Margin Protected ({100 - discountPct}% Gross)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>High Discount Margin Warning</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Target Audience Reach */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Audience Segmentation Reach</span>
              <span className="text-indigo-400 font-mono">{audiencePct}% of High-Intent Shoppers</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={audiencePct}
              onChange={(e) => setAudiencePct(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Top 20% (VIPs only)</span>
              <span>100% (All Abandoners)</span>
            </div>
          </div>

          {/* Slider 2: Promotional Incentive */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Discount Voucher Percentage</span>
              <span className="text-purple-400 font-mono">{discountPct}% Promo Code</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={discountPct}
              onChange={(e) => setDiscountPct(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>5% (Conservative)</span>
              <span>15% (Balanced)</span>
              <span>30% (Aggressive)</span>
            </div>
          </div>

          {/* Selector 3: Channel Orchestration Mix */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Channel Orchestration Strategy
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'omnichannel', label: 'Omnichannel (Email + SMS + Discount)', badge: 'Max Lift' },
                { id: 'sms_first', label: 'SMS Alert First', badge: 'High Open Rate' },
                { id: 'email_only', label: 'Email Series Only', badge: 'Lowest Cost' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannelMix(c.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    channelMix === c.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase">{c.badge}</span>
                  <span className="text-xs font-semibold block mt-0.5">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector 4: Urgency Expiration Window */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Campaign Countdown Urgency Window
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { hours: 24, label: '24 Hours (Flash Scarcity)' },
                { hours: 48, label: '48 Hours (Standard Balanced)' },
                { hours: 72, label: '72 Hours (Extended Window)' },
              ].map((u) => (
                <button
                  key={u.hours}
                  onClick={() => setUrgencyHours(u.hours)}
                  className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                    urgencyHours === u.hours
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Calculated ROI Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-5 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-3">
              Simulated Performance Output
            </span>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Projected Gross Uplift:</span>
                <span className="text-lg font-black text-slate-100">
                  +{currency}{calculations.grossUplift.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-semibold">Net Profit (Post-Discount):</span>
                <span className="text-xl font-black text-emerald-400">
                  +{currency}{calculations.netUplift.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Recovered Carts</span>
                  <span className="text-cyan-400 font-bold text-sm mt-0.5 block">
                    ~{calculations.estimatedRecoveredOrders} Orders
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Simulated ROAS</span>
                  <span className="text-purple-400 font-bold text-sm mt-0.5 block">
                    {calculations.estimatedROAS}x ROI
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            *Simulations update in real time based on store AOV (${kpis.avgOrderValue.toFixed(0)}) and historical cart elasticity priors.
          </p>
        </div>
      </div>
    </div>
  );
};
