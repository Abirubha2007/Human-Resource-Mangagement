import { demoDepartments } from '../data/departments';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredDepartments = () => {
  const stored = localStorage.getItem('dayflow_departments');
  if (!stored) {
    localStorage.setItem('dayflow_departments', JSON.stringify(demoDepartments));
    return demoDepartments;
  }
  return JSON.parse(stored);
};

const saveDepartments = (depts) => {
  localStorage.setItem('dayflow_departments', JSON.stringify(depts));
};

export const departmentService = {
  getAll: async () => {
    await delay();
    return getStoredDepartments();
  },

  create: async (data) => {
    await delay(700);
    const depts = getStoredDepartments();
    const newDept = {
      id: `DEP-${String(depts.length + 1).padStart(2, '0')}`,
      name: data.name,
      employeeCount: 0,
      head: data.head || "TBD",
      status: "Active",
      budget: data.budget || "₹0"
    };

    depts.push(newDept);
    saveDepartments(depts);
    return newDept;
  },

  update: async (id, data) => {
    await delay(500);
    const depts = getStoredDepartments();
    const index = depts.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Department not found");

    depts[index] = {
      ...depts[index],
      ...data
    };

    saveDepartments(depts);
    return depts[index];
  },

  delete: async (id) => {
    await delay(500);
    const depts = getStoredDepartments();
    const filtered = depts.filter(d => d.id !== id);
    if (filtered.length === depts.length) throw new Error("Department not found");
    saveDepartments(filtered);
    return { success: true };
  }
};
