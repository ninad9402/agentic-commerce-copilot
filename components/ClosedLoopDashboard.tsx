'use client';

import React from 'react';
import { TrendingUp, Award, Brain, CheckCircle2, Zap, ArrowUpRight, Clock, Target } from 'lucide-react';
import { ClosedLoopMetrics } from '../lib/types/ecommerce';
import { initialAgentMemories, MemoryEntry } from '../lib/agent/agentMemory';

interface ClosedLoopDashboardProps {
  metricsHistory: ClosedLoopMetrics[];
  currency?: string;
}

export const ClosedLoopDashboard: React.FC<ClosedLoopDashboardProps> = ({
  metricsHistory,
  currency = '$',
}) => {
  if (metricsHistory.length === 0) return null;

  const latestMetric = metricsHistory[metricsHistory.length - 1];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-slate-950/70 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Closed-Loop Performance & Uplift Tracker</h2>
              <span className="badge-active text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Real-Time Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Measures campaign revenue uplift, conversion lifts, and feeds back into Agent Memory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Executed at {latestMetric.executedAt}
        </div>
      </div>

      {/* Primary Uplift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Actual vs Projected Revenue */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
          <span className="text-xs font-semibold text-slate-400 uppercase">Actual Revenue Uplift</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {currency}{latestMetric.actualRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <Target className="w-3 h-3 text-indigo-400" />
            <span>Target: {currency}{latestMetric.projectedRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Email/SMS Open Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Engagement Open Rate</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {latestMetric.openRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Click-through: {latestMetric.clickRate}%</div>
        </div>

        {/* Total Conversions */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Recovered Orders</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {latestMetric.conversions} Orders
          </div>
          <div className="text-xs text-slate-400 mt-1">Conv. Rate: {latestMetric.conversionRate}%</div>
        </div>

        {/* Campaign ROI */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Campaign ROAS / ROI</span>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {latestMetric.roiPercentage}% ROI
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> High efficiency
          </div>
        </div>
      </div>

      {/* Adaptive Agent Memory Log */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Agent Reinforcement Memory Log
            </h4>
          </div>
          <span className="text-[11px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-700">
            Reinforcement Learning Active
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-indigo-900 text-xs text-slate-300 font-mono">
          <p className="text-emerald-400 font-bold mb-1">⚡ Dynamic Memory Update Applied:</p>
          <p className="text-slate-300">{latestMetric.agentMemoryInsight}</p>
        </div>
      </div>
    </div>
  );
};
