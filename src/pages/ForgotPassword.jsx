import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button, Input } from '../components/UI';

const ForgotPassword = () => {
  const { signup } = useAuth(); // or authService directly
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Let's simulate a success
      setIsSent(true);
      showToast(`Recovery link sent to ${email}`);
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white border border-charcoal-100 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Banner branding */}
        <div className="bg-charcoal-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black tracking-tight">Dayflow</span>
            <span className="text-[8px] font-black text-charcoal-400 border border-charcoal-800 px-1 rounded-sm uppercase tracking-wide">HRMS</span>
          </div>
          <Link 
            to="/login"
            className="text-xs font-bold text-charcoal-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sign In
          </Link>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-charcoal-950 font-sans">Forgot Password?</h3>
                <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">
                  Enter your email address below, and we'll send you a link to reset your account password.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-750 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-bold py-2.5"
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-600 shadow-subtle mb-1">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-charcoal-900 font-sans">Check your email</h3>
              <p className="text-xs text-charcoal-400 max-w-xs leading-relaxed">
                We've sent a password reset link to <span className="font-bold text-charcoal-900">{email}</span>. Click the link in the email to set a new password.
              </p>
              
              <Link
                to="/login"
                className="mt-4 px-4 py-2 border border-charcoal-200 text-charcoal-700 font-bold text-xs rounded-lg hover:bg-charcoal-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        <div className="px-8 py-3 bg-charcoal-50 border-t border-charcoal-100 text-center text-[10px] text-charcoal-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>If you need urgent assistance, contact HR support.</span>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
