import React from 'react';
import { CheckCircle2, Clock, XCircle, Wrench, User } from 'lucide-react';

const BedCard = ({ bed, onSelect, isSelected, isOwnerView, onViewOccupant }) => {
  const { bedNumber, status, price } = bed;

  // Status configuration mapping
  const statusConfig = {
    available: {
      color: 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pillColor: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Available',
      clickable: true,
    },
    pending: {
      color: 'border-amber-400 bg-amber-50/50 text-amber-700 cursor-not-allowed',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse-amber',
      pillColor: 'bg-amber-500',
      icon: Clock,
      label: 'Approval Pending',
      clickable: false,
    },
    occupied: {
      color: 'border-rose-400 bg-rose-50/40 text-rose-700',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      pillColor: 'bg-rose-500',
      icon: isOwnerView ? User : XCircle,
      label: 'Occupied',
      clickable: isOwnerView, // In owner view, clicking occupied opens occupant details
    },
    maintenance: {
      color: 'border-slate-300 bg-slate-100/70 text-slate-600 cursor-not-allowed',
      badgeColor: 'bg-slate-200 text-slate-700 border-slate-300',
      pillColor: 'bg-slate-400',
      icon: Wrench,
      label: 'Maintenance',
      clickable: isOwnerView,
    },
  };

  const current = statusConfig[status] || statusConfig.available;
  const StatusIcon = current.icon;

  const handleClick = () => {
    if (isOwnerView) {
      if (status === 'occupied' && onViewOccupant) {
        onViewOccupant(bed);
      } else if (onSelect) {
        onSelect(bed);
      }
    } else {
      if (status === 'available' && onSelect) {
        onSelect(bed);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group rounded-2xl border-2 p-4 transition-all duration-200 select-none ${
        current.color
      } ${
        isSelected
          ? 'ring-4 ring-indigo-500/30 border-indigo-600 scale-[1.02] shadow-lg'
          : 'shadow-sm hover:shadow-md'
      } ${current.clickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
      {/* Top bar with bed number and status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-slate-800 text-base flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${current.pillColor}`}></span>
          {bedNumber}
        </span>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${current.badgeColor}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {current.label}
        </span>
      </div>

      {/* Visual Bed Graphic Architecture */}
      <div className="my-3 flex justify-center">
        <div className="w-full max-w-[130px] h-20 bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex flex-col justify-between relative overflow-hidden group-hover:border-slate-300 transition-colors">
          {/* Pillow */}
          <div className="w-10 h-4 bg-slate-100 rounded-md border border-slate-200 self-center"></div>

          {/* Mattress sheet accent line */}
          <div className="w-full h-8 bg-slate-50/80 rounded border-dashed border border-slate-200 flex items-center justify-center">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {bedNumber}
            </span>
          </div>

          {/* Bed Footboard */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* Price & Action Info */}
      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500">Rent</span>
          <p className="font-extrabold text-slate-900 text-sm">
            ₹{price?.toLocaleString('en-IN') || '5,000'}
            <span className="text-[11px] font-normal text-slate-500">/mo</span>
          </p>
        </div>

        {status === 'available' && !isOwnerView && (
          <button
            type="button"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            Select
          </button>
        )}

        {isOwnerView && (
          <span className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 underline">
            {status === 'occupied' ? 'Occupant Details' : 'Manage'}
          </span>
        )}
      </div>
    </div>
  );
};

export default BedCard;
