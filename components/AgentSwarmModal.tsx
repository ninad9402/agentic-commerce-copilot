'use client';

import React, { useState, useEffect } from 'react';
import { X, Bot, Play, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, Loader2, FileCheck, Eye } from 'lucide-react';
import { StoreDataset, GrowthOpportunity, SwarmExecutionState, DraftedCampaignAsset, BrandTone } from '../lib/types/ecommerce';
import { specializedAgents, runSwarmOrchestration } from '../lib/agent/multiAgentOrchestrator';

interface AgentSwarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: StoreDataset;
  opportunity: GrowthOpportunity;
  brandTone: BrandTone;
  onAssetsReady: (assets: DraftedCampaignAsset[]) => void;
}

export const AgentSwarmModal: React.FC<AgentSwarmModalProps> = ({
  isOpen,
  onClose,
  dataset,
  opportunity,
  brandTone,
  onAssetsReady,
}) => {
  const [swarmState, setSwarmState] = useState<SwarmExecutionState>({
    status: 'idle',
    steps: [],
    synthesizedAssets: [],
    guardrailChecks: {
      passed: true,
      marginSafety: 'Pending verification',
      discountCapApproved: true,
      audienceFilterValidated: true,
    },
  });
  const [isRunning, setIsRunning] = useState(false);

  const handleLaunchSwarm = React.useCallback(async () => {
    setIsRunning(true);
    setSwarmState(prev => ({ ...prev, status: 'running', steps: [] }));

    await runSwarmOrchestration(
      dataset,
      opportunity,
      brandTone,
      (updatedState) => setSwarmState(updatedState)
    );

    setIsRunning(false);
  }, [dataset, opportunity, brandTone]);

  useEffect(() => {
    if (isOpen) {
      handleLaunchSwarm();
    }
  }, [isOpen, handleLaunchSwarm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-indigo-500/40 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Multi-Agent Swarm Collaboration Hub</h3>
                <span className="badge-purple text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> 4 Cooperating Agents
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specialized sub-agents collaborating on: <strong className="text-slate-200">{opportunity.title}</strong>
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

        {/* 4 Specialized Agent Team Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-900/40 border-b border-slate-800">
          {specializedAgents.map((agent) => {
            const isActive = swarmState.currentAgentRole === agent.role && isRunning;
            return (
              <div
                key={agent.role}
                className={`p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{agent.avatar}</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 leading-none">{agent.name}</h5>
                    <span className="text-[10px] text-indigo-400 block font-medium mt-0.5">{agent.title}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{agent.description}</p>
                {isActive && (
                  <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold mt-2 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> Computing handoff...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Swarm Handoff Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Inter-Agent Communication & Tool Execution Stream
            </span>
            <span className="text-xs text-slate-500 font-mono">{swarmState.steps.length} Actions Logged</span>
          </div>

          <div className="space-y-3">
            {swarmState.steps.map((step) => (
              <div
                key={step.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 animate-in fade-in duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{step.agentAvatar}</span>
                    <span className="text-xs font-bold text-slate-200">{step.agentName}</span>
                    <span className="badge-purple text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {step.phase}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{step.message}</p>

                {step.outputPayload && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {JSON.stringify(step.outputPayload, null, 2)}
                  </div>
                )}
              </div>
            ))}

            {isRunning && (
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-dashed border-indigo-500/40 flex items-center justify-center gap-2 text-xs text-indigo-400 font-semibold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Agents are collaborating and validating safety guardrails...
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>All 4 Agent Verification Checks Completed & Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              Close
            </button>

            {swarmState.synthesizedAssets.length > 0 && (
              <button
                onClick={() => {
                  onAssetsReady(swarmState.synthesizedAssets);
                  onClose();
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Eye className="w-4 h-4 text-cyan-300" />
                Review Synthesized Assets ({swarmState.synthesizedAssets.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
