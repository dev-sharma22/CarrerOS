import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  location: { type: String, default: 'Multiple Global Locations' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  requiredSkills: [{ type: String }],
  interviewQuestions: [{
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    category: { type: String, enum: ['Coding', 'Technical', 'HR'], default: 'Technical' }
  }],
  experiences: [{
    author: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
