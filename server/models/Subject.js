const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  totalHours: { type: Number, default: 0 },
  totalLectures: { type: Number, default: 0 },
  completedHours: { type: Number, default: 0 },
  completedLectures: { type: Number, default: 0 },
  sources: [{ type: String }],
  revisionCount: { type: Number, default: 0 },
  pyqsSolved: { type: Number, default: 0 },
  pyqsYear: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
