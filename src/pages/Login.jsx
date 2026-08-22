import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Database,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Button, Input } from '../components/UI';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect if already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('dayflow_token');
    const userStr = localStorage.getItem('dayflow_user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') navigate('/admin/dashboard', { replace: true });
        else navigate('/employee/dashboard', { replace: true });
      } catch (e) {
        // invalid JSON, ignore
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.firstName}!`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    setError('');
    const demoEmail = role === 'admin' ? 'admin@dayflow.com' : 'employee@dayflow.com';
    const demoPassword = role === 'admin' ? 'admin123' : 'employee123';
    
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const user = await login(demoEmail, demoPassword);
      showToast(`Logged in as ${user.firstName} (${role === 'admin' ? 'HR Admin' : 'Employee'})`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row select-none">
      
      {/* LEFT SIDE — BRAND EXPERIENCE */}
      <div className="hidden md:flex md:w-1/2 bg-charcoal-950 text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        {/* Subtle grid lines or pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-charcoal-900 via-charcoal-950 to-black opacity-80" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Logo & Tagline header */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight font-sans text-white">Dayflow</span>
              <span className="text-[10px] font-black text-charcoal-400 border border-charcoal-800 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">HRMS</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mt-10 max-w-sm font-sans">
              Every workday,<br />perfectly aligned.
            </h2>
            <p className="text-xs text-charcoal-400 mt-4 leading-relaxed max-w-md font-medium">
              Manage employees, attendance, leave, payroll and workplace operations — all in one clean, integrated dashboard.
            </p>
          </div>

          {/* Subtle Monochrome Dashboard Mockup Preview */}
          <div className="my-8 border border-charcoal-800 bg-charcoal-900/40 rounded-xl p-5 backdrop-blur-[2px]">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800 text-[10px] text-charcoal-500 font-bold uppercase tracking-wider">
              <span>Dayflow Dashboard Preview</span>
              <span className="w-2.5 h-2.5 bg-charcoal-600 rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 text-left">
              <div className="bg-charcoal-950/50 border border-charcoal-850 p-2.5 rounded-lg">
                <span className="text-[10px] text-charcoal-400 font-semibold">Active Staff</span>
                <p className="text-lg font-bold mt-1 text-white">128</p>
              </div>
              <div className="bg-charcoal-950/50 border border-charcoal-850 p-2.5 rounded-lg">
                <span className="text-[10px] text-charcoal-400 font-semibold">Attendance</span>
                <p className="text-lg font-bold mt-1 text-white">96%</p>
              </div>
              <div className="bg-charcoal-950/50 border border-charcoal-850 p-2.5 rounded-lg">
                <span className="text-[10px] text-charcoal-400 font-semibold">Payroll processed</span>
                <p className="text-[10px] font-bold mt-1.5 text-green-400 bg-green-950/30 px-1.5 py-0.5 rounded border border-green-900 w-fit">Aug Ready</p>
              </div>
            </div>
            
            {/* Minimal mockup chart lines */}
            <div className="mt-4 flex items-end gap-1 h-12 justify-around">
              <div className="w-full bg-charcoal-800 h-1/3 rounded-sm" />
              <div className="w-full bg-charcoal-700 h-2/3 rounded-sm" />
              <div className="w-full bg-charcoal-800 h-1/2 rounded-sm" />
              <div className="w-full bg-charcoal-600 h-4/5 rounded-sm" />
              <div className="w-full bg-charcoal-500 h-full rounded-sm" />
            </div>
          </div>

          {/* Three monochrome feature markers */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-charcoal-900">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-charcoal-400" />
                <span>Secure</span>
              </div>
              <p className="text-[10px] text-charcoal-400 mt-1">Workforce data stays protected.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-charcoal-400" />
                <span>Reliable</span>
              </div>
              <p className="text-[10px] text-charcoal-400 mt-1">Built for modern teams.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Database className="w-4 h-4 text-charcoal-400" />
                <span>Insightful</span>
              </div>
              <p className="text-[10px] text-charcoal-400 mt-1">Workforce stats at a glance.</p>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE — AUTHENTICATION CARD */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 bg-white relative">
        
        {/* Mobile Logo Header */}
        <div className="absolute top-6 left-6 md:hidden flex items-baseline gap-1">
          <span className="text-xl font-extrabold tracking-tight font-sans text-charcoal-950">Dayflow</span>
          <span className="text-[8px] font-black text-charcoal-400 border border-charcoal-200 px-1 rounded-sm uppercase">HRMS</span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 w-10 h-10 bg-charcoal-50 rounded-xl border border-charcoal-150 flex items-center justify-center text-charcoal-900 shadow-subtle mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-sans text-charcoal-950 tracking-tight">Welcome back!</h3>
            <p className="text-xs text-charcoal-400 mt-1">Sign in to your account to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-750">
                {error}
              </div>
            )}

            <Input
              label="Email address"
              placeholder="Enter your email address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-charcoal-400 hover:text-charcoal-800 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs font-semibold mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-charcoal-350 text-charcoal-950 focus:ring-charcoal-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 transition-all" 
                />
                <span className="text-charcoal-500">Remember me</span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-charcoal-950 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-bold py-2.5 active:scale-[0.98]"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Accounts Panel */}
          <div className="p-4 bg-charcoal-50 rounded-xl border border-charcoal-100 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
              <UserCheck className="w-4 h-4" />
              <span>Demo Login Accounts</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex flex-col items-center justify-center p-2 border border-charcoal-200 bg-white rounded-lg hover:border-charcoal-900 transition-all font-medium"
              >
                <span className="font-bold text-charcoal-900">Admin Account</span>
                <span className="text-[10px] text-charcoal-400 mt-0.5">HR Manager</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('employee')}
                className="flex flex-col items-center justify-center p-2 border border-charcoal-200 bg-white rounded-lg hover:border-charcoal-900 transition-all font-medium"
              >
                <span className="font-bold text-charcoal-900">Employee Account</span>
                <span className="text-[10px] text-charcoal-400 mt-0.5">Sarah (Engineer)</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs">
            <span className="text-charcoal-400">Don't have an account? </span>
            <Link to="/signup" className="font-bold text-charcoal-950 hover:underline inline-flex items-center gap-1">
              Create account <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="text-center text-[10px] text-charcoal-400 pt-4 border-t border-charcoal-50 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Your data is protected with enterprise-grade security.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
