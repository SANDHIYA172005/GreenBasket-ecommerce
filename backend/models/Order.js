const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false } // no separate _id for sub-documents
);

const statusEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
      required: true,
    },
    timestamp: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'Order must contain at least one item.',
    },
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Placed',
  },
  placedAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
  address: {
    type: String,
    required: [true, 'Delivery address is required'],
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'UPI'],
    required: [true, 'Payment method is required'],
  },
  statusHistory: {
    type: [statusEntrySchema],
    default: [],
  },
});

module.exports = mongoose.model('Order', orderSchema);
