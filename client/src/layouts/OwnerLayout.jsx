import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerHeader from '../components/owner/OwnerHeader';
import api from '../services/api';

const OwnerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const location = useLocation();

  // Load counts for notification badges on the sidebar
  const loadCounts = async () => {
    try {
      const [bookingsRes, changesRes] = await Promise.all([
        api.get('/bookings/owner?status=pending'),
        api.get('/room-changes/owner'),
      ]);

      if (bookingsRes.data.success) {
        setPendingBookingsCount(bookingsRes.data.count);
      }
      if (changesRes.data.success) {
        const pending = changesRes.data.data.filter((r) => r.status === 'pending');
        setPendingChangesCount(pending.length);
      }
    } catch (err) {
      console.error('Failed to load pending counts:', err);
    }
  };

  useEffect(() => {
    loadCounts();
    const interval = setInterval(loadCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  // Title mapping
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === '/owner/dashboard') {
      return { title: 'Dashboard Overview', subtitle: 'Live hostel occupancy and metrics' };
    }
    if (path === '/owner/hostel') {
      return { title: 'Hostel Profile & Information', subtitle: 'Manage hostel facilities and details' };
    }
    if (path === '/owner/rooms') {
      return { title: 'Rooms & Bed Grid Layout', subtitle: 'Configure rooms, floors, and bed statuses' };
    }
    if (path === '/owner/bookings') {
      return { title: 'Booking Requests Queue', subtitle: 'Review and approve student bed allocations' };
    }
    if (path === '/owner/room-changes') {
      return { title: 'Room Change Requests', subtitle: 'Process student room swap and reallocation requests' };
    }
    if (path === '/owner/reports') {
      return { title: 'Analytics & Occupancy Reports', subtitle: 'Room occupancy and booking status charts' };
    }
    if (path === '/owner/settings') {
      return { title: 'Account Settings', subtitle: 'Manage contact and account information' };
    }
    return { title: 'Hostel Owner Portal', subtitle: '' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <OwnerSidebar
          pendingBookingsCount={pendingBookingsCount}
          pendingChangesCount={pendingChangesCount}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col z-10">
            <OwnerSidebar
              pendingBookingsCount={pendingBookingsCount}
              pendingChangesCount={pendingChangesCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <OwnerHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshSidebarCounts: loadCounts }} />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
