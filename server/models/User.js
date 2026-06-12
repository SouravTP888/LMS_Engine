const mongoose = require('mongoose');
const jsonDb = require('../config/jsonDb');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  careerGoal: { type: String, enum: ['Full Stack Developer', 'AI Engineer', 'Data Analyst'], default: 'Full Stack Developer' },
  interests: [{ type: String }],
  assignedTrack: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', default: null },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  badges: [{ type: String }]
}, { timestamps: true });

const MongooseUser = mongoose.model('User', userSchema);

module.exports = {
  get User() {
    return global.useJsonDb ? jsonDb.users : MongooseUser;
  }
};
