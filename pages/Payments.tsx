
import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, CreditCard, Calendar, Filter, Smartphone, Send } from 'lucide-react';
import { PaymentStatus, Order } from '../types';

const Payments: React.FC = () => {
  const { orders, customers, sendSMS, addLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSendingSMS, setIsSendingSMS] = useState<string | null>(null);

  const dueOrders = orders.filter(o => o.paymentStatus !== PaymentStatus.PAID);

  const handleSendReminderSMS = async (order: Order) => {
    const customer = customers.find(c => c.id === order.customerId);
    if (!customer?.phone) return;

    setIsSendingSMS(order.id);
    const message = `Velvessa Closet Reminder: You have an outstanding balance of ৳${order.balanceDue} for Order #${order.id}. Please complete your payment at your earliest convenience. Thank you!`;
    await sendSMS(customer.phone, message);
    addLog('Payment Reminder', `Sent balance reminder SMS to ${customer.name}`);
    setIsSendingSMS(null);
  };

  const handleSendAllReminders = async () => {
    if (!confirm(`Are you sure you want to send reminders to all ${dueOrders.length} customers with pending balances?`)) return;
    
    for (const order of dueOrders) {
      await handleSendReminderSMS(order);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Collections & Payments</h2>
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Find by invoice #..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-48 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Outstanding Balances</h3>
              <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Action Required</span>
            </div>
            <div className="divide-y divide-slate-100">
              {dueOrders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">#{order.id}</p>
                        <p className="text-xs text-slate-500">{customer?.name} • Due: {order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-lg font-bold text-red-600">৳{order.balanceDue.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Due Now</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => handleSendReminderSMS(order)}
                          disabled={isSendingSMS === order.id}
                          className="p-2 bg-slate-50 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100"
                          title="Send SMS Reminder"
                        >
                          {isSendingSMS === order.id ? <Send size={14} className="animate-pulse" /> : <Smartphone size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {dueOrders.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                  <p>All clear! No outstanding balances.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-violet-900 text-white p-8 rounded-3xl shadow-xl shadow-violet-900/20 relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-violet-300 text-sm font-medium">Total Pending Collections</p>
               <h3 className="text-4xl font-bold mt-2">
                 ৳{dueOrders.reduce((sum, o) => sum + o.balanceDue, 0).toLocaleString()}
               </h3>
               <button 
                onClick={handleSendAllReminders}
                disabled={dueOrders.length === 0}
                className="mt-8 w-full py-3 bg-white text-violet-900 font-bold rounded-xl hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 <Smartphone size={18} />
                 Send All Reminders
               </button>
             </div>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-800/30 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-violet-600" />
              Recent Payments
            </h4>
            <div className="space-y-4">
              {orders.filter(o => o.advancePaid > 0).slice(0, 5).map(o => (
                <div key={o.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">#{o.id} Payment</p>
                    <p className="text-xs text-slate-400">{o.date}</p>
                  </div>
                  <span className="font-bold text-emerald-600">+৳{o.advancePaid.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
