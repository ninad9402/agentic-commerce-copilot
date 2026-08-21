import { StoreDataset } from '../types/ecommerce';

export const sampleDatasets: StoreDataset[] = [
  {
    id: 'apex-athletics',
    name: 'Apex Athletics',
    industry: 'Fitness & Gym Apparel',
    logo: '🏋️‍♂️',
    currency: '$',
    products: [
      {
        id: 'prod-101',
        name: 'Apex Pro Seamless Compression Tights',
        category: 'Apparel',
        price: 68.00,
        cost: 22.00,
        inventory: 140,
        conversionRate: 1.8,
        trafficMonthly: 4200,
        decliningRate: 12.5,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-102',
        name: 'Titan Heavyweight Gym Hoodie',
        category: 'Outerwear',
        price: 88.00,
        cost: 31.00,
        inventory: 85,
        conversionRate: 3.4,
        trafficMonthly: 3100,
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-103',
        name: 'HydroPulse Insulated Shaker Bottle (1L)',
        category: 'Accessories',
        price: 32.00,
        cost: 8.50,
        inventory: 310,
        conversionRate: 4.9,
        trafficMonthly: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-104',
        name: 'Apex Precision Lifting Straps & Grip Set',
        category: 'Gear',
        price: 24.00,
        cost: 5.00,
        inventory: 450,
        conversionRate: 2.1,
        trafficMonthly: 1900,
        decliningRate: 8.2,
      }
    ],
    customers: [
      {
        id: 'cust-201',
        name: 'Marcus Vance',
        email: 'marcus.v@example.com',
        phone: '+1 (555) 234-8901',
        totalOrders: 6,
        totalSpent: 482.00,
        lastOrderDate: '2026-05-10',
        rfmSegment: 'VIP',
      },
      {
        id: 'cust-202',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1 (555) 456-1122',
        totalOrders: 4,
        totalSpent: 310.00,
        lastOrderDate: '2026-04-14',
        rfmSegment: 'At-Risk',
      },
      {
        id: 'cust-203',
        name: 'David Miller',
        email: 'david.m@example.com',
        phone: '+1 (555) 890-3344',
        totalOrders: 1,
        totalSpent: 68.00,
        lastOrderDate: '2026-08-01',
        rfmSegment: 'Cart Abandoner',
        cartItemsCount: 2,
        lastCartValue: 156.00,
        lastCartDate: '2026-08-20',
      },
      {
        id: 'cust-204',
        name: 'Elena Rostova',
        email: 'elena.r@example.com',
        phone: '+1 (555) 671-9988',
        totalOrders: 3,
        totalSpent: 264.00,
        lastOrderDate: '2026-07-22',
        rfmSegment: 'Loyal',
      },
      {
        id: 'cust-205',
        name: 'Tyler Johnson',
        email: 'tyler.j@example.com',
        phone: '+1 (555) 345-7711',
        totalOrders: 0,
        totalSpent: 0.00,
        lastOrderDate: 'Never',
        rfmSegment: 'Cart Abandoner',
        cartItemsCount: 3,
        lastCartValue: 188.00,
        lastCartDate: '2026-08-21',
      }
    ],
    orders: [
      {
        id: 'ord-901',
        customerId: 'cust-201',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus.v@example.com',
        items: [
          { productId: 'prod-101', name: 'Apex Pro Seamless Compression Tights', quantity: 2, unitPrice: 68.00 },
          { productId: 'prod-102', name: 'Titan Heavyweight Gym Hoodie', quantity: 1, unitPrice: 88.00 }
        ],
        totalAmount: 224.00,
        status: 'completed',
        createdAt: '2026-05-10T14:32:00Z',
      },
      {
        id: 'ord-902',
        customerId: 'cust-202',
        customerName: 'Sarah Chen',
        customerEmail: 'sarah.chen@example.com',
        items: [
          { productId: 'prod-103', name: 'HydroPulse Insulated Shaker Bottle (1L)', quantity: 2, unitPrice: 32.00 }
        ],
        totalAmount: 64.00,
        status: 'completed',
        createdAt: '2026-04-14T09:15:00Z',
      },
      {
        id: 'ord-903',
        customerId: 'cust-204',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.r@example.com',
        items: [
          { productId: 'prod-102', name: 'Titan Heavyweight Gym Hoodie', quantity: 1, unitPrice: 88.00 }
        ],
        totalAmount: 88.00,
        status: 'completed',
        createdAt: '2026-07-22T18:40:00Z',
      }
    ],
    abandonedCarts: [
      {
        id: 'cart-501',
        customerId: 'cust-205',
        customerName: 'Tyler Johnson',
        customerEmail: 'tyler.j@example.com',
        customerPhone: '+1 (555) 345-7711',
        items: [
          { productId: 'prod-101', name: 'Apex Pro Seamless Compression Tights', price: 68.00, quantity: 1 },
          { productId: 'prod-102', name: 'Titan Heavyweight Gym Hoodie', price: 88.00, quantity: 1 },
          { productId: 'prod-103', name: 'HydroPulse Insulated Shaker Bottle (1L)', price: 32.00, quantity: 1 }
        ],
        cartValue: 188.00,
        abandonedAt: '2026-08-21T11:45:00Z',
        checkoutStep: 'payment',
      },
      {
        id: 'cart-502',
        customerId: 'cust-203',
        customerName: 'David Miller',
        customerEmail: 'david.m@example.com',
        customerPhone: '+1 (555) 890-3344',
        items: [
          { productId: 'prod-101', name: 'Apex Pro Seamless Compression Tights', price: 68.00, quantity: 2 },
          { productId: 'prod-104', name: 'Apex Precision Lifting Straps & Grip Set', price: 24.00, quantity: 1 }
        ],
        cartValue: 160.00,
        abandonedAt: '2026-08-20T16:20:00Z',
        checkoutStep: 'shipping',
      },
      {
        id: 'cart-503',
        customerId: 'cust-206',
        customerName: 'Jessica Taylor',
        customerEmail: 'jessica.t@example.com',
        customerPhone: '+1 (555) 912-4455',
        items: [
          { productId: 'prod-102', name: 'Titan Heavyweight Gym Hoodie', price: 88.00, quantity: 2 }
        ],
        cartValue: 176.00,
        abandonedAt: '2026-08-19T20:10:00Z',
        checkoutStep: 'payment',
      }
    ]
  },
  {
    id: 'luxe-glow',
    name: 'Luxe Glow Cosmetics',
    industry: 'Clean Skincare & Beauty',
    logo: '✨',
    currency: '$',
    products: [
      {
        id: 'prod-201',
        name: 'Radiance Elixir Vitamin C + Ferulic Serum',
        category: 'Serums',
        price: 74.00,
        cost: 14.00,
        inventory: 220,
        conversionRate: 4.2,
        trafficMonthly: 8500,
      },
      {
        id: 'prod-202',
        name: 'Hydra-Surge Botanical Overnight Cream',
        category: 'Moisturizers',
        price: 62.00,
        cost: 11.50,
        inventory: 180,
        conversionRate: 1.4,
        trafficMonthly: 5400,
        decliningRate: 18.0,
      },
      {
        id: 'prod-203',
        name: 'Rose Gold Gua Sha & Jade Roller Set',
        category: 'Tools',
        price: 38.00,
        cost: 6.00,
        inventory: 400,
        conversionRate: 3.8,
        trafficMonthly: 3900,
      }
    ],
    customers: [
      {
        id: 'cust-301',
        name: 'Amara Okafor',
        email: 'amara.o@example.com',
        phone: '+1 (555) 778-9900',
        totalOrders: 8,
        totalSpent: 620.00,
        lastOrderDate: '2026-03-01',
        rfmSegment: 'At-Risk',
      },
      {
        id: 'cust-302',
        name: 'Chloe Bennett',
        email: 'chloe.b@example.com',
        phone: '+1 (555) 667-8899',
        totalOrders: 5,
        totalSpent: 410.00,
        lastOrderDate: '2026-08-15',
        rfmSegment: 'VIP',
      }
    ],
    orders: [
      {
        id: 'ord-801',
        customerId: 'cust-302',
        customerName: 'Chloe Bennett',
        customerEmail: 'chloe.b@example.com',
        items: [
          { productId: 'prod-201', name: 'Radiance Elixir Vitamin C + Ferulic Serum', quantity: 2, unitPrice: 74.00 }
        ],
        totalAmount: 148.00,
        status: 'completed',
        createdAt: '2026-08-15T10:00:00Z',
      }
    ],
    abandonedCarts: [
      {
        id: 'cart-601',
        customerId: 'cust-303',
        customerName: 'Sophia Martinez',
        customerEmail: 'sophia.m@example.com',
        customerPhone: '+1 (555) 443-2211',
        items: [
          { productId: 'prod-201', name: 'Radiance Elixir Vitamin C + Ferulic Serum', price: 74.00, quantity: 1 },
          { productId: 'prod-202', name: 'Hydra-Surge Botanical Overnight Cream', price: 62.00, quantity: 1 }
        ],
        cartValue: 136.00,
        abandonedAt: '2026-08-21T08:30:00Z',
        checkoutStep: 'payment',
      }
    ]
  },
  {
    id: 'urban-threads',
    name: 'Urban Threads',
    industry: 'Modern Streetwear',
    logo: '⚡',
    currency: '$',
    products: [
      {
        id: 'prod-301',
        name: 'Over-Dyed Acid Wash Oversized Tee',
        category: 'T-Shirts',
        price: 45.00,
        cost: 9.00,
        inventory: 310,
        conversionRate: 1.2,
        trafficMonthly: 9800,
        decliningRate: 22.4,
      },
      {
        id: 'prod-302',
        name: 'Utility Cargo Pants - Stealth Black',
        category: 'Bottoms',
        price: 110.00,
        cost: 28.00,
        inventory: 120,
        conversionRate: 3.9,
        trafficMonthly: 6200,
      }
    ],
    customers: [
      {
        id: 'cust-401',
        name: 'Liam Vance',
        email: 'liam.v@example.com',
        phone: '+1 (555) 123-9988',
        totalOrders: 3,
        totalSpent: 265.00,
        lastOrderDate: '2026-07-02',
        rfmSegment: 'Loyal',
      }
    ],
    orders: [
      {
        id: 'ord-701',
        customerId: 'cust-401',
        customerName: 'Liam Vance',
        customerEmail: 'liam.v@example.com',
        items: [
          { productId: 'prod-302', name: 'Utility Cargo Pants - Stealth Black', quantity: 1, unitPrice: 110.00 }
        ],
        totalAmount: 110.00,
        status: 'completed',
        createdAt: '2026-07-02T16:00:00Z',
      }
    ],
    abandonedCarts: [
      {
        id: 'cart-701',
        customerId: 'cust-402',
        customerName: 'Kai Tanaka',
        customerEmail: 'kai.t@example.com',
        customerPhone: '+1 (555) 887-3322',
        items: [
          { productId: 'prod-301', name: 'Over-Dyed Acid Wash Oversized Tee', price: 45.00, quantity: 2 },
          { productId: 'prod-302', name: 'Utility Cargo Pants - Stealth Black', price: 110.00, quantity: 1 }
        ],
        cartValue: 200.00,
        abandonedAt: '2026-08-21T02:15:00Z',
        checkoutStep: 'shipping',
      }
    ]
  }
];
