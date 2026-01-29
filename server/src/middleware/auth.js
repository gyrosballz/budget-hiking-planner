
const jwt = require('jsonwebtoken');

module.exports = (roles = []) => (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);
    const token = auth.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(data.role)) return res.sendStatus(403);
    req.user = data;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
