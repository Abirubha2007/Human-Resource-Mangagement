import api from './api';

export const leaveService = {
  getAll: async () => {
    const response = await api.get('/leaves');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch leave requests');
  },

  getByEmployeeId: async (employeeId) => {
    const currentUser = JSON.parse(localStorage.getItem('dayflow_user'));
    if (currentUser && currentUser.id === employeeId) {
      const response = await api.get('/leaves/me');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
    // Fallback for admin viewing specific employee leaves
    const response = await api.get('/leaves');
    if (response.data && response.data.success) {
      return response.data.data.filter(lv => lv.employeeId === employeeId);
    }
    throw new Error(response.data?.error || 'Failed to fetch employee leaves');
  },

  getBalance: async (employeeId) => {
    const currentUser = JSON.parse(localStorage.getItem('dayflow_user'));
    const url = (currentUser && currentUser.id === employeeId) ? '/leaves/me/balance' : `/leaves/balance/${employeeId}`;
    const response = await api.get(url);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch leave balance');
  },

  apply: async (employeeId, employeeName, data) => {
    const response = await api.post('/leaves', data);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to submit leave request');
  },

  approve: async (id) => {
    const response = await api.patch(`/leaves/${id}/approve`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to approve leave request');
  },

  reject: async (id) => {
    const response = await api.patch(`/leaves/${id}/reject`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to reject leave request');
  }
};

