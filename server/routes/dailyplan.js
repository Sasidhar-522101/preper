const express = require('express');
const DailyPlan = require('../models/DailyPlan');
const auth = require('../middleware/auth');
const router = express.Router();

// Get daily plans (remove the completed filter)
router.get('/', auth, async (req, res) => {
  try {
    const plans = await DailyPlan.find({ userId: req.user.id });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add daily plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = new DailyPlan({ ...req.body, userId: req.user.id });
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update daily plan
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await DailyPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete daily plan
router.delete('/:id', auth, async (req, res) => {
  try {
    await DailyPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
