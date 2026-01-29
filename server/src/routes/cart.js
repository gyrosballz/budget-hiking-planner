const router = require('express').Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.json(cart);
});

router.post('/items', auth(), async (req, res) => {
  const { product, qty = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  const idx = cart.items.findIndex(i => i.product.toString() === product);
  const itemQty = Number(qty) || 0;
  const prod = await Product.findById(product);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  if (itemQty <= 0) return res.status(400).json({ message: 'Invalid quantity' });
  if (prod.stock < itemQty) {
    return res.status(400).json({ message: `Insufficient stock for ${prod.name}. Available: ${prod.stock}` });
  }

  if (idx >= 0) {
    cart.items[idx].qty += itemQty;
  } else {
    cart.items.push({ product, qty: itemQty });
  }

  // Reserve stock immediately on add-to-cart
  await Product.findByIdAndUpdate(product, { $inc: { stock: -itemQty } });
  await cart.save();
  res.json(await cart.populate('items.product'));
});

router.put('/items/:productId', auth(), async (req, res) => {
  const { qty } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.sendStatus(404);
  const idx = cart.items.findIndex(i => i.product.toString() === req.params.productId);
  if (idx < 0) return res.sendStatus(404);
  const currentQty = cart.items[idx].qty;
  const newQty = Number(qty) || 0;
  const delta = newQty - currentQty;

  if (newQty <= 0) {
    // Restore reserved stock
    await Product.findByIdAndUpdate(req.params.productId, { $inc: { stock: currentQty } });
    cart.items.splice(idx, 1);
  } else {
    if (delta > 0) {
      const prod = await Product.findById(req.params.productId);
      if (!prod || prod.stock < delta) {
        return res.status(400).json({ message: `Insufficient stock for ${prod?.name || 'item'}. Available: ${prod?.stock || 0}` });
      }
      await Product.findByIdAndUpdate(req.params.productId, { $inc: { stock: -delta } });
    }
    if (delta < 0) {
      await Product.findByIdAndUpdate(req.params.productId, { $inc: { stock: -delta } });
    }
    cart.items[idx].qty = newQty;
  }
  await cart.save();
  res.json(await cart.populate('items.product'));
});

router.delete('/items/:productId', auth(), async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.sendStatus(404);
  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (item) {
    await Product.findByIdAndUpdate(req.params.productId, { $inc: { stock: item.qty } });
  }
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(await cart.populate('items.product'));
});

router.post('/checkout', auth(), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Stock already reserved at add-to-cart
    
    // Create order
    const order = await Order.create({ 
      items: cart.items.map(i => ({ product: i.product._id, qty: i.qty })), 
      user: req.user.id 
    });
    
    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      user: req.user.id,
      title: 'Order Confirmed',
      message: `Your order #${order._id.toString().slice(-6)} has been confirmed. Total items: ${cart.items.length}`,
      type: 'order',
      link: `/orders`
    });
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    const populated = await Order.findById(order._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
