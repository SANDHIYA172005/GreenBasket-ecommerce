const Order = require('../models/Order');

const STATUS_SEQUENCE = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

// ─── Controller Methods ──────────────────────────────────────

exports.createOrder = async (req, res, next) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: 'Delivery address is required.' });
    }
    if (!paymentMethod || !['COD', 'Card', 'UPI'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Valid payment method (COD, Card, UPI) is required.' });
    }

    // Build order items and calculate total
    const orderItems = items.map(i => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      unit: i.unit,
    }));
    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const now = new Date().toISOString();

    const order = await Order.create({
      orderId: 'OGS' + Date.now().toString().slice(-8),
      userId: req.user.id,
      items: orderItems,
      total,
      status: 'Placed',
      placedAt: now,
      address,
      paymentMethod,
      statusHistory: [{ status: 'Placed', timestamp: now }],
    });

    res.status(201).json({ success: true, message: 'Order placed successfully.', order });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ placedAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.advanceOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const currentIndex = STATUS_SEQUENCE.indexOf(order.status);

    if (currentIndex === STATUS_SEQUENCE.length - 1) {
      return res.status(400).json({ success: false, message: 'Order is already delivered.' });
    }

    const nextStatus = STATUS_SEQUENCE[currentIndex + 1];
    order.status = nextStatus;
    order.statusHistory.push({ status: nextStatus, timestamp: new Date().toISOString() });

    await order.save();

    res.json({ success: true, message: `Order advanced to "${nextStatus}".`, order });
  } catch (err) {
    next(err);
  }
};
