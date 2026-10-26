import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Home,
  Search,
  BookmarkCheck,
  Bed,
  Sparkles,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Check,
} from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/student/dashboard', icon: Home },
    { name: 'Find Hostel', path: '/student/hostels', icon: Search },
    { name: 'Smart Match', path: '/student/recommendations', icon: Sparkles },
    { name: 'My Bookings', path: '/student/my-bookings', icon: BookmarkCheck },
    { name: 'My Room', path: '/student/my-room', icon: Bed },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to={role === 'student' ? '/student/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🏠</span>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Hostel<span className="text-indigo-600">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Smart Bed Allocation
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          {role === 'student' && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-600'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Controls & Notifications */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-sm animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) navigate(n.link);
                                setShowNotifications(false);
                              }}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                                !n.read ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span
                                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                    !n.read ? 'bg-indigo-600' : 'bg-slate-300'
                                  }`}
                                ></span>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                                    {n.message}
                                  </p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">
                                    {new Date(n.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to="/student/profile"
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                Choose Role
              </Link>
            )}

            {/* Mobile Hamburger */}
            {role === 'student' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && role === 'student' && (
          <div className="md:hidden py-4 border-t border-slate-200/80 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-600" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
