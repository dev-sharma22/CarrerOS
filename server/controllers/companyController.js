import Company from '../models/Company.js';
import Job from '../models/Job.js';
import { memoryDb } from '../utils/memoryDb.js';
import { EXPANDED_COMPANIES } from '../utils/expandedCompanies.js';

// Auto-seed companies into MongoDB if empty
const ensureCompaniesSeeded = async () => {
  if (!global.isMongoConnected) return;
  try {
    const count = await Company.countDocuments();
    if (count === 0) {
      const formatted = EXPANDED_COMPANIES.map(c => ({
        companyName: c.name || c.companyName,
        logo: c.logo || 'briefcase',
        location: c.location || 'Multiple Global Locations',
        difficulty: c.difficulty || 'Medium',
        requiredSkills: c.requiredSkills || [],
        interviewQuestions: (c.questions || []).map(q => ({
          question: q.question,
          answer: q.answer,
          category: q.category === 'System Design' ? 'Technical' : (q.category || 'Technical')
        })),
        experiences: c.experiences || []
      }));
      await Company.insertMany(formatted);
    }
  } catch (err) {
    console.error('Auto company seed error:', err.message);
  }
};

// @desc    Get all companies list
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
  try {
    let companies = [];
    if (global.isMongoConnected) {
      await ensureCompaniesSeeded();
      const dbCompanies = await Company.find({});
      companies = dbCompanies.map(c => ({
        _id: c._id,
        companyName: c.companyName,
        name: c.companyName,
        logo: c.logo,
        difficulty: c.difficulty,
        requiredSkills: c.requiredSkills
      }));
    } else {
      const list = await memoryDb.getCompaniesList();
      const rawList = (list && list.length > 0) ? list : EXPANDED_COMPANIES;
      companies = rawList.map(c => ({
        _id: c._id || `mem_comp_${c.name}`,
        companyName: c.companyName || c.name,
        name: c.name || c.companyName,
        logo: c.logo || 'briefcase',
        difficulty: c.difficulty || 'Medium',
        requiredSkills: c.requiredSkills || []
      }));
    }
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get details for a specific company (FAQs, reviews, jobs)
// @route   GET /api/companies/:name
// @access  Public
export const getCompanyDetails = async (req, res) => {
  const companyName = req.params.name;

  try {
    let company, jobs = [];
    if (global.isMongoConnected) {
      await ensureCompaniesSeeded();
      company = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });
      jobs = await Job.find({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } }).populate('recruiterId', 'name email');
    } else {
      company = await memoryDb.findCompanyByName(companyName);
      if (!company) {
        const fallback = EXPANDED_COMPANIES.find(c => (c.name || c.companyName || '').toLowerCase() === companyName.toLowerCase());
        if (fallback) {
          company = {
            ...fallback,
            companyName: fallback.name || fallback.companyName,
            interviewQuestions: (fallback.questions || []).map(q => ({
              question: q.question,
              answer: q.answer,
              category: q.category || 'Technical'
            }))
          };
        }
      } else {
        company = {
          ...company,
          companyName: company.companyName || company.name,
          interviewQuestions: company.interviewQuestions || (company.questions || []).map(q => ({
            question: q.question,
            answer: q.answer,
            category: q.category || 'Technical'
          }))
        };
      }

      const allJobs = await memoryDb.getJobsList();
      jobs = (allJobs || []).filter(j => (j.companyName || '').toLowerCase() === companyName.toLowerCase());
      jobs = jobs.map(j => {
        const rec = memoryDb.db.users.find(u => u._id === j.recruiterId);
        return {
          ...j,
          recruiterId: rec ? { name: rec.name, email: rec.email } : { name: 'Recruiter', email: '' }
        };
      });
    }

    if (!company) {
      return res.status(404).json({ success: false, message: `Company ${companyName} not found` });
    }

    res.status(200).json({
      success: true,
      company,
      jobs
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add peer placement experience
// @route   POST /api/companies/:name/experience
// @access  Private (Student)
export const addInterviewExperience = async (req, res) => {
  const companyName = req.params.name;
  const { role, content } = req.body;

  if (!role || !content) {
    return res.status(400).json({ success: false, message: 'Please provide role and content' });
  }

  try {
    let updatedExperiences;
    const newExp = {
      author: req.user.name,
      role,
      content,
      date: new Date()
    };

    if (global.isMongoConnected) {
      const company = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });
      if (!company) {
        return res.status(404).json({ success: false, message: `Company ${companyName} not found` });
      }

      company.experiences.unshift(newExp);
      const saved = await company.save();
      updatedExperiences = saved.experiences;
    } else {
      let company = await memoryDb.findCompanyByName(companyName);
      if (!company) {
        return res.status(404).json({ success: false, message: `Company ${companyName} not found` });
      }

      newExp._id = 'mem_exp_' + Math.random().toString(36).substr(2, 9);
      if (!company.experiences) company.experiences = [];
      company.experiences.unshift(newExp);
      updatedExperiences = company.experiences;
    }

    res.status(201).json({
      success: true,
      message: 'Interview experience posted successfully',
      experiences: updatedExperiences
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new company guide (Admin only)
// @route   POST /api/companies
// @access  Private (Admin)
export const createCompany = async (req, res) => {
  const { companyName, logo, difficulty, location, requiredSkills, interviewQuestions } = req.body;

  if (!companyName) {
    return res.status(400).json({ success: false, message: 'Company name is required' });
  }

  try {
    let company;
    if (global.isMongoConnected) {
      const exists = await Company.findOne({ companyName });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Company already exists' });
      }

      company = await Company.create({
        companyName,
        logo: logo || 'briefcase',
        location: location || 'Multiple Global Locations',
        difficulty: difficulty || 'Medium',
        requiredSkills: requiredSkills || [],
        interviewQuestions: interviewQuestions || []
      });
    } else {
      const exists = await memoryDb.findCompanyByName(companyName);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Company already exists' });
      }

      company = await memoryDb.createCompany({
        companyName,
        logo: logo || 'briefcase',
        location: location || 'Multiple Global Locations',
        difficulty: difficulty || 'Medium',
        requiredSkills: requiredSkills || [],
        interviewQuestions: interviewQuestions || []
      });
    }

    res.status(201).json({ success: true, company });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a company guide
// @route   DELETE /api/companies/:name
// @access  Private (Admin / Recruiter)
export const deleteCompany = async (req, res) => {
  const companyName = req.params.name;

  try {
    if (global.isMongoConnected) {
      const result = await Company.findOneAndDelete({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });
      if (!result) {
        return res.status(404).json({ success: false, message: 'Company guide not found' });
      }
    } else {
      const success = await memoryDb.deleteCompanyByName(companyName);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Company guide not found' });
      }
    }

    res.status(200).json({ success: true, message: 'Company guide deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
