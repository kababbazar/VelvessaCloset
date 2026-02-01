
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  X,
  History,
  FileText,
  // Added missing Download icon import
  Download
} from 'lucide-react';
import { useStore } from '../store';
import { Customer, Order } from '../types';

const CustomerManagement: React.FC = () => {
  const { customers, setCustomers, orders, stock, addLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const customerOrders = useMemo(() => {
    if (!viewingHistory) return [];
    return orders.filter(o => o.customerId === viewingHistory.id);
  }, [orders, viewingHistory]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } as Customer : c));
      addLog('Update Customer', `Updated details for: ${formData.name}`);
    } else {
      const newCustomer: Customer = {
        ...formData as Customer,
        id: 'c' + Date.now()
      };
      setCustomers([...customers, newCustomer]);
      addLog('Add Customer', `Registered new customer: ${newCustomer.name}`);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer record?')) {
      const customer = customers.find(c => c.id === id);
      setCustomers(customers.filter(c => c.id !== id));
      addLog('Delete Customer', `Deleted record for: ${customer?.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Customer Directory</h2>
        <button 
          onClick={() => { setEditingCustomer(null); setFormData({}); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 shadow-lg shadow-violet-500/20"
        >
          <Plus size={18} />
          New Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Find customers by name or phone..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User size={24} />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setViewingHistory(customer)}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Transaction History"
                >
                  <History size={16} />
                </button>
                <button onClick={() => { setEditingCustomer(customer); setFormData(customer); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(customer.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{customer.name}</h3>
            <p className="text-xs text-slate-400 font-medium mb-4 uppercase tracking-wider">ID: #{customer.id.substring(customer.id.length - 4)}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400 mt-1" />
                <span className="line-clamp-2">{customer.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Status</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History Modal */}
      {viewingHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-600" />
                  History: {viewingHistory.name}
                </h3>
                <p className="text-xs text-slate-500">{viewingHistory.phone} • {viewingHistory.address}</p>
              </div>
              <button onClick={() => setViewingHistory(null)} className="p-2 hover:bg-slate-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {customerOrders.length > 0 ? (
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Invoice #</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Rate</th>
                        <th className="px-4 py-3 text-right">Delivery</th>
                        <th className="px-4 py-3 text-right">Total Amount</th>
                        <th className="px-4 py-3 text-right">Advance</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium">{order.date}</td>
                          <td className="px-4 py-3 text-violet-600 font-mono">#{order.id}</td>
                          <td className="px-4 py-3 max-w-xs truncate">
                            {order.items.map(i => stock.find(s => s.id === i.stockItemId)?.name).join(', ')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ৳{order.items[0]?.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ৳{order.deliveryCharge.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">
                            ৳{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                            ৳{order.advancePaid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-red-600 font-bold">
                            ৳{order.balanceDue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-right">Grand Totals:</td>
                        <td className="px-4 py-3 text-right">
                          ৳{customerOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600">
                          ৳{customerOrders.reduce((s, o) => s + o.advancePaid, 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          ৳{customerOrders.reduce((s, o) => s + o.balanceDue, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 opacity-30">
                  <FileText size={64} className="mx-auto mb-4" />
                  <p className="text-xl font-bold">No Transaction History Found</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all"
              >
                <Download size={18} />
                Download Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingCustomer ? 'Modify Customer' : 'Add Customer'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address (Optional)</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Shipping Address</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/20">
                  {editingCustomer ? 'Update Record' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
