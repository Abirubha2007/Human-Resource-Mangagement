import { demoEmployees } from '../data/employees';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredEmployees = () => {
  const stored = localStorage.getItem('dayflow_employees');
  if (!stored) {
    localStorage.setItem('dayflow_employees', JSON.stringify(demoEmployees));
    return demoEmployees;
  }
  return JSON.parse(stored);
};

const saveEmployees = (employees) => {
  localStorage.setItem('dayflow_employees', JSON.stringify(employees));
};

export const employeeService = {
  getAll: async () => {
    await delay();
    return getStoredEmployees();
  },

  getById: async (id) => {
    await delay(300);
    const employees = getStoredEmployees();
    const employee = employees.find(emp => emp.id === id);
    if (!employee) throw new Error("Employee not found");
    return employee;
  },

  create: async (data) => {
    await delay(800);
    const employees = getStoredEmployees();
    
    // Generate new unique ID
    const lastId = employees[employees.length - 1]?.id || 'EMP-2026-000';
    const idNum = parseInt(lastId.split('-')[2]) + 1;
    const newId = `EMP-2026-${String(idNum).padStart(3, '0')}`;

    const newEmployee = {
      id: newId,
      ...data,
      status: data.status || "Active",
      avatar: data.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?q=80&w=256&auto=format&fit=crop`,
      salaryDetails: {
        basicSalary: Number(data.basicSalary) || 50000,
        allowances: Number(data.allowances) || 10000,
        deductions: Number(data.deductions) || 5000,
        netSalary: (Number(data.basicSalary) || 50000) + (Number(data.allowances) || 10000) - (Number(data.deductions) || 5000)
      }
    };

    employees.push(newEmployee);
    saveEmployees(employees);
    return newEmployee;
  },

  update: async (id, data) => {
    await delay(600);
    const employees = getStoredEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error("Employee not found");

    const updatedEmployee = {
      ...employees[index],
      ...data,
      salaryDetails: {
        basicSalary: Number(data.basicSalary) || employees[index].salaryDetails.basicSalary,
        allowances: Number(data.allowances) || employees[index].salaryDetails.allowances,
        deductions: Number(data.deductions) || employees[index].salaryDetails.deductions,
        netSalary: (Number(data.basicSalary) || employees[index].salaryDetails.basicSalary) + 
                   (Number(data.allowances) || employees[index].salaryDetails.allowances) - 
                   (Number(data.deductions) || employees[index].salaryDetails.deductions)
      }
    };

    employees[index] = updatedEmployee;
    saveEmployees(employees);
    return updatedEmployee;
  },

  delete: async (id) => {
    await delay(500);
    const employees = getStoredEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    if (employees.length === filtered.length) throw new Error("Employee not found");
    saveEmployees(filtered);
    return { success: true };
  }
};
