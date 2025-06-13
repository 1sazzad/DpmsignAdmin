const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch minimal admin info to ensure user still exists and is valid
      const [admins] = await db.query('SELECT id, email, name FROM admins WHERE id = ?', [decoded.id]);
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user for token not found' });
      }
      req.user = admins[0]; // Attach user object to request
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      let message = 'Not authorized, token failed';
      if (error.name === 'JsonWebTokenError') message = 'Not authorized, invalid token';
      if (error.name === 'TokenExpiredError') message = 'Not authorized, token expired';
      res.status(401).json({ message });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
