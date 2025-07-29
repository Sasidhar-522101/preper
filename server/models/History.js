const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  hoursCompleted: { type: Number, required: true },
  lecturesCompleted: { type: Number, required: true },
  completedDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Remove any unique indexes that might be causing issues
HistorySchema.index({ userId: 1, completedDate: 1 });

module.exports = mongoose.model('History', HistorySchema);
