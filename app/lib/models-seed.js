const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Plan Schema
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    distance: Number,
    duration: Number,
    difficulty: String,
    budget: Number,
    createdBy: String,
  },
  { timestamps: true }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: Number,
    category: String,
    createdBy: String,
  },
  { timestamps: true }
);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    username: String,
    items: Array,
    total: Number,
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    createdBy: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Plan = mongoose.model('Plan', planSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { User, Plan, Product, Order };
