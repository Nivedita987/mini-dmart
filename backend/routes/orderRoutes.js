const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderDetails, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

router.get('/all', protect, authorizeRoles('ADMIN', 'MANAGER', 'STAFF'), getAllOrders);
router.get('/:id', protect, getOrderDetails);
router.delete('/:id', protect, cancelOrder);
router.put('/:id/status', protect, authorizeRoles('ADMIN', 'MANAGER', 'STAFF'), updateOrderStatus);

module.exports = router;    