import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base">
              🏠
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                Hostel<span className="text-indigo-600">Hub</span>
              </span>
              <p className="text-xs text-slate-500">
                Smart Hostel Bed Booking & Allocation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="w-4 h-4" /> Secure Allocation
            </span>
            <span className="flex items-center gap-1 text-indigo-600">
              <Sparkles className="w-4 h-4" /> Smart Recommendations
            </span>
            <span className="hidden sm:inline">MERN Stack College Mini-Project</span>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-1">
            Built for FSD Demonstration with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
