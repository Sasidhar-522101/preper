const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  gateDate: { type: Date },
  loginStreak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  targetTimeline: { type: String, default: '' },
  subjectPlanner: { type: String, default: '' },
  timeTable: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
