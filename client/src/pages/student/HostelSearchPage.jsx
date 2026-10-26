import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  ArrowRight,
  Sparkles,
  Wifi,
  Shield,
  Utensils,
  Wind,
} from 'lucide-react';

const HostelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '15000');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [sort, setSort] = useState('rating_desc');

  const facilityOptions = [
    'Wi-Fi',
    'AC',
    'Mess Food',
    'Laundry',
    'CCTV Security',
    'Power Backup',
    'Gym',
    'Study Room',
  ];

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (city && city !== 'All') params.append('city', city);
      if (gender && gender !== 'All') params.append('gender', gender);
      if (maxRent) params.append('maxRent', maxRent);
      if (selectedFacilities.length > 0) {
        params.append('facilities', selectedFacilities.join(','));
      }
      if (sort) params.append('sort', sort);

      const res = await api.get(`/hostels?${params.toString()}`);
      if (res.data.success) {
        setHostels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to search hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [city, gender, maxRent, selectedFacilities, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHostels();
  };

  const toggleFacility = (fac) => {
    if (selectedFacilities.includes(fac)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== fac));
    } else {
      setSelectedFacilities([...selectedFacilities, fac]);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCity('All');
    setGender('All');
    setMaxRent('15000');
    setSelectedFacilities([]);
    setSort('rating_desc');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Find Your Perfect Hostel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Filter verified student accommodations by price, gender, location, and visual bed availability.
        </p>
      </div>

      {/* Main Grid: Filter Sidebar + Hostel List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" /> Filter Hostels
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Search Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hostel name or landmark..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* City / Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              City / Location
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Cities</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Hostel Type / Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hostel Type (Gender)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Boys', 'Girls', 'Co-ed'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    gender === g
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Max Rent Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Max Rent</span>
              <span className="font-extrabold text-indigo-600">
                ₹{Number(maxRent).toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min="4000"
              max="15000"
              step="500"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹4,000</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Facilities
            </label>
            <div className="space-y-1.5">
              {facilityOptions.map((fac) => (
                <label
                  key={fac}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(fac)}
                    onChange={() => toggleFacility(fac)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>{fac}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hostel Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Filter Bar with Sort and Count */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-700">
              Showing <strong className="text-indigo-600 font-extrabold">{hostels.length}</strong> verified hostels
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Loading available hostels...
            </div>
          ) : hostels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="font-extrabold text-slate-800 text-lg">No Hostels Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hostels matched your exact criteria. Try broadening your rent filter or selecting a different city.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hostels.map((hostel) => (
                <div
                  key={hostel._id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={
                        hostel.images?.[0] ||
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={hostel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold flex items-center gap-1 shadow-sm">
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
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{hostel.address}, {hostel.city}</span>
                      </p>

                      {/* Bed Status badge */}
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            (hostel.availableBeds || 0) > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {(hostel.availableBeds || 0) > 0
                            ? `🟢 ${hostel.availableBeds} Beds Available`
                            : '🔴 Full / No Beds Available'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {hostel.totalRooms || 0} Rooms
                        </span>
                      </div>

                      {/* Facility chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hostel.facilities?.slice(0, 4).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {f}
                          </span>
                        ))}
                        {hostel.facilities?.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                            +{hostel.facilities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400">Starting at</span>
                        <p className="font-extrabold text-slate-900 text-base">
                          ₹{hostel.monthlyRent?.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500">/mo</span>
                        </p>
                      </div>

                      <Link
                        to={`/student/hostels/${hostel._id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 group-hover:gap-2"
                      >
                        <span>View Hostel</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelSearchPage;
