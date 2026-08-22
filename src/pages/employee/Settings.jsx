import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Palette, 
  ShieldCheck, 
  Smartphone,
  Save
} from 'lucide-react';
import { PageHeader, Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const EmployeeSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Sarah',
    lastName: user?.lastName || 'Johnson',
    email: user?.email || 'employee@dayflow.com',
    phone: user?.phone || '+91 98765 43211'
  });

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotif: true,
    leaveNotif: true,
    attendanceNotif: true,
    payrollNotif: true
  });

  // Security state
  const [passwords, setPasswords] = useState({
    oldPass: '',
    newPass: '',
    confirmPass: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Appearance state
  const [theme, setTheme] = useState('light');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast("Profile details updated successfully.");
  };

  const handleSaveNotifs = () => {
    showToast("Preferences saved.");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.oldPass || !passwords.newPass || !passwords.confirmPass) {
      setPassError("All fields are required.");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setPassError("Passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 6) {
      setPassError("Password must be at least 6 characters.");
      return;
    }

    setPassError('');
    showToast("Credentials updated.");
    setPasswords({ oldPass: '', newPass: '', confirmPass: '' });
  };

  const handleSaveAppearance = () => {
    showToast(`Theme preference set to ${theme}.`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title */}
      <PageHeader
        title="Account Settings"
        subtitle="Manage personal settings, notification channels, password security, and dashboard themes."
      />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Tabs Sidebar */}
        <Card className="w-full md:w-64 p-3 shrink-0 flex flex-col gap-1 select-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'profile' ? 'bg-charcoal-950 text-white' : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-900'}`}
          >
            <User className="w-4 h-4" />
            <span>My Profile Info</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'notifications' ? 'bg-charcoal-950 text-white' : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-900'}`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'security' ? 'bg-charcoal-950 text-white' : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-900'}`}
          >
            <Lock className="w-4 h-4" />
            <span>Security Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === 'appearance' ? 'bg-charcoal-950 text-white' : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-900'}`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </button>
        </Card>

        {/* Right Active Panel */}
        <div className="flex-1 w-full">
          
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <Card className="animate-fade-in">
              <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-5">
                Personal Information
              </h4>
              
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-charcoal-50">
                  <img
                    src={user?.avatar}
                    alt={user?.firstName}
                    className="w-16 h-16 rounded-full object-cover border border-charcoal-200"
                  />
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold block font-sans">Avatar Photo</span>
                    <button
                      type="button"
                      className="text-xs font-bold text-charcoal-950 hover:underline mt-1 block"
                      onClick={() => showToast("Avatar upload simulation initiated.")}
                    >
                      Upload New Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <Button type="submit" variant="primary" icon={Save} className="self-end mt-2">
                  Save Details
                </Button>

              </form>
            </Card>
          )}

          {/* NOTIFICATIONS PANEL */}
          {activeTab === 'notifications' && (
            <Card className="animate-fade-in">
              <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-5">
                Notifications Alerts Config
              </h4>
              
              <div className="flex flex-col gap-4">
                <p className="text-xs text-charcoal-400 leading-relaxed font-semibold mb-2">
                  Configure when you receive email and push notification summaries.
                </p>

                <div className="space-y-4">
                  
                  <label className="flex items-start gap-3 p-3 bg-charcoal-50/50 rounded-lg border border-charcoal-100 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifPrefs.emailNotif}
                      onChange={(e) => setNotifPrefs(prev => ({ ...prev, emailNotif: e.target.checked }))}
                      className="rounded border-charcoal-300 text-charcoal-900 focus:ring-0 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal-805 block">Email Summaries</span>
                      <span className="text-[10px] text-charcoal-400 mt-0.5 block leading-normal">
                        Receive announcements, shift reminders, and monthly payslips processed messages.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-charcoal-50/50 rounded-lg border border-charcoal-100 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifPrefs.leaveNotif}
                      onChange={(e) => setNotifPrefs(prev => ({ ...prev, leaveNotif: e.target.checked }))}
                      className="rounded border-charcoal-300 text-charcoal-900 focus:ring-0 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal-805 block">Leave Application Updates</span>
                      <span className="text-[10px] text-charcoal-400 mt-0.5 block leading-normal">
                        Receive instant alerts when leave submissions are approved or rejected.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-charcoal-50/50 rounded-lg border border-charcoal-100 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifPrefs.payrollNotif}
                      onChange={(e) => setNotifPrefs(prev => ({ ...prev, payrollNotif: e.target.checked }))}
                      className="rounded border-charcoal-300 text-charcoal-900 focus:ring-0 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal-805 block">Payslip Ready Updates</span>
                      <span className="text-[10px] text-charcoal-400 mt-0.5 block leading-normal">
                        Receive notifications as soon as payslip breakdowns are computed and ready to download.
                      </span>
                    </div>
                  </label>

                </div>

                <Button onClick={handleSaveNotifs} variant="primary" icon={Save} className="self-end mt-2">
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* SECURITY PANEL */}
          {activeTab === 'security' && (
            <Card className="animate-fade-in">
              <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-5">
                Change Account Password
              </h4>
              
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                
                {passError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-750 rounded-lg">
                    {passError}
                  </div>
                )}

                <Input
                  label="Current Password"
                  placeholder="Enter current password"
                  type={showPass ? 'text' : 'password'}
                  value={passwords.oldPass}
                  onChange={(e) => setPasswords(prev => ({ ...prev, oldPass: e.target.value }))}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-charcoal-400 hover:text-charcoal-900 p-1"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  type={showPass ? 'text' : 'password'}
                  value={passwords.newPass}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                />

                <Input
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  type={showPass ? 'text' : 'password'}
                  value={passwords.confirmPass}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPass: e.target.value }))}
                />

                <Button type="submit" variant="primary" icon={Save} className="self-end mt-2">
                  Update Password
                </Button>

              </form>
            </Card>
          )}

          {/* APPEARANCE PANEL */}
          {activeTab === 'appearance' && (
            <Card className="animate-fade-in">
              <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-5">
                Appearance Settings
              </h4>
              
              <div className="flex flex-col gap-4 font-semibold text-xs text-charcoal-700">
                <p className="text-charcoal-450 leading-relaxed font-semibold mb-2">
                  Customize the look and theme palette of your dashboard workspace.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 hover:border-charcoal-950 transition-all ${theme === 'light' ? 'bg-charcoal-50 border-charcoal-950 text-charcoal-950 font-bold' : 'bg-white border-charcoal-200 text-charcoal-500'}`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 hover:border-charcoal-950 transition-all ${theme === 'dark' ? 'bg-charcoal-950 border-charcoal-950 text-white font-bold font-sans' : 'bg-white border-charcoal-200 text-charcoal-500'}`}
                  >
                    <Smartphone className="w-5 h-5 text-current" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 hover:border-charcoal-950 transition-all ${theme === 'system' ? 'bg-charcoal-50 border-charcoal-950 text-charcoal-950 font-bold' : 'bg-white border-charcoal-200 text-charcoal-500'}`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>System Theme</span>
                  </button>

                </div>

                <Button onClick={handleSaveAppearance} variant="primary" icon={Save} className="self-end mt-2">
                  Save Theme
                </Button>
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};

export default EmployeeSettings;
