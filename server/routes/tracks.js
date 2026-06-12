const express = require('express');
const router = express.Router();
const { Track } = require('../models/Track');
const { User } = require('../models/User');
const { Progress } = require('../models/Progress');
const { protect, admin } = require('../middleware/auth');
const { recommendTrack } = require('../services/automationEngine');

router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find({});
    res.json({ success: true, tracks });
  } catch (error) {
    console.error('Fetch tracks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tracks' });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, difficulty, modules } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and difficulty' });
    }

    const newTrack = await Track.create({
      title,
      description,
      difficulty,
      modules: modules || []
    });

    res.status(201).json({ success: true, track: newTrack });
  } catch (error) {
    console.error('Create track error:', error);
    res.status(500).json({ success: false, message: 'Server error creating track' });
  }
});

router.post('/assign', protect, async (req, res) => {
  try {
    const { careerGoal, skillLevel, interests, trackId } = req.body;
    
    const updates = {};
    if (careerGoal) updates.careerGoal = careerGoal;
    if (skillLevel) updates.skillLevel = skillLevel;
    if (interests) updates.interests = interests;

    let targetTrack = null;
    
    if (trackId) {
      targetTrack = await Track.findById(trackId);
    } else {
      const tracks = await Track.find({});
      const goal = careerGoal || req.user.careerGoal;
      const skill = skillLevel || req.user.skillLevel;
      targetTrack = recommendTrack(goal, skill, tracks);
    }

    if (!targetTrack) {
      return res.status(404).json({ success: false, message: 'No suitable track found' });
    }

    updates.assignedTrack = targetTrack._id;

    let updatedUser;
    if (!global.useJsonDb) {
      updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    } else {
      updatedUser = await User.findByIdAndUpdate(req.user._id, updates);
    }

    let userProgress = await Progress.findOne({ userId: req.user._id, trackId: targetTrack._id });
    if (!userProgress) {
      userProgress = await Progress.create({
        userId: req.user._id,
        trackId: targetTrack._id,
        completedLessons: [],
        completedModules: [],
        percentage: 0
      });
    }

    res.json({
      success: true,
      message: `Track '${targetTrack.title}' assigned.`,
      track: targetTrack,
      progress: userProgress,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skillLevel: updatedUser.skillLevel,
        careerGoal: updatedUser.careerGoal,
        interests: updatedUser.interests,
        assignedTrack: updatedUser.assignedTrack,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        badges: updatedUser.badges
      }
    });
  } catch (error) {
    console.error('Assign track error:', error);
    res.status(500).json({ success: false, message: 'Server error assigning track' });
  }
});

module.exports = router;
