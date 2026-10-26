import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import { ArrowLeft, Mail, Lock, AlertCircle, LogIn, Sparkles } from 'lucide-react';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { loginOwner } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginOwner(email, password);
      navigate('/owner/dashboard');
    } catch (err) {
      console.error('Owner login error:', err);
      setError(err.response?.data?.message || 'Invalid owner credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoOwner = () => {
    setEmail('owner@example.com');
    setPassword('Owner@123');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-14 h-14 rounded-3xl bg-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/25">
            🏠
          </div>
          <h2 className="mt-4 text-3xl font-black text-white tracking-tight">
            Hostel Owner Portal
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage rooms, approve bookings, and monitor occupancy.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-700/80">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Owner'}</span>
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-5 border-t border-slate-700">
            <button
              type="button"
              onClick={fillDemoOwner}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-fill Demo Credentials (owner@example.com)</span>
            </button>
          </div>

          {/* Link to Register */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Registering a new hostel?{' '}
            <Link
              to="/owner/register"
              className="font-bold text-emerald-400 hover:text-emerald-300"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default OwnerLogin;
