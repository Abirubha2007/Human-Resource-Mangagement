import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('dayflow_token', token);
      localStorage.setItem('dayflow_user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error(response.data?.error || 'Invalid credentials');
  },

  signup: async (signUpData) => {
    const response = await api.post('/auth/register', signUpData);
    if (response.data && response.data.success) {
      return { success: true };
    }
    throw new Error(response.data?.error || 'Failed to register account');
  },

  forgotPassword: async (email) => {
    // Simulated forgot password network response (no backend SMTP setup required)
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: `Reset link has been sent to ${email}` };
  },

  logout: async () => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    return { success: true };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('dayflow_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

