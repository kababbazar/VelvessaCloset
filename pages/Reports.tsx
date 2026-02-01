
import React from 'react';
import { useStore } from '../store';
import { BarChart3, Download, Calendar, PieChart as PieIcon, TrendingUp, Package } from 'lucide-react';

const Reports: React.FC = () => {
  const { orders, stock, customers } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCost = stock.reduce((sum, s) => sum + (s.purchasePrice * s.quantity), 0);
  const potentialProfit = stock.reduce((sum, s) => sum + ((s.sellingPrice - s.purchasePrice) * s.quantity), 0);

  const reportSections = [
    { title: 'Revenue Analytics', desc: 'Detailed sales performance by date and category.', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Inventory Valuation', desc: 'Current stock value vs purchase costs.', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Customer Insights', desc: 'Top spending customers and retention rates.', icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Payment Aging', desc: 'Outstanding balances and collection timeline.', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Insights & Intelligence (BDT)</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
            <Calendar size={18} />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold shadow-lg shadow-violet-500/20">
            <Download size={18} />
            Download Monthly Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Sales (LTD)</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-2">৳{totalRevenue.toLocaleString()}</h3>
            <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
              <TrendingUp size={12} className="mr-1" />
              +18.4% growth
            </div>
          </div>
          <PieIcon size={120} className="absolute -right-8 -bottom-8 text-slate-50 opacity-10" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Inventory Value</p>
          <h3 className="text-4xl font-bold text-slate-900 mt-2">৳{totalCost.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-4">Calculated from {stock.length} unique items</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Expected Profit</p>
          <h3 className="text-4xl font-bold text-emerald-600 mt-2">৳{potentialProfit.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-4">Based on current stock inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportSections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-200 transition-all cursor-pointer group shadow-sm">
            <div className="flex items-start gap-5">
              <div className={`${section.bg} ${section.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <section.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900">{section.title}</h4>
                  <button className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={18} />
                  </button>
                </div>
                <p className="text-slate-500 text-sm mt-1">{section.desc}</p>
                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full">PDF</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full">Excel</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full">CSV</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold brand-font mb-2">Advanced Visualizations</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Generate interactive charts and heatmaps for deeper boutique analysis. Available for Admin roles only.</p>
          <button className="px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-bold transition-all shadow-xl shadow-violet-900/50">
            Open Analytics Suite
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Reports;
