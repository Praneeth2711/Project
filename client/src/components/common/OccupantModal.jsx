import React, { useState } from 'react';
import { X, User, Phone, BookOpen, Calendar, Clock, LogOut, Wrench, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const OccupantModal = ({ bed, isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmVacate, setConfirmVacate] = useState(false);

  if (!isOpen || !bed) return null;

  const handleVacate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/beds/${bed._id}/vacate`);
      if (res.data.success) {
        onRefresh && onRefresh();
        onClose();
      }
    } catch (err) {
      console.error('Failed to vacate bed:', err);
      setError(err.response?.data?.message || 'Failed to vacate bed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/beds/${bed._id}/status`, { status: newStatus });
      if (res.data.success) {
        onRefresh && onRefresh();
        onClose();
      }
    } catch (err) {
      console.error('Failed to update bed status:', err);
      setError(err.response?.data?.message || 'Failed to update bed status.');
    } finally {
      setLoading(false);
    }
  };

  const student = bed.currentStudentId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {bed.bedNumber} Management
              </h3>
              <p className="text-slate-400 text-xs">
                Status:{' '}
                <span
                  className={`font-semibold capitalize ${
                    bed.status === 'occupied'
                      ? 'text-rose-400'
                      : bed.status === 'available'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {bed.status}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {bed.status === 'occupied' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" /> Student Name
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {student?.name || 'Allocated Student'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Department / Year
                  </span>
                  <span className="font-semibold text-slate-700 text-xs">
                    {student?.department || 'Engineering'} • {student?.year || '2nd Year'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Number
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {student?.phone || '+91 98765 43210'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Move-in
                  </span>
                  <span className="font-medium text-slate-700 text-xs">
                    {bed.currentBookingId?.moveInDate
                      ? new Date(bed.currentBookingId.moveInDate).toLocaleDateString()
                      : 'Active Allocation'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" /> Duration
                  </span>
                  <span className="font-medium text-slate-700 text-xs">
                    {bed.currentBookingId?.duration
                      ? `${bed.currentBookingId.duration} Months`
                      : '6 Months'}
                  </span>
                </div>
              </div>

              {/* Vacate Action */}
              {confirmVacate ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-fade-in">
                  <p className="text-xs font-semibold text-rose-800">
                    Are you sure you want to vacate this bed? The allocation will be completed and the bed marked Available.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVacate}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      {loading ? 'Vacating...' : 'Yes, Confirm Vacate'}
                    </button>
                    <button
                      onClick={() => setConfirmVacate(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmVacate(true)}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Vacate Bed
                </button>
              )}
            </div>
          )}

          {bed.status === 'available' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                This bed is currently <strong>Available</strong> for students to book. You can place it under maintenance if repairs are required.
              </p>
              <button
                onClick={() => handleStatusChange('maintenance')}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Wrench className="w-4 h-4 text-slate-500" />
                Mark as Maintenance
              </button>
            </div>
          )}

          {bed.status === 'maintenance' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                This bed is currently under <strong>Maintenance</strong> and hidden from student booking.
              </p>
              <button
                onClick={() => handleStatusChange('available')}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Available
              </button>
            </div>
          )}

          {bed.status === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              This bed is currently awaiting approval in <strong>Booking Requests</strong>. Please review the pending request to Approve or Reject.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OccupantModal;
