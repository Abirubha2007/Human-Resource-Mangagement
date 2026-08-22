const db = require('../config/database');

// Helper to format database employee rows to frontend camelCase format
const formatEmployee = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || '',
    address: row.address || '',
    department: row.department || '',
    jobTitle: row.job_title || '',
    joiningDate: row.joining_date ? new Date(row.joining_date).toISOString().split('T')[0] : '',
    status: row.status,
    role: row.role,
    avatar: row.avatar || '',
    salaryDetails: {
      basicSalary: Number(row.basic_salary) || 0,
      allowances: Number(row.allowances) || 0,
      deductions: Number(row.deductions) || 0,
      netSalary: Number(row.net_salary) || 0
    }
  };
};

const employeeController = {
  getAll: async (req, res, next) => {
    // Only Admin/HR can view all employees
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    const { search, department, status, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      let queryText = 'SELECT * FROM employees WHERE 1=1';
      const params = [];
      let paramCount = 1;

      if (search) {
        queryText += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR id ILIKE $${paramCount})`;
        params.push(`%${search}%`);
        paramCount++;
      }

      if (department) {
        queryText += ` AND department = $${paramCount}`;
        params.push(department);
        paramCount++;
      }

      if (status) {
        queryText += ` AND status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      // Get total count for pagination metadata
      const countRes = await db.query(
        queryText.replace('SELECT * FROM employees', 'SELECT COUNT(*) FROM employees'),
        params
      );
      const totalItems = parseInt(countRes.rows[0].count);

      // Add ordering, limit and offset
      queryText += ` ORDER BY id ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(Number(limit), offset);

      const employeesRes = await db.query(queryText, params);
      const employees = employeesRes.rows.map(formatEmployee);

      res.status(200).json({
        success: true,
        message: 'Employees retrieved successfully',
        data: {
          employees,
          pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / Number(limit)),
            currentPage: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;

    // Admin/HR can view any employee; standard employees can only view themselves
    if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.employeeId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view other employees\' private records.',
        error: 'Forbidden'
      });
    }

    try {
      const empRes = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
      const employee = empRes.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: `No employee found with ID ${id}`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Employee retrieved successfully',
        data: formatEmployee(employee)
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

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      department,
      jobTitle,
      joiningDate,
      status,
      role,
      avatar,
      basicSalary,
      allowances,
      deductions
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'First name, last name, and email are required.'
      });
    }

    try {
      // Check if employee with email already exists
      const emailCheck = await db.query('SELECT * FROM employees WHERE email = $1', [email.toLowerCase()]);
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Operation failed',
          error: 'An employee with this email already exists.'
        });
      }

      // Generate a new custom sequential employee ID: EMP-2026-XXX
      const maxIdRes = await db.query("SELECT id FROM employees ORDER BY id DESC LIMIT 1");
      let nextIdNum = 1;
      if (maxIdRes.rows.length > 0) {
        const lastId = maxIdRes.rows[0].id;
        const idParts = lastId.split('-');
        if (idParts.length === 3) {
          nextIdNum = parseInt(idParts[2]) + 1;
        }
      }
      const newEmployeeId = `EMP-2026-${String(nextIdNum).padStart(3, '0')}`;

      // Calculations
      const basic = Number(basicSalary) || 50000;
      const allow = Number(allowances) || 10000;
      const deduct = Number(deductions) || 5000;
      const net = basic + allow - deduct;

      const randomAvatarSeed = 1500000000000 + Math.floor(Math.random() * 500000);
      const defaultAvatar = avatar || `https://images.unsplash.com/photo-${randomAvatarSeed}?q=80&w=256&auto=format&fit=crop`;

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        const insertQuery = `
          INSERT INTO employees (
            id, first_name, last_name, email, phone, address, department,
            job_title, joining_date, status, role, avatar,
            basic_salary, allowances, deductions, net_salary
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING *
        `;

        const values = [
          newEmployeeId,
          firstName,
          lastName,
          email.toLowerCase(),
          phone || '',
          address || '',
          department || 'Engineering',
          jobTitle || 'Associate Engineer',
          joiningDate || new Date().toISOString().split('T')[0],
          status || 'Active',
          role || 'employee',
          defaultAvatar,
          basic,
          allow,
          deduct,
          net
        ];

        const result = await client.query(insertQuery, values);

        // Create default leave balances
        await client.query(
          `INSERT INTO leave_balances (
            employee_id, annual_total, annual_used, annual_remaining,
            sick_total, sick_used, sick_remaining, unpaid_total, unpaid_used, unpaid_remaining
          ) VALUES ($1, 18, 0, 18, 12, 0, 12, 10, 0, 10)`,
          [newEmployeeId]
        );

        await client.query('COMMIT');

        res.status(201).json({
          success: true,
          message: 'Employee created successfully',
          data: formatEmployee(result.rows[0])
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

  update: async (req, res, next) => {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    try {
      // Find employee
      const empCheck = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
      const employee = empCheck.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: `No employee found with ID ${id}`
        });
      }

      // Extract details
      const {
        firstName,
        lastName,
        email,
        phone,
        address,
        department,
        jobTitle,
        joiningDate,
        status,
        role,
        avatar,
        basicSalary,
        allowances,
        deductions
      } = req.body;

      const basic = basicSalary !== undefined ? Number(basicSalary) : Number(employee.basic_salary);
      const allow = allowances !== undefined ? Number(allowances) : Number(employee.allowances);
      const deduct = deductions !== undefined ? Number(deductions) : Number(employee.deductions);
      const net = basic + allow - deduct;

      const updateQuery = `
        UPDATE employees SET
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          address = COALESCE($5, address),
          department = COALESCE($6, department),
          job_title = COALESCE($7, job_title),
          joining_date = COALESCE($8, joining_date),
          status = COALESCE($9, status),
          role = COALESCE($10, role),
          avatar = COALESCE($11, avatar),
          basic_salary = $12,
          allowances = $13,
          deductions = $14,
          net_salary = $15,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *
      `;

      const values = [
        firstName,
        lastName,
        email ? email.toLowerCase() : null,
        phone,
        address,
        department,
        jobTitle,
        joiningDate,
        status,
        role,
        avatar,
        basic,
        allow,
        deduct,
        net,
        id
      ];

      const result = await db.query(updateQuery, values);

      // If user_id exists, sync email/role in users table
      if (employee.user_id) {
        await db.query(
          'UPDATE users SET email = COALESCE($1, email), role = COALESCE($2, role), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [email ? email.toLowerCase() : null, role, employee.user_id]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: formatEmployee(result.rows[0])
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
        error: 'Forbidden'
      });
    }

    try {
      const empCheck = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
      const employee = empCheck.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: `No employee found with ID ${id}`
        });
      }

      // Delete transaction (Cascade deletes user, leave balances, attendance, payroll)
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Delete from employees
        await client.query('DELETE FROM employees WHERE id = $1', [id]);

        // Delete from users if linked
        if (employee.user_id) {
          await client.query('DELETE FROM users WHERE id = $1', [employee.user_id]);
        }

        await client.query('COMMIT');

        res.status(200).json({
          success: true,
          message: 'Employee and related records deleted successfully'
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

  getMe: async (req, res, next) => {
    try {
      const empRes = await db.query('SELECT * FROM employees WHERE id = $1', [req.user.employeeId]);
      const employee = empRes.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: 'Current profile could not be retrieved.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: formatEmployee(employee)
      });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req, res, next) => {
    const { phone, address, avatar, firstName, lastName } = req.body;

    try {
      // Employees are allowed to update phone, address, avatar, first name, last name
      const updateQuery = `
        UPDATE employees SET
          phone = COALESCE($1, phone),
          address = COALESCE($2, address),
          avatar = COALESCE($3, avatar),
          first_name = COALESCE($4, first_name),
          last_name = COALESCE($5, last_name),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
      `;

      const result = await db.query(updateQuery, [phone, address, avatar, firstName, lastName, req.user.employeeId]);
      const updated = result.rows[0];

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          error: 'Current profile could not be updated.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: formatEmployee(updated)
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  employeeController,
  formatEmployee
};
