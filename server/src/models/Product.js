
const mongoose = require('mongoose');

// Product model schema for hiking gear items in the marketplace
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  imageUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));
