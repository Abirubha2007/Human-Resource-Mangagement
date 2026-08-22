import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  CalendarOff, 
  Banknote, 
  Settings 
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const employeeLinks = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/profile', label: 'My Profile', icon: User },
  { to: '/employee/attendance', label: 'Attendance', icon: Clock },
  { to: '/employee/leaves', label: 'Leave Requests', icon: CalendarOff },
  { to: '/employee/payroll', label: 'Payroll', icon: Banknote },
  { to: '/employee/settings', label: 'Settings', icon: Settings },
];

export function EmployeeLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const currentLink = employeeLinks.find(link => currentPath.startsWith(link.to));
  const title = currentLink ? currentLink.label : 'Employee Portal';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={employeeLinks} />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
