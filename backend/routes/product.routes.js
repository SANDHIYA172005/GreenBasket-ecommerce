const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// ─── GET /api/products/categories ────────────────────────────
// (Must be placed BEFORE /:id to avoid matching 'categories' as an id)
router.get('/categories', productController.getCategories);

// ─── GET /api/products/featured ──────────────────────────────
router.get('/featured', productController.getFeaturedProducts);

// ─── GET /api/products/bestsellers ───────────────────────────
router.get('/bestsellers', productController.getBestSellers);

// ─── GET /api/products ───────────────────────────────────────
router.get('/', productController.getProducts);

// ─── GET /api/products/:id ───────────────────────────────────
router.get('/:id', productController.getProductById);

module.exports = router;
