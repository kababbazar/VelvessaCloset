
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Truck, 
  CreditCard,
  Eye,
  X,
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  Smartphone,
  Send,
  Download,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { useStore } from '../store';
import { 
  Order, OrderItem, PaymentStatus, DeliveryStatus, 
  Customer, StockItem 
} from '../types';

const OrderManagement: React.FC = () => {
  const { orders, setOrders, customers, setCustomers, stock, setStock, addLog, sendSMS } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isSendingSMS, setIsSendingSMS] = useState<string | null>(null);

  // Customer Selection / Autocomplete
  const [customerSearch, setCustomerSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // New Order Details
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);

  // Form Fields for New Customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  const suggestions = useMemo(() => {
    if (!customerSearch) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.phone.includes(customerSearch)
    ).slice(0, 5);
  }, [customers, customerSearch]);

  const subtotal = useMemo(() => 
    orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  , [orderItems]);

  const tax = subtotal * 0.08; 
  const totalAmount = subtotal + tax + deliveryCharge;
  const balanceDue = totalAmount - advancePaid;

  const handleAddOrderItem = (stockId: string) => {
    const item = stock.find(s => s.id === stockId);
    if (!item || item.quantity <= 0) return;

    const existing = orderItems.find(oi => oi.stockItemId === stockId);
    if (existing) {
      setOrderItems(orderItems.map(oi => 
        oi.stockItemId === stockId ? { ...oi, quantity: oi.quantity + 1 } : oi
      ));
    } else {
      setOrderItems([...orderItems, { stockItemId: stockId, quantity: 1, price: item.sellingPrice }]);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setNewCustName(customer.name);
    setNewCustPhone(customer.phone);
    setNewCustAddress(customer.address);
    setShowSuggestions(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0 || !newCustName || !newCustPhone) return;

    let customerId = selectedCustomer?.id;

    // Create new customer if not selected from database
    if (!selectedCustomer) {
      const newCust: Customer = {
        id: 'c' + Date.now(),
        name: newCustName,
        phone: newCustPhone,
        address: newCustAddress
      };
      setCustomers(prev => [...prev, newCust]);
      customerId = newCust.id;
      addLog('Customer Auto-Register', `Registered ${newCust.name} during order flow.`);
    }

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerId: customerId!,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      deliveryCharge,
      subtotal,
      tax,
      totalAmount,
      advancePaid,
      balanceDue,
      paymentStatus: balanceDue <= 0 ? PaymentStatus.PAID : advancePaid > 0 ? PaymentStatus.PARTIAL : PaymentStatus.DUE,
      deliveryStatus: DeliveryStatus.PENDING
    };

    const updatedStock = stock.map(s => {
      const orderItem = orderItems.find(oi => oi.stockItemId === s.id);
      if (orderItem) return { ...s, quantity: s.quantity - orderItem.quantity };
      return s;
    });

    setStock(updatedStock);
    setOrders(prev => [newOrder, ...prev]);
    addLog('Order Creation', `Created Order #${newOrder.id} for ${newCustName}`);
    setIsModalOpen(false);
    
    // Reset
    setOrderItems([]);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setAdvancePaid(0);
    setDeliveryCharge(0);
  };

  const handleSendStatusSMS = async (order: Order) => {
    const customer = customers.find(c => c.id === order.customerId);
    if (!customer?.phone) return;
    
    setIsSendingSMS(order.id);
    const message = `Velvessa Closet: Order #${order.id} update! Your status is now: ${order.deliveryStatus}. Total: ৳${order.totalAmount}. Thank you for shopping!`;
    await sendSMS(customer.phone, message);
    addLog('SMS Notification', `Sent delivery update SMS for Order #${order.id}`);
    setIsSendingSMS(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Orders & Sales</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 shadow-xl shadow-violet-500/30 transition-all active:scale-95"
        >
          <Plus size={18} />
          Create Order
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing (BDT)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Notify</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">#{order.id}</p>
                      <p className="text-xs text-slate-500 font-medium">{customer?.name} • {order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">৳{order.totalAmount.toLocaleString()}</p>
                      <span className={`text-[9px] font-bold uppercase ${
                        order.paymentStatus === PaymentStatus.PAID ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleSendStatusSMS(order)}
                        disabled={isSendingSMS === order.id}
                        className={`p-2 rounded-xl transition-all ${
                          isSendingSMS === order.id 
                          ? 'bg-slate-100 text-slate-300' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {isSendingSMS === order.id ? <Send size={16} className="animate-pulse"/> : <Smartphone size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${order.deliveryStatus === DeliveryStatus.DELIVERED ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase">{order.deliveryStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-900 brand-font flex items-center gap-3">
                <ShoppingCart className="text-violet-600" />
                Create New Sale (BDT)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Side: Items & Customer Search */}
              <div className="lg:col-span-8 space-y-8">
                {/* Customer Suggestion Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Details</label>
                     {selectedCustomer && (
                       <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Change Customer</button>
                     )}
                   </div>
                   
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                         {selectedCustomer ? <UserCheck size={18} className="text-emerald-500"/> : <Search size={18}/>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search existing customer or type new name..." 
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition-all ${selectedCustomer ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 focus:ring-4 focus:ring-violet-500/10'}`}
                        value={customerSearch}
                        onChange={(e) => { 
                          setCustomerSearch(e.target.value); 
                          setNewCustName(e.target.value);
                          setShowSuggestions(true);
                          if (selectedCustomer) setSelectedCustomer(null);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                      />

                      {/* Suggestions Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2">
                           {suggestions.map(c => (
                             <button 
                               key={c.id}
                               type="button"
                               onClick={() => selectCustomer(c)}
                               className="w-full px-6 py-3 text-left hover:bg-violet-50 flex items-center justify-between group transition-colors"
                             >
                               <div>
                                 <p className="font-bold text-slate-800 group-hover:text-violet-700">{c.name}</p>
                                 <p className="text-xs text-slate-400 font-medium">{c.phone}</p>
                               </div>
                               <Plus size={14} className="text-slate-300 group-hover:text-violet-400" />
                             </button>
                           ))}
                        </div>
                      )}
                   </div>

                   {/* Customer Info (Visible when search is done or new typed) */}
                   <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <input 
                          placeholder="Phone Number"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={newCustPhone}
                          onChange={(e) => setNewCustPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <input 
                          placeholder="Address"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={newCustAddress}
                          onChange={(e) => setNewCustAddress(e.target.value)}
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Add Items to Cart</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                    {stock.map(item => (
                      <button 
                        key={item.id}
                        disabled={item.quantity <= 0}
                        onClick={() => handleAddOrderItem(item.id)}
                        className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all ${
                          item.quantity <= 0 ? 'bg-slate-50 opacity-50 cursor-not-allowed' : 'hover:border-violet-500 hover:bg-violet-50/50 hover:shadow-lg shadow-violet-500/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-violet-500"><Package size={20}/></div>
                           <div>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.sku} • {item.size}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-600">৳{item.sellingPrice}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Stock: {item.quantity}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shopping Cart Items</label>
                  <div className="space-y-3">
                    {orderItems.map(oi => {
                      const si = stock.find(s => s.id === oi.stockItemId);
                      return (
                        <div key={oi.stockItemId} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-violet-600 shadow-sm border border-slate-100">
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{si?.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rate: ৳{oi.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                              <button onClick={() => {
                                if (oi.quantity > 1) {
                                  setOrderItems(orderItems.map(item => item.stockItemId === oi.stockItemId ? {...item, quantity: item.quantity - 1} : item));
                                } else {
                                  setOrderItems(orderItems.filter(item => item.stockItemId !== oi.stockItemId));
                                }
                              }} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><MinusCircle size={20} /></button>
                              <span className="w-6 text-center text-sm font-black text-slate-800">{oi.quantity}</span>
                              <button onClick={() => {
                                if (si && oi.quantity < si.quantity) {
                                  setOrderItems(orderItems.map(item => item.stockItemId === oi.stockItemId ? {...item, quantity: item.quantity + 1} : item));
                                }
                              }} className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"><PlusCircle size={20} /></button>
                            </div>
                            <p className="text-sm font-black w-24 text-right text-slate-900">৳{(oi.price * oi.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                    {orderItems.length === 0 && (
                      <div className="py-16 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                        <ShoppingCart size={48} className="mb-3 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest opacity-40">Cart is Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Side */}
              <div className="lg:col-span-4 h-full flex flex-col">
                 <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 flex flex-col h-full shadow-2xl shadow-slate-900/40 border border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex flex-col h-full">
                       <h4 className="font-bold text-xl mb-8 flex items-center gap-3 brand-font">
                        <CreditCard size={24} className="text-violet-400" />
                        Order Summary
                      </h4>
                      
                      <div className="space-y-5 flex-1">
                        <div className="flex justify-between text-slate-400 text-sm font-medium">
                          <span>Subtotal</span>
                          <span className="text-white">৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm font-medium">
                          <span>Tax (8%)</span>
                          <span className="text-white">৳{tax.toLocaleString()}</span>
                        </div>
                        <div className="pt-2">
                           <div className="flex justify-between items-center text-slate-400 text-sm font-medium mb-2">
                             <span>Delivery Charge</span>
                             <span className="text-violet-400 text-xs font-bold">BDT</span>
                           </div>
                           <input 
                            type="number" 
                            className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white font-bold outline-none ring-1 ring-slate-700 focus:ring-violet-500 transition-all"
                            value={deliveryCharge}
                            onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="pt-6 border-t border-slate-800">
                          <div className="flex justify-between items-end">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Payable</span>
                            <span className="text-3xl font-black text-white">৳{totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="pt-8 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Advance Payment</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-white font-black text-xl outline-none ring-1 ring-slate-700 focus:ring-emerald-500 transition-all shadow-inner"
                              placeholder="0"
                              value={advancePaid}
                              onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex justify-between items-center px-2 py-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Remaining Balance</span>
                            <span className="text-lg font-black text-red-400">৳{balanceDue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleCreateOrder}
                        disabled={orderItems.length === 0 || !newCustName || !newCustPhone}
                        className="w-full mt-10 py-5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-violet-900/60 flex items-center justify-center gap-3 active:scale-95"
                      >
                        <UserPlus size={20} />
                        Confirm & Print
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Detail / Invoice - Minimal Update to use BDT labels */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 brand-font">Invoice #{viewingOrder.id}</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Order Date: {viewingOrder.date}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={28} />
              </button>
            </div>
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Information</h4>
                  <p className="text-lg font-black text-slate-900">{customers.find(c => c.id === viewingOrder.customerId)?.name}</p>
                  <p className="text-sm text-slate-500 font-bold mt-2">Address:</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{customers.find(c => c.id === viewingOrder.customerId)?.address}</p>
                  <p className="text-sm text-slate-500 font-bold mt-3">Phone:</p>
                  <p className="text-sm text-slate-600 font-black">{customers.find(c => c.id === viewingOrder.customerId)?.phone}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Order Progress</h4>
                  <div className="inline-block px-4 py-2 bg-violet-50 text-violet-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-3">
                    {viewingOrder.deliveryStatus}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Payment Status</p>
                  <p className={`font-black uppercase text-xs ${viewingOrder.paymentStatus === PaymentStatus.PAID ? 'text-emerald-500' : 'text-amber-500'}`}>{viewingOrder.paymentStatus}</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Item Description</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">Qty</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Rate</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {viewingOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 font-bold text-slate-800">{stock.find(s => s.id === item.stockItemId)?.name}</td>
                        <td className="px-6 py-4 text-center font-black">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium">৳{item.price}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-80 space-y-4">
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">৳{viewingOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-slate-900">৳{viewingOrder.deliveryCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-medium pb-4 border-b border-slate-100">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-slate-900">৳{viewingOrder.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-slate-900">
                    <span>Grand Total</span>
                    <span>৳{viewingOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-600 px-3 py-2 bg-emerald-50 rounded-xl">
                    <span>Advance Paid</span>
                    <span>-৳{viewingOrder.advancePaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-red-500 px-3 py-2 bg-red-50 rounded-xl">
                    <span>Balance Due</span>
                    <span>৳{viewingOrder.balanceDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-10 bg-slate-50/50 flex gap-4">
              <button onClick={() => window.print()} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-sm">
                <Download size={20} />
                Download PDF
              </button>
              <button className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black text-sm hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/30">
                Share Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
