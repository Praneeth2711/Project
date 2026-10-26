import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AddRoomModal = ({ hostelId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    roomType: '2 Sharing',
    capacity: 2,
    monthlyRent: 6000,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoomTypeChange = (e) => {
    const selectedType = e.target.value;
    let cap = 2;
    if (selectedType === 'Single') cap = 1;
    if (selectedType === '2 Sharing') cap = 2;
    if (selectedType === '3 Sharing') cap = 3;
    if (selectedType === '4 Sharing') cap = 4;

    setFormData({
      ...formData,
      roomType: selectedType,
      capacity: cap,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/rooms', {
        hostelId,
        roomNumber: formData.roomNumber.trim(),
        floor: Number(formData.floor),
        roomType: formData.roomType,
        capacity: Number(formData.capacity),
        monthlyRent: Number(formData.monthlyRent),
      });

      if (res.data.success) {
        onSuccess && onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Add New Room</h3>
            <p className="text-indigo-200 text-xs">
              Beds will be automatically generated based on room capacity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Number
              </label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. 104 or B-201"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Floor Level
              </label>
              <input
                type="number"
                required
                min={0}
                max={20}
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Sharing Type
              </label>
              <select
                value={formData.roomType}
                onChange={handleRoomTypeChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Single">Single (1 Bed)</option>
                <option value="2 Sharing">2 Sharing (2 Beds)</option>
                <option value="3 Sharing">3 Sharing (3 Beds)</option>
                <option value="4 Sharing">4 Sharing (4 Beds)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bed Capacity
              </label>
              <input
                type="number"
                readOnly
                value={formData.capacity}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Monthly Rent per Bed (₹)
            </label>
            <input
              type="number"
              required
              min={1000}
              value={formData.monthlyRent}
              onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Auto-generation info notice */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-800">
            Will automatically generate <strong>{formData.capacity} beds</strong> (Bed 1{formData.capacity > 1 ? ` to Bed ${formData.capacity}` : ''}) marked as 🟢 Available.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Room & Beds'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
