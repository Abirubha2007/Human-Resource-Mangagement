import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Employees from '../pages/admin/Employees';
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import AdminAttendance from '../pages/admin/Attendance';
import AdminLeaves from '../pages/admin/LeaveManagement';
import AdminPayroll from '../pages/admin/Payroll';
import AdminDepartments from '../pages/admin/Departments';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeAttendance from '../pages/employee/Attendance';
import EmployeeLeaves from '../pages/employee/LeaveRequests';
import EmployeePayroll from '../pages/employee/Payroll';
import EmployeeSettings from '../pages/employee/Settings';

// Helper Guard: Must be Logged In
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-charcoal-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-charcoal-300 border-t-charcoal-900" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Helper Guard: Must have correct Role
const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-charcoal-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-charcoal-300 border-t-charcoal-900" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized Page
const Unauthorized = () => {
  const { user } = useAuth();
  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <h1 className="text-6xl font-black text-charcoal-200">403</h1>
      <h2 className="text-xl font-bold text-charcoal-800 mt-4 font-sans">Access Denied</h2>
      <p className="text-xs text-charcoal-400 max-w-xs mt-2 leading-relaxed">
        You do not have permission to access this page. Please contact your HR administrator.
      </p>
      <a 
        href={dashboardLink}
        className="mt-6 px-4 py-2 bg-charcoal-950 text-white rounded-lg text-xs font-semibold hover:bg-charcoal-800 transition-colors shadow-subtle"
      >
        Back to Dashboard
      </a>
    </div>
  );
};

// 404 Page
const NotFound = () => {
  const { user } = useAuth();
  const homeLink = user ? (user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard') : '/login';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <h1 className="text-6xl font-black text-charcoal-200">404</h1>
      <h2 className="text-xl font-bold text-charcoal-800 mt-4 font-sans">Page Not Found</h2>
      <p className="text-xs text-charcoal-400 max-w-xs mt-2 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <a 
        href={homeLink}
        className="mt-6 px-4 py-2 bg-charcoal-950 text-white rounded-lg text-xs font-semibold hover:bg-charcoal-800 transition-colors shadow-subtle"
      >
        Go Home
      </a>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Pages (Protected + Admin Role) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="leaves" element={<AdminLeaves />} />
        <Route path="payroll" element={<AdminPayroll />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Employee Pages (Protected + Employee Role) */}
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['employee']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="leave" element={<EmployeeLeaves />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      {/* Utility Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
