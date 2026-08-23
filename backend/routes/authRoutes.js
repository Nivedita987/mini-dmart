const express = require('express');
const router = express.Router();

// Synchronized Imports
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes

router.get('/profile', protect, getProfile);

// RBAC Test Routes
router.get('/admin-test', protect, authorizeRoles('ADMIN'), (req, res) => {
    res.json({ message: "Admin access verified" });
});

module.exports = router;