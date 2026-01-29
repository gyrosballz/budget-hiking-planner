const router = require('express').Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
  res.json(await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }));
});

router.post('/:id/read', auth(), async (req, res) => {
  res.json(await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true }));
});

router.delete('/:id', auth(), async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
