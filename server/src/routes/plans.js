
const router = require('express').Router();
const Plan = require('../models/Plan');
const Route = require('../models/Route');
const auth = require('../middleware/auth');

// Get user's plans with optional status filter
router.get('/', auth(), async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user.id };
    if (status) query.status = status;
    
    const plans = await Plan.find(query)
      .populate('route')
      .populate('gearList.productId')
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new plan
router.post('/', auth(), async (req, res) => {
  try {
    // Verify route exists
    const route = await Route.findById(req.body.route);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    
    const plan = await Plan.create({
      ...req.body,
      user: req.user.id,
      updatedAt: Date.now()
    });
    
    const populated = await Plan.findById(plan._id).populate('route');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update plan
router.put('/:id', auth(), async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    Object.assign(plan, req.body, { updatedAt: Date.now() });
    await plan.save();
    
    const populated = await Plan.findById(plan._id).populate('route').populate('gearList.productId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to gear list
router.post('/:id/gear', auth(), async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    plan.gearList.push(req.body);
    plan.updatedAt = Date.now();
    await plan.save();
    
    const populated = await Plan.findById(plan._id).populate('route').populate('gearList.productId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update gear item status
router.put('/:id/gear/:gearId', auth(), async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    const gearItem = plan.gearList.id(req.params.gearId);
    if (!gearItem) return res.status(404).json({ message: 'Gear item not found' });
    
    Object.assign(gearItem, req.body);
    plan.updatedAt = Date.now();
    await plan.save();
    
    const populated = await Plan.findById(plan._id).populate('route').populate('gearList.productId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete plan
router.delete('/:id', auth(), async (req, res) => {
  try {
    const result = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!result) return res.status(404).json({ message: 'Plan not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
