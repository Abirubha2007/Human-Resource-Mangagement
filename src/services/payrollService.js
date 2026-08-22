import api from './api';

export const payrollService = {
  getAll: async () => {
    const response = await api.get('/payroll');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to fetch payroll records');
  },

  getByEmployeeId: async (employeeId) => {
    const currentUser = JSON.parse(localStorage.getItem('dayflow_user'));
    if (currentUser && currentUser.id === employeeId) {
      const response = await api.get('/payroll/me');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
    // Fallback for admin viewing specific employee payroll
    const response = await api.get('/payroll');
    if (response.data && response.data.success) {
      return response.data.data.filter(rec => rec.employeeId === employeeId);
    }
    throw new Error(response.data?.error || 'Failed to fetch employee payroll');
  },

  processPayout: async (id) => {
    const response = await api.put(`/payroll/${id}`, { status: 'Processed' });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.error || 'Failed to process payout');
  },

  updateSalaryDetails: async (employeeId, basicSalary, allowances, deductions) => {
    const response = await api.post('/payroll', {
      employeeId,
      basicSalary,
      allowances,
      deductions
    });
    if (response.data && response.data.success) {
      return { success: true };
    }
    throw new Error(response.data?.error || 'Failed to update salary details');
  }
};

