import React from 'react';
import { Plus, Users, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockDepartments } from '../../data/departments';

export default function Departments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-500">Manage organizational structure.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDepartments.map(dept => (
          <div key={dept.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 relative group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                <Badge variant={dept.status === 'Active' ? 'success' : 'default'} className="mt-1">
                  {dept.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Department Head</span>
                <span className="font-medium text-gray-900">{dept.head}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Employees Count</span>
                <span className="font-medium text-gray-900">{dept.employeesCount}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex gap-2">
              <Button variant="secondary" className="w-full h-9 text-sm">View Details</Button>
              <Button variant="secondary" className="w-full h-9 text-sm">Employees</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
