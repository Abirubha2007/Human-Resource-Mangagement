const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      error: 'Unauthorized'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345!');
    req.user = {
      id: decoded.id, // user_id
      role: decoded.role, // 'admin', 'hr', 'employee'
      employeeId: decoded.employeeId // employee table ID e.g., 'EMP-2026-001'
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: 'Unauthorized'
    });
  }
};

module.exports = authMiddleware;
