import { demoLeaves, demoLeaveBalances } from '../data/leaves';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredLeaves = () => {
  const stored = localStorage.getItem('dayflow_leaves');
  if (!stored) {
    localStorage.setItem('dayflow_leaves', JSON.stringify(demoLeaves));
    return demoLeaves;
  }
  return JSON.parse(stored);
};

const saveLeaves = (records) => {
  localStorage.setItem('dayflow_leaves', JSON.stringify(records));
};

const getStoredBalances = () => {
  const stored = localStorage.getItem('dayflow_balances');
  if (!stored) {
    localStorage.setItem('dayflow_balances', JSON.stringify(demoLeaveBalances));
    return demoLeaveBalances;
  }
  return JSON.parse(stored);
};

const saveBalances = (balances) => {
  localStorage.setItem('dayflow_balances', JSON.stringify(balances));
};

export const leaveService = {
  getAll: async () => {
    await delay();
    return getStoredLeaves();
  },

  getByEmployeeId: async (employeeId) => {
    await delay(300);
    const leaves = getStoredLeaves();
    return leaves.filter(lv => lv.employeeId === employeeId);
  },

  getBalance: async (employeeId) => {
    await delay(200);
    const balances = getStoredBalances();
    // Default if not initialized
    if (!balances[employeeId]) {
      balances[employeeId] = {
        annualLeave: { total: 18, used: 0, remaining: 18 },
        sickLeave: { total: 12, used: 0, remaining: 12 },
        unpaidLeave: { total: 10, used: 0, remaining: 10 }
      };
      saveBalances(balances);
    }
    return balances[employeeId];
  },

  apply: async (employeeId, employeeName, data) => {
    await delay(700);
    const leaves = getStoredLeaves();
    
    // Check if start date is after end date
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error("Start date cannot be after end date.");
    }

    const newRequest = {
      id: `LR-${Date.now()}`,
      employeeId,
      employeeName,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: "Pending",
      appliedOn: new Date().toISOString().split('T')[0]
    };

    leaves.unshift(newRequest);
    saveLeaves(leaves);
    return newRequest;
  },

  approve: async (id) => {
    await delay(600);
    const leaves = getStoredLeaves();
    const index = leaves.findIndex(lv => lv.id === id);
    if (index === -1) throw new Error("Leave request not found");

    leaves[index].status = "Approved";
    saveLeaves(leaves);

    // Deduct from balance
    const request = leaves[index];
    const balances = getStoredBalances();
    if (balances[request.employeeId]) {
      const typeKey = request.leaveType === "Annual Leave" ? "annualLeave" : 
                      request.leaveType === "Sick Leave" ? "sickLeave" : "unpaidLeave";
      
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const category = balances[request.employeeId][typeKey];
      if (category) {
        category.used = Math.min(category.total, category.used + days);
        category.remaining = Math.max(0, category.total - category.used);
      }
      saveBalances(balances);
    }

    return leaves[index];
  },

  reject: async (id) => {
    await delay(600);
    const leaves = getStoredLeaves();
    const index = leaves.findIndex(lv => lv.id === id);
    if (index === -1) throw new Error("Leave request not found");

    leaves[index].status = "Rejected";
    saveLeaves(leaves);
    return leaves[index];
  }
};
