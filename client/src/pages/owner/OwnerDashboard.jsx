import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import {
  Bed,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Plus,
  Grid,
} from 'lucide-react';

const OwnerDashboard = () => {
  const { refreshSidebarCounts } = useOutletContext() || {};
  const [reports, setReports] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadDashboard = async () => {
    try {
      const [reportsRes, bookingsRes] = await Promise.all([
        api.get('/reports/owner'),
        api.get('/bookings/owner?status=pending'),
      ]);

      if (reportsRes.data.success) {
        setReports(reportsRes.data.data.summary);
      }
      if (bookingsRes.data.success) {
        setPendingBookings(bookingsRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    setActionSuccess('');
    try {
      const res = await api.put(`/bookings/${id}/approve`);
      if (res.data.success) {
        setActionSuccess('Booking approved successfully! Bed is now marked as Occupied (🔴).');
        loadDashboard();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):', 'Requested room unavailable.');
    if (reason === null) return;

    setActionLoadingId(id);
    setActionSuccess('');
    try {
      const res = await api.put(`/bookings/${id}/reject`, { rejectionReason: reason });
      if (res.data.success) {
        setActionSuccess('Booking rejected. Bed released back to Available (🟢).');
        loadDashboard();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading owner dashboard data...
      </div>
    );
  }

  const summary = reports || {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    pendingBeds: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    pendingBookingsCount: 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess('')}
            className="text-white hover:text-emerald-100 underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hostel Operations Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bed allocation metrics, student requests, and floor statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/owner/rooms"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Grid className="w-4 h-4" />
            <span>Visual Bed Map</span>
          </Link>
          <Link
            to="/owner/bookings"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pending Requests ({summary.pendingBookingsCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* Section 15 Required Stat Cards: Total Beds, Occupied Beds, Available Beds, Pending Requests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Beds */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Beds
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{summary.totalBeds}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Hostel Total Capacity</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
            🛏️
          </div>
        </div>

        {/* Occupied Beds */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Occupied Beds
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{summary.occupiedBeds}</p>
            <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">
              {summary.occupancyRate}% Current Occupancy
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
            🔴
          </div>
        </div>

        {/* Available Beds */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available Beds
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{summary.availableBeds}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Ready for Booking
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            🟢
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pending Requests
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {summary.pendingBookingsCount}
            </p>
            <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
              Requires Approval
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            🟡
          </div>
        </div>
      </div>

      {/* Occupancy Progress Bar Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Overall Hostel Occupancy Rate
          </span>
          <span className="font-black text-slate-900 text-sm">{summary.occupancyRate}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${summary.occupancyRate}%` }}
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            title={`Occupied: ${summary.occupiedBeds}`}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>{summary.occupiedBeds} Beds Occupied (🔴)</span>
          <span>{summary.availableBeds} Beds Available (🟢)</span>
          <span>{summary.pendingBeds || 0} Beds Pending (🟡)</span>
        </div>
      </div>

      {/* Pending Booking Requests Action Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Pending Booking Requests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and approve student bed allocations in real-time.
            </p>
          </div>
          <Link
            to="/owner/bookings"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
            No pending booking requests at this time. All requests are up-to-date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Room & Bed</th>
                  <th className="py-3 px-4">Move-in</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4 text-right">Decision Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {b.studentId?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{b.studentId?.name}</p>
                          <span className="text-[10px] text-slate-400">{b.studentId?.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      Room {b.roomId?.roomNumber} • <span className="text-amber-600">{b.bedId?.bedNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(b.moveInDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{b.duration} Months</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{b.monthlyRent?.toLocaleString('en-IN')}/mo
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(b._id)}
                          disabled={actionLoadingId === b._id}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
                        >
                          {actionLoadingId === b._id ? '...' : 'APPROVE'}
                        </button>
                        <button
                          onClick={() => handleReject(b._id)}
                          disabled={actionLoadingId === b._id}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-colors disabled:opacity-50"
                        >
                          REJECT
                        </button>
                      </div>
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

export default OwnerDashboard;
