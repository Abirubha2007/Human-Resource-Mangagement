import { demoEmployees } from '../data/employees';

// Helper to simulate network lag
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay();
    
    // Check demo accounts
    let user = demoEmployees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    
    // Add fallback for standard test passwords
    if (user) {
      const isValid = (user.role === 'admin' && password === 'admin123') || 
                      (user.role === 'employee' && password === 'employee123') ||
                      password === 'password123'; // general backup password
                      
      if (isValid) {
        const token = `mock-jwt-token-for-${user.id}`;
        localStorage.setItem('dayflow_token', token);
        localStorage.setItem('dayflow_user', JSON.stringify(user));
        return { user, token };
      }
    }
    
    throw new Error('Invalid email address or password.');
  },

  signup: async (signUpData) => {
    await delay(1200);
    const { employeeId, firstName, lastName, email, password, role } = signUpData;

    // Check if user already exists
    const exists = demoEmployees.some(emp => emp.email.toLowerCase() === email.toLowerCase() || emp.id === employeeId);
    if (exists) {
      throw new Error('Employee ID or Email already registered.');
    }

    // Create a mock new user
    const newUser = {
      id: employeeId || `EMP-2026-0${demoEmployees.length + 1}`,
      firstName,
      lastName,
      email,
      phone: "+91 99999 88888",
      address: "Dayflow Head Office, Bengaluru, India",
      department: role === 'admin' ? 'Human Resources' : 'Engineering',
      jobTitle: role === 'admin' ? 'HR Coordinator' : 'Associate Engineer',
      joiningDate: new Date().toISOString().split('T')[0],
      status: "Active",
      role: role || "employee",
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?q=80&w=256&auto=format&fit=crop`,
      salaryDetails: {
        basicSalary: 60000,
        allowances: 10000,
        deductions: 5000,
        netSalary: 65000
      }
    };

    // Note: Since this is frontend-only, we don't persist globally beyond local runtime, 
    // but we can append to the in-memory array or save to sessionStorage if we want.
    // Let's add it to local list during this session
    demoEmployees.push(newUser);
    return { success: true, user: newUser };
  },

  forgotPassword: async (email) => {
    await delay(1000);
    const user = demoEmployees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('We could not find an account with that email address.');
    }
    return { success: true, message: `Reset link has been sent to ${email}` };
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    return { success: true };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('dayflow_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
