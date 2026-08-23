const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.post('/', protect, authorizeRoles('MANAGER', 'ADMIN'), createCategory);
router.put('/:id', protect, authorizeRoles('MANAGER', 'ADMIN'), updateCategory);
router.delete('/:id', protect, authorizeRoles('MANAGER', 'ADMIN'), deleteCategory);

module.exports = router;