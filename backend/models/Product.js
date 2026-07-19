const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Grains'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  oldPrice: {
    type: Number,
    default: null,
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  organic: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
