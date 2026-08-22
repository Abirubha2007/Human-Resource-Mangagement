const db = require('../config/database');

const formatDepartment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    employeeCount: parseInt(row.employee_count) || 0,
    head: row.head || 'TBD',
    status: row.status,
    budget: row.budget || '₹0'
  };
};

const departmentController = {
  getAll: async (req, res, next) => {
    try {
      const result = await db.query(
        `SELECT d.*, COALESCE(e.count, 0) as employee_count
         FROM departments d
         LEFT JOIN (
           SELECT department, COUNT(*) as count 
           FROM employees 
           GROUP BY department
         ) e ON d.name = e.department
         ORDER BY d.id ASC`
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(formatDepartment)
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        `SELECT d.*, COALESCE(e.count, 0) as employee_count
         FROM departments d
         LEFT JOIN (
           SELECT department, COUNT(*) as count 
           FROM employees 
           GROUP BY department
         ) e ON d.name = e.department
         WHERE d.id = $1`,
        [id]
      );

      const dept = result.rows[0];

      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
          error: `No department found with ID ${id}`
        });
      }

      res.status(200).json({
        success: true,
        data: formatDepartment(dept)
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

    const { name, head, budget, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Department name is required.'
      });
    }

    try {
      // Check if department name already exists
      const existCheck = await db.query('SELECT * FROM departments WHERE name = $1', [name]);
      if (existCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Operation failed',
          error: 'A department with this name already exists.'
        });
      }

      // Generate DEP-XX format
      const countRes = await db.query('SELECT COUNT(*) FROM departments');
      const nextNum = parseInt(countRes.rows[0].count) + 1;
      const newId = `DEP-${String(nextNum).padStart(2, '0')}`;

      const insertQuery = `
        INSERT INTO departments (id, name, head, budget, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [newId, name, head || 'TBD', budget || '₹0', status || 'Active'];
      const result = await db.query(insertQuery, values);

      const row = result.rows[0];
      row.employee_count = 0; // newly created

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: formatDepartment(row)
      });
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

    const { name, head, budget, status } = req.body;

    try {
      const checkRes = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
      const dept = checkRes.rows[0];

      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
          error: `No department found with ID ${id}`
        });
      }

      const updateQuery = `
        UPDATE departments SET
          name = COALESCE($1, name),
          head = COALESCE($2, head),
          budget = COALESCE($3, budget),
          status = COALESCE($4, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `;

      const result = await db.query(updateQuery, [name, head, budget, status, id]);

      // Calculate count for response
      const countRes = await db.query('SELECT COUNT(*) FROM employees WHERE department = $1', [result.rows[0].name]);
      const employeeCount = parseInt(countRes.rows[0].count) || 0;

      const row = result.rows[0];
      row.employee_count = employeeCount;

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: formatDepartment(row)
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
      const checkRes = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
      const dept = checkRes.rows[0];

      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
          error: `No department found with ID ${id}`
        });
      }

      // Check if there are employees in this department
      const empCountRes = await db.query('SELECT COUNT(*) FROM employees WHERE department = $1', [dept.name]);
      if (parseInt(empCountRes.rows[0].count) > 0) {
        return res.status(400).json({
          success: false,
          message: 'Operation failed',
          error: 'Cannot delete department. There are active employees assigned to it.'
        });
      }

      await db.query('DELETE FROM departments WHERE id = $1', [id]);

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = departmentController;
