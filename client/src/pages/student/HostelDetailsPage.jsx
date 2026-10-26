import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Bed,
  Layers,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Home,
} from 'lucide-react';

const HostelDetailsPage = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const res = await api.get(`/hostels/${id}`);
        if (res.data.success) {
          setHostel(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load hostel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading hostel information...
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
        <h3 className="font-extrabold text-slate-900 text-lg">Hostel Not Found</h3>
        <p className="text-xs text-slate-500">The requested hostel could not be found.</p>
        <Link
          to="/student/hostels"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <Link to="/student/hostels" className="hover:text-indigo-600">
          Hostels
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{hostel.name}</span>
      </nav>

      {/* Hero Banner with Images & Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        {/* Images Carousel / Grid */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm relative">
            <img
              src={
                hostel.images?.[0] ||
                'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'
              }
              alt={hostel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold">
              {hostel.gender} Student Hostel
            </div>
          </div>

          {hostel.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {hostel.images.slice(1, 4).map((img, idx) => (
                <div key={idx} className="h-24 rounded-xl overflow-hidden bg-slate-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Details Sidebar */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
                Verified Listing
              </span>
              <div className="flex items-center gap-1 text-slate-800 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{hostel.rating || 4.8}</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {hostel.name}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 leading-relaxed">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{hostel.address}, {hostel.city}</span>
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {hostel.description}
            </p>

            {/* Total beds counter */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Available Beds</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🟢 {hostel.availableBeds} Available
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Capacity</span>
                <span className="font-bold text-slate-800">{hostel.totalBeds} Beds</span>
              </div>
            </div>

            {/* Owner Contact */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Hostel Administration
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>{hostel.ownerId?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{hostel.ownerId?.email || 'contact@hostelhub.com'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Monthly Rent from</span>
              <p className="text-2xl font-black text-slate-900">
                ₹{hostel.monthlyRent?.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </p>
            </div>
            <a
              href="#rooms-section"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Hostel Amenities & Facilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {hostel.facilities?.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Section */}
      <div id="rooms-section" className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Available Rooms & Beds
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a room to view the interactive room floor plan and choose an available bed.
          </p>
        </div>

        {hostel.rooms?.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
            No rooms listed yet for this hostel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostel.rooms?.map((room) => {
              const statusPill =
                room.statusText === 'Available'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : room.statusText === 'Partially Occupied'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200';

              return (
                <div
                  key={room._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xl">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" /> Floor {room.floor}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusPill}`}
                      >
                        {room.statusText}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">
                        {room.roomType} • Capacity {room.capacity}
                      </p>
                      <p className="text-xs text-emerald-600 font-bold">
                        {room.availableBeds} beds available
                      </p>
                    </div>

                    {/* Visual mini bed status indicator dots */}
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {room.beds?.map((bed) => (
                        <span
                          key={bed._id}
                          className={`w-3.5 h-3.5 rounded-full ${
                            bed.status === 'available'
                              ? 'bg-emerald-500'
                              : bed.status === 'pending'
                              ? 'bg-amber-500 animate-pulse'
                              : bed.status === 'occupied'
                              ? 'bg-rose-500'
                              : 'bg-slate-400'
                          }`}
                          title={`${bed.bedNumber} - ${bed.status}`}
                        ></span>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-auto">
                        {room.beds?.length} beds
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Monthly Rent</span>
                      <p className="font-extrabold text-slate-900 text-base">
                        ₹{room.monthlyRent?.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </p>
                    </div>

                    <Link
                      to={`/student/hostels/${hostel._id}/rooms/${room._id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1 group-hover:gap-2"
                    >
                      <Bed className="w-3.5 h-3.5" />
                      <span>View Beds</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelDetailsPage;
