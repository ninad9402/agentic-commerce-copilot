'use client';

import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  apiProvider: 'openai' | 'gemini';
  onSave: (key: string, provider: 'openai' | 'gemini') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  apiProvider,
  onSave,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [providerInput, setProviderInput] = useState<'openai' | 'gemini'>(apiProvider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Reasoning & API Config</h3>
              <p className="text-xs text-slate-400">Configure LLM keys or use built-in Copilot engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">AI Provider</label>
          <select
            value={providerInput}
            onChange={(e) => setProviderInput(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
            <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">API Key (Optional)</label>
          <input
            type="password"
            placeholder="sk-proj-..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            Leaving this blank will automatically default to our pre-tuned high-converting E-Commerce Copilot fallback engine.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>Keys are stored locally in your browser memory and never transmitted outside tool calls.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(keyInput, providerInput);
              onClose();
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
