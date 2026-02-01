
import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Camera, Shield, Mail, Phone, History, Clock, Activity } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateProfile, auditLogs } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [imageUrl, setImageUrl] = useState(currentUser?.profileImage || '');

  const userLogs = auditLogs.filter(log => log.userId === currentUser?.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone, profileImage: imageUrl });
    setIsEditing(false);
  };

  const simulateImageUpload = () => {
    const urls = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop'
    ];
    const random = urls[Math.floor(Math.random() * urls.length)];
    setImageUrl(random);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-violet-600 to-indigo-700 relative">
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                      {imageUrl ? (
                        <img src={imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={40} /></div>
                      )}
                    </div>
                    <button 
                      onClick={simulateImageUpload}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-violet-600 hover:bg-violet-50 transition-colors border border-slate-100"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="pt-16 pb-8 px-6 text-center">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mt-1">{currentUser.role}</p>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail size={16} className="text-slate-400" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Phone size={16} className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone Number</p>
                    <p className="text-sm font-medium text-slate-700">{currentUser.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Shield size={16} className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Access Level</p>
                    <p className="text-sm font-medium text-slate-700">{currentUser.status}</p>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl shadow-lg border border-violet-100 space-y-4 animate-in zoom-in duration-200">
              <h3 className="font-bold text-slate-900 mb-2">Edit Details</h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action History Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 brand-font flex items-center gap-3">
                  <Activity className="text-violet-600" />
                  Your Activity History
                </h3>
                <p className="text-sm text-slate-500">Track your changes and system interactions</p>
              </div>
              <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                <History size={20} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {userLogs.length > 0 ? (
                userLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                        <Clock size={18} />
                      </div>
                      <div className="w-0.5 h-full bg-slate-100 my-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800">{log.action}</h4>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <Clock size={64} className="mb-4" />
                  <p className="font-bold">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
