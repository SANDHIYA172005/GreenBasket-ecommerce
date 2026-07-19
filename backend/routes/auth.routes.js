const express = require('express');
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// ─── POST /api/auth/register ─────────────────────────────────
router.post('/register', authController.registerUser);

// ─── POST /api/auth/login ────────────────────────────────────
router.post('/login', authController.loginUser);

// ─── GET /api/auth/profile ───────────────────────────────────
router.get('/profile', authMiddleware, authController.getUserProfile);

// ─── PUT /api/auth/profile ───────────────────────────────────
router.put('/profile', authMiddleware, authController.updateUserProfile);

module.exports = router;
