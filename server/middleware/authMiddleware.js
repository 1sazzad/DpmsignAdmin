// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes to { adminId: ..., iat: ..., exp: ... }

      // Fetch user details from Admins table using adminId
      const [admins] = await db.query('SELECT adminId, email, name, phone, avatar FROM `Admins` WHERE adminId = ?', [decoded.adminId]);
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user for token not found' });
      }
      req.user = admins[0]; // Attach user object (with adminId, email, name etc.) to request
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
