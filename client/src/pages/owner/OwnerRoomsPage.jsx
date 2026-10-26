import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AddRoomModal from '../../components/owner/AddRoomModal';
import RoomLayoutMap from '../../components/common/RoomLayoutMap';
import OccupantModal from '../../components/common/OccupantModal';
import {
  Grid,
  Plus,
  Layers,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Bed,
  Eye,
  X,
} from 'lucide-react';

const OwnerRoomsPage = () => {
  const [hostel, setHostel] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectRoom, setInspectRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isOccupantModalOpen, setIsOccupantModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchRoomsAndMatrix = async () => {
    try {
      const myHostelsRes = await api.get('/hostels/owner/my');
      if (myHostelsRes.data.success && myHostelsRes.data.data.length > 0) {
        const h = myHostelsRes.data.data[0];
        setHostel(h);

        const matrixRes = await api.get(`/beds/hostel/${h._id}/matrix`);
        if (matrixRes.data.success) {
          setFloors(matrixRes.data.data.floors);
          // If a room was being inspected, keep it refreshed
          if (inspectRoom) {
            for (const floor of matrixRes.data.data.floors) {
              const matched = floor.rooms.find((r) => r._id === inspectRoom._id);
              if (matched) setInspectRoom(matched);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load room matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndMatrix();
  }, []);

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}? This cannot be undone.`))
      return;

    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        setToastMessage(`Room ${roomNumber} deleted successfully.`);
        if (inspectRoom?._id === roomId) setInspectRoom(null);
        fetchRoomsAndMatrix();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete room.');
    }
  };

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setIsOccupantModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading room and bed layouts...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-md">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rooms & Visual Bed Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {hostel?.name} • Configure rooms, review visual bed statuses, and vacate beds.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Inspection Modal / View if a room is being inspected */}
      {inspectRoom && (
        <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Detailed Inspection View
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Room {inspectRoom.roomNumber} ({inspectRoom.roomType})
              </h2>
            </div>
            <button
              onClick={() => setInspectRoom(null)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <RoomLayoutMap
            room={inspectRoom}
            beds={inspectRoom.beds}
            selectedBed={selectedBed}
            onSelectBed={handleBedClick}
            isOwnerView={true}
            onViewOccupant={handleBedClick}
          />
        </div>
      )}

      {/* Floor by Floor Layout View */}
      {floors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3 shadow-card">
          <Grid className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-slate-900 text-lg">No Rooms Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by adding your first room. Bed capacities will be automatically initialized!
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
          >
            Add First Room
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {floors.map((floor) => (
            <div
              key={floor.floorNumber}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                    {floor.floorNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      Floor {floor.floorNumber}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {floor.rooms.length} Rooms Configured
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="text-emerald-600">
                    🟢 {floor.rooms.reduce((acc, r) => acc + r.availableBeds, 0)} Available
                  </span>
                  <span className="text-rose-600">
                    🔴 {floor.rooms.reduce((acc, r) => acc + r.occupiedBeds, 0)} Occupied
                  </span>
                </div>
              </div>

              {/* Room Cards Grid for this Floor */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {floor.rooms.map((room) => (
                  <div
                    key={room._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">
                          Room {room.roomNumber}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          {room.roomType} • ₹{room.monthlyRent?.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section 18 visual bed indicator representation */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Live Bed States
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {room.beds.map((b) => (
                          <button
                            key={b._id}
                            type="button"
                            onClick={() => handleBedClick(b)}
                            className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 ${
                              b.status === 'available'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : b.status === 'pending'
                                ? 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse'
                                : b.status === 'occupied'
                                ? 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-slate-200 border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="block text-[10px] font-bold truncate">
                              {b.bedNumber}
                            </span>
                            <span className="block text-xs mt-0.5">
                              {b.status === 'available'
                                ? '🟢'
                                : b.status === 'pending'
                                ? '🟡'
                                : b.status === 'occupied'
                                ? '🔴'
                                : '⚪'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {room.availableBeds} / {room.totalBeds} Beds Free
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectRoom(room)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Room Blueprint</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      <AddRoomModal
        hostelId={hostel?._id}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setToastMessage('New room and beds successfully configured!');
          fetchRoomsAndMatrix();
        }}
      />

      {/* Occupant / Bed Management Modal */}
      <OccupantModal
        bed={selectedBed}
        isOpen={isOccupantModalOpen}
        onClose={() => {
          setIsOccupantModalOpen(false);
          setSelectedBed(null);
        }}
        onRefresh={fetchRoomsAndMatrix}
      />
    </div>
  );
};

export default OwnerRoomsPage;
