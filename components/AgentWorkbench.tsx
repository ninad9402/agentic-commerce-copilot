'use client';

import React from 'react';
import { Bot, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Eye, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { AgentExecutionState } from '../lib/agent/agentCore';

interface AgentWorkbenchProps {
  state: AgentExecutionState;
  onOpenPreviewModal: () => void;
  onReset: () => void;
}

export const AgentWorkbench: React.FC<AgentWorkbenchProps> = ({
  state,
  onOpenPreviewModal,
  onReset,
}) => {
  const { currentOpportunity, thoughts, draftedAssets, status } = state;

  if (!currentOpportunity && thoughts.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
          <Bot className="w-7 h-7 text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-slate-200">Agent Workbench Standby</h3>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Select a prioritized growth opportunity above to launch the Autonomous Agentic Workflow.
        </p>
      </div>
    );
  }

  const isComplete = status === 'completed';
  const isAwaiting = status === 'awaiting_approval';
  const isRunning = status === 'analyzing' || status === 'drafting' || status === 'executing';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-slate-950/60 shadow-2xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            {isRunning ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isAwaiting ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                {currentOpportunity?.title || 'Autonomous Agent Workflow'}
              </h2>
              {isAwaiting && (
                <span className="badge-warning text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Awaiting Human Approval
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isRunning
                ? 'Agent is reasoning, mining store data, and executing tools...'
                : isAwaiting
                ? 'Assets drafted. Human guardrails pause active. Review assets to proceed.'
                : 'Execution completed & metrics logged.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {draftedAssets.length > 0 && (
            <button
              onClick={onOpenPreviewModal}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              Review Drafted Assets ({draftedAssets.length})
            </button>
          )}

          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Thought Stream Log Terminal */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Agent Thought Stream & Tool Invocations
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{thoughts.length} steps logged</span>
        </div>

        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2.5 shadow-inner">
          {thoughts.map((t) => (
            <div key={t.id} className="flex items-start gap-2.5 border-b border-slate-900/60 pb-2">
              <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{t.timestamp}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.phase === 'tool_call'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : t.phase === 'approval_required'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-900'
                    }`}
                  >
                    {t.phase}
                  </span>
                  {t.toolInvoked && (
                    <span className="text-cyan-400 text-[11px] font-semibold">
                      tool:{t.toolInvoked}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-normal">{t.message}</p>
              </div>
            </div>
          ))}

          {isRunning && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs py-1 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Agent is computing next step...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
