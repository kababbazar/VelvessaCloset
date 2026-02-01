
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  User as UserIcon,
  Smartphone,
  Settings
} from 'lucide-react';
import { useStore, StoreProvider } from './store';
import Dashboard from './pages/Dashboard';
import StockManagement from './pages/StockManagement';
import CustomerManagement from './pages/CustomerManagement';
import OrderManagement from './pages/OrderManagement';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { currentUser, logout, stock, smsLogs } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const lowStockAlerts = useMemo(() => 
    stock.filter(item => item.quantity <= item.lowStockThreshold).length
  , [stock]);

  if (!currentUser) {
    return <Login />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SALES, UserRole.INVENTORY] },
    { id: 'stock', label: 'Stock Inventory', icon: Package, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
    { id: 'orders', label: 'Orders & Sales', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.SALES] },
    { id: 'customers', label: 'Customers', icon: Users, roles: [UserRole.ADMIN, UserRole.SALES] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: [UserRole.ADMIN, UserRole.SALES] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: [UserRole.ADMIN] },
    { id: 'team', label: 'Team Management', icon: ShieldCheck, roles: [UserRole.ADMIN] },
    { id: 'profile', label: 'My Profile', icon: UserIcon, roles: [UserRole.ADMIN, UserRole.SALES, UserRole.INVENTORY] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'stock': return <StockManagement />;
      case 'customers': return <CustomerManagement />;
      case 'orders': return <OrderManagement />;
      case 'payments': return <Payments />;
      case 'reports': return <Reports />;
      case 'team': return <UserManagement />;
      case 'profile': return <Profile />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col z-50 shadow-2xl`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-xl brand-font">V</div>
          {isSidebarOpen && <span className="font-bold text-lg brand-font tracking-tight">Velvessa Closet</span>}
        </div>

        <div className="p-4 flex flex-col items-center">
          <div 
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer transition-all border-2 rounded-full p-1 mb-2 ${activeTab === 'profile' ? 'border-violet-500' : 'border-transparent'}`}
          >
            {currentUser.profileImage ? (
              <img src={currentUser.profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
            ) : (
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700">
                <UserIcon size={24} />
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <div className="text-center">
              <p className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.role}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all ${
                    activeTab === item.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  {item.id === 'stock' && lowStockAlerts > 0 && isSidebarOpen && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {lowStockAlerts}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors`}
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-md text-slate-600"
            >
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
              />
            </div>
            
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full group">
              <Smartphone size={20} />
              {smsLogs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              {lowStockAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden border border-slate-100">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
