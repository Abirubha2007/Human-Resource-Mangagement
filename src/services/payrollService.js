import { demoPayroll } from '../data/payroll';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredPayroll = () => {
  const stored = localStorage.getItem('dayflow_payroll');
  if (!stored) {
    localStorage.setItem('dayflow_payroll', JSON.stringify(demoPayroll));
    return demoPayroll;
  }
  return JSON.parse(stored);
};

const savePayroll = (records) => {
  localStorage.setItem('dayflow_payroll', JSON.stringify(records));
};

export const payrollService = {
  getAll: async () => {
    await delay();
    return getStoredPayroll();
  },

  getByEmployeeId: async (employeeId) => {
    await delay(300);
    const records = getStoredPayroll();
    return records.filter(rec => rec.employeeId === employeeId);
  },

  processPayout: async (id) => {
    await delay(600);
    const records = getStoredPayroll();
    const index = records.findIndex(rec => rec.id === id);
    if (index === -1) throw new Error("Payroll slip not found");

    records[index].status = "Processed";
    records[index].processedDate = new Date().toISOString().split('T')[0];
    
    savePayroll(records);
    return records[index];
  },

  updateSalaryDetails: async (employeeId, basicSalary, allowances, deductions) => {
    await delay(600);
    const records = getStoredPayroll();
    
    const basic = Number(basicSalary) || 0;
    const allow = Number(allowances) || 0;
    const deduct = Number(deductions) || 0;
    const net = basic + allow - deduct;

    const index = records.findIndex(rec => rec.employeeId === employeeId);
    if (index !== -1) {
      records[index] = {
        ...records[index],
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: net
      };
    } else {
      // Create new record
      records.push({
        id: `PAY-${Date.now()}`,
        employeeId,
        employeeName: "Employee",
        department: "Engineering",
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: net,
        status: "Pending",
        payoutMonth: "August 2026",
        processedDate: "-"
      });
    }

    savePayroll(records);
    return { success: true };
  }
};
