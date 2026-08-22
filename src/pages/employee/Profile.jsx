import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Shield,
  User
} from 'lucide-react';
import { PageHeader, Card, Badge } from '../../components/UI';

const EmployeeProfile = () => {
  const { user } = useAuth();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title */}
      <PageHeader
        title="My Profile"
        subtitle="Review your contracts, compensation breakdown, and personal files."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Photo and basic info */}
        <Card className="flex flex-col items-center text-center p-6 h-full justify-between">
          <div className="flex flex-col items-center w-full">
            <img 
              src={user.avatar} 
              alt={user.firstName} 
              className="w-24 h-24 rounded-full object-cover border border-charcoal-200 shadow-md mb-4"
            />
            <h3 className="text-lg font-bold font-sans text-charcoal-950">{user.firstName} {user.lastName}</h3>
            <p className="text-xs text-charcoal-400 mt-0.5 font-semibold uppercase">{user.jobTitle}</p>
            <Badge variant="green" className="mt-3">
              {user.status || 'Active'}
            </Badge>
          </div>

          <div className="w-full border-t border-charcoal-50 pt-5 mt-5 space-y-3.5 text-left text-xs font-semibold text-charcoal-700">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-charcoal-400" />
              <div>
                <p className="text-[10px] text-charcoal-400">Employee ID</p>
                <p className="text-charcoal-900 font-bold">{user.id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-charcoal-400" />
              <div>
                <p className="text-[10px] text-charcoal-400">Department</p>
                <p className="text-charcoal-900">{user.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-charcoal-400" />
              <div>
                <p className="text-[10px] text-charcoal-400">Joining Date</p>
                <p className="text-charcoal-900">{user.joiningDate}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Side sections */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section: Personal Info */}
          <Card>
            <h4 className="text-sm font-bold text-charcoal-950 font-sans pb-3 border-b border-charcoal-50 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-charcoal-450" />
              <span>Personal Information</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-charcoal-400 block mb-0.5">Email Address</span>
                <span className="text-charcoal-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-charcoal-400" />
                  {user.email}
                </span>
              </div>
              
              <div>
                <span className="text-[10px] text-charcoal-400 block mb-0.5">Phone Number</span>
                <span className="text-charcoal-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                  {user.phone || '+91 99999 88888'}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="text-[10px] text-charcoal-400 block mb-0.5">Home Address</span>
                <span className="text-charcoal-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                  {user.address || 'Dayflow Head Office, Bengaluru, India'}
                </span>
              </div>
            </div>
          </Card>

          {/* Section: Compensation details */}
          <Card>
            <h4 className="text-sm font-bold text-charcoal-950 font-sans pb-3 border-b border-charcoal-50 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-charcoal-450" />
              <span>Salary & Benefit Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              
              <div className="p-3 bg-charcoal-50/50 border border-charcoal-100 rounded-lg">
                <span className="text-[9px] text-charcoal-400 font-bold block uppercase tracking-wider">Basic Salary</span>
                <span className="text-sm font-bold text-charcoal-900 block mt-1">
                  {formatCurrency(user.salaryDetails?.basicSalary)}
                </span>
              </div>

              <div className="p-3 bg-charcoal-50/50 border border-charcoal-100 rounded-lg">
                <span className="text-[9px] text-charcoal-400 font-bold block uppercase tracking-wider">Allowances</span>
                <span className="text-sm font-bold text-green-700 block mt-1">
                  {formatCurrency(user.salaryDetails?.allowances)}
                </span>
              </div>

              <div className="p-3 bg-charcoal-50/50 border border-charcoal-100 rounded-lg">
                <span className="text-[9px] text-charcoal-400 font-bold block uppercase tracking-wider">Deductions</span>
                <span className="text-sm font-bold text-red-650 block mt-1">
                  {formatCurrency(user.salaryDetails?.deductions)}
                </span>
              </div>

              <div className="p-3 bg-charcoal-950 border border-transparent rounded-lg">
                <span className="text-[9px] text-charcoal-300 font-bold block uppercase tracking-wider">Net Payout</span>
                <span className="text-sm font-bold text-white block mt-1">
                  {formatCurrency(user.salaryDetails?.netSalary)}
                </span>
              </div>

            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default EmployeeProfile;
