import api from './api';

export const employeeService = {
  getAll: async () => {
    const response = await api.get('/employees?limit=1000');
    if (response.data && response.data.success) {
      return response.data.data.employees;
    }
    throw new Error(response.data?.error || 'Failed to fetch employees');
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch employee details');
  },

  create: async (data) => {
    const response = await api.post('/employees', data);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to create employee');
  },

  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to update employee');
  },

  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    if (response.data && response.data.success) {
      return { success: true };
    }
    throw new Error(response.data?.error || 'Failed to delete employee');
  }
};

