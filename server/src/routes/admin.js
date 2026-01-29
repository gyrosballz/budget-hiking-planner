const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Plan = require('../models/Plan');
const Route = require('../models/Route');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// ========== User Management ==========

router.get('/users', auth(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/role', auth(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'seller', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Notify user of role change
    await Notification.create({
      user: user._id,
      title: 'Account Updated',
      message: `Your account role has been changed to ${role}.`,
      type: 'system'
    });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', auth(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== Product Management ==========

router.get('/products', auth(['admin']), async (req, res) => {
  try {
    const products = await Product.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', auth(['admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== Order Management ==========

router.get('/orders', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', auth(['admin', 'seller']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('user').populate('items.product');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Create notification for status change
    const notifications = {
      processing: 'Your order is now being processed.',
      shipped: 'Your order has been shipped!',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.'
    };
    
    if (notifications[status]) {
      await Notification.create({
        user: order.user._id,
        title: `Order ${status}`,
        message: notifications[status],
        type: 'order',
        link: `/orders`
      });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== Analytics & Reports ==========

// Dashboard stats
router.get('/stats', auth(['admin']), async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalPlans,
      totalRoutes,
      pendingOrders,
      revenue
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Plan.countDocuments(),
      Route.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: null, total: { $sum: { $multiply: ['$product.price', '$items.qty'] } } } }
      ])
    ]);
    
    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      plans: totalPlans,
      routes: totalRoutes,
      pendingOrders,
      revenue: revenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Order statistics by status
router.get('/stats/orders', auth(['admin']), async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Top selling products
router.get('/stats/products', auth(['admin']), async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.qty' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
    
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Popular routes
router.get('/stats/routes', auth(['admin']), async (req, res) => {
  try {
    const popularRoutes = await Plan.aggregate([
      {
        $group: {
          _id: '$route',
          planCount: { $sum: 1 }
        }
      },
      { $sort: { planCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'route'
        }
      },
      { $unwind: '$route' }
    ]);
    
    res.json(popularRoutes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User activity report
router.get('/stats/users', auth(['admin']), async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(userStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Recent activity feed
router.get('/activity', auth(['admin']), async (req, res) => {
  try {
    const [recentOrders, recentPlans, recentUsers] = await Promise.all([
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id status createdAt user'),
      Plan.find()
        .populate('user', 'name')
        .populate('route', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id name createdAt user route'),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id name email role createdAt')
    ]);
    
    res.json({
      recentOrders,
      recentPlans,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
