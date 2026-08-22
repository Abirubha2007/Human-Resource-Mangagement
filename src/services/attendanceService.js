import { demoAttendance } from '../data/attendance';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredAttendance = () => {
  const stored = localStorage.getItem('dayflow_attendance');
  if (!stored) {
    localStorage.setItem('dayflow_attendance', JSON.stringify(demoAttendance));
    return demoAttendance;
  }
  return JSON.parse(stored);
};

const saveAttendance = (records) => {
  localStorage.setItem('dayflow_attendance', JSON.stringify(records));
};

export const attendanceService = {
  getAll: async () => {
    await delay();
    return getStoredAttendance();
  },

  getByEmployeeId: async (employeeId) => {
    await delay(300);
    const records = getStoredAttendance();
    return records.filter(rec => rec.employeeId === employeeId);
  },

  getCurrentStatus: async (employeeId) => {
    await delay(200);
    const records = getStoredAttendance();
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's record for this employee
    const record = records.find(rec => rec.employeeId === employeeId && rec.date === today);
    if (record) {
      return record;
    }
    
    return {
      date: today,
      employeeId,
      checkIn: "",
      checkOut: "",
      workingHours: "0 hrs",
      status: "Absent"
    };
  },

  checkIn: async (employeeId, employeeName) => {
    await delay(600);
    const records = getStoredAttendance();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already checked in
    const existingIndex = records.findIndex(rec => rec.employeeId === employeeId && rec.date === today);
    
    if (existingIndex !== -1 && records[existingIndex].checkIn) {
      throw new Error("Already checked in today.");
    }

    const newRecord = {
      id: `ATT-${Date.now()}`,
      date: today,
      employeeId,
      employeeName,
      checkIn: nowTime,
      checkOut: "",
      workingHours: "0 hrs",
      status: "Present"
    };

    if (existingIndex !== -1) {
      records[existingIndex] = newRecord;
    } else {
      records.unshift(newRecord);
    }
    
    saveAttendance(records);
    return newRecord;
  },

  checkOut: async (employeeId) => {
    await delay(600);
    const records = getStoredAttendance();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const index = records.findIndex(rec => rec.employeeId === employeeId && rec.date === today);
    if (index === -1 || !records[index].checkIn) {
      throw new Error("Cannot check out. You have not checked in today.");
    }

    if (records[index].checkOut) {
      throw new Error("Already checked out today.");
    }

    // Calculate working hours (mocked calculation)
    const checkInStr = records[index].checkIn;
    // e.g. "08:50 AM" -> calculate hours roughly
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours + minutes / 60;
    };
    
    let hoursWorked = 8.0; // default backup
    try {
      const inVal = parseTime(checkInStr);
      const outVal = parseTime(nowTime);
      hoursWorked = Math.max(0.1, parseFloat((outVal - inVal).toFixed(1)));
    } catch (e) {
      // fallback
    }

    const updatedRecord = {
      ...records[index],
      checkOut: nowTime,
      workingHours: `${hoursWorked} hrs`,
      status: "Present"
    };

    records[index] = updatedRecord;
    saveAttendance(records);
    return updatedRecord;
  }
};
