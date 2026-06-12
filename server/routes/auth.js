const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skillLevel, careerGoal, interests } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      skillLevel: skillLevel || 'Beginner',
      careerGoal: careerGoal || 'Full Stack Developer',
      interests: interests || [],
      xp: 0,
      streak: 1,
      lastActiveDate: new Date(),
      badges: ['Welcome Onboard']
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillLevel: user.skillLevel,
        careerGoal: user.careerGoal,
        interests: user.interests,
        assignedTrack: user.assignedTrack,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const { updateStreak } = require('../services/automationEngine');
    const userPlain = user.toObject ? user : user;
    updateStreak(userPlain);
    
    if (user.save) {
      await user.save();
    } else {
      await User.findByIdAndUpdate(user._id, { 
        streak: userPlain.streak, 
        lastActiveDate: userPlain.lastActiveDate 
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillLevel: user.skillLevel,
        careerGoal: user.careerGoal,
        interests: user.interests,
        assignedTrack: user.assignedTrack,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        skillLevel: req.user.skillLevel,
        careerGoal: req.user.careerGoal,
        interests: req.user.interests,
        assignedTrack: req.user.assignedTrack,
        xp: req.user.xp,
        streak: req.user.streak,
        badges: req.user.badges
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
});

module.exports = router;
