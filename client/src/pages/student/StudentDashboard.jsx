import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Search,
  Bed,
  BookmarkCheck,
  Home,
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hostels, setHostels] = useState([]);
  const [topRecommendation, setTopRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [hostelsRes, recRes] = await Promise.all([
          api.get('/hostels'),
          api.post('/hostels/recommendations', {}),
        ]);

        if (hostelsRes.data.success) {
          setHostels(hostelsRes.data.data);
        }

        if (recRes.data.success && recRes.data.data.length > 0) {
          setTopRecommendation(recRes.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/hostels?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/student/hostels');
    }
  };

  // Metrics computation
  const totalAvailableBeds = hostels.reduce((acc, h) => acc + (h.availableBeds || 0), 0);
  const avgRent =
    hostels.length > 0
      ? Math.round(hostels.reduce((acc, h) => acc + (h.monthlyRent || 0), 0) / hostels.length)
      : 5500;

  return (
    <div className="space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Smart Hostel Bed Booking
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>

          <p className="text-indigo-100 text-sm sm:text-base font-normal">
            Find a comfortable place to stay. Choose from verified hostels, explore real-time visual bed maps, and secure your room in minutes.
          </p>

          {/* Search bar inside hero */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hostel name, city or location..."
                className="w-full pl-3 pr-4 py-2.5 text-slate-800 text-sm focus:outline-none placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/student/hostels"
          className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl hover:border-indigo-400 transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🔍
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              Find Hostel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Explore available hostels & beds</p>
          </div>
        </Link>

        <Link
          to="/student/my-bookings"
          className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl hover:border-amber-400 transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📑
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
              My Bookings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Track allocation approval status</p>
          </div>
        </Link>

        <Link
          to="/student/my-room"
          className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl hover:border-emerald-400 transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🛏️
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
              My Room
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">View roommates & room changes</p>
          </div>
        </Link>
      </div>

      {/* Highlights & Top Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Pill Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Live Platform Stats</h3>
            <p className="text-xs text-slate-500 mt-1">Verified student accommodation network</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available Beds
              </span>
              <span className="font-extrabold text-slate-900 text-lg">
                {totalAvailableBeds} Beds
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Average Monthly Rent
              </span>
              <span className="font-extrabold text-slate-900 text-lg">
                ₹{avgRent.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-xs font-semibold text-amber-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Top Rated Hostels
              </span>
              <span className="font-extrabold text-slate-900 text-lg">4.8 / 5.0</span>
            </div>
          </div>

          <Link
            to="/student/recommendations"
            className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Try Smart Bed Matcher
          </Link>
        </div>

        {/* Smart Recommendation Highlight Card */}
        {topRecommendation && (
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-indigo-200 p-6 sm:p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1.5 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> ✨ Recommended for You
                </span>
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                  {topRecommendation.matchPercentage}% Match
                </span>
              </div>

              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                Room {topRecommendation.room.roomNumber} • {topRecommendation.bedNumber}
              </h4>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {topRecommendation.hostel.name}, {topRecommendation.hostel.city}
              </p>

              {/* Match reasons checklist */}
              <div className="mt-4 flex flex-wrap gap-2">
                {topRecommendation.reasons.map((r, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Monthly Rent
                </span>
                <p className="text-xl font-black text-slate-900">
                  ₹{topRecommendation.price?.toLocaleString('en-IN')}/mo
                </p>
              </div>

              <Link
                to={`/student/hostels/${topRecommendation.hostel._id}/rooms/${topRecommendation.room._id}`}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>View & Book Bed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Popular Hostels Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Hostels
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified accommodations with modern amenities
            </p>
          </div>
          <Link
            to="/student/hostels"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Hostels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostels.slice(0, 3).map((hostel) => (
            <div
              key={hostel._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={
                    hostel.images?.[0] ||
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={hostel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{hostel.rating || 4.8}</span>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold">
                  {hostel.gender}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                    {hostel.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {hostel.city} • {hostel.address}
                  </p>

                  {/* Bed availability tag */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      🟢 {hostel.availableBeds || 0} Beds Available
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400">Starts from</span>
                    <p className="font-extrabold text-slate-900 text-base">
                      ₹{hostel.monthlyRent?.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500">/mo</span>
                    </p>
                  </div>

                  <Link
                    to={`/student/hostels/${hostel._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    View Hostel
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
