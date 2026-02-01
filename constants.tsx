
import React from 'react';
import { Category, UserRole, StockItem, Customer, Order, PaymentStatus, DeliveryStatus } from './types';

export const INITIAL_USER = {
  id: 'u1',
  name: 'Velvessa Admin',
  email: 'admin@velvessa.com',
  role: UserRole.ADMIN
};

export const MOCK_STOCK: StockItem[] = [
  {
    id: 's1',
    sku: 'VC-DRS-001',
    name: 'Silk Evening Gown',
    category: Category.DRESS,
    size: 'M',
    color: 'Midnight Blue',
    quantity: 12,
    purchasePrice: 150,
    sellingPrice: 350,
    supplier: 'Elite Silks Co',
    dateAdded: '2024-01-15',
    lowStockThreshold: 5
  },
  {
    id: 's2',
    sku: 'VC-TOP-023',
    name: 'Cashmere Turtleneck',
    category: Category.TOP,
    size: 'S',
    color: 'Cream',
    quantity: 3,
    purchasePrice: 45,
    sellingPrice: 120,
    supplier: 'Nordic Knits',
    dateAdded: '2024-02-01',
    lowStockThreshold: 5
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    phone: '555-0102',
    address: '123 Maple Ave, Springfield',
    email: 'sarah.j@example.com'
  },
  {
    id: 'c2',
    name: 'Michael Rossi',
    phone: '555-0199',
    address: '456 Oak Dr, Riverside',
    email: 'mrossi@work.com'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerId: 'c1',
    date: '2024-03-20',
    items: [{ stockItemId: 's1', quantity: 1, price: 350 }],
    deliveryCharge: 15,
    subtotal: 350,
    tax: 28,
    totalAmount: 393,
    advancePaid: 100,
    balanceDue: 293,
    paymentStatus: PaymentStatus.PARTIAL,
    deliveryStatus: DeliveryStatus.DELIVERED
  }
];
