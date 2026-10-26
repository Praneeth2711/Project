import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Grid,
  ClipboardList,
  GitPullRequest,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const OwnerSidebar = ({ pendingBookingsCount = 0, pendingChangesCount = 0 }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My Hostel', path: '/owner/hostel', icon: Building2 },
    { name: 'Rooms & Beds', path: '/owner/rooms', icon: Grid },
    {
      name: 'Booking Requests',
      path: '/owner/bookings',
      icon: ClipboardList,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : null,
    },
    {
      name: 'Room Changes',
      path: '/owner/room-changes',
      icon: GitPullRequest,
      badge: pendingChangesCount > 0 ? pendingChangesCount : null,
    },
    { name: 'Analytics & Reports', path: '/owner/reports', icon: BarChart3 },
    { name: 'Settings', path: '/owner/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg shadow-sm">
          🏠
        </div>
        <div>
          <span className="font-extrabold text-white tracking-tight text-base flex items-center gap-1">
            Hostel<span className="text-indigo-400">Hub</span>
          </span>
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block">
            Owner Portal
          </span>
        </div>
      </div>

      {/* Owner Info Summary Card */}
      <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
          {user?.name?.charAt(0) || 'O'}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-white text-sm truncate">{user?.name || 'Hostel Owner'}</p>
          <span className="text-[11px] text-slate-400 block truncate">Hostel Administrator</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
