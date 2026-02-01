
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  AlertCircle,
  Download,
  Barcode,
  X
} from 'lucide-react';
import { useStore } from '../store';
import { Category, StockItem } from '../types';

const StockManagement: React.FC = () => {
  const { stock, setStock, addLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const [formData, setFormData] = useState<Partial<StockItem>>({
    name: '',
    sku: '',
    category: Category.DRESS,
    size: 'M',
    color: '',
    quantity: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: '',
    lowStockThreshold: 5
  });

  const filteredStock = useMemo(() => {
    return stock.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stock, searchTerm, filterCategory]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updatedStock = stock.map(s => s.id === editingItem.id ? { ...s, ...formData } as StockItem : s);
      setStock(updatedStock);
      addLog('Update Stock', `Updated item: ${formData.name}`);
    } else {
      const newItem: StockItem = {
        ...formData as StockItem,
        id: 's' + Date.now(),
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setStock([...stock, newItem]);
      addLog('Add Stock', `Added new item: ${newItem.name}`);
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const item = stock.find(s => s.id === id);
      setStock(stock.filter(s => s.id !== id));
      addLog('Delete Stock', `Deleted item: ${item?.name}`);
    }
  };

  const openEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Inventory Repository</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => { setEditingItem(null); setFormData({ category: Category.DRESS, size: 'M', lowStockThreshold: 5 }); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-semibold shadow-lg shadow-violet-500/20"
          >
            <Plus size={18} />
            New Item
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Item Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price (Buy/Sell)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <Barcode size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400 font-mono tracking-tighter">{item.sku} • {item.size} • {item.color || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wide">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.quantity <= item.lowStockThreshold ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.quantity}
                      </span>
                      {item.quantity <= item.lowStockThreshold && (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-slate-400">In: <span className="text-slate-600">৳{item.purchasePrice}</span></p>
                      <p className="text-slate-400 font-semibold">Out: <span className="text-emerald-600">৳{item.sellingPrice}</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(item)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingItem ? 'Edit Stock Item' : 'Add New Stock Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">SKU / ID</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500/20"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Size</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Quantity In Stock</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Low Stock Threshold</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Purchase Price (BDT)</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Selling Price (BDT)</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 shadow-lg shadow-violet-500/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
