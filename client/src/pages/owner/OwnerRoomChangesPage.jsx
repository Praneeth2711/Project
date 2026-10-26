import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Phone,
  Bed,
  Check,
  X,
} from 'lucide-react';

const OwnerRoomChangesPage = () => {
  const { refreshSidebarCounts } = useOutletContext() || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/room-changes/owner');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load room changes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id, studentName) => {
    setActionLoadingId(id);
    setToastMessage('');
    try {
      const res = await api.put(`/room-changes/${id}/approve`);
      if (res.data.success) {
        setToastMessage(`Room change approved for ${studentName}! Old bed is now Available (🟢) and new bed is Occupied (🔴).`);
        fetchRequests();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve room change.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id, studentName) => {
    const reason = window.prompt(
      `Enter rejection reason for ${studentName}'s room change request:`,
      'Requested room currently at full capacity.'
    );
    if (reason === null) return;

    setActionLoadingId(id);
    setToastMessage('');
    try {
      const res = await api.put(`/room-changes/${id}/reject`, { rejectionReason: reason });
      if (res.data.success) {
        setToastMessage(`Room change request rejected for ${studentName}.`);
        fetchRequests();
        refreshSidebarCounts && refreshSidebarCounts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject room change.');
    } finally {
      setActionLoadingId(null);
    }
  };

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Room Change Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Students can request reassignment to different rooms or floors. Approving automatically swaps old and new bed allocations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading room change requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <GitPullRequest className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">No Room Change Requests</h3>
            <p className="text-xs text-slate-500">
              There are no pending room swap or reallocation requests from students.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-4 max-w-2xl">
                  {/* Student & Status */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                      {req.studentId?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {req.studentId?.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{req.studentId?.phone}</span>
                        <span>•</span>
                        <span>{req.studentId?.email}</span>
                      </p>
                    </div>
                    <span
                      className={`ml-auto lg:ml-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
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

                  {/* Room Swap Graphic */}
                  <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="p-2 px-3 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Current Bed
                      </span>
                      Room {req.currentRoomId?.roomNumber} ({req.currentBedId?.bedNumber})
                    </div>

                    <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />

                    <div className="p-2 px-3 rounded-xl bg-indigo-50 border border-indigo-200 font-bold text-indigo-900">
                      <span className="text-[10px] text-indigo-500 block uppercase font-bold">
                        Requested Room
                      </span>
                      Room {req.requestedRoomId?.roomNumber} ({req.requestedRoomId?.roomType})
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60">
                    <strong className="text-slate-900">Reason:</strong> {req.reason}
                    {req.additionalMessage && (
                      <p className="text-slate-500 mt-1 italic">
                        "{req.additionalMessage}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(req._id, req.studentId?.name)}
                        disabled={actionLoadingId === req._id}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{actionLoadingId === req._id ? 'Processing...' : 'Approve Change'}</span>
                      </button>
                      <button
                        onClick={() => handleReject(req._id, req.studentId?.name)}
                        disabled={actionLoadingId === req._id}
                        className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Decision Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerRoomChangesPage;
