const express = require('express');
const router = express.Router();
const { Progress } = require('../models/Progress');
const { Track } = require('../models/Track');
const { User } = require('../models/User');
const { protect } = require('../middleware/auth');
const { calculateTrackStatus, checkAndAwardBadges } = require('../services/automationEngine');

router.get('/', protect, async (req, res) => {
  try {
    if (!req.user.assignedTrack) {
      return res.json({
        success: true,
        message: 'No track assigned yet',
        track: null,
        progress: null
      });
    }

    const track = await Track.findById(req.user.assignedTrack);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Assigned track not found' });
    }

    let progress = await Progress.findOne({
      userId: req.user._id,
      trackId: track._id
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        trackId: track._id,
        completedLessons: [],
        completedModules: [],
        percentage: 0
      });
    }

    const trackWithStatus = calculateTrackStatus(track, progress);

    res.json({
      success: true,
      track: trackWithStatus,
      progress: {
        id: progress._id,
        completedLessons: progress.completedLessons,
        completedModules: progress.completedModules,
        percentage: trackWithStatus.overallPercentage
      }
    });
  } catch (error) {
    console.error('Fetch progress error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching progress' });
  }
});

router.post('/complete-lesson', protect, async (req, res) => {
  try {
    const { lessonId, trackId } = req.body;

    if (!lessonId || !trackId) {
      return res.status(400).json({ success: false, message: 'Please provide lessonId and trackId' });
    }

    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
    }

    let progress = await Progress.findOne({ userId: req.user._id, trackId });
    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        trackId,
        completedLessons: [],
        completedModules: [],
        percentage: 0
      });
    }

    let lessonFound = false;
    let targetModule = null;
    
    for (const mod of track.modules) {
      const les = mod.lessons.find(l => l._id.toString() === lessonId);
      if (les) {
        lessonFound = true;
        targetModule = mod;
        break;
      }
    }

    if (!lessonFound) {
      return res.status(404).json({ success: false, message: 'Lesson not found in this track' });
    }

    const alreadyCompleted = progress.completedLessons.includes(lessonId);
    let xpEarned = 0;
    
    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
      xpEarned = 50;
      
      let user = await User.findById(req.user._id);
      user.xp = (user.xp || 0) + xpEarned;
      
      const trackWithStatus = calculateTrackStatus(track, progress);
      progress.percentage = trackWithStatus.overallPercentage;
      
      const completedModules = trackWithStatus.modules
        .filter(m => m.status === 'COMPLETED')
        .map(m => m._id.toString());
      
      progress.completedModules = completedModules;
      
      checkAndAwardBadges(user, progress, trackWithStatus);
      
      if (!global.useJsonDb) {
        await user.save();
        await progress.save();
      } else {
        await User.findByIdAndUpdate(user._id, { xp: user.xp, badges: user.badges });
        await Progress.findByIdAndUpdate(progress._id, { 
          completedLessons: progress.completedLessons,
          completedModules: progress.completedModules,
          percentage: progress.percentage
        });
      }
    }

    const finalProgress = await Progress.findOne({ userId: req.user._id, trackId });
    const finalTrackWithStatus = calculateTrackStatus(track, finalProgress);
    const finalUser = await User.findById(req.user._id);

    res.json({
      success: true,
      message: xpEarned > 0 ? `Lesson completed! +${xpEarned} XP awarded.` : 'Lesson already completed.',
      xpEarned,
      track: finalTrackWithStatus,
      progress: {
        id: finalProgress._id,
        completedLessons: finalProgress.completedLessons,
        completedModules: finalProgress.completedModules,
        percentage: finalTrackWithStatus.overallPercentage
      },
      user: {
        id: finalUser._id,
        name: finalUser.name,
        xp: finalUser.xp,
        streak: finalUser.streak,
        badges: finalUser.badges
      }
    });

  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ success: false, message: 'Server error completing lesson' });
  }
});

router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' });
    const sorted = users
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 10)
      .map((u, index) => ({
        rank: index + 1,
        id: u._id,
        name: u.name,
        xp: u.xp || 0,
        streak: u.streak || 0,
        badgesCount: (u.badges || []).length,
        careerGoal: u.careerGoal
      }));

    res.json({ success: true, leaderboard: sorted });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error loading leaderboard' });
  }
});

router.get('/certificate/:trackId', protect, async (req, res) => {
  try {
    const { trackId } = req.params;
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
    }

    const progress = await Progress.findOne({ userId: req.user._id, trackId });
    if (!progress) {
      return res.status(400).json({ success: false, message: 'No progress found' });
    }

    const trackWithStatus = calculateTrackStatus(track, progress);
    if (trackWithStatus.overallPercentage < 100) {
      return res.status(400).json({ 
        success: false, 
        message: `Track is only ${trackWithStatus.overallPercentage}% complete.` 
      });
    }

    const certificateId = `CERT-${trackId.substring(0, 4).toUpperCase()}-${req.user._id.toString().substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      certificate: {
        id: certificateId,
        studentName: req.user.name,
        trackTitle: track.title,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        authority: 'LMS AI Automation Engine',
        signature: 'AI-Core-System'
      }
    });

  } catch (error) {
    console.error('Certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error generating certificate' });
  }
});

module.exports = router;
