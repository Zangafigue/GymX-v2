import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/ConfirmDialog';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/Users';
import ManageLocations from './pages/admin/Locations';
import ManageClasses from './pages/admin/Classes';
import AdminSettings from './pages/admin/Settings';
import AdminAnalytics from './pages/admin/Analytics';
import AdminTrainers from './pages/admin/Trainers';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberBookings from './pages/member/Bookings';
import MemberSettings from './pages/member/Settings';

// Shared Pages
import Profile from './pages/shared/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <ConfirmProvider>
              <Router>
                <Routes>
                  {/* Public Website Routes (with Navbar & Footer) */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>

                  {/* Internal Dashboard Routes (with Sidebar & Header) */}
                  {/* Members */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<MemberDashboard />} />
                    <Route path="bookings" element={<MemberBookings />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<MemberSettings />} />
                  </Route>

                  {/* Admins */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="trainers" element={<AdminTrainers />} />
                    <Route path="locations" element={<ManageLocations />} />
                    <Route path="classes" element={<ManageClasses />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* Catch-all Redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ConfirmProvider>
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
