
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  StockItem, Customer, Order, PaymentRecord, User, 
  UserRole, UserStatus, AuditLog, SMSLog 
} from './types';
import { MOCK_STOCK, MOCK_CUSTOMERS, MOCK_ORDERS } from './constants.tsx';

// Simple persistence wrapper
const usePersistedState = <T,>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  name: 'Velvessa Admin',
  email: 'admin',
  password: 'admin',
  role: UserRole.ADMIN,
  status: UserStatus.APPROVED,
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
};

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  stock: StockItem[];
  customers: Customer[];
  orders: Order[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  smsLogs: SMSLog[];
  setStock: React.Dispatch<React.SetStateAction<StockItem[]>>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  logout: () => void;
  login: (email: string, password?: string) => User;
  registerUser: (userData: Partial<User>) => User;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  updateProfile: (userData: Partial<User>) => void;
  addLog: (action: string, details: string) => void;
  sendSMS: (recipient: string, message: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = usePersistedState<User | null>('v_user', null);
  const [users, setUsers] = usePersistedState<User[]>('v_all_users', [DEFAULT_ADMIN]);
  const [stock, setStock] = usePersistedState<StockItem[]>('v_stock', MOCK_STOCK);
  const [customers, setCustomers] = usePersistedState<Customer[]>('v_customers', MOCK_CUSTOMERS);
  const [orders, setOrders] = usePersistedState<Order[]>('v_orders', MOCK_ORDERS);
  const [payments, setPayments] = usePersistedState<PaymentRecord[]>('v_payments', []);
  const [auditLogs, setAuditLogs] = usePersistedState<AuditLog[]>('v_logs', []);
  const [smsLogs, setSmsLogs] = usePersistedState<SMSLog[]>('v_sms_logs', []);

  const addLog = (action: string, details: string) => {
    if (!currentUser) return;
    const log: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const login = (email: string, password?: string) => {
    const inputEmail = email || 'admin';
    const inputPass = password || 'admin';

    const user = users.find(u => u.email === inputEmail && u.password === inputPass);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    if (user.status !== UserStatus.APPROVED) {
      throw new Error(`Access Denied: Your account is ${user.status}. Contact Admin.`);
    }
    setCurrentUser(user);
    addLog('Login', 'Logged into the system');
    return user;
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    addLog('Update Profile', 'Updated personal profile details');
  };

  const registerUser = (userData: Partial<User>) => {
    const existing = users.find(u => u.email === userData.email);
    if (existing) throw new Error('Email already registered');
    
    const newUser: User = {
      id: 'u' + Date.now(),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || 'password',
      role: userData.role || UserRole.SALES,
      status: UserStatus.PENDING,
      phone: userData.phone
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    addLog('User Approval', `User ${userId} status updated to ${status}`);
  };

  const sendSMS = async (recipient: string, message: string): Promise<void> => {
    const newLog: SMSLog = {
      id: 'sms-' + Date.now(),
      recipient,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    setSmsLogs(prev => [newLog, ...prev]);
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
  };

  const value = {
    currentUser,
    users,
    stock,
    customers,
    orders,
    payments,
    auditLogs,
    smsLogs,
    setStock,
    setCustomers,
    setOrders,
    setPayments,
    logout,
    login,
    registerUser,
    updateUserStatus,
    updateProfile,
    addLog,
    sendSMS
  };

  return React.createElement(StoreContext.Provider, { value }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
