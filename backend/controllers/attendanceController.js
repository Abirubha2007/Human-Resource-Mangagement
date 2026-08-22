const db = require('../config/database');

const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours + minutes / 60;
};

const formatAttendance = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    date: new Date(row.date).toISOString().split('T')[0],
    employeeId: row.employee_id,
    employeeName: row.employee_name || '',
    checkIn: row.check_in || '',
    checkOut: row.check_out || '',
    workingHours: row.working_hours || '0 hrs',
    status: row.status
  };
};

const attendanceController = {
  checkIn: async (req, res, next) => {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Determine status (Late if check-in is after 09:00 AM)
    let status = 'Present';
    try {
      const checkInHour = parseTime(nowTime);
      if (checkInHour > 9.0) {
        status = 'Late';
      }
    } catch (e) {
      // fallback to Present
    }

    try {
      // Prevent duplicate check-in
      const existingRes = await db.query(
        'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
        [employeeId, today]
      );

      if (existingRes.rows.length > 0 && existingRes.rows[0].check_in) {
        return res.status(400).json({
          success: false,
          message: 'Operation failed',
          error: 'Already checked in today.'
        });
      }

      // Fetch employee name
      const empRes = await db.query('SELECT first_name, last_name FROM employees WHERE id = ?', [employeeId]);
      const employeeName = empRes.rows[0] ? `${empRes.rows[0].first_name} ${empRes.rows[0].last_name}` : 'Employee';

      let result;
      if (existingRes.rows.length > 0) {
        // Update existing row (e.g. if pre-seeded as absent or on leave, update it)
        result = await db.query(
          `UPDATE attendance SET 
            check_in = ?, 
            status = ?, 
            working_hours = '0 hrs',
            updated_at = CURRENT_TIMESTAMP
          WHERE employee_id = ? AND date = ?
          `,
          [nowTime, status, employeeId, today]
        );
      } else {
        // Insert new row
        result = await db.query(
          `INSERT INTO attendance (date, employee_id, check_in, working_hours, status)
           VALUES (?, ?, ?, ?, ?)
           `,
          [today, employeeId, nowTime, '0 hrs', status]
        );
      }

      const formatted = formatAttendance(result.rows[0]);
      formatted.employeeName = employeeName;

      res.status(201).json({
        success: true,
        message: 'Checked in successfully',
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  },

  checkOut: async (req, res, next) => {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      const existingRes = await db.query(
        'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
        [employeeId, today]
      );

      const record = existingRes.rows[0];

      if (!record || !record.check_in) {
        return res.status(400).json({
          success: false,
          message: 'Operation failed',
          error: 'Cannot check out. You have not checked in today.'
        });
      }

      if (record.check_out) {
        return res.status(400).json({
          success: false,
          message: 'Operation failed',
          error: 'Already checked out today.'
        });
      }

      // Calculate working hours
      const inVal = parseTime(record.check_in);
      const outVal = parseTime(nowTime);
      let hoursWorked = 8.0; // fallback
      try {
        hoursWorked = Math.max(0.1, parseFloat((outVal - inVal).toFixed(1)));
      } catch (e) {
        // fallback
      }

      // Fetch employee name
      const empRes = await db.query('SELECT first_name, last_name FROM employees WHERE id = ?', [employeeId]);
      const employeeName = empRes.rows[0] ? `${empRes.rows[0].first_name} ${empRes.rows[0].last_name}` : 'Employee';

      const result = await db.query(
        `UPDATE attendance SET 
          check_out = ?, 
          working_hours = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?
         `,
        [nowTime, `${hoursWorked} hrs`, record.id]
      );

      const formatted = formatAttendance(result.rows[0]);
      formatted.employeeName = employeeName;

      res.status(200).json({
        success: true,
        message: 'Checked out successfully',
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req, res, next) => {
    const employeeId = req.user.employeeId;
    const { today } = req.query;

    try {
      if (today === 'true') {
        const todayDate = new Date().toISOString().split('T')[0];
        const result = await db.query(
          `SELECT a.*, (e.first_name || ' ' || e.last_name) as employee_name
           FROM attendance a
           JOIN employees e ON a.employee_id = e.id
           WHERE a.employee_id = ? AND a.date = ?`,
          [employeeId, todayDate]
        );

        if (result.rows.length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              date: todayDate,
              employeeId,
              checkIn: '',
              checkOut: '',
              workingHours: '0 hrs',
              status: 'Absent'
            }
          });
        }

        return res.status(200).json({
          success: true,
          data: formatAttendance(result.rows[0])
        });
      }

      const result = await db.query(
        `SELECT a.*, (e.first_name || ' ' || e.last_name) as employee_name
         FROM attendance a
         JOIN employees e ON a.employee_id = e.id
         WHERE a.employee_id = ?
         ORDER BY a.date DESC`,
        [employeeId]
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatAttendance)
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    const { employeeId, department, status, date } = req.query;

    try {
      let queryText = `
        SELECT a.*, (e.first_name || ' ' || e.last_name) as employee_name
        FROM attendance a
        JOIN employees e ON a.employee_id = e.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (employeeId) {
        queryText += ` AND a.employee_id = $${paramCount}`;
        params.push(employeeId);
        paramCount++;
      }

      if (department) {
        queryText += ` AND e.department = $${paramCount}`;
        params.push(department);
        paramCount++;
      }

      if (status) {
        queryText += ` AND a.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (date) {
        queryText += ` AND a.date = $${paramCount}`;
        params.push(date);
        paramCount++;
      }

      queryText += ' ORDER BY a.date DESC, a.check_in DESC';

      const result = await db.query(queryText, params);
      res.status(200).json({
        success: true,
        data: result.rows.map(formatAttendance)
      });
    } catch (error) {
      next(error);
    }
  },

  getSummary: async (req, res, next) => {
    const today = new Date().toISOString().split('T')[0];

    try {
      if (req.user.role === 'admin' || req.user.role === 'hr') {
        // Admin summary stats: Present, Late, Absent, On Leave
        const statsRes = await db.query(
          `SELECT 
             COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
             COUNT(CASE WHEN status = 'Late' THEN 1 END) as late,
             COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent,
             COUNT(CASE WHEN status = 'On Leave' THEN 1 END) as on_leave
           FROM attendance
           WHERE date = ?`,
          [today]
        );

        const totalEmpRes = await db.query("SELECT COUNT(*) FROM employees WHERE status = 'Active'");
        const totalEmployees = parseInt(totalEmpRes.rows[0].count);

        const stats = statsRes.rows[0];
        const presentToday = parseInt(stats.present) + parseInt(stats.late);
        const onLeave = parseInt(stats.on_leave);
        const absent = totalEmployees - presentToday - onLeave;

        return res.status(200).json({
          success: true,
          data: {
            totalEmployees,
            presentToday,
            onLeave,
            absent: Math.max(0, absent),
            details: {
              present: parseInt(stats.present) || 0,
              late: parseInt(stats.late) || 0,
              onLeave: onLeave || 0,
              absent: Math.max(0, absent)
            }
          }
        });
      } else {
        // Employee attendance statistics
        const employeeId = req.user.employeeId;
        const result = await db.query(
          `SELECT 
             COUNT(CASE WHEN status IN ('Present', 'Late') THEN 1 END) as present_count,
             COUNT(CASE WHEN status = 'Late' THEN 1 END) as late_count,
             COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent_count,
             COALESCE(SUM(CAST(SPLIT_PART(working_hours, ' ', 1) AS NUMERIC)), 0) as total_hours
           FROM attendance
           WHERE employee_id = ?`,
          [employeeId]
        );

        const row = result.rows[0];
        res.status(200).json({
          success: true,
          data: {
            present: parseInt(row.present_count),
            late: parseInt(row.late_count),
            absent: parseInt(row.absent_count),
            totalHours: parseFloat(row.total_hours).toFixed(1) + ' hrs'
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = attendanceController;
