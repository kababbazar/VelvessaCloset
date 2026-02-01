
import React from 'react';
import { useStore } from '../store';
import { UserStatus, UserRole } from '../types';
import { CheckCircle, XCircle, User as UserIcon, ShieldAlert, Mail, Smartphone } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { users, updateUserStatus, currentUser } = useStore();

  const handleApprove = (userId: string) => {
    updateUserStatus(userId, UserStatus.APPROVED);
  };

  const handleReject = (userId: string) => {
    updateUserStatus(userId, UserStatus.REJECTED);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 brand-font">Team & Access Control</h2>
        <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-2">
          <ShieldAlert size={16} />
          Admin Level Control
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Team Member</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Mail size={10}/> {user.email}</span>
                        {user.phone && <span className="flex items-center gap-1"><Smartphone size={10}/> {user.phone}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    user.role === UserRole.ADMIN ? 'bg-violet-50 text-violet-600' :
                    user.role === UserRole.INVENTORY ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.status === UserStatus.APPROVED ? 'text-emerald-600 bg-emerald-50' :
                    user.status === UserStatus.PENDING ? 'text-amber-600 bg-amber-50' :
                    'text-red-600 bg-red-50'
                  }`}>
                    {user.status === UserStatus.APPROVED && <CheckCircle size={12}/>}
                    {user.status === UserStatus.REJECTED && <XCircle size={12}/>}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== currentUser?.id && user.status === UserStatus.PENDING && (
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleReject(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Reject Access"
                      >
                        <XCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Approve User"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  )}
                  {user.id === currentUser?.id && (
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Current User</span>
                  )}
                  {user.status !== UserStatus.PENDING && user.id !== currentUser?.id && (
                     <button 
                      onClick={() => updateUserStatus(user.id, UserStatus.PENDING)}
                      className="text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors"
                     >
                       Reset to Pending
                     </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
           <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-800">Security Note</h4>
          <p className="text-sm text-amber-700 mt-1">
            As an Administrator, you have full control over team member access. 
            Once approved, users can login with their email and chosen password. 
            Rejected users are strictly forbidden from entering the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
