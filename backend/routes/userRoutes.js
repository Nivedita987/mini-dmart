const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');


router.get('/', protect, authorizeRoles('ADMIN'), userController.getAllUsers);

router.put('/:id/role', protect, authorizeRoles('ADMIN'), userController.updateUserRole);

module.exports = router;