export const demoLeaves = [
  {
    id: "LR-001",
    employeeId: "EMP-2026-002",
    employeeName: "Sarah Johnson",
    leaveType: "Annual Leave",
    startDate: "2026-08-25",
    endDate: "2026-08-28",
    reason: "Family trip to Shimla",
    status: "Pending",
    appliedOn: "2026-08-20"
  },
  {
    id: "LR-002",
    employeeId: "EMP-2026-003",
    employeeName: "Michael Brown",
    leaveType: "Sick Leave",
    startDate: "2026-08-18",
    endDate: "2026-08-19",
    reason: "High fever and flu symptoms",
    status: "Approved",
    appliedOn: "2026-08-17"
  },
  {
    id: "LR-003",
    employeeId: "EMP-2026-004",
    employeeName: "Emily Davis",
    leaveType: "Annual Leave",
    startDate: "2026-08-22",
    endDate: "2026-08-26",
    reason: "Personal work / relocation planning",
    status: "Approved",
    appliedOn: "2026-08-15"
  },
  {
    id: "LR-004",
    employeeId: "EMP-2026-005",
    employeeName: "David Wilson",
    leaveType: "Unpaid Leave",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    reason: "Exam preparation",
    status: "Pending",
    appliedOn: "2026-08-21"
  },
  {
    id: "LR-005",
    employeeId: "EMP-2026-006",
    employeeName: "Jessica Taylor",
    leaveType: "Sick Leave",
    startDate: "2026-08-10",
    endDate: "2026-08-10",
    reason: "Dental appointment",
    status: "Rejected",
    appliedOn: "2026-08-09"
  }
];

export const demoLeaveBalances = {
  "EMP-2026-002": {
    annualLeave: { total: 18, used: 4, remaining: 14 },
    sickLeave: { total: 12, used: 4, remaining: 8 },
    unpaidLeave: { total: 10, used: 2, remaining: 8 }
  },
  "EMP-2026-003": {
    annualLeave: { total: 18, used: 6, remaining: 12 },
    sickLeave: { total: 12, used: 2, remaining: 10 },
    unpaidLeave: { total: 10, used: 0, remaining: 10 }
  },
  "EMP-2026-004": {
    annualLeave: { total: 18, used: 5, remaining: 13 },
    sickLeave: { total: 12, used: 1, remaining: 11 },
    unpaidLeave: { total: 10, used: 0, remaining: 10 }
  }
};
