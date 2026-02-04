
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Connects to MongoDB database using environment variable
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

const app = express();
app.use(cors());
app.use(express.json());

// Mounts route handlers for different API endpoints
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Starts Express server on configured port
app.listen(process.env.PORT, () =>
  console.log('Server running on ' + process.env.PORT)
);
