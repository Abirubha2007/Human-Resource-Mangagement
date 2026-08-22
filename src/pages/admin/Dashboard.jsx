import React from 'react';
import { Users, UserCheck, UserMinus, CalendarClock, Banknote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockEmployees } from '../../data/employees';
import { mockLeaves } from '../../data/leaves';
import { mockDepartments } from '../../data/departments';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {trend === 'up' ? '+' : '-'}{trendValue}
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </CardContent>
  </Card>
);

const attendanceData = [
  { name: 'Mon', present: 110, absent: 18 },
  { name: 'Tue', present: 115, absent: 13 },
  { name: 'Wed', present: 112, absent: 16 },
  { name: 'Thu', present: 118, absent: 10 },
  { name: 'Fri', present: 105, absent: 23 },
];

const COLORS = ['#111827', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'];

export default function AdminDashboard() {
  const pendingLeaves = mockLeaves.filter(l => l.status === 'Pending').slice(0, 3);
  
  const deptData = mockDepartments.map(d => ({
    name: d.name,
    value: d.employeesCount
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good morning, John</h2>
        <p className="text-gray-500">Here's what's happening across your organization today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Employees" value="128" icon={Users} trend="up" trendValue="12%" />
        <StatCard title="Present Today" value="98" icon={UserCheck} trend="up" trendValue="4%" />
        <StatCard title="On Leave" value="15" icon={UserMinus} trend="down" trendValue="2%" />
        <StatCard title="Pending Requests" value="6" icon={CalendarClock} trend="up" trendValue="10%" />
        <StatCard title="Payroll This Month" value="$248,540" icon={Banknote} trend="up" trendValue="5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <select className="text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="present" name="Present" fill="#111827" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full flex flex-wrap justify-center gap-2 mt-4 text-xs text-gray-600">
                {deptData.slice(0,4).map((d, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i] }}></div>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">View All</button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Leave Type</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map(leave => (
                  <tr key={leave.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{leave.employeeName}</td>
                    <td className="px-6 py-4 text-gray-500">{leave.type}</td>
                    <td className="px-6 py-4 text-gray-500">{leave.startDate} to {leave.endDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant="warning">{leave.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { time: '2 hours ago', text: 'Sarah Johnson applied for Annual Leave', type: 'leave' },
                { time: '3 hours ago', text: 'Michael Brown checked in at 09:15 AM', type: 'attendance' },
                { time: '5 hours ago', text: "Emily Davis' leave request was approved", type: 'approval' },
                { time: '1 day ago', text: 'Payroll for this month has been processed', type: 'system' }
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-gray-200"></div>}
                  <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white shadow-sm flex-shrink-0 mt-0.5 z-10"></div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
