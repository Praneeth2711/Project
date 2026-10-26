import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import OwnerLayout from './layouts/OwnerLayout';

// Public & Role Selection
import RoleSelectionPage from './pages/RoleSelectionPage';

// Auth Pages
import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import OwnerLogin from './pages/auth/OwnerLogin';
import OwnerRegister from './pages/auth/OwnerRegister';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import HostelSearchPage from './pages/student/HostelSearchPage';
import HostelDetailsPage from './pages/student/HostelDetailsPage';
import RoomBedsPage from './pages/student/RoomBedsPage';
import MyBookingsPage from './pages/student/MyBookingsPage';
import MyRoomPage from './pages/student/MyRoomPage';
import SmartRecommendationsPage from './pages/student/SmartRecommendationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerHostelPage from './pages/owner/OwnerHostelPage';
import OwnerRoomsPage from './pages/owner/OwnerRoomsPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';
import OwnerRoomChangesPage from './pages/owner/OwnerRoomChangesPage';
import OwnerReportsPage from './pages/owner/OwnerReportsPage';
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage';

// Common
import NotFoundPage from './pages/common/NotFoundPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Entry Screen: Role Selection */}
            <Route path="/" element={<RoleSelectionPage />} />

            {/* Student Auth Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />

            {/* Owner Auth Routes */}
            <Route path="/owner/login" element={<OwnerLogin />} />
            <Route path="/owner/register" element={<OwnerRegister />} />

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="hostels" element={<HostelSearchPage />} />
              <Route path="hostels/:id" element={<HostelDetailsPage />} />
              <Route path="hostels/:hostelId/rooms/:roomId" element={<RoomBedsPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              <Route path="my-room" element={<MyRoomPage />} />
              <Route path="recommendations" element={<SmartRecommendationsPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>

            {/* Owner Protected Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="hostel" element={<OwnerHostelPage />} />
              <Route path="rooms" element={<OwnerRoomsPage />} />
              <Route path="bookings" element={<OwnerBookingsPage />} />
              <Route path="room-changes" element={<OwnerRoomChangesPage />} />
              <Route path="reports" element={<OwnerReportsPage />} />
              <Route path="settings" element={<OwnerSettingsPage />} />
            </Route>

            {/* Common Status Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
