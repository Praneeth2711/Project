import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Phone,
  Filter,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

const OwnerBookingsPage = () => {
  const { refreshSidebarCounts } = useOutletContext() || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === 'all'
          ? '/bookings/owner'
          : `/bookings/owner?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleApprove = async (id, studentName, bedNumber) => {
    setActionLoadingId(id);
    setToastMessage('');
    try {
      const res = await api.put(`/bookings/${id}/approve`);
      if (res.data.success) {
        setToastMessage(`Booking approved for ${studentName}! Bed ${bedNumber} is now Occupied (🔴).`);
        fetchBookings();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id, studentName) => {
    const reason = window.prompt(
      `Enter rejection reason for ${studentName}'s booking:`,
      'Requested bed no longer available.'
    );
    if (reason === null) return;

    setActionLoadingId(id);
    setToastMessage('');
    try {
      const res = await api.put(`/bookings/${id}/reject`, { rejectionReason: reason });
      if (res.data.success) {
        setToastMessage(`Booking rejected for ${studentName}. Bed released back to Available (🟢).`);
        fetchBookings();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Booking Requests Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, or reject student allocation requests. Approved bookings automatically transition bed states to Occupied.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Only', badge: pendingCount },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Requests */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading booking requests...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">No Booking Requests Found</h3>
            <p className="text-xs text-slate-500">
              There are no {filterStatus !== 'all' ? filterStatus : ''} booking requests to display.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Student Information</th>
                  <th className="py-4 px-4">Room & Bed</th>
                  <th className="py-4 px-4">Move-in Date</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Monthly Rent</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {booking.studentId?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {booking.studentId?.name || 'Student'}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {booking.studentId?.phone || '+91 98765 43210'}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {booking.studentId?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Room & Bed */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        Room {booking.roomId?.roomNumber || '---'}
                      </div>
                      <span className="text-indigo-600 font-extrabold text-[11px]">
                        {booking.bedId?.bedNumber || 'Bed'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {booking.roomId?.roomType}
                      </span>
                    </td>

                    {/* Move-in Date */}
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {new Date(booking.moveInDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      {booking.duration} Months
                    </td>

                    {/* Rent */}
                    <td className="py-4 px-4 font-black text-slate-900">
                      ₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          booking.status === 'approved'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : booking.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                            : booking.status === 'rejected'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            booking.status === 'approved'
                              ? 'bg-rose-500'
                              : booking.status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        ></span>
                        {booking.status}
                      </span>
                      {booking.rejectionReason && (
                        <span className="text-[10px] text-rose-600 block mt-1">
                          Reason: {booking.rejectionReason}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {booking.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleApprove(
                                booking._id,
                                booking.studentId?.name,
                                booking.bedId?.bedNumber
                              )
                            }
                            disabled={actionLoadingId === booking._id}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{actionLoadingId === booking._id ? '...' : 'APPROVE'}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleReject(booking._id, booking.studentId?.name)
                            }
                            disabled={actionLoadingId === booking._id}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs transition-colors disabled:opacity-50"
                          >
                            REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Decision finalized
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookingsPage;
