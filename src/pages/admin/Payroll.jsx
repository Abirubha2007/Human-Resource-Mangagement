import React from 'react';
import { Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockEmployees } from '../../data/employees';

export default function Payroll() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-500">Manage employee salaries and processing.</p>
        </div>
        <Button className="gap-2">
          Run Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 text-white border-0">
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-1">Total Payroll Current Month</p>
            <h3 className="text-3xl font-bold">$248,540</h3>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-1">Processed</p>
            <h3 className="text-3xl font-bold text-gray-900">0%</h3>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-1">Next Pay Date</p>
            <h3 className="text-3xl font-bold text-gray-900">Oct 31, 2023</h3>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Basic Salary</th>
                <th className="px-6 py-4 font-medium">Allowances</th>
                <th className="px-6 py-4 font-medium">Deductions</th>
                <th className="px-6 py-4 font-medium">Net Salary</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Payslip</th>
              </tr>
            </thead>
            <tbody>
              {mockEmployees.map(emp => {
                const net = emp.salary.basic + emp.salary.allowances - emp.salary.deductions;
                return (
                  <tr key={emp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-gray-600">${emp.salary.basic.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-600">+${emp.salary.allowances.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600">-${emp.salary.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${net.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant="warning">Pending</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Download className="w-4 h-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
