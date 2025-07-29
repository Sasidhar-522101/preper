const express = require('express');
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add subject
router.post('/', auth, async (req, res) => {
  try {
    const subject = new Subject({ ...req.body, userId: req.user.id });
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject
router.put('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subject
router.delete('/:id', auth, async (req, res) => {
  try {
    await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
