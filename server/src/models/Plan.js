
const mongoose = require('mongoose');

module.exports = mongoose.model('Plan', new mongoose.Schema({
  name: { type: String, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  budget: { type: Number },
  duration: { type: Number, required: true }, // days
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['planning', 'confirmed', 'in-progress', 'completed', 'cancelled'], default: 'planning' },
  gearList: [{
    item: String,
    purchased: { type: Boolean, default: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  }],
  notes: String,
  companions: Number, // number of people
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));
