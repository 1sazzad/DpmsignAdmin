// server/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (adminId) => {
  return jwt.sign({ adminId: adminId }, process.env.JWT_SECRET, { // Use adminId
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// Register Admin - adapted for user's schema
exports.registerAdmin = async (req, res) => {
    const { name, email, password, phone, avatar } = req.body; // phone is NOT NULL
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Please provide name, email, phone, and password' });
    }

    try {
        const [existingAdmins] = await db.query('SELECT email FROM Admins WHERE email = ?', [email]);
        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // Use your column name 'password' for the hash

        // Using backticks for table and column names if they are case sensitive or reserved words (though Admins and password are not typically)
        const [result] = await db.query(
            'INSERT INTO `Admins` (name, email, phone, password, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [name, email, phone, hashedPassword, avatar || null]
        );

        if (result.insertId) {
            const token = generateToken(result.insertId);
            res.status(201).json({
                message: 'Admin registered successfully',
                token: token,
                admin: { adminId: result.insertId, name, email, phone, avatar: avatar || null },
            });
        } else {
            res.status(500).json({ message: 'Error registering admin' });
        }
    } catch (error) {
        console.error('Register admin error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// Login Admin - adapted for user's schema
exports.loginAdmin = async (req, res) => {
  const { email, password: plainPassword } = req.body; // 'password' from body is plain text
  if (!email || !plainPassword) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const [admins] = await db.query('SELECT adminId, name, email, phone, password, avatar FROM `Admins` WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const admin = admins[0];
    // 'admin.password' from DB is the hashed password
    const isMatch = await bcrypt.compare(plainPassword, admin.password);

    if (isMatch) {
      res.json({
        message: 'Login successful',
        token: generateToken(admin.adminId), // Use adminId
        admin: {
            adminId: admin.adminId,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            avatar: admin.avatar
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials (password incorrect)' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get Me - adapted for user's schema
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.adminId) { // req.user.adminId set by middleware
         return res.status(401).json({ message: 'Not authorized, user ID missing from token' });
    }
    const [admins] = await db.query('SELECT adminId, name, email, phone, avatar, createdAt FROM `Admins` WHERE adminId = ?', [req.user.adminId]);
    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admins[0]);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error fetching admin details', error: error.message });
  }
};
