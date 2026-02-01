const mongoose = require('mongoose');

module.exports = mongoose.model('Route', new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], required: true },
  distance: { type: Number, required: true }, // miles
  elevation: Number, // feet
  duration: Number, // hours
  description: String,
  location: { type: String, required: true },
  trailType: { type: String, enum: ['loop', 'out-and-back', 'point-to-point'], default: 'out-and-back' },
  features: [{ type: String, enum: ['waterfall', 'lake', 'river', 'views', 'wildlife', 'wildflowers', 'dogs-allowed', 'kid-friendly', 'camping'] }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  surface: { type: String, enum: ['paved', 'gravel', 'dirt', 'rocky'], default: 'dirt' },
  season: [{ type: String, enum: ['spring', 'summer', 'fall', 'winter'] }],
  photos: [String], // URLs
  coordinates: {
    lat: Number,
    lng: Number
  },
  // Water and nutrition requirements
  waterLiters: { type: Number, default: 2 }, // Recommended liters of water
  caloriesNeeded: { type: Number, default: 500 }, // Estimated calories needed
  nutritionNotes: String, // Additional nutrition tips
  // Recommended gear
  recommendedGear: [{
    name: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    priority: { type: String, enum: ['essential', 'recommended', 'optional'], default: 'recommended' }
  }],
  createdAt: { type: Date, default: Date.now }
}));
