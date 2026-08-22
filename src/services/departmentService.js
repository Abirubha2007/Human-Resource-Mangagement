import api from './api';

export const departmentService = {
  getAll: async () => {
    const response = await api.get('/departments');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch departments');
  },

  create: async (data) => {
    const response = await api.post('/departments', data);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to create department');
  },

  update: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to update department');
  },

  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    if (response.data && response.data.success) {
      return { success: true };
    }
    throw new Error(response.data?.error || 'Failed to delete department');
  }
};

