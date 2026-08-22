import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarOff, 
  Banknote, 
  Building2, 
  PieChart, 
  Settings 
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/attendance', label: 'Attendance', icon: Clock },
  { to: '/admin/leaves', label: 'Leave Management', icon: CalendarOff },
  { to: '/admin/payroll', label: 'Payroll', icon: Banknote },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/reports', label: 'Reports', icon: PieChart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find title based on current path
  const currentLink = adminLinks.find(link => currentPath.startsWith(link.to));
  const title = currentLink ? currentLink.label : 'Admin Portal';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={adminLinks} />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
