import Job from '../models/Job.js';
import User from '../models/User.js';
import { memoryDb } from '../utils/memoryDb.js';
import sendLiveNotification from '../utils/notification.js';

// @desc    Post a new job opening
// @route   POST /api/jobs
// @access  Private (Recruiter only)
export const createJob = async (req, res) => {
  const { title, companyName, description, location, salary, requirements } = req.body;

  if (!title || !companyName || !description) {
    return res.status(400).json({ success: false, message: 'Title, companyName, and description are required' });
  }

  try {
    let job;
    const jobData = {
      recruiterId: req.user._id,
      companyName,
      title,
      description,
      location: location || 'Remote',
      salary: salary || 'Not Disclosed',
      requirements: requirements || [],
      applicants: []
    };

    if (global.isMongoConnected) {
      job = await Job.create(jobData);
    } else {
      job = await memoryDb.createJob(jobData);
    }

    res.status(201).json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs (with query keyword search)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  const { search } = req.query;

  try {
    let jobs;

    if (global.isMongoConnected) {
      let query = {};
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { requirements: { $in: [new RegExp(search, 'i')] } }
          ]
        };
      }
      jobs = await Job.find(query).populate('recruiterId', 'name email').sort({ createdAt: -1 });
    } else {
      jobs = await memoryDb.getJobsList(search);
      jobs = jobs.map(j => {
        const rec = memoryDb.db.users.find(u => u._id === j.recruiterId);
        return {
          ...j,
          recruiterId: rec ? { name: rec.name, email: rec.email } : { name: 'Recruiter', email: '' }
        };
      });
    }

    res.status(200).json({ success: true, jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get job details by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    let job;
    if (global.isMongoConnected) {
      job = await Job.findById(req.params.id).populate('recruiterId', 'name email');
    } else {
      job = await memoryDb.findJobById(req.params.id);
      if (job) {
        const rec = memoryDb.db.users.find(u => u._id === job.recruiterId);
        job = {
          ...job,
          recruiterId: rec ? { name: rec.name, email: rec.email } : { name: 'Recruiter', email: '' }
        };
      }
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    res.status(200).json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student only)
export const applyForJob = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job opening not found' });
      }

      const alreadyApplied = job.applicants.some(
        applicantId => applicantId.toString() === req.user._id.toString()
      );

      if (alreadyApplied) {
        return res.status(400).json({ success: false, message: 'You have already applied for this job' });
      }

      job.applicants.push(req.user._id);
      await job.save();
    } else {
      const success = await memoryDb.applyJob(req.params.id, req.user._id);
      if (!success) {
        return res.status(400).json({ success: false, message: 'You have already applied or job not found' });
      }
    }

    res.status(200).json({ success: true, message: 'Applied for job successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get jobs posted by the logged-in recruiter (includes applicants data)
// @route   GET /api/jobs/recruiter
// @access  Private (Recruiter only)
export const getRecruiterJobs = async (req, res) => {
  try {
    let jobs;

    if (global.isMongoConnected) {
      jobs = await Job.find({ recruiterId: req.user._id })
        .populate('applicants', 'name email skills education resumeURL')
        .sort({ createdAt: -1 });
    } else {
      jobs = await memoryDb.getRecruiterJobsList(req.user._id);
      jobs = jobs.map(j => {
        const apps = j.applicants.map(appId => {
          const u = memoryDb.db.users.find(usr => usr._id === appId);
          return u ? { _id: u._id, name: u.name, email: u.email, skills: u.skills, education: u.education, resumeURL: u.resumeURL } : null;
        }).filter(Boolean);
        return {
          ...j,
          applicants: apps
        };
      });
    }

    res.status(200).json({ success: true, jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job listing (Admin or Recruiter who owns it)
// @route   DELETE /api/jobs/:id
// @access  Private (Admin or Recruiter)
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    let job;
    if (global.isMongoConnected) {
      job = await Job.findById(jobId);
    } else {
      job = await memoryDb.findJobById(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Auth check: Admin or the owner recruiter
    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job posting' });
    }

    if (global.isMongoConnected) {
      await Job.findByIdAndDelete(jobId);
    } else {
      await memoryDb.deleteJobById(jobId);
    }

    res.status(200).json({ success: true, message: 'Job posting deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Notify Candidate (Recruiter shortlists or schedules)
// @route   POST /api/jobs/:id/applicants/:candidateId/notify
// @access  Private (Recruiter only)
export const notifyCandidate = async (req, res) => {
  const { id: jobId, candidateId } = req.params;
  const { title, desc, type } = req.body;

  try {
    sendLiveNotification(candidateId, title, desc, type || 'info');
    res.json({ success: true, message: 'Candidate notified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
