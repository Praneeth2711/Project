import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Bed,
  Layers,
  Users,
  MapPin,
  Calendar,
  Clock,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Home,
  X,
  Phone,
} from 'lucide-react';

const MyRoomPage = () => {
  const [roomData, setRoomData] = useState(null);
  const [hasRoom, setHasRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeRequests, setChangeRequests] = useState([]);

  // Room change form state
  const [changeForm, setChangeForm] = useState({
    requestedRoomId: '',
    reason: '',
    additionalMessage: '',
  });
  const [submittingChange, setSubmittingChange] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchMyRoom = async () => {
    try {
      const res = await api.get('/bookings/my-room');
      if (res.data.success && res.data.hasRoom) {
        setHasRoom(true);
        setRoomData(res.data.data);

        // Fetch other rooms in the same hostel for room change options
        const hostelId = res.data.data.booking.hostelId._id;
        const roomsRes = await api.get(`/rooms/hostel/${hostelId}`);
        if (roomsRes.data.success) {
          // Filter out current room
          const others = roomsRes.data.data.filter(
            (r) => r._id !== res.data.data.booking.roomId._id
          );
          setAvailableRooms(others);
          if (others.length > 0) {
            setChangeForm((prev) => ({ ...prev, requestedRoomId: others[0]._id }));
          }
        }
      } else {
        setHasRoom(false);
      }

      // Fetch student's room change requests
      const changesRes = await api.get('/room-changes/student');
      if (changesRes.data.success) {
        setChangeRequests(changesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load my room:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRoom();
  }, []);

  const handleRoomChangeSubmit = async (e) => {
    e.preventDefault();
    setSubmittingChange(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await api.post('/room-changes', changeForm);
      if (res.data.success) {
        setFormSuccess('Room change request submitted to hostel owner successfully!');
        fetchMyRoom();
        setTimeout(() => {
          setShowChangeModal(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit room change request.');
    } finally {
      setSubmittingChange(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading room allocation details...
      </div>
    );
  }

  if (!hasRoom) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-card animate-fade-in max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
          🛏️
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Active Room Allocation</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have a confirmed bed allocation at the moment. Browse verified hostels, select an available green bed, and submit your request.
        </p>
        <div className="pt-2">
          <Link
            to="/student/hostels"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Find a Hostel & Bed
          </Link>
        </div>
      </div>
    );
  }

  const { booking, roommates } = roomData;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Allocation
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Room: Room {booking.roomId?.roomNumber} ({booking.bedId?.bedNumber})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {booking.hostelId?.name} • {booking.hostelId?.address}, {booking.hostelId?.city}
          </p>
        </div>

        <button
          onClick={() => setShowChangeModal(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Request Room Change</span>
        </button>
      </div>

      {/* Main Room & Stay Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg">Room Allocation Summary</h3>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              🟢 Confirmed & Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-indigo-600" /> Allocated Bed
              </span>
              <p className="text-xl font-black text-slate-900">
                {booking.bedId?.bedNumber}
              </p>
              <p className="text-xs text-slate-500">
                Room {booking.roomId?.roomNumber} • {booking.roomId?.roomType}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Floor Level
              </span>
              <p className="text-xl font-black text-slate-900">
                Floor {booking.roomId?.floor}
              </p>
              <p className="text-xs text-slate-500">
                Capacity: {booking.roomId?.capacity} Students
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Move-in Date
              </span>
              <p className="text-base font-bold text-slate-900">
                {new Date(booking.moveInDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-500">Duration: {booking.duration} Months</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Monthly Rent
              </span>
              <p className="text-xl font-black text-slate-900">
                ₹{booking.monthlyRent?.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500">/month</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold">Active stay agreement</p>
            </div>
          </div>

          {/* Roommates in same room */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Roommates in Room {booking.roomId?.roomNumber}
            </h4>

            {roommates?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No other roommates currently allocated to this room.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roommates.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {r.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{r.student?.name}</p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {r.bedNumber} • {r.student?.phone || 'Verified student'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Room Change Requests History Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-indigo-600" /> Room Change History
            </h3>

            {changeRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                No room change requests submitted yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {changeRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        Requested: Room {req.requestedRoomId?.roomNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      <strong>Reason:</strong> {req.reason}
                    </p>
                    {req.rejectionReason && (
                      <p className="text-rose-600 text-[11px]">
                        <strong>Owner Note:</strong> {req.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowChangeModal(true)}
            className="w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-colors"
          >
            Submit New Change Request
          </button>
        </div>
      </div>

      {/* Room Change Request Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Request Room Change</h3>
                <p className="text-indigo-200 text-xs">
                  Current: Room {booking.roomId?.roomNumber} • {booking.bedId?.bedNumber}
                </p>
              </div>
              <button
                onClick={() => setShowChangeModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRoomChangeSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Preferred Room
                </label>
                <select
                  required
                  value={changeForm.requestedRoomId}
                  onChange={(e) =>
                    setChangeForm({ ...changeForm, requestedRoomId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {availableRooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      Room {r.roomNumber} ({r.roomType}, Floor {r.floor}) – ₹{r.monthlyRent}/mo
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Room Change
                </label>
                <textarea
                  required
                  rows={3}
                  value={changeForm.reason}
                  onChange={(e) => setChangeForm({ ...changeForm, reason: e.target.value })}
                  placeholder="e.g. Prefer 2 sharing on floor 1 for studies, quiet environment, etc."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Note to Owner (Optional)
                </label>
                <input
                  type="text"
                  value={changeForm.additionalMessage}
                  onChange={(e) =>
                    setChangeForm({ ...changeForm, additionalMessage: e.target.value })
                  }
                  placeholder="Any extra details..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingChange}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {submittingChange ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoomPage;
