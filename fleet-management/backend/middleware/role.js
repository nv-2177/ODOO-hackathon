/**
 * Restricts a route to a set of allowed roles.
 * Usage: router.put('/settings', auth, allowRoles('Admin'), handler)
 */
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Your role (${req.user.role}) cannot perform this action.`,
      });
    }
    next();
  };
}

module.exports = allowRoles;
