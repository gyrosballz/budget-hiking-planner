const router = require('express').Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Retrieves all notifications for authenticated user with order details
router.get('/', auth(), async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate({
      path: 'order',
      populate: {
        path: 'user',
        select: 'name email role'
      }
    })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

// Marks notification as read to update unread count
router.post('/:id/read', auth(), async (req, res) => {
  res.json(await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true }));
});

// Deletes notification from user's notification list
router.delete('/:id', auth(), async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
