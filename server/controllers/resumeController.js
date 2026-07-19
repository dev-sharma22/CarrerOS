import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { parsePDF } from '../services/resumeParser.js';
import { analyzeResume } from '../services/aiService.js';
import { memoryDb } from '../utils/memoryDb.js';

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/analyze
// @access  Private (Student only)
export const uploadAndAnalyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF resume file' });
  }

  try {
    const filePath = req.file.path;
    
    // Parse text from PDF
    const resumeText = await parsePDF(filePath);

    // Call AI helper for assessment
    const analysis = await analyzeResume(resumeText);

    let savedAnalysis;
    const resumeURL = `/uploads/${req.file.filename}`;

    if (global.isMongoConnected) {
      // Find or create resume record in MongoDB
      let resume = await Resume.findOne({ userId: req.user._id });
      if (resume) {
        resume.extractedSkills = analysis.extractedSkills || [];
        resume.ATSScore = analysis.ATSScore || 0;
        resume.suggestions = analysis.suggestions || [];
        savedAnalysis = await resume.save();
      } else {
        savedAnalysis = await Resume.create({
          userId: req.user._id,
          extractedSkills: analysis.extractedSkills || [],
          ATSScore: analysis.ATSScore || 0,
          suggestions: analysis.suggestions || []
        });
      }

      // Update User profile skills and resume URL
      const user = await User.findById(req.user._id);
      if (user) {
        user.resumeURL = resumeURL;
        if (analysis.extractedSkills && analysis.extractedSkills.length > 0) {
          const mergedSkills = new Set([...user.skills, ...analysis.extractedSkills]);
          user.skills = Array.from(mergedSkills);
        }
        await user.save();
      }
    } else {
      // Save in In-Memory DB
      savedAnalysis = await memoryDb.saveResume(req.user._id, {
        extractedSkills: analysis.extractedSkills || [],
        ATSScore: analysis.ATSScore || 0,
        suggestions: analysis.suggestions || []
      });

      // Update User in memory
      const user = await memoryDb.findUserById(req.user._id);
      if (user) {
        user.resumeURL = resumeURL;
        if (analysis.extractedSkills && analysis.extractedSkills.length > 0) {
          const mergedSkills = new Set([...user.skills, ...analysis.extractedSkills]);
          user.skills = Array.from(mergedSkills);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      resumeURL,
      analysis: savedAnalysis
    });

  } catch (error) {
    console.error('Resume upload/analyze error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Latest Resume Analysis Report
// @route   GET /api/resume/analysis
// @access  Private (Student)
export const getResumeAnalysis = async (req, res) => {
  try {
    let analysis;
    if (global.isMongoConnected) {
      analysis = await Resume.findOne({ userId: req.user._id });
    } else {
      analysis = await memoryDb.findResumeByUserId(req.user._id);
    }

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'No resume analysis report found. Please upload a resume first.' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
