const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorizeRoles('MANAGER', 'ADMIN'), createProduct);
router.put('/:id', protect, authorizeRoles('MANAGER', 'ADMIN'), updateProduct);
router.delete('/:id', protect, authorizeRoles('MANAGER', 'ADMIN'), deleteProduct);

module.exports = router;