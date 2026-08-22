export const demoNotifications = [
  {
    id: "NTF-001",
    title: "New leave request",
    message: "Sarah Johnson applied for Annual Leave (2026-08-25 to 2026-08-28)",
    type: "leave",
    time: "10 mins ago",
    read: false,
    role: "admin"
  },
  {
    id: "NTF-002",
    title: "Employee checked in",
    message: "Michael Brown checked in at 09:15 AM (Late)",
    type: "attendance",
    time: "25 mins ago",
    read: false,
    role: "admin"
  },
  {
    id: "NTF-003",
    title: "Leave Request Approved",
    message: "Your leave request for 2026-08-22 to 2026-08-26 has been approved.",
    type: "leave",
    time: "1 hour ago",
    read: true,
    role: "employee",
    employeeId: "EMP-2026-002"
  },
  {
    id: "NTF-004",
    title: "Payroll Processed",
    message: "Payroll for August 2026 has been processed and payslips are ready.",
    type: "payroll",
    time: "2 hours ago",
    read: false,
    role: "all"
  }
];

export const demoRecentActivities = [
  {
    id: "ACT-001",
    user: "Sarah Johnson",
    action: "applied for Annual Leave",
    time: "10 mins ago",
    type: "leave"
  },
  {
    id: "ACT-002",
    user: "Michael Brown",
    action: "checked in at 09:15 AM",
    time: "25 mins ago",
    type: "attendance"
  },
  {
    id: "ACT-003",
    user: "Emily Davis",
    action: "leave request was approved by John Doe",
    time: "1 hour ago",
    type: "leave"
  },
  {
    id: "ACT-004",
    user: "System",
    action: "Payroll for August 2026 has been successfully processed",
    time: "2 hours ago",
    type: "payroll"
  }
];
