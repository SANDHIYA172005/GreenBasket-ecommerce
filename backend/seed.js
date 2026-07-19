/**
 * Product Seeder — Migrates product data from products.json into MongoDB.
 *
 * Usage:   node seed.js
 *
 * This script:
 *  1. Connects to MongoDB using the MONGO_URI from .env
 *  2. Clears the existing products collection (if any)
 *  3. Inserts all 32 products from data/products.json
 *  4. Logs the result and exits
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

async function seed() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍃 Connected to MongoDB');

    // 2. Read products from JSON file
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    console.log(`📦 Read ${products.length} products from products.json`);

    // 3. Clear existing products (so we don't get duplicates on re-run)
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products collection');

    // 4. Insert all products into MongoDB
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${inserted.length} products into MongoDB`);

    // 5. Disconnect and exit
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
}

seed();
