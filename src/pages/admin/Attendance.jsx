import React from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockEmployees } from '../../data/employees';

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <p className="text-gray-500">Monitor employee attendance records.</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Present Today', 'Absent Today', 'Late Arrivals', 'On Leave'].map((stat, i) => (
          <div key={stat} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {[98, 15, 12, 15][i]}
            </h3>
          </div>
        ))}
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search employee..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <input type="date" className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Working Hours</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEmployees.slice(0, 5).map((emp, i) => (
                <tr key={emp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-gray-600">Oct 24, 2023</td>
                  <td className="px-6 py-4 text-gray-600">{['09:00 AM', '09:15 AM', '08:45 AM', '--:--', '09:05 AM'][i]}</td>
                  <td className="px-6 py-4 text-gray-600">{['05:00 PM', '05:30 PM', '04:45 PM', '--:--', '05:00 PM'][i]}</td>
                  <td className="px-6 py-4 text-gray-600">{['8h 0m', '8h 15m', '8h 0m', '--', '7h 55m'][i]}</td>
                  <td className="px-6 py-4">
                    <Badge variant={['success', 'warning', 'success', 'error', 'success'][i]}>
                      {['Present', 'Late', 'Present', 'Absent', 'Present'][i]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
