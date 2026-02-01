
export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales',
  INVENTORY = 'Inventory'
}

export enum UserStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  phone?: string;
  profileImage?: string; // New field
}

export enum Category {
  DRESS = 'Dress',
  TOP = 'Top',
  BOTTOM = 'Bottom',
  ACCESSORIES = 'Accessories'
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: Category;
  size: string;
  color?: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier?: string;
  dateAdded: string;
  lowStockThreshold: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export enum PaymentStatus {
  PAID = 'Paid',
  PARTIAL = 'Partial',
  DUE = 'Due'
}

export enum DeliveryStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered'
}

export interface OrderItem {
  stockItemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  items: OrderItem[];
  deliveryCharge: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  method: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SMSLog {
  id: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'failed';
}
