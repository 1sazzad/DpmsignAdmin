const express = require('express');
const { loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Auth middleware

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getMe); // Example protected route

// router.post('/register', registerAdmin); // If needed

module.exports = router;
