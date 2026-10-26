import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Bed,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
} from 'lucide-react';

const OwnerReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/owner');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load owner reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Generating analytics reports and charts...
      </div>
    );
  }

  const { summary, roomOccupancy, bookingDistribution, bedDistribution } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hostel Occupancy & Analytics Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on room utilization, bed status distribution, and estimated monthly revenues.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Occupancy Rate
          </span>
          <p className="text-3xl font-black text-slate-900 mt-1">{summary?.occupancyRate}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {summary?.occupiedBeds} of {summary?.totalBeds} Beds Occupied
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Estimated Monthly Revenue
          </span>
          <p className="text-3xl font-black text-slate-900 mt-1">
            ₹{summary?.monthlyRevenue?.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            From Active Student Allocations
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Capacity
          </span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{summary?.availableBeds}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Beds Ready for Allocation (🟢)
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pending Approval Queue
          </span>
          <p className="text-3xl font-black text-amber-500 mt-1">
            {summary?.pendingBookingsCount}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Awaiting Owner Action (🟡)
          </span>
        </div>
      </div>

      {/* Main Chart 1: Room-wise Occupancy (Recharts BarChart) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Room-wise Bed Occupancy Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Comparison between occupied beds and available beds for each room.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {roomOccupancy?.length || 0} Rooms Analyzed
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roomOccupancy}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="roomNumber" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '1rem',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="occupied" name="Occupied Beds (🔴)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="available" name="Available Beds (🟢)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Distribution Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bed Status Distribution PieChart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Bed Status Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Total bed split across available, occupied, pending, and maintenance.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bedDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bedDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '1rem',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Requests Status Distribution PieChart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Booking Requests Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Breakdown of approved, pending, and rejected student requests.
            </p>
          </div>

          <div className="h-64 w-full">
            {bookingDistribution?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No booking history to display.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '1rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerReportsPage;
