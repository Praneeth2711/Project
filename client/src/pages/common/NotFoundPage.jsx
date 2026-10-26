import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-card space-y-6">
        <span className="text-6xl font-black text-indigo-600 block">404</span>

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The page or room you were looking for doesn't exist or has moved.
          </p>
        </div>

        <Link
          to="/"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
