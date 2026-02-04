
const mongoose = require('mongoose');

// Order model schema for tracking purchased items and fulfillment status
module.exports = mongoose.model('Order', new mongoose.Schema({
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number }],
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));
