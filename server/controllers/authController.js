const db = require('../config/db'); // Real DB connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// (Optional) Example: Register a new admin - useful for initial setup
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    try {
        const [existingAdmins] = await db.query('SELECT email FROM admins WHERE email = ?', [email]);
        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await db.query('INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);

        if (result.insertId) {
            const token = generateToken(result.insertId);
            res.status(201).json({
                message: 'Admin registered successfully',
                token: token,
                admin: { id: result.insertId, name, email },
            });
        } else {
            res.status(500).json({ message: 'Error registering admin' });
        }
    } catch (error) {
        console.error('Register admin error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};


exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (isMatch) {
      res.json({
        message: 'Login successful',
        token: generateToken(admin.id),
        admin: { id: admin.id, name: admin.name, email: admin.email },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials (password incorrect)' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user.id is populated by the 'protect' middleware from the JWT
    if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized, user ID missing from token' });
    }
    const [admins] = await db.query('SELECT id, name, email, created_at FROM admins WHERE id = ?', [req.user.id]);
    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admins[0]);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error fetching admin details', error: error.message });
  }
};
