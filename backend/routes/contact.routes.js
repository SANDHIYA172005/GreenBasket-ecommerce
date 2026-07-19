const express = require('express');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// ─── POST /api/contact ───────────────────────────────────────
router.post('/', contactController.submitContactForm);

module.exports = router;
