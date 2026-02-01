
import React, { useState } from 'react';
import { useStore } from '../store';
import { UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Lock, Smartphone, ArrowRight, UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const { login, registerUser } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Use 'admin' as default if fields are empty for easy testing
      login(email || 'admin', password || 'admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      registerUser({ name, email, phone, role, password });
      setSuccess("Account request sent! An admin must approve your access before you can login.");
      setIsRegistering(false);
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-violet-600 rounded-2xl items-center justify-center text-white mb-4 shadow-xl shadow-violet-500/20 brand-font text-3xl font-bold">V</div>
          <h1 className="text-3xl font-bold text-slate-900 brand-font">Velvessa Closet</h1>
          <p className="text-slate-500 mt-2">Boutique Management System</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="flex mb-8 bg-slate-50 p-1 rounded-xl">
            <button 
              onClick={() => { setIsRegistering(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${!isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isRegistering ? 'Create Request' : 'Secure Access'}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
              <Lock size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl font-medium flex items-center gap-2">
              <ShieldCheck size={16} />
              {success}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username / Email</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="admin"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="admin"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/30 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                Login to Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email / Username</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required
                    type="tel" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Desired Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.SALES, UserRole.INVENTORY, UserRole.ADMIN].map(r => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 text-[10px] font-bold uppercase rounded-lg border-2 transition-all ${role === r ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-100 text-slate-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  required
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                Submit Request
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-10 text-xs text-slate-400">
          &copy; 2024 Velvessa Closet. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
