const mongoose = require('mongoose');
const jsonDb = require('../config/jsonDb');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  completedLessons: [{ type: String }],
  completedModules: [{ type: String }],
  percentage: { type: Number, default: 0 }
}, { timestamps: true });

const MongooseProgress = mongoose.model('Progress', progressSchema);

module.exports = {
  get Progress() {
    return global.useJsonDb ? jsonDb.progress : MongooseProgress;
  }
};
