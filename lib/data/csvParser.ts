import Papa from 'papaparse';
import { StoreDataset, Product, Customer, Order, AbandonedCart } from '../types/ecommerce';

export interface ParsedCsvResult {
  dataset?: StoreDataset;
  error?: string;
  summary?: {
    productsCount: number;
    customersCount: number;
    ordersCount: number;
    abandonedCartsCount: number;
  };
}

export function parseStoreCsvFiles(
  storeName: string,
  csvText: string
): ParsedCsvResult {
  try {
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
      return { error: `CSV Parsing error: ${parsed.errors[0].message}` };
    }

    const rows = parsed.data;
    if (rows.length === 0) {
      return { error: 'Uploaded CSV file is empty' };
    }

    // Auto-detect row type or columns
    const firstRow = rows[0];
    const keys = Object.keys(firstRow).map(k => k.toLowerCase());

    const products: Product[] = [];
    const customers: Customer[] = [];
    const orders: Order[] = [];
    const abandonedCarts: AbandonedCart[] = [];

    // Simple schema map heuristics
    let countP = 0, countC = 0, countO = 0, countA = 0;

    rows.forEach((row, idx) => {
      const rowKeys = Object.keys(row).map(k => k.toLowerCase());
      
      // If product format
      if (rowKeys.some(k => k.includes('price')) && rowKeys.some(k => k.includes('product') || k.includes('title') || k.includes('sku'))) {
        countP++;
        products.push({
          id: row['id'] || row['ID'] || `csv-prod-${idx}`,
          name: row['name'] || row['Title'] || row['Name'] || row['Product Name'] || `Item ${idx}`,
          category: row['category'] || row['Category'] || row['Type'] || 'General',
          price: parseFloat(row['price'] || row['Price'] || '29.99'),
          cost: parseFloat(row['cost'] || row['Cost'] || '10.00'),
          inventory: parseInt(row['inventory'] || row['Inventory'] || row['Stock'] || '50', 10),
          conversionRate: parseFloat(row['conversion_rate'] || row['Conversion Rate'] || '2.5'),
          trafficMonthly: parseInt(row['traffic'] || row['Monthly Traffic'] || '1500', 10),
          decliningRate: row['declining_rate'] ? parseFloat(row['declining_rate']) : undefined,
        });
      }
      // If order or cart format
      else if (rowKeys.some(k => k.includes('total') || k.includes('cart_value') || k.includes('amount'))) {
        const isCart = rowKeys.some(k => k.includes('abandon') || k.includes('cart'));
        if (isCart) {
          countA++;
          abandonedCarts.push({
            id: row['id'] || `csv-cart-${idx}`,
            customerId: row['customer_id'] || `cust-${idx}`,
            customerName: row['customer_name'] || row['Name'] || 'Guest Shopper',
            customerEmail: row['email'] || row['Email'] || `shopper${idx}@example.com`,
            customerPhone: row['phone'] || row['Phone'] || '+1 555-0192',
            items: [
              {
                productId: 'csv-p1',
                name: row['item_name'] || row['Cart Items'] || 'Cart Item',
                price: parseFloat(row['cart_value'] || row['Total'] || '85.00'),
                quantity: 1
              }
            ],
            cartValue: parseFloat(row['cart_value'] || row['Total'] || row['Amount'] || '85.00'),
            abandonedAt: row['date'] || new Date().toISOString(),
            checkoutStep: (row['step'] as any) || 'payment',
          });
        } else {
          countO++;
          orders.push({
            id: row['id'] || `csv-ord-${idx}`,
            customerId: row['customer_id'] || `cust-${idx}`,
            customerName: row['customer_name'] || row['Name'] || 'Customer',
            customerEmail: row['email'] || row['Email'] || `customer${idx}@example.com`,
            items: [
              { productId: 'csv-p1', name: row['item_name'] || 'Order Item', quantity: 1, unitPrice: parseFloat(row['total'] || '50.00') }
            ],
            totalAmount: parseFloat(row['total'] || row['Total'] || row['Amount'] || '50.00'),
            status: 'completed',
            createdAt: row['date'] || new Date().toISOString(),
          });
        }
      }
      // If customer format
      else if (rowKeys.some(k => k.includes('email') || k.includes('customer'))) {
        countC++;
        customers.push({
          id: row['id'] || `csv-cust-${idx}`,
          name: row['name'] || row['Customer Name'] || 'Customer',
          email: row['email'] || row['Email'] || `user${idx}@example.com`,
          phone: row['phone'] || row['Phone'] || '+1 555-0199',
          totalOrders: parseInt(row['orders_count'] || row['Total Orders'] || '1', 10),
          totalSpent: parseFloat(row['total_spent'] || row['Total Spent'] || '120.00'),
          lastOrderDate: row['last_order_date'] || '2026-08-01',
          rfmSegment: (row['segment'] as any) || 'Loyal',
        });
      }
    });

    // Fallbacks if one array was empty
    if (products.length === 0) {
      products.push({
        id: 'prod-fallback',
        name: 'Featured Store Product',
        category: 'Apparel',
        price: 49.99,
        cost: 15.00,
        inventory: 100,
        conversionRate: 2.1,
        trafficMonthly: 3000,
      });
    }

    const dataset: StoreDataset = {
      id: `custom-${Date.now()}`,
      name: storeName || 'Custom Store Upload',
      industry: 'Custom E-Commerce Store',
      logo: '🛍️',
      currency: '$',
      products,
      customers,
      orders,
      abandonedCarts,
    };

    return {
      dataset,
      summary: {
        productsCount: products.length,
        customersCount: customers.length,
        ordersCount: orders.length,
        abandonedCartsCount: abandonedCarts.length,
      }
    };
  } catch (err: any) {
    return { error: err.message || 'Failed to process CSV file' };
  }
}
