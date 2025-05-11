import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'interviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: String,
  resumeUrl: String
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);