const db = require('../config/database');

const formatPayroll = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || '',
    department: row.department || '',
    basicSalary: Number(row.basic_salary) || 0,
    allowances: Number(row.allowances) || 0,
    deductions: Number(row.deductions) || 0,
    netSalary: Number(row.net_salary) || 0,
    status: row.status,
    payoutMonth: row.payout_month,
    processedDate: row.processed_date || '-'
  };
};

const payrollController = {
  getMe: async (req, res, next) => {
    const employeeId = req.user.employeeId;

    try {
      const result = await db.query(
        `SELECT p.*, (e.first_name || ' ' || e.last_name) as employee_name, e.department
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         WHERE p.employee_id = $1
         ORDER BY p.payout_month DESC, p.id DESC`,
        [employeeId]
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatPayroll)
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
        `SELECT p.*, (e.first_name || ' ' || e.last_name) as employee_name, e.department
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         ORDER BY p.payout_month DESC, p.id DESC`
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatPayroll)
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        `SELECT p.*, (e.first_name || ' ' || e.last_name) as employee_name, e.department
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         WHERE p.id = $1`,
        [id]
      );

      const record = result.rows[0];

      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Payroll record not found',
          error: `No payroll record found with ID ${id}`
        });
      }

      if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.employeeId !== record.employee_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Unauthorized to view this record.',
          error: 'Forbidden'
        });
      }

      res.status(200).json({
        success: true,
        data: formatPayroll(record)
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    const { employeeId, basicSalary, allowances, deductions, payoutMonth } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Employee ID is required.'
      });
    }

    const basic = Number(basicSalary) || 0;
    const allow = Number(allowances) || 0;
    const deduct = Number(deductions) || 0;
    const net = basic + allow - deduct;
    const month = payoutMonth || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    try {
      // Verify employee exists
      const empRes = await db.query('SELECT first_name, last_name, department FROM employees WHERE id = $1', [employeeId]);
      const employee = empRes.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: `No employee found with ID ${employeeId}`
        });
      }

      // Check if slip already exists for this month and employee
      const existRes = await db.query(
        'SELECT * FROM payroll WHERE employee_id = $1 AND payout_month = $2',
        [employeeId, month]
      );

      let result;
      if (existRes.rows.length > 0) {
        // Update existing slip
        result = await db.query(
          `UPDATE payroll SET 
            basic_salary = $1, 
            allowances = $2, 
            deductions = $3, 
            net_salary = $4,
            updated_at = CURRENT_TIMESTAMP
           WHERE id = $5
           RETURNING *`,
          [basic, allow, deduct, net, existRes.rows[0].id]
        );
      } else {
        // Insert new slip
        result = await db.query(
          `INSERT INTO payroll (employee_id, basic_salary, allowances, deductions, net_salary, status, payout_month, processed_date)
           VALUES ($1, $2, $3, $4, $5, 'Pending', $6, '-')
           RETURNING *`,
          [employeeId, basic, allow, deduct, net, month]
        );
      }

      // Update employee salary details as well for consistency
      await db.query(
        `UPDATE employees SET 
          basic_salary = $1, 
          allowances = $2, 
          deductions = $3, 
          net_salary = $4,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [basic, allow, deduct, net, employeeId]
      );

      const formatted = formatPayroll(result.rows[0]);
      formatted.employeeName = `${employee.first_name} ${employee.last_name}`;
      formatted.department = employee.department;

      res.status(201).json({
        success: true,
        message: 'Payroll details processed successfully',
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { status, basicSalary, allowances, deductions } = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    try {
      const checkRes = await db.query('SELECT * FROM payroll WHERE id = $1', [id]);
      const record = checkRes.rows[0];

      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Payroll record not found',
          error: `No payroll record found with ID ${id}`
        });
      }

      const basic = basicSalary !== undefined ? Number(basicSalary) : Number(record.basic_salary);
      const allow = allowances !== undefined ? Number(allowances) : Number(record.allowances);
      const deduct = deductions !== undefined ? Number(deductions) : Number(record.deductions);
      const net = basic + allow - deduct;

      const newStatus = status || record.status;
      const processedDate = newStatus === 'Processed' 
        ? new Date().toISOString().split('T')[0] 
        : record.processed_date;

      const result = await db.query(
        `UPDATE payroll SET 
          status = $1,
          basic_salary = $2,
          allowances = $3,
          deductions = $4,
          net_salary = $5,
          processed_date = $6,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [newStatus, basic, allow, deduct, net, processedDate, id]
      );

      // Fetch name and department for return object
      const fullRes = await db.query(
        `SELECT p.*, (e.first_name || ' ' || e.last_name) as employee_name, e.department
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         WHERE p.id = $1`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: 'Payroll record updated successfully',
        data: formatPayroll(fullRes.rows[0])
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = payrollController;
