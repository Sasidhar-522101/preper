const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');
const router = express.Router();

// Get history
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ completedDate: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
});

// Add to history
router.post('/', auth, async (req, res) => {
  try {
    const { subject, hoursCompleted, lecturesCompleted } = req.body;
    
    // Validate required fields
    if (!subject || hoursCompleted === undefined || lecturesCompleted === undefined) {
      return res.status(400).json({ 
        message: 'Subject, hoursCompleted, and lecturesCompleted are required' 
      });
    }

    // Create new history entry with unique timestamp
    const history = new History({
      userId: req.user.id,
      subject: subject.toString(),
      hoursCompleted: Number(hoursCompleted),
      lecturesCompleted: Number(lecturesCompleted),
      completedDate: new Date() // Always use current timestamp
    });
    
    await history.save();
    console.log('History saved successfully:', history._id);
    res.json(history);
  } catch (error) {
    console.error('Error saving history:', error);
    
    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      // Create with slightly different timestamp to avoid collision
      try {
        const history = new History({
          userId: req.user.id,
          subject: subject.toString(),
          hoursCompleted: Number(hoursCompleted),
          lecturesCompleted: Number(lecturesCompleted),
          completedDate: new Date(Date.now() + Math.random() * 1000) // Add random milliseconds
        });
        await history.save();
        res.json(history);
        return;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
      }
    }
    
    res.status(500).json({ message: 'Server error saving history' });
  }
});

// Delete history item
router.delete('/:id', auth, async (req, res) => {
  try {
    await History.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'History item deleted' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ message: 'Server error deleting history' });
  }
});

module.exports = router;
