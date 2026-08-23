const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartQty, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartQty);
router.delete('/remove/:productId', protect, removeFromCart);

module.exports = router;