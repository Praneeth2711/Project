import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, User, Building, Phone, Mail, Shield, CheckCircle } from 'lucide-react';

const OwnerSettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Owner Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your administrator identity and hostel management permissions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{user?.name}</h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" /> Verified Hostel Owner
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Account Email
            </span>
            <p className="font-bold text-slate-800 text-sm">{user?.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> Administrator Phone
            </span>
            <p className="font-bold text-slate-800 text-sm">{user?.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Role-Based Access Control
            </span>
            <p className="font-bold text-slate-800 text-sm">
              Role: <strong className="text-indigo-600">owner</strong> (Can manage assigned hostels, rooms, beds, approve/reject student allocations)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSettingsPage;
