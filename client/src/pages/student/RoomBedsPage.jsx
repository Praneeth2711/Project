import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import RoomLayoutMap from '../../components/common/RoomLayoutMap';
import BookingModal from '../../components/common/BookingModal';
import { ArrowLeft, Home, Building2, Bed, CheckCircle2, ShieldAlert } from 'lucide-react';

const RoomBedsPage = () => {
  const { hostelId, roomId } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [room, setRoom] = useState(null);
  const [beds, setBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const loadRoomAndBeds = async () => {
    try {
      const [hostelRes, roomRes, bedsRes] = await Promise.all([
        api.get(`/hostels/${hostelId}`),
        api.get(`/rooms/${roomId}`),
        api.get(`/beds/room/${roomId}`),
      ]);

      if (hostelRes.data.success) setHostel(hostelRes.data.data);
      if (roomRes.data.success) setRoom(roomRes.data.data);
      if (bedsRes.data.success) setBeds(bedsRes.data.data);
    } catch (err) {
      console.error('Failed to load room beds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomAndBeds();
  }, [hostelId, roomId]);

  const handleSelectBed = (bed) => {
    if (bed.status === 'available') {
      setSelectedBed(bed);
      setIsModalOpen(true);
    }
  };

  const handleBookingSuccess = (newBooking) => {
    // Reload beds so the booked bed immediately turns to PENDING!
    loadRoomAndBeds();
    setSelectedBed(null);
    setToastMessage(
      `Success! You have booked ${selectedBed?.bedNumber || 'the bed'}. Status is now Pending Approval.`
    );
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading room layout and live bed statuses...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
          <Link
            to="/student/my-bookings"
            className="px-4 py-1.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-sm hover:bg-emerald-50 transition-colors"
          >
            View in My Bookings →
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <Link to="/student/hostels" className="hover:text-indigo-600">
          Hostels
        </Link>
        <span>/</span>
        <Link to={`/student/hostels/${hostelId}`} className="hover:text-indigo-600">
          {hostel?.name || 'Hostel'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">Room {room?.roomNumber}</span>
      </nav>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to={`/student/hostels/${hostelId}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
              title="Back to Hostel Rooms"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Room {room?.roomNumber} – Visual Bed Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-10">
            {hostel?.name} • Floor {room?.floor} • {room?.roomType}
          </p>
        </div>

        {/* Selected Bed Quick Action Pill */}
        {selectedBed && (
          <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-indigo-200 shadow-sm animate-fade-in">
            <span className="text-xs font-semibold text-slate-600">
              Selected: <strong className="text-indigo-600">{selectedBed.bedNumber}</strong>
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-start gap-3 text-indigo-900 text-xs">
        <Bed className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">How Visual Bed Booking Works:</strong>
          <p className="mt-0.5 text-indigo-800 leading-relaxed">
            Click on any <strong className="text-emerald-700">🟢 Available (Green)</strong> bed card to open the booking confirmation modal. Upon booking, the bed will immediately switch to <strong className="text-amber-700">🟡 Pending Approval (Amber)</strong> until the hostel owner confirms your request.
          </p>
        </div>
      </div>

      {/* Visual Architectural Room Blueprint with Interactive Bed Cards */}
      <RoomLayoutMap
        room={room}
        beds={beds}
        selectedBed={selectedBed}
        onSelectBed={handleSelectBed}
        isOwnerView={false}
      />

      {/* Booking Modal */}
      <BookingModal
        hostel={hostel}
        room={room}
        bed={selectedBed}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default RoomBedsPage;
