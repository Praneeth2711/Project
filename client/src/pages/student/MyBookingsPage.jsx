import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Bed,
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch student bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending booking request?')) return;
    setCancellingId(id);
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return {
          pill: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Confirmed / Occupied',
          icon: CheckCircle2,
        };
      case 'pending':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse',
          dot: 'bg-amber-500',
          label: 'Pending Approval',
          icon: Clock,
        };
      case 'rejected':
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Rejected by Owner',
          icon: XCircle,
        };
      case 'cancelled':
        return {
          pill: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Cancelled',
          icon: XCircle,
        };
      case 'completed':
        return {
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Completed Stay',
          icon: CheckCircle2,
        };
      default:
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: status,
          icon: Clock,
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          My Bed Bookings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your active hostel bed reservations, approval status, and stay duration.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
            📑
          </div>
          <h3 className="font-extrabold text-slate-900 text-xl">No Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't requested any bed allocations yet. Browse verified hostels and pick your preferred bed!
          </p>
          <Link
            to="/student/hostels"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Explore Hostels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const statusConfig = getStatusBadge(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Top Bar with Hostel Name and Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                        Hostel Booking
                      </span>
                      <h3 className="font-bold text-slate-900 text-xl mt-0.5">
                        {booking.hostelId?.name || 'Hostel'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {booking.hostelId?.city} • {booking.hostelId?.address}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0 ${statusConfig.pill}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Allocation Details Grid */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-indigo-600" /> Room & Bed
                      </span>
                      <span className="font-bold text-slate-800">
                        Room {booking.roomId?.roomNumber || '---'} •{' '}
                        {booking.bedId?.bedNumber || 'Bed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Move-in Date
                      </span>
                      <span className="font-medium text-slate-700">
                        {booking.moveInDate
                          ? new Date(booking.moveInDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Not specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> Stay Duration
                      </span>
                      <span className="font-medium text-slate-700">
                        {booking.duration} Months
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Monthly Rent</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>

                  {/* Rejection notice if rejected */}
                  {booking.status === 'rejected' && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      <strong>Rejection Reason:</strong> {booking.rejectionReason || 'Owner rejected the request.'}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                  )}

                  {booking.status === 'approved' && (
                    <Link
                      to="/student/my-room"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                    >
                      <span>Open My Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
