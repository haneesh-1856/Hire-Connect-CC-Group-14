import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['job_seeker', 'recruiter'],
    required: true
  },
  // Additional fields as needed
}, { timestamps: true });

export default mongoose.model('User', userSchema);