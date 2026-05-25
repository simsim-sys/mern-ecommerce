const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, deliverOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/deliver', protect, adminOnly, deliverOrder);

module.exports = router;