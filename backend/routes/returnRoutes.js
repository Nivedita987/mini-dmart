const express = require('express');
const router = express.Router();
const { createReturnRequest, getMyReturns, getAllReturns, updateReturnStatus } = require('../controllers/returnController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, createReturnRequest);
router.get('/my', protect, getMyReturns);
router.get('/all', protect, authorizeRoles('STAFF', 'MANAGER', 'ADMIN'), getAllReturns);
router.put('/:id/status', protect, authorizeRoles('STAFF', 'MANAGER', 'ADMIN'), updateReturnStatus);

module.exports = router;