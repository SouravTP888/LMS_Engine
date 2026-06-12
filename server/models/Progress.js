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

const ProgressProxy = new Proxy({}, {
  get(target, prop) {
    const activeModel = global.useJsonDb ? jsonDb.progress : MongooseProgress;
    const val = activeModel[prop];
    if (typeof val === 'function') {
      return val.bind(activeModel);
    }
    return val;
  },
  construct(target, argumentsList) {
    const activeModel = global.useJsonDb ? jsonDb.progress : MongooseProgress;
    return Reflect.construct(activeModel, argumentsList);
  }
});

module.exports = {
  Progress: ProgressProxy
};

