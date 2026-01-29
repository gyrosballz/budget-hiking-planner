
const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Create order (from checkout or direct order)
router.post('/', auth(), async (req, res) => {
  try {
    // Verify stock availability
    for (const item of req.body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
    }
    
    // Update inventory
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }
    
    // Create order
    const order = await Order.create({ ...req.body, user: req.user.id });
    
    // Create notification for order creation
    await Notification.create({
      user: req.user.id,
      title: 'Order Confirmed',
      message: `Your order #${order._id.toString().slice(-6)} has been confirmed and is being processed.`,
      type: 'order',
      link: `/orders`
    });
    
    const populated = await Order.findById(order._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders (role-based)
router.get('/', auth(), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    // Filter by status if provided
    if (status) query.status = status;
    
    // Admin and sellers see all orders, users see only their own
    if (['admin', 'seller'].includes(req.user.role)) {
      const orders = await Order.find(query)
        .populate('items.product')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      res.json(orders);
    } else {
      query.user = req.user.id;
      const orders = await Order.find(query)
        .populate('items.product')
        .sort({ createdAt: -1 });
      res.json(orders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order details
router.get('/:id', auth(), async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only see their own orders
    if (!['admin', 'seller'].includes(req.user.role)) {
      query.user = req.user.id;
    }
    
    const order = await Order.findOne(query)
      .populate('items.product')
      .populate('user', 'name email');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (admin/seller only) with automatic notifications
router.put('/:id/status', auth(['admin', 'seller']), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('items.product').populate('user');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Create notification based on status
    const notifications = {
      processing: {
        title: 'Order Processing',
        message: `Your order #${order._id.toString().slice(-6)} is now being processed.`
      },
      shipped: {
        title: 'Order Shipped',
        message: `Great news! Your order #${order._id.toString().slice(-6)} has been shipped and is on its way.`
      },
      delivered: {
        title: 'Order Delivered',
        message: `Your order #${order._id.toString().slice(-6)} has been delivered. Enjoy your hiking gear!`
      },
      cancelled: {
        title: 'Order Cancelled',
        message: `Your order #${order._id.toString().slice(-6)} has been cancelled. Your refund will be processed within 3-5 business days.`
      }
    };
    
    if (notifications[status]) {
      await Notification.create({
        user: order.user._id,
        title: notifications[status].title,
        message: notifications[status].message,
        type: 'order',
        link: `/orders`
      });
    }
    
    // If cancelled, restore inventory
    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.qty } });
      }
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
