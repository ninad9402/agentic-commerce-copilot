'use client';

import React from 'react';
import { Bot, Store, Upload, Settings, Sparkles, Brain, Network, Sliders } from 'lucide-react';
import { StoreDataset, BrandTone } from '../lib/types/ecommerce';
import { sampleDatasets } from '../lib/data/sampleDatasets';
import { brandTones } from '../lib/agent/brandToneEngine';

interface HeaderProps {
  currentStore: StoreDataset;
  stores?: StoreDataset[];
  onSelectStore: (store: StoreDataset) => void;
  onOpenCsvModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSandboxModal: () => void;
  onOpenMemoryModal: () => void;
  brandTone: BrandTone;
  onSelectBrandTone: (tone: BrandTone) => void;
  isAiActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  stores = sampleDatasets,
  onSelectStore,
  onOpenCsvModal,
  onOpenSettingsModal,
  onOpenSandboxModal,
  onOpenMemoryModal,
  brandTone,
  onSelectBrandTone,
  isAiActive = false,
}) => {
  const storeList = stores.some(s => s.id === currentStore.id)
    ? stores
    : [currentStore, ...stores];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">GrowthCopilot.ai</h1>
            <span className="badge-purple px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Autonomous Commerce Swarm
            </span>
          </div>
          <p className="text-xs text-slate-400">Multi-Agent Revenue Engine & Autonomous Campaign Dispatch</p>
        </div>
      </div>

      {/* Action Controls & Modal Triggers */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Store Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
          <Store className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-400 font-medium">Store:</span>
          <select
            value={currentStore.id}
            onChange={(e) => {
              const selected = storeList.find(s => s.id === e.target.value);
              if (selected) onSelectStore(selected);
            }}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-1"
          >
            {storeList.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.logo} {s.name} ({s.industry})
              </option>
            ))}
          </select>
        </div>

        {/* Brand Tone Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
          <span className="text-xs font-semibold text-purple-400">Voice:</span>
          <select
            value={brandTone}
            onChange={(e) => onSelectBrandTone(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-1"
          >
            {Object.values(brandTones).map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                {t.badge} {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Memory & Guardrails Trigger */}
        <button
          onClick={onOpenMemoryModal}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 transition-all shadow-sm"
          title="Inspect Agent Memory & Business Guardrails"
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>Agent Memory</span>
        </button>

        {/* Live API Sandbox Trigger */}
        <button
          onClick={onOpenSandboxModal}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 transition-all shadow-sm"
          title="Inspect Mock API Webhook Payloads"
        >
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>API Sandbox</span>
        </button>

        {/* Upload Custom CSV Button */}
        <button
          onClick={onOpenCsvModal}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 transition-all shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Upload CSV</span>
        </button>

        {/* API Settings */}
        <button
          onClick={onOpenSettingsModal}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 transition-all shadow-sm"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
};
