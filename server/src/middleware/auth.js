
const jwt = require('jsonwebtoken');

// Authentication middleware to verify JWT tokens and enforce role-based access control
module.exports = (roles = []) => (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);
    const token = auth.split(' ')[1];
    if (!token) return res.sendStatus(401);
    // Verifies JWT token and extracts user data
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // Checks if user has required role permission
    if (roles.length && !roles.includes(data.role)) return res.sendStatus(403);
    req.user = data;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
