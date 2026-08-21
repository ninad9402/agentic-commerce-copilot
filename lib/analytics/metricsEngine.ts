import { StoreDataset, StoreKPIs } from '../types/ecommerce';

export function calculateStoreKPIs(dataset: StoreDataset): StoreKPIs {
  const { orders, customers, abandonedCarts, products } = dataset;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.totalAmount : 0), 0);
  const totalOrders = orders.filter(o => o.status === 'completed').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const totalAbandonedValue = abandonedCarts.reduce((sum, c) => sum + c.cartValue, 0);
  const totalCartCheckoutsStarted = totalOrders + abandonedCarts.length;
  const cartAbandonmentRate = totalCartCheckoutsStarted > 0 
    ? (abandonedCarts.length / totalCartCheckoutsStarted) * 100 
    : 0;

  const repeatCustomersCount = customers.filter(c => c.totalOrders > 1).length;
  const repeatPurchaseRate = customers.length > 0 ? (repeatCustomersCount / customers.length) * 100 : 0;

  const totalCustomerSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const customerLTV = customers.length > 0 ? totalCustomerSpent / customers.length : 0;

  const atRiskCustomersCount = customers.filter(c => c.rfmSegment === 'At-Risk').length;
  const decliningSkusCount = products.filter(p => (p.decliningRate && p.decliningRate > 5) || p.conversionRate < 2.0).length;

  return {
    totalRevenue,
    revenueTrend: 14.8, // % vs last period
    totalOrders,
    avgOrderValue,
    cartAbandonmentRate,
    totalAbandonedValue,
    repeatPurchaseRate,
    customerLTV,
    atRiskCustomersCount,
    decliningSkusCount,
  };
}
