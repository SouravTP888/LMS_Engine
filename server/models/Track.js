const mongoose = require('mongoose');
const jsonDb = require('../config/jsonDb');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoURL: { type: String, required: true },
  duration: { type: String, required: true }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  difficulty: { type: String, required: true },
  duration: { type: String, required: true },
  lessons: [lessonSchema]
});

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  modules: [moduleSchema]
}, { timestamps: true });

const MongooseTrack = mongoose.model('Track', trackSchema);

const TrackProxy = new Proxy({}, {
  get(target, prop) {
    const activeModel = global.useJsonDb ? jsonDb.tracks : MongooseTrack;
    const val = activeModel[prop];
    if (typeof val === 'function') {
      return val.bind(activeModel);
    }
    return val;
  },
  construct(target, argumentsList) {
    const activeModel = global.useJsonDb ? jsonDb.tracks : MongooseTrack;
    return Reflect.construct(activeModel, argumentsList);
  }
});

module.exports = {
  Track: TrackProxy
};

