const mongoose = require('mongoose');

const DailyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  targetHours: { type: Number, required: true },
  targetLectures: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DailyPlan', DailyPlanSchema);
