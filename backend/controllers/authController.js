const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res, next) => {
    const { employeeId, firstName, lastName, email, password, role } = req.body;

    if (!employeeId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'All fields are required'
      });
    }

    try {
      // 1. Check if user already exists with this email or employeeId
      const userCheck = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (userCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Operation failed',
          error: 'Email already registered.'
        });
      }

      // 2. Check employees table for the provided employeeId
      const employeeCheck = await db.query(
        'SELECT * FROM employees WHERE id = ?',
        [employeeId]
      );

      let employeeRecord = employeeCheck.rows[0];

      if (employeeRecord && employeeRecord.user_id) {
        return res.status(409).json({
          success: false,
          message: 'Operation failed',
          error: 'Employee ID already registered.'
        });
      }

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const targetRole = role || 'employee';

      // Start transaction
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Insert into users
        const userInsert = await client.query(
          'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?) ',
          [email.toLowerCase(), passwordHash, targetRole]
        );
        const newUserId = userInsert.rows[0].id;

        if (employeeRecord) {
          // Employee profile exists (e.g. created by admin), link it
          await client.query(
            'UPDATE employees SET user_id = ?, role = ? WHERE id = ?',
            [newUserId, targetRole, employeeId]
          );
        } else {
          // Create new employee profile
          const randomAvatarSeed = 1500000000000 + Math.floor(Math.random() * 500000);
          const defaultAvatar = `https://images.unsplash.com/photo-${randomAvatarSeed}?q=80&w=256&auto=format&fit=crop`;
          
          await client.query(
            `INSERT INTO employees (
              id, user_id, first_name, last_name, email, role, avatar, 
              phone, address, department, job_title, joining_date, status,
              basic_salary, allowances, deductions, net_salary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, ?, ?, ?, ?, ?)`,
            [
              employeeId,
              newUserId,
              firstName,
              lastName,
              email.toLowerCase(),
              targetRole,
              defaultAvatar,
              '+91 99999 88888',
              'Dayflow Head Office, Bengaluru, India',
              targetRole === 'admin' ? 'Human Resources' : 'Engineering',
              targetRole === 'admin' ? 'HR Coordinator' : 'Associate Engineer',
              'Active',
              60000.00,
              10000.00,
              5000.00,
              65000.00
            ]
          );

          // Create leave balances
          await client.query(
            `INSERT INTO leave_balances (
              employee_id, annual_total, annual_used, annual_remaining,
              sick_total, sick_used, sick_remaining, unpaid_total, unpaid_used, unpaid_remaining
            ) VALUES (?, 18, 0, 18, 12, 0, 12, 10, 0, 10)`,
            [employeeId]
          );
        }

        await client.query('COMMIT');
        
        res.status(201).json({
          success: true,
          message: 'Account created successfully!'
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

  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Email and password are required'
      });
    }

    try {
      const userRes = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      const user = userRes.rows[0];

      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed',
          error: 'Invalid email address or password.'
        });
      }

      // Fetch employee profile
      const empRes = await db.query(
        'SELECT * FROM employees WHERE user_id = ?',
        [user.id]
      );

      const employee = empRes.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Operation failed',
          error: 'Employee profile not found.'
        });
      }

      // Formulate standard return structure matching the frontend expectations
      const userProfile = {
        id: employee.id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        department: employee.department,
        jobTitle: employee.job_title,
        joiningDate: employee.joining_date ? employee.joining_date.toISOString().split('T')[0] : '',
        status: employee.status,
        role: employee.role,
        avatar: employee.avatar,
        salaryDetails: {
          basicSalary: Number(employee.basic_salary),
          allowances: Number(employee.allowances),
          deductions: Number(employee.deductions),
          netSalary: Number(employee.net_salary)
        }
      };

      const token = jwt.sign(
        { id: user.id, role: user.role, employeeId: employee.id },
        process.env.JWT_SECRET || 'supersecretjwtkey12345!',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userProfile,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  me: async (req, res, next) => {
    try {
      const empRes = await db.query(
        'SELECT * FROM employees WHERE user_id = ?',
        [req.user.id]
      );

      const employee = empRes.rows[0];

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
          error: 'Employee profile could not be resolved.'
        });
      }

      const userProfile = {
        id: employee.id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        department: employee.department,
        jobTitle: employee.job_title,
        joiningDate: employee.joining_date ? employee.joining_date.toISOString().split('T')[0] : '',
        status: employee.status,
        role: employee.role,
        avatar: employee.avatar,
        salaryDetails: {
          basicSalary: Number(employee.basic_salary),
          allowances: Number(employee.allowances),
          deductions: Number(employee.deductions),
          netSalary: Number(employee.net_salary)
        }
      };

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: userProfile
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
