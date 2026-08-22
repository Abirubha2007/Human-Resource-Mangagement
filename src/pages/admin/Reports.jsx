import React, { useState } from 'react';
import { 
  Download, 
  BarChart, 
  Calendar, 
  Briefcase, 
  Users, 
  FileSpreadsheet, 
  FileDown 
} from 'lucide-react';
import { PageHeader, Card, ChartCard, Button } from '../../components/UI';
import { useToast } from '../../context/ToastContext';

// Recharts components
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { weeklyAttendanceStats } from '../../data/attendance';
import { departmentDistribution } from '../../data/departments';
import { payrollHistory } from '../../data/payroll';

const COLORS = ['#0a0a0a', '#333333', '#666666', '#999999', '#cccccc'];

// Mock dataset for leave distribution report
const leaveTypeDistribution = [
  { name: "Annual Leave", value: 65 },
  { name: "Sick Leave", value: 25 },
  { name: "Unpaid Leave", value: 10 }
];

const AdminReports = () => {
  const { showToast } = useToast();
  
  // Filters
  const [reportType, setReportType] = useState('All Overview');
  const [dept, setDept] = useState('');
  const [month, setMonth] = useState('2026-08');

  const handleExport = (format) => {
    showToast(`Generating report for ${month || 'Current Month'} in ${format} format...`, "info");
    
    setTimeout(() => {
      showToast(`Exported ${reportType} report as ${format} successfully.`);
    }, 1500);
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
      
      {/* Page Title */}
      <PageHeader
        title="Analytical Reports"
        subtitle="Extract, compile, and visualize workforce metrics, payout statistics, and attendance logs."
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={FileSpreadsheet} 
              onClick={() => handleExport('CSV')}
            >
              Export CSV
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon={Download} 
              onClick={() => handleExport('Excel')}
            >
              Export Excel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={FileDown} 
              onClick={() => handleExport('PDF')}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle text-xs font-semibold">
        
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <span className="text-[10px] text-charcoal-400 block mb-1">Report Category</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
            >
              <option>All Overview</option>
              <option>Attendance & Clock-In logs</option>
              <option>Payroll disbursement history</option>
              <option>Leave distribution trends</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-400 block mb-1">Department Filter</span>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-400 block mb-1">Reporting Month</span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-charcoal-200 rounded-lg p-1.5 bg-white focus:outline-none focus:border-charcoal-900"
            />
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Attendance trend */}
        <ChartCard title="Attendance Fill Rate (%)">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={weeklyAttendanceStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Present" fill="#000000" radius={[3, 3, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payroll Trend */}
        <ChartCard title="Historical Payout Trend (INR)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={payrollHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis 
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(tick) => `₹${tick / 100000}L`} 
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="totalPayout" stroke="#0a0a0a" strokeWidth={2.5} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Distribution */}
        <ChartCard title="Head Count ratio (%)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Leave distribution trend */}
        <ChartCard title="Leave Category Distribution (%)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leaveTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {leaveTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

    </div>
  );
};

export default AdminReports;
