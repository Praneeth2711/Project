import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-card space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You do not have the necessary permissions to access this page. You are currently logged in with the{' '}
            <strong className="text-slate-800 uppercase font-bold">{role || 'unassigned'}</strong> role.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            to={role === 'owner' ? '/owner/dashboard' : '/student/dashboard'}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </Link>

          <button
            onClick={handleSwitch}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            Switch Role / Re-login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
