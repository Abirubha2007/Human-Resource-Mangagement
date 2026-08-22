import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  CalendarDays, 
  CreditCard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully.");
      navigate('/login');
    } catch (e) {
      showToast("Logout failed.", "error");
    }
  };

  // Define navigation lists
  const adminLinks = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Employees", to: "/admin/employees", icon: Users },
    { label: "Attendance", to: "/admin/attendance", icon: CalendarClock },
    { label: "Leave Management", to: "/admin/leaves", icon: CalendarDays },
    { label: "Payroll", to: "/admin/payroll", icon: CreditCard },
    { label: "Departments", to: "/admin/departments", icon: Briefcase },
    { label: "Reports", to: "/admin/reports", icon: BarChart3 },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  const employeeLinks = [
    { label: "Dashboard", to: "/employee/dashboard", icon: LayoutDashboard },
    { label: "My Profile", to: "/employee/profile", icon: User },
    { label: "Attendance", to: "/employee/attendance", icon: CalendarClock },
    { label: "Leave Requests", to: "/employee/leave", icon: CalendarDays },
    { label: "Payroll", to: "/employee/payroll", icon: CreditCard },
    { label: "Settings", to: "/employee/settings", icon: Settings },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-charcoal-100 shadow-subtle select-none">
      {/* Brand logo area */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold font-sans tracking-tight text-charcoal-950">Dayflow</span>
            <span className="text-[9px] font-black text-charcoal-400 border border-charcoal-200 px-1 rounded-sm uppercase tracking-wide">HRMS</span>
          </div>
          <span className="text-[10px] text-charcoal-400 mt-0.5 tracking-tight font-medium">Every workday, perfectly aligned.</span>
        </div>
        
        {/* Mobile close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-950 hover:bg-charcoal-50 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose} // close mobile drawer
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive 
                  ? 'bg-charcoal-950 text-white shadow-subtle' 
                  : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-950'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile summary + Logout */}
      <div className="p-4 border-t border-charcoal-50 bg-charcoal-50/20">
        <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
          <div className="relative shrink-0">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"} 
              alt={user?.firstName} 
              className="w-9 h-9 rounded-full object-cover border border-charcoal-200" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-charcoal-900 truncate font-sans">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-charcoal-400 capitalize truncate font-semibold">
              {user?.role === 'admin' ? 'HR Manager' : user?.jobTitle || 'Employee'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-charcoal-200 rounded-lg text-charcoal-700 hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-charcoal-950/40 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transition-transform duration-300 transform md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
