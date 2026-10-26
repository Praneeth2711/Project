import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BookingModal from '../../components/common/BookingModal';
import {
  Sparkles,
  Bed,
  MapPin,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Filter,
  Layers,
  Star,
} from 'lucide-react';

const SmartRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter preferences
  const [maxBudget, setMaxBudget] = useState(8000);
  const [preferredHostelId, setPreferredHostelId] = useState('');
  const [preferredRoomType, setPreferredRoomType] = useState('2 Sharing');
  const [preferredFloor, setPreferredFloor] = useState(1);
  const [selectedFacilities, setSelectedFacilities] = useState(['Wi-Fi', 'Mess Food']);

  // Booking modal state
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const facilityList = [
    'Wi-Fi',
    'AC',
    'Mess Food',
    'Laundry',
    'CCTV Security',
    'Power Backup',
    'Gym',
    'Study Room',
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.post('/hostels/recommendations', {
        maxBudget: Number(maxBudget),
        preferredHostelId: preferredHostelId || undefined,
        preferredRoomType,
        preferredFloor: Number(preferredFloor),
        facilities: selectedFacilities,
      });

      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to calculate recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const hostelsRes = await api.get('/hostels');
        if (hostelsRes.data.success) {
          setHostels(hostelsRes.data.data);
        }
      } catch (e) {}
      fetchRecommendations();
    };
    init();
  }, []);

  const handleFacilityToggle = (fac) => {
    if (selectedFacilities.includes(fac)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== fac));
    } else {
      setSelectedFacilities([...selectedFacilities, fac]);
    }
  };

  const handleBookBed = (rec) => {
    setSelectedRecommendation(rec);
    setIsModalOpen(true);
  };

  const handleBookingComplete = () => {
    setSuccessToast(
      `Booking request submitted for ${selectedRecommendation.bedNumber}! Status is now Pending Approval.`
    );
    setSelectedRecommendation(null);
    fetchRecommendations();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="font-bold text-sm">{successToast}</span>
          </div>
          <Link
            to="/student/my-bookings"
            className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs"
          >
            My Bookings →
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Smart Scoring Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Smart Bed Matcher
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
            Our multi-parameter matching algorithm calculates match percentages against live available beds based on your budget, room type, floor, and facility preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Preference Controls Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" /> My Preferences
            </h3>
            <button
              onClick={fetchRecommendations}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Recalculate
            </button>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                Max Monthly Budget
              </span>
              <span className="font-extrabold text-indigo-600">
                ₹{maxBudget.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min="4000"
              max="15000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹4,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Preferred Hostel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred Hostel (Optional)
            </label>
            <select
              value={preferredHostelId}
              onChange={(e) => setPreferredHostelId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Any Hostel</option>
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred Room Type
            </label>
            <select
              value={preferredRoomType}
              onChange={(e) => setPreferredRoomType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Single">Single Room</option>
              <option value="2 Sharing">2 Sharing</option>
              <option value="3 Sharing">3 Sharing</option>
              <option value="4 Sharing">4 Sharing</option>
            </select>
          </div>

          {/* Floor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred Floor
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((floorNum) => (
                <button
                  key={floorNum}
                  type="button"
                  onClick={() => setPreferredFloor(floorNum)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    preferredFloor === floorNum
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Floor {floorNum}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Must-Have Amenities
            </label>
            <div className="space-y-1.5">
              {facilityList.map((fac) => (
                <label
                  key={fac}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(fac)}
                    onChange={() => handleFacilityToggle(fac)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>{fac}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={fetchRecommendations}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Apply & Calculate Scores
          </button>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Found <strong className="text-indigo-600 font-extrabold">{recommendations.length}</strong> available beds ranked by match score
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Scored on 100-Point Rule System
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Calculating smart bed scores...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3 shadow-card">
              <span className="text-4xl">✨</span>
              <h3 className="font-extrabold text-slate-800 text-lg">No Matching Beds Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No currently available beds matched your budget or criteria. Try increasing your budget or choosing another room type.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => {
                const matchClass =
                  rec.matchPercentage >= 80
                    ? 'bg-emerald-600 text-white'
                    : rec.matchPercentage >= 60
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-600 text-white';

                return (
                  <div
                    key={rec.bedId}
                    className="bg-white rounded-3xl border-2 border-indigo-100/80 hover:border-indigo-300 p-6 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      {/* Top Header with Match Percentage */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            Room {rec.room.roomNumber} • Floor {rec.room.floor}
                          </span>
                          <h3 className="font-black text-slate-900 text-xl mt-0.5">
                            {rec.bedNumber}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {rec.hostel.name}, {rec.hostel.city}
                          </p>
                        </div>

                        <div
                          className={`px-3 py-1.5 rounded-full font-black text-xs shadow-sm flex items-center gap-1 ${matchClass}`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{rec.matchPercentage}% Match</span>
                        </div>
                      </div>

                      {/* Reasons Breakdown Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rec.reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* Specs */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            Room Type
                          </span>
                          <p className="font-bold text-slate-800">{rec.room.roomType}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            Hostel Rating
                          </span>
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {rec.hostel.rating || 4.8}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                          Rent
                        </span>
                        <p className="text-lg font-black text-slate-900">
                          ₹{rec.price?.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500">/mo</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/student/hostels/${rec.hostel._id}/rooms/${rec.room._id}`}
                          className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
                        >
                          View Map
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleBookBed(rec)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                        >
                          <Bed className="w-3.5 h-3.5" />
                          <span>Book This Bed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRecommendation && (
        <BookingModal
          hostel={selectedRecommendation.hostel}
          room={selectedRecommendation.room}
          bed={{
            _id: selectedRecommendation.bedId,
            bedNumber: selectedRecommendation.bedNumber,
            price: selectedRecommendation.price,
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default SmartRecommendationsPage;
