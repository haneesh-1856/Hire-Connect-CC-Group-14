import express from 'express';
import auth from '../middleware/auth.js';
import Application from '../models/Application.js';

const router = express.Router();

// Get user's applications
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.userId })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to job
router.post('/:jobId', auth, async (req, res) => {
  try {
    const newApplication = new Application({
      job: req.params.jobId,
      user: req.user.userId,
      message: req.body.message,
      resumeUrl: req.body.resumeUrl
    });

    const application = await newApplication.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;