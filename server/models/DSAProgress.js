import mongoose from 'mongoose';

const dsaProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graph', 'Dynamic Programming']
  },
  solvedProblems: [{
    name: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    solvedAt: { type: Date, default: Date.now }
  }],
  progress: { type: Number, default: 0 } // Percentage of completion
}, { timestamps: true });

dsaProgressSchema.index({ userId: 1, topic: 1 }, { unique: true });

const DSAProgress = mongoose.models.DSAProgress || mongoose.model('DSAProgress', dsaProgressSchema);
export default DSAProgress;
