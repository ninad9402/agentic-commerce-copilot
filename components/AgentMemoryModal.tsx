'use client';

import React, { useState } from 'react';
import { X, Brain, Shield, Plus, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { initialAgentMemories, defaultMerchantGuardrails, MemoryEntry } from '../lib/agent/agentMemory';
import { MerchantGuardrail } from '../lib/types/ecommerce';

interface AgentMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  additionalMemories?: MemoryEntry[];
}

export const AgentMemoryModal: React.FC<AgentMemoryModalProps> = ({
  isOpen,
  onClose,
  additionalMemories = [],
}) => {
  const [guardrails, setGuardrails] = useState<MerchantGuardrail[]>(defaultMerchantGuardrails);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleValue, setNewRuleValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const allMemories = [...additionalMemories, ...initialAgentMemories];

  const handleToggleGuardrail = (id: string) => {
    setGuardrails(prev =>
      prev.map(g => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleAddGuardrail = () => {
    if (!newRuleTitle || !newRuleValue) return;
    const newG: MerchantGuardrail = {
      id: `custom-gr-${Date.now()}`,
      title: newRuleTitle,
      category: 'brand_safety',
      description: 'Custom merchant-defined operational constraint enforced on all autonomous cycles.',
      ruleValue: newRuleValue,
      enabled: true,
    };
    setGuardrails(prev => [newG, ...prev]);
    setNewRuleTitle('');
    setNewRuleValue('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Agent Long-Term Memory & Merchant Guardrails</h3>
                <span className="badge-purple text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> Reinforcement Priors
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect how the agent learns from previous campaigns and enforce hard business rules.
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Merchant Operational Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Active Human-In-The-Loop Safety Guardrails ({guardrails.filter(g => g.enabled).length} Enabled)
                </h4>
              </div>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-950/40 border border-indigo-800 px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Constraint</span>
              </button>
            </div>

            {isAdding && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3">
                <h5 className="text-xs font-bold text-slate-200">Define New Business Constraint</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Constraint Title (e.g. Free Shipping Min $50)"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Rule Threshold (e.g. Min $50 Order)"
                    value={newRuleValue}
                    onChange={(e) => setNewRuleValue(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-950"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGuardrail}
                    className="text-xs text-white font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                  >
                    Enforce Rule
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guardrails.map((g) => (
                <div
                  key={g.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    g.enabled
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{g.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{g.description}</p>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-900 inline-block mt-1">
                      Rule: {g.ruleValue}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleGuardrail(g.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                      g.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {g.enabled ? 'ACTIVE' : 'MUTED'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Learned Memory Bank & Priors */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Learned Empirical Priors ({allMemories.length} Stored Priors)
                </h4>
              </div>
              <span className="text-xs text-purple-400 font-medium">Auto-updated on Closed-Loop feedback</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {allMemories.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                      <span className="badge-purple text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {m.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{m.insight}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-mono font-bold block">
                      +{Math.round(m.weightDelta * 100)}% Weight
                    </span>
                    <span className="text-[10px] text-slate-500">Heuristic Boost</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            Close Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};
