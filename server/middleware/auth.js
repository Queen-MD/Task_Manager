const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT id, name, email, is_admin FROM users WHERE id = $1', [decoded.id]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { auth, adminAuth };