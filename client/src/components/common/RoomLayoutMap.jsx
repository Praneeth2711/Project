import React from 'react';
import BedCard from './BedCard';
import { DoorOpen, Layers, Users } from 'lucide-react';

const RoomLayoutMap = ({
  room,
  beds = [],
  selectedBed,
  onSelectBed,
  isOwnerView = false,
  onViewOccupant,
}) => {
  if (!room) return null;

  const availableCount = beds.filter((b) => b.status === 'available').length;
  const occupiedCount = beds.filter((b) => b.status === 'occupied').length;
  const pendingCount = beds.filter((b) => b.status === 'pending').length;
  const maintenanceCount = beds.filter((b) => b.status === 'maintenance').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-card">
      {/* Room Header with Info Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Room {room.roomNumber}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {room.roomType}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Floor {room.floor}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Capacity: {room.capacity} Beds
            </span>
          </div>
        </div>

        {/* Live Status Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {availableCount} Available
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {pendingCount} Pending
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {occupiedCount} Occupied
          </div>
          {maintenanceCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              {maintenanceCount} Maint.
            </div>
          )}
        </div>
      </div>

      {/* Blueprint Visual Room Frame */}
      <div className="mt-8 relative rounded-3xl border-4 border-slate-700 bg-slate-50/50 p-6 sm:p-10 shadow-inner overflow-hidden room-blueprint-grid">
        {/* Room Entrance Door Indicator */}
        <div className="absolute top-0 left-12 -translate-y-1/2 bg-white px-3 py-1 rounded-full border-2 border-slate-700 flex items-center gap-1 text-[11px] font-bold text-slate-700 shadow-sm z-10">
          <DoorOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>DOOR / ENTRANCE</span>
        </div>

        {/* Window Indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white px-2 py-1.5 rounded-full border-2 border-slate-700 flex flex-col items-center gap-0.5 text-[9px] font-bold text-slate-500 shadow-sm z-10 rotate-90">
          <span>WINDOW</span>
        </div>

        {/* Architectural Center Marker */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-500 shadow-xs uppercase tracking-widest">
            {room.roomNumber} Floor Plan
          </span>
        </div>

        {/* Dynamic Grid Layout for Beds */}
        <div
          className={`grid gap-6 ${
            beds.length === 1
              ? 'max-w-xs mx-auto grid-cols-1'
              : beds.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto'
              : beds.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {beds.map((bed) => (
            <BedCard
              key={bed._id}
              bed={bed}
              isSelected={selectedBed?._id === bed._id}
              onSelect={onSelectBed}
              isOwnerView={isOwnerView}
              onViewOccupant={onViewOccupant}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
            <span className="font-medium">Available (Click to Book)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500"></span>
            <span className="font-medium">Approval Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500"></span>
            <span className="font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-400"></span>
            <span className="font-medium">Under Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLayoutMap;
