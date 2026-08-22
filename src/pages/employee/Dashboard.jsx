import React, { useState } from 'react';
import { Clock, CalendarOff, Banknote, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockLeaves } from '../../data/leaves';

export default function EmployeeDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
  };

  const myLeaves = mockLeaves.filter(l => l.employeeId === 'EMP-002').slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Sarah</h2>
        <p className="text-gray-500">Here's your workday at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-900 text-white border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Today's Attendance</p>
                <h3 className="text-2xl font-bold">
                  {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                </h3>
              </div>
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">Check In</p>
                <p className="font-medium">{checkInTime || '--:--'}</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">Check Out</p>
                <p className="font-medium">--:--</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 mb-1">Working Hrs</p>
                <p className="font-medium">{isCheckedIn ? '0h 45m' : '0h 0m'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isCheckedIn ? (
                <button 
                  onClick={handleCheckIn}
                  className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Check In
                </button>
              ) : (
                <button 
                  onClick={handleCheckOut}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Check Out
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <CalendarOff className="w-5 h-5 text-gray-700" />
              </div>
              <Badge variant="success">12 Available</Badge>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Paid Leave Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">12 Days</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Next Payroll</p>
            <h3 className="text-2xl font-bold text-gray-900">Oct 31</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <Button variant="ghost" size="sm">Apply for Leave</Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Leave Type</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.length > 0 ? myLeaves.map(leave => (
                  <tr key={leave.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 text-gray-500">{leave.startDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'error' : 'warning'}>
                        {leave.status}
                      </Badge>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No recent leave requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Thanksgiving Day', date: 'Nov 23, 2023', day: 'Thursday' },
                { name: 'Christmas Day', date: 'Dec 25, 2023', day: 'Monday' },
                { name: 'New Year\'s Day', date: 'Jan 1, 2024', day: 'Monday' }
              ].map((holiday, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div>
                    <p className="font-medium text-gray-900">{holiday.name}</p>
                    <p className="text-xs text-gray-500">{holiday.day}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">
                    {holiday.date}
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
