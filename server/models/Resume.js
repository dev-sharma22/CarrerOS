import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  extractedSkills: [{ type: String }],
  ATSScore: { type: Number, default: 0 },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export default Resume;
