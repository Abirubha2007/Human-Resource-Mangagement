// Restrict route access to specific roles
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication required.',
        error: 'Unauthorized'
      });
    }

    const { role } = req.user;

    // Check if user's role is in the list of allowed roles
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Insufficient permissions.',
        error: 'Forbidden'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
