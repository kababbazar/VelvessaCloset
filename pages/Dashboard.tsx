
import React, { useMemo } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useStore } from '../store';
import { PaymentStatus } from '../types';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { customers, stock, orders } = useStore();

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const totalDue = orders.reduce((sum, ord) => sum + ord.balanceDue, 0);
    
    return [
      { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Stock Items', value: stock.length, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
      { label: 'Due Balances', value: `৳${totalDue.toLocaleString()}`, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Total Revenue', value: `৳${totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
  }, [customers, stock, orders]);

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-violet-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <TrendingUp size={12} className="text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium mr-1">+12%</span>
              <span>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-violet-600" />
              Sales Performance (BDT)
            </h3>
            <select className="bg-slate-50 border-none text-xs font-semibold rounded-lg px-3 py-2 outline-none">
              <option>Last 7 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Low Stock Warnings</h3>
          <div className="flex-1 space-y-4">
            {stock.filter(item => item.quantity <= item.lowStockThreshold).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-red-600 font-medium">Only {item.quantity} left in stock</p>
                </div>
                <button 
                  onClick={() => setActiveTab('stock')}
                  className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
            {stock.filter(item => item.quantity <= item.lowStockThreshold).length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <Package size={48} className="mb-2" />
                <p className="text-sm">No stock alerts</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setActiveTab('stock')}
            className="w-full mt-6 py-3 text-sm font-semibold text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
          >
            View Inventory
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-violet-600 hover:underline"
          >
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === PaymentStatus.PAID ? 'bg-emerald-100 text-emerald-700' :
                        order.paymentStatus === PaymentStatus.PARTIAL ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
