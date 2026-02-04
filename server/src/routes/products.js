
const router = require('express').Router();
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Retrieves all products from database for store display
router.get('/', async (_,res)=> res.json(await Product.find()));

// Creates new product and sends low stock alert if applicable
router.post('/', auth(['seller','admin']), async (req,res)=>{
  const product = await Product.create({...req.body, createdBy:req.user.id});
  
  // Send notification if created with low stock
  if (product.stock < 10) {
    await Notification.create({
      user: req.user.id,
      title: product.stock < 5 ? '🚨 Critical Stock Alert' : '⚠️ Low Stock Alert',
      message: `New product "${product.name}" was created with ${product.stock < 5 ? 'critically low' : 'low'} stock (${product.stock} units).`,
      type: 'product',
      link: '/seller'
    });
  }
  
  res.json(product);
});

// Updates product details and triggers low stock notifications
router.put('/:id', auth(['seller','admin']), async (req,res)=>{
  const oldProduct = await Product.findById(req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
  
  // Send notification if stock is now low (and wasn't before)
  if (product.stock < 10 && oldProduct && oldProduct.stock >= 10) {
    await Notification.create({
      user: product.createdBy,
      title: product.stock < 5 ? '🚨 Critical Stock Alert' : '⚠️ Low Stock Alert',
      message: `${product.name} stock updated to ${product.stock} unit${product.stock !== 1 ? 's' : ''}. Please restock soon.`,
      type: 'product',
      link: '/seller'
    });
  }
  
  res.json(product);
});

// Deletes product from inventory (admin only)
router.delete('/:id', auth(['admin']), async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
