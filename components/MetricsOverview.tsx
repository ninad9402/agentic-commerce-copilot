'use client';

import React from 'react';
import { DollarSign, ShoppingBag, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { StoreKPIs } from '../lib/types/ecommerce';

interface MetricsOverviewProps {
  kpis: StoreKPIs;
  currency?: string;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ kpis, currency = '$' }) => {
  const cards = [
    {
      title: 'Total Monthly Revenue',
      value: `${currency}${kpis.totalRevenue.toLocaleString()}`,
      trend: `+${kpis.revenueTrend}% vs prev period`,
      isPositive: true,
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Average Order Value (AOV)',
      value: `${currency}${kpis.avgOrderValue.toFixed(2)}`,
      trend: `${kpis.totalOrders} total completed orders`,
      isPositive: true,
      icon: ShoppingBag,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    },
    {
      title: 'Cart Abandonment Rate',
      value: `${kpis.cartAbandonmentRate.toFixed(1)}%`,
      trend: `${currency}${kpis.totalAbandonedValue.toLocaleString()} lost in abandoned carts`,
      isPositive: false,
      icon: ShoppingCart,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Repeat Purchase Rate',
      value: `${kpis.repeatPurchaseRate.toFixed(1)}%`,
      trend: `Customer LTV: ${currency}${kpis.customerLTV.toFixed(0)}`,
      isPositive: true,
      icon: Users,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'At-Risk VIP Churn',
      value: `${kpis.atRiskCustomersCount} Users`,
      trend: 'High churn risk over 60 days',
      isPositive: false,
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`glass-panel p-4 rounded-2xl border bg-gradient-to-br ${card.color} glass-panel-hover flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-100 tracking-tight">{card.value}</div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
                {card.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
