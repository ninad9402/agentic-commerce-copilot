'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { MetricsOverview } from '../components/MetricsOverview';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { StrategySimulator } from '../components/StrategySimulator';
import { OpportunityCard } from '../components/OpportunityCard';
import { AgentWorkbench } from '../components/AgentWorkbench';
import { AssetPreviewModal } from '../components/AssetPreviewModal';
import { AgentSwarmModal } from '../components/AgentSwarmModal';
import { VariantComparisonModal } from '../components/VariantComparisonModal';
import { IntegrationSandboxModal } from '../components/IntegrationSandboxModal';
import { AgentMemoryModal } from '../components/AgentMemoryModal';
import { ClosedLoopDashboard } from '../components/ClosedLoopDashboard';
import { CsvUploadModal } from '../components/CsvUploadModal';
import { SettingsModal } from '../components/SettingsModal';

import { sampleDatasets } from '../lib/data/sampleDatasets';
import { calculateStoreKPIs } from '../lib/analytics/metricsEngine';
import { mineGrowthOpportunities } from '../lib/agent/growthOpportunityEngine';
import { ECommerceGrowthAgent, AgentExecutionState } from '../lib/agent/agentCore';
import { executeApprovedCampaign } from '../lib/integrations/mockIntegrations';

import { StoreDataset, GrowthOpportunity, DraftedCampaignAsset, ClosedLoopMetrics, BrandTone } from '../lib/types/ecommerce';
import { Sparkles, Bot, Zap, Network, Brain, Sliders, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [stores, setStores] = useState<StoreDataset[]>(sampleDatasets);
  const [currentStore, setCurrentStore] = useState<StoreDataset>(sampleDatasets[0]);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'openai' | 'gemini'>('openai');
  const [brandTone, setBrandTone] = useState<BrandTone>('urgency');

  // Modals state
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Swarm and Variant Modals
  const [swarmOpportunity, setSwarmOpportunity] = useState<GrowthOpportunity | null>(null);
  const [variantOpportunity, setVariantOpportunity] = useState<GrowthOpportunity | null>(null);

  // Agent State
  const [agentState, setAgentState] = useState<AgentExecutionState>({
    status: 'idle',
    thoughts: [],
    draftedAssets: [],
  });

  // Closed loop metrics history
  const [closedLoopHistory, setClosedLoopHistory] = useState<ClosedLoopMetrics[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Derived metrics & opportunities
  const storeKPIs = useMemo(() => calculateStoreKPIs(currentStore), [currentStore]);
  const growthOpportunities = useMemo(() => mineGrowthOpportunities(currentStore), [currentStore]);

  // Trigger Agent Execution on an Opportunity
  const handleSelectOpportunity = async (opp: GrowthOpportunity) => {
    setAgentState({
      status: 'analyzing',
      currentOpportunity: opp,
      thoughts: [],
      draftedAssets: [],
    });

    const agent = new ECommerceGrowthAgent(currentStore, apiKey, apiProvider);

    await agent.runExperiment(
      opp,
      (updatedThoughts) => {
        setAgentState(prev => ({ ...prev, thoughts: updatedThoughts }));
      },
      (finalState) => {
        setAgentState(finalState);
        setIsPreviewModalOpen(true);
      }
    );
  };

  // Handle Human Approval & Execution
  const handleApproveAndExecute = async (approvedAssets: DraftedCampaignAsset[]) => {
    if (!agentState.currentOpportunity) return;

    setIsExecuting(true);

    const execResult = await executeApprovedCampaign(
      approvedAssets[0] || agentState.draftedAssets[0],
      agentState.currentOpportunity.expectedUpliftRevenue,
      agentState.currentOpportunity.targetAudienceCount
    );

    setIsExecuting(false);
    setIsPreviewModalOpen(false);

    if (execResult.closedLoopResult) {
      const closedLoop = execResult.closedLoopResult;
      setClosedLoopHistory(prev => [...prev, closedLoop]);

      setAgentState(prev => ({
        ...prev,
        status: 'completed',
        thoughts: [
          ...prev.thoughts,
          {
            id: `thought-exec-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            phase: 'execution',
            message: `🎉 Campaign Approved & Executed! Shopify discount "${execResult.shopifyDiscountCode}" created, Stripe voucher active, ${execResult.dispatchedRecipientCount} Klaviyo emails queued.`,
          },
          {
            id: `thought-eval-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            phase: 'evaluation',
            message: `Closed-Loop Result Logged: $${closedLoop.actualRevenue.toLocaleString()} revenue uplift captured. Agent memory updated with campaign priors.`,
          }
        ]
      }));

      // Fire celebratory confetti burst!
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas unsupported
      }
    }
  };

  const handleResetAgent = () => {
    setAgentState({
      status: 'idle',
      thoughts: [],
      draftedAssets: [],
    });
  };

  const handleAssetsFromSwarmOrVariant = (assets: DraftedCampaignAsset[], opp: GrowthOpportunity) => {
    setAgentState({
      status: 'awaiting_approval',
      currentOpportunity: opp,
      thoughts: [
        {
          id: `thought-swarm-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'tool_call',
          message: `Multi-agent swarm collaboration generated ${assets.length} production assets for "${opp.title}".`,
        },
        {
          id: `thought-guard-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'approval_required',
          message: 'Human review gate active. Assets queued for merchant verification.',
        }
      ],
      draftedAssets: assets,
    });
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        currentStore={currentStore}
        stores={stores}
        onSelectStore={setCurrentStore}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenSandboxModal={() => setIsSandboxModalOpen(true)}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        brandTone={brandTone}
        onSelectBrandTone={setBrandTone}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-9">
        {/* Hero Banner */}
        <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 shadow-2xl flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> Autonomous Commerce Multi-Agent Ecosystem
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">
              Turn store data into prioritized growth experiments & automated revenue assets.
            </h2>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              GrowthCopilot doesn&apos;t just show analytics — it orchestrates specialized AI agents to mine high-impact cohorts, draft multichannel assets (Email, SMS, Shopify discounts), enforce margin guardrails, and execute closed-loop learning.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
              <Bot className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Active Store Dataset</span>
              <span className="text-base font-bold text-slate-100">{currentStore.name}</span>
              <span className="text-xs text-emerald-400 block font-semibold mt-0.5">
                {growthOpportunities.length} Growth Opportunities Ready
              </span>
            </div>
          </div>
        </div>

        {/* 1. Store Analytics Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              1. Store Data & KPI Health Check
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live calculation from CSV data lake</span>
          </div>
          <MetricsOverview kpis={storeKPIs} currency={currentStore.currency} />
        </section>

        {/* 2. Visual Store Intelligence & Forecasting Charts */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              2. Visual Revenue Forecasting & Customer Cohorts
            </h3>
            <span className="text-xs text-indigo-400 font-medium">Predictive & RFM Clustering</span>
          </div>
          <AnalyticsCharts dataset={currentStore} kpis={storeKPIs} currency={currentStore.currency} />
        </section>

        {/* 3. Prioritized Growth Opportunities */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              3. AI Growth Radar: Prioritized Opportunities
            </h3>
            <span className="text-xs text-indigo-400 font-medium">Ranked by revenue uplift potential</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {growthOpportunities.slice(0, 3).map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={handleSelectOpportunity}
                onOpenSwarm={(selectedOpp) => setSwarmOpportunity(selectedOpp)}
                onOpenVariants={(selectedOpp) => setVariantOpportunity(selectedOpp)}
                isSelected={agentState.currentOpportunity?.id === opp.id}
                currency={currentStore.currency}
              />
            ))}
          </div>
        </section>

        {/* 4. Interactive Strategy & ROI Simulator */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              4. Interactive Strategy & ROI Simulator
            </h3>
            <span className="text-xs text-slate-500 font-mono">Dynamic Elasticity Calculator</span>
          </div>
          <StrategySimulator kpis={storeKPIs} currency={currentStore.currency} />
        </section>

        {/* 5. Agent Execution Workbench & Thought Stream */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              5. Autonomous Agent Execution Workbench
            </h3>
            <span className="text-xs text-slate-500 font-mono">Tool Invocations & Human Guardrails</span>
          </div>

          <AgentWorkbench
            state={agentState}
            onOpenPreviewModal={() => setIsPreviewModalOpen(true)}
            onReset={handleResetAgent}
          />
        </section>

        {/* 6. Closed-Loop Performance & Adaptive Learning */}
        {closedLoopHistory.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                6. Closed-Loop Campaign Results & Agent Learning
              </h3>
            </div>

            <ClosedLoopDashboard
              metricsHistory={closedLoopHistory}
              currency={currentStore.currency}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Agentic Commerce Growth Copilot • Built for E-Commerce Growth Teams & AI Multi-Agent Showcase</p>
      </footer>

      {/* Modals */}
      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onDatasetLoaded={(ds) => {
          setStores(prev => [ds, ...prev.filter(s => s.id !== ds.id)]);
          setCurrentStore(ds);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        apiKey={apiKey}
        apiProvider={apiProvider}
        onSave={(key, prov) => {
          setApiKey(key);
          setApiProvider(prov);
        }}
      />

      {/* Multi-Agent Swarm Modal */}
      {swarmOpportunity && (
        <AgentSwarmModal
          isOpen={!!swarmOpportunity}
          onClose={() => setSwarmOpportunity(null)}
          dataset={currentStore}
          opportunity={swarmOpportunity}
          brandTone={brandTone}
          onAssetsReady={(assets) => handleAssetsFromSwarmOrVariant(assets, swarmOpportunity)}
        />
      )}

      {/* A/B Multi-Variant Studio Modal */}
      {variantOpportunity && (
        <VariantComparisonModal
          isOpen={!!variantOpportunity}
          onClose={() => setVariantOpportunity(null)}
          dataset={currentStore}
          opportunity={variantOpportunity}
          onSelectVariant={(assets) => handleAssetsFromSwarmOrVariant(assets, variantOpportunity)}
        />
      )}

      {/* Integration Sandbox Modal */}
      <IntegrationSandboxModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
      />

      {/* Agent Memory & Merchant Guardrails Modal */}
      <AgentMemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />

      {/* Human-in-the-Loop Asset Preview Modal */}
      {agentState.currentOpportunity && (
        <AssetPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          assets={agentState.draftedAssets}
          opportunity={agentState.currentOpportunity}
          onApproveAndExecute={handleApproveAndExecute}
          isExecuting={isExecuting}
        />
      )}
    </div>
  );
}
