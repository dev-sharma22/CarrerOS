import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  salary: { type: String, default: 'Not Disclosed' },
  requirements: [{ type: String }],
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
