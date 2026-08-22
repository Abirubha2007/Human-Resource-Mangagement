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
  Briefcase,
  User,
  Hash,
  ArrowLeft
} from 'lucide-react';
import { Button, Input, Select } from '../components/UI';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form Fields
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength checker
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'bg-transparent' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500 w-1/3' };
    if (score <= 3) return { label: 'Medium', color: 'bg-amber-500 w-2/3' };
    return { label: 'Strong', color: 'bg-green-500 w-full' };
  };

  const strength = calculatePasswordStrength(password);

  const validateForm = () => {
    const tempErrors = {};
    if (!employeeId) tempErrors.employeeId = "Employee ID is required (e.g. EMP-2026-025).";
    if (!firstName) tempErrors.firstName = "First name is required.";
    if (!lastName) tempErrors.lastName = "Last name is required.";
    if (!email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    
    if (!password) {
      tempErrors.password = "Password is required.";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup({
        employeeId,
        firstName,
        lastName,
        email,
        password,
        role
      });
      showToast("Account created successfully! You can login now.");
      navigate('/login');
    } catch (err) {
      showToast(err.message || "Failed to create account.", "error");
      setErrors(prev => ({ ...prev, api: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white border border-charcoal-100 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in">
        
        {/* Head branding banner */}
        <div className="bg-charcoal-950 text-white px-8 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tight">Dayflow</span>
              <span className="text-[8px] font-black text-charcoal-400 border border-charcoal-800 px-1 rounded-sm uppercase tracking-wide">HRMS</span>
            </div>
            <h2 className="text-sm font-bold text-charcoal-300 mt-1">Create your Dayflow Account</h2>
          </div>
          <Link 
            to="/login"
            className="text-xs font-bold text-charcoal-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
          
          {errors.api && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-750">
              {errors.api}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Input
              label="Employee ID"
              placeholder="e.g. EMP-2026-015"
              icon={Hash}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              error={errors.employeeId}
              disabled={isLoading}
            />

            <Select
              label="Account Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              options={[
                { value: 'employee', label: 'Employee / Standard Staff' },
                { value: 'admin', label: 'HR Administrator' }
              ]}
            />
            
            <Input
              label="First Name"
              placeholder="First name"
              icon={User}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              disabled={isLoading}
            />

            <Input
              label="Last Name"
              placeholder="Last name"
              icon={User}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              disabled={isLoading}
            />

          </div>

          <Input
            label="Email Address"
            placeholder="Enter your company email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <Input
                label="Password"
                placeholder="Choose password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
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
              {/* Strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="h-1 bg-charcoal-100 rounded-full overflow-hidden w-full">
                    <div className={`h-full transition-all duration-300 ${strength.color}`} />
                  </div>
                  <span className="text-[10px] text-charcoal-400 font-semibold mt-1 block">
                    Password Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-4 font-bold py-2.5"
          >
            Create Account
          </Button>

          <div className="text-center text-xs mt-2">
            <span className="text-charcoal-400">Already have an account? </span>
            <Link to="/login" className="font-bold text-charcoal-950 hover:underline">
              Sign in
            </Link>
          </div>

        </form>

        <div className="px-8 py-3 bg-charcoal-50 border-t border-charcoal-100 text-center text-[10px] text-charcoal-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>By signing up, you agree to comply with organizational policies.</span>
        </div>

      </div>
    </div>
  );
};

export default Signup;
