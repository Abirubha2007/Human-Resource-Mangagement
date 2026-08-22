import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CircleDollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  Plus
} from 'lucide-react';
import { PageHeader, Card, StatCard, Badge, Button, Input, Select } from '../../components/UI';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // States
  const [attendance, setAttendance] = useState({
    checkIn: "",
    checkOut: "",
    workingHours: "0 hrs",
    status: "Absent"
  });

  const [balances, setBalances] = useState({
    annualLeave: { total: 18, used: 0, remaining: 18 },
    sickLeave: { total: 12, used: 0, remaining: 12 },
    unpaidLeave: { total: 10, used: 0, remaining: 10 }
  });

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Leave Form state
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [leaveFields, setLeaveFields] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveErrors, setLeaveErrors] = useState({});
  const [isApplying, setIsApplying] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Get today's attendance status
      const attStatus = await attendanceService.getCurrentStatus(user.id);
      setAttendance(attStatus);

      // Get leave balances
      const bal = await leaveService.getBalance(user.id);
      setBalances(bal);

      // Get leave requests history
      const reqs = await leaveService.getByEmployeeId(user.id);
      setRecentLeaves(reqs.slice(0, 4));
    } catch (err) {
      showToast("Could not sync dashboard data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const rec = await attendanceService.checkIn(user.id, `${user.firstName} ${user.lastName}`);
      setAttendance(rec);
      showToast("Checked in successfully at " + rec.checkIn + ".");
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to check in.", "error");
    }
  };

  const handleCheckOut = async () => {
    try {
      const rec = await attendanceService.checkOut(user.id);
      setAttendance(rec);
      showToast("Checked out successfully at " + rec.checkOut + ". Hours: " + rec.workingHours);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to check out.", "error");
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    
    // validation
    const errs = {};
    if (!leaveFields.startDate) errs.startDate = "Start date is required.";
    if (!leaveFields.endDate) errs.endDate = "End date is required.";
    if (!leaveFields.reason) errs.reason = "Reason is required.";
    
    if (Object.keys(errs).length > 0) {
      setLeaveErrors(errs);
      return;
    }

    setIsApplying(true);
    setLeaveErrors({});
    try {
      await leaveService.apply(user.id, `${user.firstName} ${user.lastName}`, leaveFields);
      showToast("Leave request applied successfully. Awaiting HR review.");
      setIsLeaveOpen(false);
      setLeaveFields({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to apply.", "error");
    } finally {
      setIsApplying(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Welcome header */}
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'Sarah'}`}
        subtitle="Here's your workday outline at a glance."
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsLeaveOpen(true)}>
            Apply for Leave
          </Button>
        }
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-50 border border-charcoal-100 text-charcoal-800 rounded-lg shadow-subtle shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">Clock Status</span>
            <span className="text-sm font-bold text-charcoal-900 block mt-0.5">
              {attendance.checkIn ? `In: ${attendance.checkIn}` : 'Not Clocked'}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-50 border border-charcoal-100 text-charcoal-800 rounded-lg shadow-subtle shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">Hours Worked</span>
            <span className="text-sm font-bold text-charcoal-900 block mt-0.5">
              {attendance.workingHours || '0 hrs'}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-50 border border-charcoal-100 text-charcoal-800 rounded-lg shadow-subtle shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">Leave Balance</span>
            <span className="text-sm font-bold text-charcoal-900 block mt-0.5">
              {balances.annualLeave?.remaining || 14} days left
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-50 border border-charcoal-100 text-charcoal-800 rounded-lg shadow-subtle shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">Pending Requests</span>
            <span className="text-sm font-bold text-charcoal-900 block mt-0.5">
              {recentLeaves.filter(l => l.status === 'Pending').length} Pending
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-950 text-white rounded-lg shadow-subtle shrink-0">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-300 font-bold block uppercase tracking-wider">Net Salary (Aug)</span>
            <span className="text-sm font-bold text-charcoal-900 block mt-0.5 text-white">
              {formatCurrency(user?.salaryDetails?.netSalary)}
            </span>
          </div>
        </Card>

      </div>

      {/* LOWER SECTION: Attendance Panel & Leave balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Card checkin toggler */}
        <Card className="flex flex-col justify-between p-6 border border-charcoal-100 h-full">
          <div>
            <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-charcoal-450" />
              <span>Shift Clocking</span>
            </h4>

            <div className="bg-charcoal-50/50 p-4 border border-charcoal-100 rounded-xl text-center space-y-2 mb-6">
              <p className="text-xs text-charcoal-450 font-bold uppercase tracking-wider">Today's Clocking Ledger</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
                <div className="border-r border-charcoal-150 py-1">
                  <span className="text-[10px] text-charcoal-400 block uppercase">Check In</span>
                  <span className="text-charcoal-900 font-bold block mt-0.5">
                    {attendance.checkIn || '—'}
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-[10px] text-charcoal-400 block uppercase">Check Out</span>
                  <span className="text-charcoal-900 font-bold block mt-0.5">
                    {attendance.checkOut || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!attendance.checkIn ? (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleCheckIn}
                className="w-full font-bold py-2.5"
              >
                Check In Shift
              </Button>
            ) : !attendance.checkOut ? (
              <Button 
                variant="danger" 
                size="lg" 
                onClick={handleCheckOut}
                className="w-full font-bold py-2.5"
              >
                Check Out Shift
              </Button>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center rounded-lg flex items-center justify-center gap-1.5 select-none">
                <CheckCircle className="w-4 h-4" />
                <span>Shift Clocking Completed Today</span>
              </div>
            )}
          </div>
        </Card>

        {/* Leave balance grids */}
        <Card className="lg:col-span-2">
          <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-4">
            Leave Balances
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            
            <div className="p-4 bg-charcoal-50 border border-charcoal-100 rounded-xl">
              <span className="text-[10px] font-bold text-charcoal-450 uppercase block">Annual Leave</span>
              <h3 className="text-xl font-black text-charcoal-900 mt-2">
                {balances.annualLeave?.remaining} / {balances.annualLeave?.total}
              </h3>
              <span className="text-[9px] text-charcoal-400 font-semibold block mt-1">days remaining</span>
            </div>

            <div className="p-4 bg-charcoal-50 border border-charcoal-100 rounded-xl">
              <span className="text-[10px] font-bold text-charcoal-450 uppercase block">Sick Leave</span>
              <h3 className="text-xl font-black text-charcoal-900 mt-2">
                {balances.sickLeave?.remaining} / {balances.sickLeave?.total}
              </h3>
              <span className="text-[9px] text-charcoal-400 font-semibold block mt-1">days remaining</span>
            </div>

            <div className="p-4 bg-charcoal-50 border border-charcoal-100 rounded-xl">
              <span className="text-[10px] font-bold text-charcoal-450 uppercase block">Unpaid Leave</span>
              <h3 className="text-xl font-black text-charcoal-900 mt-2">
                {balances.unpaidLeave?.remaining} / {balances.unpaidLeave?.total}
              </h3>
              <span className="text-[9px] text-charcoal-400 font-semibold block mt-1">days remaining</span>
            </div>

          </div>
        </Card>

      </div>

      {/* Leave request history list table */}
      <div className="bg-white border border-charcoal-100 rounded-xl p-5 shadow-subtle">
        <h4 className="text-sm font-bold text-charcoal-900 font-sans pb-3 border-b border-charcoal-50 mb-4 flex items-center justify-between">
          <span>Recent Leave Requests</span>
          <Button variant="ghost" size="sm" onClick={() => navigate('/employee/leave')}>
            View History →
          </Button>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-charcoal-400 border-b border-charcoal-50">
                <th className="pb-2.5 font-bold uppercase">Leave Type</th>
                <th className="pb-2.5 font-bold uppercase">Start Date</th>
                <th className="pb-2.5 font-bold uppercase">End Date</th>
                <th className="pb-2.5 font-bold uppercase">Reason</th>
                <th className="pb-2.5 font-bold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50 text-charcoal-700">
              {recentLeaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-charcoal-400 font-semibold">
                    No recent leave requests logged.
                  </td>
                </tr>
              ) : (
                recentLeaves.map((lv) => (
                  <tr key={lv.id}>
                    <td className="py-3 font-semibold text-charcoal-900">{lv.leaveType}</td>
                    <td className="py-3">{lv.startDate}</td>
                    <td className="py-3">{lv.endDate}</td>
                    <td className="py-3 text-charcoal-450 max-w-[200px] truncate font-semibold">{lv.reason}</td>
                    <td className="py-3">
                      <Badge variant={lv.status === 'Approved' ? 'green' : lv.status === 'Pending' ? 'amber' : 'red'}>
                        {lv.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply for Leave Modal */}
      <Modal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLeaveOpen(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyLeave} isLoading={isApplying}>
              Apply Request
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          
          <Select
            label="Leave Category"
            value={leaveFields.leaveType}
            onChange={(e) => setLeaveFields(prev => ({ ...prev, leaveType: e.target.value }))}
            options={[
              { value: 'Annual Leave', label: 'Annual Leave (Paid)' },
              { value: 'Sick Leave', label: 'Sick Leave (Medical)' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave' }
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={leaveFields.startDate}
              onChange={(e) => setLeaveFields(prev => ({ ...prev, startDate: e.target.value }))}
              error={leaveErrors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={leaveFields.endDate}
              onChange={(e) => setLeaveFields(prev => ({ ...prev, endDate: e.target.value }))}
              error={leaveErrors.endDate}
            />
          </div>

          <Input
            label="Reason for Request"
            placeholder="Please detail reason..."
            value={leaveFields.reason}
            onChange={(e) => setLeaveFields(prev => ({ ...prev, reason: e.target.value }))}
            error={leaveErrors.reason}
          />

        </form>
      </Modal>

    </div>
  );
};

export default EmployeeDashboard;
