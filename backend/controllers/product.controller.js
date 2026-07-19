const Product = require('../models/Product');

// ─── Controller Methods ──────────────────────────────────────

exports.getCategories = (_req, res) => {
  res.json({ success: true, categories: ['Fruits', 'Vegetables', 'Dairy', 'Grains'] });
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const products = await Product.find({ featured: true }).limit(limit);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.getBestSellers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const products = await Product.find({ bestSeller: true }).limit(limit);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { q, category, maxPrice, organic, onSale } = req.query;

    // Build MongoDB filter object
    const filter = {};

    // Free-text search (case-insensitive regex on name and description)
    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Max price filter
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filter.price = { $lte: max };
      }
    }

    // Organic only
    if (organic === 'true') {
      filter.organic = true;
    }

    // On sale only (products with oldPrice greater than current price)
    if (onSale === 'true') {
      filter.oldPrice = { $ne: null };
      filter.$expr = { $gt: ['$oldPrice', '$price'] };
    }

    const products = await Product.find(filter);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};
