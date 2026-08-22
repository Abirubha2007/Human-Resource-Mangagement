const db = require('../config/database');

const formatLeaveRequest = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || '',
    leaveType: row.leave_type,
    startDate: new Date(row.start_date).toISOString().split('T')[0],
    endDate: new Date(row.end_date).toISOString().split('T')[0],
    reason: row.reason || '',
    status: row.status,
    appliedOn: new Date(row.applied_on).toISOString().split('T')[0]
  };
};

const formatBalance = (row) => {
  if (!row) return null;
  return {
    annualLeave: { total: row.annual_total, used: row.annual_used, remaining: row.annual_remaining },
    sickLeave: { total: row.sick_total, used: row.sick_used, remaining: row.sick_remaining },
    unpaidLeave: { total: row.unpaid_total, used: row.unpaid_used, remaining: row.unpaid_remaining }
  };
};

const leaveController = {
  apply: async (req, res, next) => {
    const employeeId = req.user.employeeId;
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Leave type, start date, end date, and reason are required.'
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Start date cannot be after end date.'
      });
    }

    try {
      // Get employee name
      const empRes = await db.query('SELECT first_name, last_name FROM employees WHERE id = ?', [employeeId]);
      const employeeName = empRes.rows[0] ? `${empRes.rows[0].first_name} ${empRes.rows[0].last_name}` : 'Employee';

      const queryText = `
        INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
        VALUES (?, ?, ?, ?, ?, 'Pending')
        
      `;
      const result = await db.query(queryText, [employeeId, leaveType, startDate, endDate, reason]);

      const formatted = formatLeaveRequest(result.rows[0]);
      formatted.employeeName = employeeName;

      res.status(201).json({
        success: true,
        message: 'Leave application submitted successfully',
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req, res, next) => {
    const employeeId = req.user.employeeId;

    try {
      const result = await db.query(
        `SELECT l.*, (e.first_name || ' ' || e.last_name) as employee_name
         FROM leave_requests l
         JOIN employees e ON l.employee_id = e.id
         WHERE l.employee_id = ?
         ORDER BY l.applied_on DESC, l.id DESC`,
        [employeeId]
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatLeaveRequest)
      });
    } catch (error) {
      next(error);
    }
  },

  getBalance: async (req, res, next) => {
    // If id passed in params, get for that id (Admin/HR only, or self)
    const employeeId = req.params.employeeId || req.user.employeeId;

    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.employeeId !== employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view other employees\' balances.',
        error: 'Forbidden'
      });
    }

    try {
      const result = await db.query('SELECT * FROM leave_balances WHERE employee_id = ?', [employeeId]);
      
      let balance = result.rows[0];

      if (!balance) {
        // Initialize balance if not present
        const initRes = await db.query(
          `INSERT INTO leave_balances (employee_id) VALUES (?) `,
          [employeeId]
        );
        balance = initRes.rows[0];
      }

      res.status(200).json({
        success: true,
        data: formatBalance(balance)
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

    try {
      const result = await db.query(
        `SELECT l.*, (e.first_name || ' ' || e.last_name) as employee_name
         FROM leave_requests l
         JOIN employees e ON l.employee_id = e.id
         ORDER BY l.applied_on DESC, l.id DESC`
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatLeaveRequest)
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        `SELECT l.*, (e.first_name || ' ' || e.last_name) as employee_name
         FROM leave_requests l
         JOIN employees e ON l.employee_id = e.id
         WHERE l.id = ?`,
        [id]
      );

      const request = result.rows[0];

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found',
          error: `No leave request found with ID ${id}`
        });
      }

      if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.employeeId !== request.employee_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Unauthorized to view this record.',
          error: 'Forbidden'
        });
      }

      res.status(200).json({
        success: true,
        data: formatLeaveRequest(request)
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason, status } = req.body;

    try {
      const checkRes = await db.query('SELECT * FROM leave_requests WHERE id = ?', [id]);
      const request = checkRes.rows[0];

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found',
          error: `No leave request found with ID ${id}`
        });
      }

      // Authorization check: Only Admin/HR can update status. Employees can update their own pending requests
      const isAdminOrHR = req.user.role === 'admin' || req.user.role === 'hr';
      if (!isAdminOrHR && req.user.employeeId !== request.employee_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.',
          error: 'Forbidden'
        });
      }

      if (!isAdminOrHR && request.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Operation failed',
          error: 'Cannot update a leave request that is already approved or rejected.'
        });
      }

      // Update fields
      const newLeaveType = leaveType || request.leave_type;
      const newStartDate = startDate || request.start_date;
      const newEndDate = endDate || request.end_date;
      const newReason = reason || request.reason;
      const newStatus = isAdminOrHR && status ? status : request.status;

      if (new Date(newStartDate) > new Date(newEndDate)) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: 'Start date cannot be after end date.'
        });
      }

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Check if we are approving this request and it wasn't approved before
        const becomingApproved = newStatus === 'Approved' && request.status !== 'Approved';

        const updateRes = await client.query(
          `UPDATE leave_requests SET
            leave_type = ?,
            start_date = ?,
            end_date = ?,
            reason = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
           WHERE id = ?
           `,
          [newLeaveType, newStartDate, newEndDate, newReason, newStatus, id]
        );

        if (becomingApproved) {
          // Deduct from balance
          const start = new Date(newStartDate);
          const end = new Date(newEndDate);
          const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

          let typeKey = 'annual';
          if (newLeaveType === 'Sick Leave') typeKey = 'sick';
          else if (newLeaveType === 'Unpaid Leave') typeKey = 'unpaid';

          // Update balances
          await client.query(
            `UPDATE leave_balances SET
              ${typeKey}_used = ${typeKey}_used + ?,
              ${typeKey}_remaining = GREATEST(0, ${typeKey}_total - (${typeKey}_used + ?)),
              updated_at = CURRENT_TIMESTAMP
             WHERE employee_id = ?`,
            [days, request.employee_id]
          );
        }

        await client.query('COMMIT');
        
        // Fetch full employee details to format with name
        const fullRes = await db.query(
          `SELECT l.*, (e.first_name || ' ' || e.last_name) as employee_name
           FROM leave_requests l
           JOIN employees e ON l.employee_id = e.id
           WHERE l.id = ?`,
          [id]
        );

        res.status(200).json({
          success: true,
          message: 'Leave request updated successfully',
          data: formatLeaveRequest(fullRes.rows[0])
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      next(error);
    }
  },

  approve: async (req, res, next) => {
    req.body.status = 'Approved';
    leaveController.update(req, res, next);
  },

  reject: async (req, res, next) => {
    req.body.status = 'Rejected';
    leaveController.update(req, res, next);
  }
};

module.exports = leaveController;
