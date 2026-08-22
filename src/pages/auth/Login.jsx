import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Use demo accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    setEmail(role === 'admin' ? 'admin@dayflow.com' : 'employee@dayflow.com');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Side - Brand Experience */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-between p-12 border-r border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Dayflow</span>
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 rounded-full text-gray-700 ml-1">HRMS</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Every workday,<br />perfectly aligned.
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-md">
            Manage employees, attendance, leave, payroll and workplace operations — all in one place.
          </p>

          {/* Visual Preview */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 max-w-md mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
              <div className="h-8 w-8 bg-gray-50 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-12 bg-gray-300 rounded"></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-gray-50 to-transparent rounded-lg border border-gray-100 flex items-end justify-around px-4 pb-2 gap-2">
              <div className="w-full bg-gray-200 rounded-t h-1/3"></div>
              <div className="w-full bg-gray-300 rounded-t h-2/3"></div>
              <div className="w-full bg-gray-200 rounded-t h-1/2"></div>
              <div className="w-full bg-gray-800 rounded-t h-full"></div>
              <div className="w-full bg-gray-300 rounded-t h-3/4"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <ShieldCheck className="w-6 h-6 text-gray-900 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
            <p className="text-sm text-gray-500">Your workforce data stays protected.</p>
          </div>
          <div>
            <Zap className="w-6 h-6 text-gray-900 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Reliable</h3>
            <p className="text-sm text-gray-500">Built for modern teams.</p>
          </div>
          <div>
            <BarChart3 className="w-6 h-6 text-gray-900 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Insightful</h3>
            <p className="text-sm text-gray-500">Make better workforce decisions.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Dayflow</span>
          </div>

          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome back!</h2>
            <p className="text-gray-500">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-shadow outline-none placeholder:text-gray-400"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-shadow outline-none placeholder:text-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded cursor-pointer accent-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-gray-900 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-gray-900 hover:underline">
              Create account &rarr;
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500 mb-4">
              Your data is protected with enterprise-grade security.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => handleDemoLogin('admin')}
                className="text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
              >
                Demo Admin
              </button>
              <button 
                onClick={() => handleDemoLogin('employee')}
                className="text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
              >
                Demo Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
