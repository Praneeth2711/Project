import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Bed,
  CheckCircle2,
} from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { loginStudent, loginOwner } = useAuth();

  const handleQuickStudentDemo = async (e) => {
    e.stopPropagation();
    try {
      await loginStudent('student@example.com', 'Student@123');
      navigate('/student/dashboard');
    } catch (err) {
      navigate('/student/login');
    }
  };

  const handleQuickOwnerDemo = async (e) => {
    e.stopPropagation();
    try {
      await loginOwner('owner@example.com', 'Owner@123');
      navigate('/owner/dashboard');
    } catch (err) {
      navigate('/owner/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background ambient decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Brand Nav */}
      <header className="max-w-7xl w-full mx-auto px-6 py-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
            🏠
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Hostel<span className="text-indigo-400">Hub</span>
            </h1>
            <p className="text-[11px] font-semibold text-indigo-300 tracking-wider uppercase">
              Smart Bed Booking & Allocation System
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>FSD Mini-Project Live Demo</span>
        </div>
      </header>

      {/* Hero Content & Role Cards */}
      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center z-10 text-center">
        {/* Tagline Header */}
        <div className="space-y-3 mb-10 max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Bed className="w-3.5 h-3.5 text-indigo-400" />
            Visual Smart Bed Allocation Platform
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Find. Book. Get Approved. Stay.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Please choose your role to enter your personalized portal.
          </p>
        </div>

        {/* Section Prompt */}
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-slate-700"></span>
          <span>Who are you?</span>
          <span className="w-8 h-px bg-slate-700"></span>
        </div>

        {/* The Two Large Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* 1. STUDENT CARD */}
          <div
            onClick={() => navigate('/student/login')}
            className="group relative rounded-3xl bg-slate-800/80 hover:bg-slate-800 border-2 border-indigo-500/30 hover:border-indigo-400 p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👨🎓
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Role: Student
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">STUDENT</h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Explore verified hostels, view interactive room blueprints, select available beds visually, and track your booking status.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all group-hover:gap-3"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickStudentDemo}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick Demo: Student (student@example.com)</span>
              </button>
            </div>
          </div>

          {/* 2. OWNER CARD */}
          <div
            onClick={() => navigate('/owner/login')}
            className="group relative rounded-3xl bg-slate-800/80 hover:bg-slate-800 border-2 border-slate-700 hover:border-emerald-400 p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🏠
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Role: Hostel Owner
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">HOSTEL OWNER</h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Manage rooms, floors, and beds visually. Review student booking requests, approve or reject allocations, and track occupancy analytics.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all group-hover:gap-3"
              >
                <span>Continue as Owner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickOwnerDemo}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-emerald-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick Demo: Owner (owner@example.com)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Visual Bed Map (Green / Yellow / Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>Smart Rule-Based Recommendation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Strict Role-Based Access Control</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 z-10 border-t border-white/5">
        HostelHub – Smart Hostel Bed Booking & Allocation System • MERN Stack Architecture
      </footer>
    </div>
  );
};

export default RoleSelectionPage;
