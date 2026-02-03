const mongoose = require('mongoose');

module.exports = mongoose.model('Notification', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ['order', 'product', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  link: String,
  createdAt: { type: Date, default: Date.now }
}));
