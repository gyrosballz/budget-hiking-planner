const router = require('express').Router();
const Route = require('../models/Route');

// Fetches hiking routes with optional filtering by search, difficulty, distance, features, and season
router.get('/', async (req, res) => {
  try {
    const { search, difficulty, minDistance, maxDistance, features, trailType, season } = req.query;
    let query = {};
    
    // Search by name or location
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    // Filter by difficulty
    if (difficulty) query.difficulty = difficulty;
    
    // Filter by distance range
    if (minDistance || maxDistance) {
      query.distance = {};
      if (minDistance) query.distance.$gte = parseFloat(minDistance);
      if (maxDistance) query.distance.$lte = parseFloat(maxDistance);
    }
    
    // Filter by features (e.g., waterfall, lake)
    if (features) {
      const featureArray = features.split(',');
      query.features = { $in: featureArray };
    }
    
    // Filter by trail type
    if (trailType) query.trailType = trailType;
    
    // Filter by season
    if (season) query.season = season;
    
    const routes = await Route.find(query).sort({ rating: -1, reviews: -1 });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieves detailed information for a specific hiking route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
