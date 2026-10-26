import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Home, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const BookingModal = ({ hostel, room, bed, isOpen, onClose, onSuccess }) => {
  const [moveInDate, setMoveInDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isOpen || !bed) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/bookings', {
        hostelId: hostel._id,
        roomId: room._id,
        bedId: bed._id,
        moveInDate,
        duration: Number(duration),
      });

      if (res.data.success) {
        setBookingConfirmed(true);
        setTimeout(() => {
          onSuccess && onSuccess(res.data.data);
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to book bed. Please verify availability or your active allocations.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Book Bed Allocation</h3>
            <p className="text-indigo-200 text-xs mt-0.5">
              Secure your stay with instant owner notification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-extrabold text-slate-900">Booking Request Sent!</h4>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              Your request for <strong className="text-slate-900">Room {room.roomNumber} ({bed.bedNumber})</strong> has been submitted. The status is now <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">Pending Approval</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="p-6 md:p-8 space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <p>{error}</p>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-indigo-600" /> Hostel
                </span>
                <span className="font-bold text-slate-800">{hostel?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Room</span>
                <span className="font-semibold text-slate-800">
                  Room {room?.roomNumber} ({room?.roomType}, Floor {room?.floor})
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Selected Bed</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                  {bed?.bedNumber}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Monthly Rent</span>
                <span className="font-extrabold text-slate-900 text-base">
                  ₹{(bed?.price || room?.monthlyRent)?.toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Move-in Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Stay Duration
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months (Standard)</option>
                    <option value={10}>10 Months (Academic Year)</option>
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Workflow Notice */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>
                Bed will be locked in <strong>Pending</strong> state until approved by the hostel owner.
              </span>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-md hover:shadow-indigo-500/25 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Confirm Bed Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
