import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Check,
  Briefcase
} from 'lucide-react';
import { Breadcrumb } from '../components/UI';
import { demoNotifications } from '../data/notifications';
import { useToast } from '../context/ToastContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifs, setNotifs] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Load notifications from local storage if available
    const stored = localStorage.getItem('dayflow_notifications');
    if (stored) {
      setNotifs(JSON.parse(stored));
    } else {
      localStorage.setItem('dayflow_notifications', JSON.stringify(demoNotifications));
      setNotifs(demoNotifications);
    }
  }, []);

  // Dropdown close listeners
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully.");
    navigate('/login');
  };

  const markAllRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem('dayflow_notifications', JSON.stringify(updated));
    showToast("All notifications marked as read.");
  };

  const handleNotifClick = (id) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem('dayflow_notifications', JSON.stringify(updated));
  };

  // Generate dynamic breadcrumbs based on route path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs = paths.map((path, idx) => {
      const isLast = idx === paths.length - 1;
      const href = '/' + paths.slice(0, idx + 1).join('/');
      const label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      return { label, href, active: isLast };
    });
    return crumbs;
  };

  // Filter notifications based on role
  const userNotifications = notifs.filter(n => 
    n.role === 'all' || 
    n.role === user?.role || 
    (n.role === 'employee' && n.employeeId === user?.id)
  );
  
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-charcoal-100 shadow-subtle select-none">
      
      {/* Page Title & Breadcrumbs / Hamburger */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger toggle */}
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-charcoal-50 md:hidden shrink-0 transition-colors"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumb items={generateBreadcrumbs()} />
        </div>
      </div>

      {/* Header operations area */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar mockup */}
        <div className="relative hidden lg:flex items-center w-60">
          <Search className="absolute left-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full text-xs bg-charcoal-50 border border-charcoal-200 rounded-lg pl-9 pr-3 py-2 transition-all focus:outline-none focus:bg-white focus:border-charcoal-950 focus:ring-1 focus:ring-charcoal-950 placeholder:text-charcoal-400"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-charcoal-50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-charcoal-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in" style={{ animationDuration: '0.15s' }}>
              <div className="flex items-center justify-between px-4 py-3 bg-charcoal-50 border-b border-charcoal-100">
                <span className="text-xs font-bold text-charcoal-900 font-sans">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] text-charcoal-900 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-charcoal-50">
                {userNotifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-charcoal-400">
                    No new alerts.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotifClick(notif.id)}
                      className={`p-3 text-xs leading-relaxed transition-colors cursor-pointer ${notif.read ? 'hover:bg-charcoal-50/50' : 'bg-charcoal-50/30 hover:bg-charcoal-50 font-medium'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-charcoal-800">{notif.title}</span>
                        <span className="text-[9px] text-charcoal-400 shrink-0 font-medium">{notif.time}</span>
                      </div>
                      <p className="text-charcoal-500 mt-0.5 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-charcoal-100 hidden sm:block" />

        {/* User Account Menu */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-charcoal-50 transition-colors"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"} 
              alt={user?.firstName} 
              className="w-8 h-8 rounded-full object-cover border border-charcoal-200" 
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-charcoal-900 font-sans truncate">
                {user?.firstName}
              </p>
              <p className="text-[9px] text-charcoal-400 font-semibold tracking-wide uppercase">
                {user?.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-charcoal-100 rounded-xl shadow-2xl py-1 overflow-hidden animate-fade-in" style={{ animationDuration: '0.15s' }}>
              <div className="px-4 py-2 border-b border-charcoal-50 text-xs">
                <p className="font-bold text-charcoal-900 font-sans">{user?.firstName} {user?.lastName}</p>
                <p className="text-charcoal-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <Link 
                to={user?.role === 'admin' ? "/admin/settings" : "/employee/profile"}
                onClick={() => setShowProfileDropdown(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950 font-medium"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </Link>
              
              <Link 
                to={user?.role === 'admin' ? "/admin/settings" : "/employee/settings"}
                onClick={() => setShowProfileDropdown(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950 font-medium"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </Link>

              <div className="h-px bg-charcoal-100 my-1" />

              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-650 hover:bg-red-50 font-semibold text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
