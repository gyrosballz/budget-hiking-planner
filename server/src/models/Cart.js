const mongoose = require('mongoose');

// Shopping cart model for storing user's selected products before checkout
module.exports = mongoose.model('Cart', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number }]
}));
