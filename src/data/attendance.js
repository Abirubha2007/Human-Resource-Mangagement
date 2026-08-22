export const demoAttendance = [
  // Today's records (Aug 22, 2026)
  {
    id: "ATT-001",
    date: "2026-08-22",
    employeeId: "EMP-2026-002", // Sarah (Employee login)
    employeeName: "Sarah Johnson",
    checkIn: "08:50 AM",
    checkOut: "",
    workingHours: "2.5 hrs", // currently checked in
    status: "Present"
  },
  {
    id: "ATT-002",
    date: "2026-08-22",
    employeeId: "EMP-2026-003",
    employeeName: "Michael Brown",
    checkIn: "09:15 AM",
    checkOut: "",
    workingHours: "2.1 hrs",
    status: "Late"
  },
  {
    id: "ATT-003",
    date: "2026-08-22",
    employeeId: "EMP-2026-004",
    employeeName: "Emily Davis",
    checkIn: "",
    checkOut: "",
    workingHours: "0 hrs",
    status: "On Leave"
  },
  {
    id: "ATT-004",
    date: "2026-08-22",
    employeeId: "EMP-2026-005",
    employeeName: "David Wilson",
    checkIn: "08:45 AM",
    checkOut: "",
    workingHours: "2.6 hrs",
    status: "Present"
  },
  {
    id: "ATT-005",
    date: "2026-08-22",
    employeeId: "EMP-2026-006",
    employeeName: "Jessica Taylor",
    checkIn: "",
    checkOut: "",
    workingHours: "0 hrs",
    status: "Absent"
  },

  // Yesterday's records (Aug 21, 2026)
  {
    id: "ATT-011",
    date: "2026-08-21",
    employeeId: "EMP-2026-002",
    employeeName: "Sarah Johnson",
    checkIn: "08:55 AM",
    checkOut: "05:30 PM",
    workingHours: "8.5 hrs",
    status: "Present"
  },
  {
    id: "ATT-012",
    date: "2026-08-21",
    employeeId: "EMP-2026-003",
    employeeName: "Michael Brown",
    checkIn: "09:05 AM",
    checkOut: "06:00 PM",
    workingHours: "8.9 hrs",
    status: "Present"
  },
  {
    id: "ATT-013",
    date: "2026-08-21",
    employeeId: "EMP-2026-004",
    employeeName: "Emily Davis",
    checkIn: "",
    checkOut: "",
    workingHours: "0 hrs",
    status: "On Leave"
  },
  {
    id: "ATT-014",
    date: "2026-08-21",
    employeeId: "EMP-2026-005",
    employeeName: "David Wilson",
    checkIn: "08:50 AM",
    checkOut: "05:15 PM",
    workingHours: "8.4 hrs",
    status: "Present"
  },
  {
    id: "ATT-015",
    date: "2026-08-21",
    employeeId: "EMP-2026-006",
    employeeName: "Jessica Taylor",
    checkIn: "09:20 AM",
    checkOut: "05:00 PM",
    workingHours: "7.6 hrs",
    status: "Late"
  },

  // Day before yesterday (Aug 20, 2026)
  {
    id: "ATT-021",
    date: "2026-08-20",
    employeeId: "EMP-2026-002",
    employeeName: "Sarah Johnson",
    checkIn: "09:02 AM",
    checkOut: "06:12 PM",
    workingHours: "9.1 hrs",
    status: "Present"
  },
  {
    id: "ATT-022",
    date: "2026-08-20",
    employeeId: "EMP-2026-003",
    employeeName: "Michael Brown",
    checkIn: "08:58 AM",
    checkOut: "05:45 PM",
    workingHours: "8.7 hrs",
    status: "Present"
  },
  {
    id: "ATT-023",
    date: "2026-08-20",
    employeeId: "EMP-2026-004",
    employeeName: "Emily Davis",
    checkIn: "09:12 AM",
    checkOut: "05:05 PM",
    workingHours: "7.8 hrs",
    status: "Late"
  },
  {
    id: "ATT-024",
    date: "2026-08-20",
    employeeId: "EMP-2026-005",
    employeeName: "David Wilson",
    checkIn: "08:48 AM",
    checkOut: "05:30 PM",
    workingHours: "8.7 hrs",
    status: "Present"
  },
  {
    id: "ATT-025",
    date: "2026-08-20",
    employeeId: "EMP-2026-006",
    employeeName: "Jessica Taylor",
    checkIn: "08:50 AM",
    checkOut: "05:40 PM",
    workingHours: "8.8 hrs",
    status: "Present"
  }
];

// Recharts data for weekly attendance percentage
export const weeklyAttendanceStats = [
  { day: "Mon", Present: 92, Late: 6, Absent: 2 },
  { day: "Tue", Present: 95, Late: 3, Absent: 2 },
  { day: "Wed", Present: 96, Late: 2, Absent: 2 },
  { day: "Thu", Present: 94, Late: 4, Absent: 2 },
  { day: "Fri", Present: 91, Late: 5, Absent: 4 },
  { day: "Sat", Present: 45, Late: 10, Absent: 45 },
  { day: "Sun", Present: 0, Late: 0, Absent: 100 }
];
