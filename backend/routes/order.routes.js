const express = require('express');
const authMiddleware = require('../middleware/auth');
const orderController = require('../controllers/order.controller');

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// ─── POST /api/orders ────────────────────────────────────────
router.post('/', orderController.createOrder);

// ─── GET /api/orders ─────────────────────────────────────────
router.get('/', orderController.getOrders);

// ─── GET /api/orders/:id ─────────────────────────────────────
router.get('/:id', orderController.getOrderById);

// ─── PATCH /api/orders/:id/advance ───────────────────────────
router.patch('/:id/advance', orderController.advanceOrderStatus);

module.exports = router;
