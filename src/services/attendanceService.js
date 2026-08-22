import api from './api';

export const attendanceService = {
  getAll: async () => {
    const response = await api.get('/attendance');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch attendance');
  },

  getByEmployeeId: async (employeeId) => {
    const response = await api.get(`/attendance?employeeId=${employeeId}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch employee attendance');
  },

  getCurrentStatus: async (employeeId) => {
    // Current status maps to the current user's today status
    const response = await api.get('/attendance/me?today=true');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch current attendance status');
  },

  checkIn: async (employeeId, employeeName) => {
    const response = await api.post('/attendance/check-in');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to check in');
  },

  checkOut: async (employeeId) => {
    const response = await api.post('/attendance/check-out');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to check out');
  }
};

