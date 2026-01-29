const mongoose = require('mongoose');

module.exports = mongoose.model('Notification', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ['order', 'product', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));
