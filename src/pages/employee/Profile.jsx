import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { mockEmployees } from '../../data/employees';
import { Mail, Phone, MapPin, Building, Briefcase } from 'lucide-react';

export default function Profile() {
  const me = mockEmployees.find(e => e.email === 'employee@dayflow.com');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-3xl font-bold">
              {me.avatar}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{me.firstName} {me.lastName}</h3>
              <p className="text-gray-500 font-medium mb-3">{me.jobTitle}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {me.department}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-center text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{me.email}</span>
            </div>
            <div className="flex gap-3 items-center text-gray-700">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{me.phone}</span>
            </div>
            <div className="flex gap-3 items-center text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{me.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Employee ID</span>
              <span className="font-medium text-gray-900">{me.id}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Date Joined</span>
              <span className="font-medium text-gray-900">{me.joinDate}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600">{me.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
