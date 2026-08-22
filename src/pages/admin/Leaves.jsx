import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockLeaves } from '../../data/leaves';

export default function Leaves() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
        <p className="text-gray-500">Review and manage employee leave requests.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Leave Type</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaves.map(leave => (
                <tr key={leave.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{leave.employeeName}</td>
                  <td className="px-6 py-4 text-gray-600">{leave.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{leave.startDate} to {leave.endDate}</div>
                    <div className="text-xs text-gray-500">{leave.days} days</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'error' : 'warning'}>
                      {leave.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                        <Eye className="w-4 h-4" />
                      </button>
                      {leave.status === 'Pending' && (
                        <>
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-md">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
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
