import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';

const StudentProfilePage = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your verified academic identity and contact information.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card space-y-8">
        {/* Profile Card Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.college || 'National University'} • {profile?.department}
            </p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address
            </span>
            <p className="font-bold text-slate-800 text-sm">{user?.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> Contact Phone
            </span>
            <p className="font-bold text-slate-800 text-sm">{user?.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> College / Institution
            </span>
            <p className="font-bold text-slate-800 text-sm">{profile?.college || 'Engineering College'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Department & Year
            </span>
            <p className="font-bold text-slate-800 text-sm">
              {profile?.department} • {profile?.year}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Gender
            </span>
            <p className="font-bold text-slate-800 text-sm">{profile?.gender || 'Male'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Verification Status
            </span>
            <p className="font-bold text-emerald-700 text-sm">Verified Student Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
