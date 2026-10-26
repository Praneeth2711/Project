import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Building2,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Star,
  Image,
} from 'lucide-react';

const OwnerHostelPage = () => {
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newFacility, setNewFacility] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    gender: 'Co-ed',
    monthlyRent: 6000,
    facilities: [],
    images: [],
  });

  const fetchHostel = async () => {
    try {
      const res = await api.get('/hostels/owner/my');
      if (res.data.success && res.data.data.length > 0) {
        const h = res.data.data[0];
        setHostel(h);
        setFormData({
          name: h.name,
          description: h.description,
          address: h.address,
          city: h.city,
          gender: h.gender || 'Co-ed',
          monthlyRent: h.monthlyRent,
          facilities: h.facilities || [],
          images: h.images || [],
        });
      }
    } catch (err) {
      console.error('Failed to load owner hostel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      });
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (fac) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((f) => f !== fac),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (hostel) {
        const res = await api.put(`/hostels/${hostel._id}`, formData);
        if (res.data.success) {
          setMessage('Hostel details updated successfully!');
          setHostel(res.data.data);
        }
      } else {
        const res = await api.post('/hostels', formData);
        if (res.data.success) {
          setMessage('Hostel created successfully!');
          setHostel(res.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hostel.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading hostel profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hostel Profile & Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update your hostel address, facilities, monthly pricing, and amenities visible to students.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hostel Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hostel Gender Category
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Co-ed">Co-ed (All Students)</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hostel Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight proximity to colleges, Wi-Fi speed, food quality..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Street Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Starting Monthly Rent (₹/month)
            </label>
            <input
              type="number"
              name="monthlyRent"
              required
              min={1000}
              value={formData.monthlyRent}
              onChange={handleChange}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Facilities */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hostel Facilities & Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((fac) => (
                <span
                  key={fac}
                  className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{fac}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(fac)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="e.g. RO Drinking Water"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 hover:bg-indigo-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Hostel Information'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerHostelPage;
