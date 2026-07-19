import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: [{ type: String }],
  answers: [{ type: String }],
  feedback: [{
    question: String,
    answer: String,
    score: Number,
    comments: String
  }],
  overallFeedback: { type: String, default: '' },
  score: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const Interview = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
export default Interview;
