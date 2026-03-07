const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const userRole = req.user.role?.toLowerCase?.();
  if (userRole !== role) return res.status(403).json({ message: "Forbidden" });
  next();
};

export default requireRole;
