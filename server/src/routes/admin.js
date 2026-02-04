const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Plan = require('../models/Plan');
const Route = require('../models/Route');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// ========== User Management ==========

// Retrieves all users with optional role filtering for admin oversight
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

// Updates user role and sends notification about account changes
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

// Deletes user account from the platform
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

// Retrieves all products with seller information for admin monitoring
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

// Removes product from marketplace inventory
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

// Fetches all orders with user and product details for admin tracking
router.get('/orders', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email role')
      .populate({
        path: 'items.product',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      })
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
      revenue,
      usersByRole,
      ordersByStatus,
      topProducts,
      lowStockProducts,
      recentRevenue,
      userGrowth
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Plan.countDocuments(),
      Route.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      // Total revenue from completed orders
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: null, total: { $sum: { $multiply: ['$product.price', '$items.qty'] } } } }
      ]),
      // Users by role breakdown
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      // Orders by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Top 5 selling products
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        { $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.qty', 1] } }
        }},
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }},
        { $unwind: '$product' },
        { $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: { $multiply: ['$product.price', '$totalSold'] }
        }}
      ]),
      // Low stock products (stock < 10)
      Product.find({ stock: { $lt: 10 } })
        .select('name stock')
        .sort({ stock: 1 })
        .limit(10),
      // Revenue last 7 days
      Order.aggregate([
        { 
          $match: { 
            status: { $in: ['delivered', 'shipped', 'processing'] },
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: null, total: { $sum: { $multiply: ['$product.price', '$items.qty'] } } } }
      ]),
      // User growth (last 30 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);
    
    // Calculate order completion rate
    const completedOrders = ordersByStatus.find(s => s._id === 'delivered')?.count || 0;
    const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;
    
    res.json({
      // Basic counts
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      plans: totalPlans,
      routes: totalRoutes,
      pendingOrders,
      
      // Revenue metrics
      revenue: revenue[0]?.total || 0,
      revenueLastWeek: recentRevenue[0]?.total || 0,
      
      // Breakdowns
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      
      // Performance metrics
      completionRate: parseFloat(completionRate),
      userGrowth: userGrowth,
      
      // Top performers & alerts
      topProducts: topProducts,
      lowStockProducts: lowStockProducts,
      lowStockCount: lowStockProducts.length
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

// Seller performance metrics
router.get('/stats/sellers', auth(['admin']), async (req, res) => {
  try {
    const sellerPerformance = await Product.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $group: {
          _id: '$seller._id',
          sellerName: { $first: '$seller.name' },
          sellerEmail: { $first: '$seller.email' },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          lowStockItems: {
            $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
          }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);

    // Get sales data for each seller
    const sellersWithSales = await Promise.all(
      sellerPerformance.map(async (seller) => {
        const sales = await Order.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $unwind: '$items' },
          {
            $lookup: {
              from: 'products',
              localField: 'items.product',
              foreignField: '_id',
              as: 'product'
            }
          },
          { $unwind: '$product' },
          { $match: { 'product.createdBy': seller._id } },
          {
            $group: {
              _id: null,
              totalSales: { $sum: '$items.qty' },
              revenue: {
                $sum: { $multiply: ['$product.price', '$items.qty'] }
              }
            }
          }
        ]);

        return {
          ...seller,
          totalSales: sales[0]?.totalSales || 0,
          revenue: sales[0]?.revenue || 0
        };
      })
    );

    res.json(sellersWithSales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
